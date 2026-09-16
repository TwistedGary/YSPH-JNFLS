from contextlib import contextmanager
import hashlib
import hmac
import json
import mimetypes
import os
import re
import secrets
import sqlite3
import time
from datetime import date, datetime, timezone
from http.cookies import SimpleCookie
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit

ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get('YSPH_DB', str(ROOT / '.runtime/ysph.sqlite3')))
DEV = os.environ.get('YSPH_DEVELOPMENT') == '1'
PUBLIC_URL = os.environ.get('YSPH_PUBLIC_URL', 'http://localhost:8080' if DEV else '').rstrip('/')
SETUP_TOKEN = os.environ.get('YSPH_SETUP_TOKEN', '')

@contextmanager
def db():
    conn = sqlite3.connect(DB_PATH, timeout=15)
    conn.row_factory = sqlite3.Row
    try:
        with conn:
            yield conn
    finally:
        conn.close()

def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with db() as conn:
        conn.executescript('''CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY CHECK(id=1), salt TEXT, password TEXT);
        CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, csrf TEXT, expires REAL);
        CREATE TABLE IF NOT EXISTS attempts (ip TEXT, timestamp REAL);
        CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT);''')
        if not conn.execute("SELECT 1 FROM metadata WHERE key='seeded'").fetchone():
            for a in json.loads((ROOT / 'articles-seed.json').read_text()):
                conn.execute('INSERT OR IGNORE INTO articles VALUES (?,?)', (a['id'], json.dumps(a, ensure_ascii=False)))
            conn.execute("INSERT INTO metadata VALUES ('seeded','1')")

def digest(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt), 600000).hex()

def read_articles(conn, public=True):
    rows = [json.loads(r['data']) for r in conn.execute('SELECT data FROM articles')]
    if public:
        rows = [a for a in rows if a['status']=='published' and a['date']<=date.today().isoformat()]
    return sorted(rows, key=lambda a:(a['date'],a['createdAt'],a['id']), reverse=True)

def safe_url(value, image=False):
    if not isinstance(value,str): return False
    if not value:return True
    u=urlsplit(value)
    if u.scheme=='https' and u.netloc and not u.username and not u.password:return True
    if image and not u.scheme and not u.netloc and value.startswith('images/') and '..' not in Path(value).parts:return True
    return False

def validate(data):
    if not isinstance(data,dict):raise ValueError('Invalid article.')
    out={}
    for key,limit in [('title',160),('summary',600),('category',80),('body',80000)]:
        value=data.get(key,{})
        if not isinstance(value,dict):raise ValueError('Invalid '+key)
        out[key]={lang:str(value.get(lang,'')).strip() for lang in ('zh','en')}
        if not any(out[key].values()) or any(len(v)>limit for v in out[key].values()):raise ValueError('Please complete '+key+' within its length limit.')
    languages=[l for l in ('zh','en') if out['body'][l]]
    if not any(all(out[k][l] for k in ('title','summary','category','body')) for l in languages):raise ValueError('Complete the title, summary, category and body in at least one language.')
    out['date']=str(data.get('date',''))
    try:parsed=date.fromisoformat(out['date'])
    except ValueError:raise ValueError('Use a valid date (YYYY-MM-DD).')
    if parsed>date.today():raise ValueError('Choose today or an earlier publication date.')
    if out['date']!=parsed.isoformat():raise ValueError('Use YYYY-MM-DD.')
    out['status']=data.get('status','draft')
    if out['status'] not in ('draft','published'):raise ValueError('Invalid status.')
    for key in ('cover','imageSource'):
        out[key]=str(data.get(key,'')).strip()
        if len(out[key])>2000 or not safe_url(out[key],image=key=='cover'):raise ValueError('Image links must use HTTPS or a local images/ path.')
    for key in ('credit','imageAlt'):
        out[key]=str(data.get(key,'')).strip()
        if len(out[key])>300:raise ValueError('Image description is too long.')
    if out['cover'] and (not out['imageAlt'] or not out['credit']):raise ValueError('Add an image description and credit for the cover.')
    sources=data.get('sources',[])
    if not isinstance(sources,list) or len(sources)>30:raise ValueError('Use up to 30 references.')
    out['sources']=[]
    for item in sources:
        if not isinstance(item,dict):raise ValueError('Invalid reference.')
        title=str(item.get('title','')).strip();url=str(item.get('url','')).strip()
        if not title or len(title)>300 or not url or len(url)>2000 or not safe_url(url):raise ValueError('Each reference needs a title and HTTPS URL.')
        out['sources'].append({'title':title,'url':url})
    return out

class HTTPError(Exception):
    def __init__(self,status,message):self.status=status;self.message=message

init_db()

def application(environ,start_response):
    method=environ.get('REQUEST_METHOD','GET');path=environ.get('PATH_INFO','/')
    try:path=path.encode('latin1').decode('utf-8')
    except (UnicodeEncodeError,UnicodeDecodeError):pass
    headers=[('X-Content-Type-Options','nosniff'),('Referrer-Policy','strict-origin-when-cross-origin'),('X-Frame-Options','DENY'),('Content-Security-Policy',"default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' https://cdn.jsdelivr.net; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")]
    if not DEV:headers.append(('Strict-Transport-Security','max-age=31536000'))
    def respond(status,value,ctype='application/json; charset=utf-8'):
        body=value if isinstance(value,bytes) else json.dumps(value,ensure_ascii=False).encode()
        start_response(f'{status} '+{200:'OK',201:'Created',400:'Bad Request',401:'Unauthorized',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',409:'Conflict',413:'Payload Too Large',429:'Too Many Requests',500:'Internal Server Error',503:'Service Unavailable',302:'Found'}.get(status,'Error'),headers+[('Content-Type',ctype),('Content-Length',str(len(body)))])
        return [body if method!='HEAD' else b'']
    try:
        if not path.startswith('/api/'):
            if method not in ('GET','HEAD'):raise HTTPError(405,'Method not allowed.')
            name=unquote(path).lstrip('/') or 'index.html'
            if name=='admin':name='admin.html'
            if name.startswith('learn-') and name.endswith('.html'):
                ident=name[6:-5]
                with db() as conn:
                    if not any(a['id']==ident for a in read_articles(conn)):raise HTTPError(404,'Article not found.')
                headers.append(('Location','/article.html?id='+ident))
                return respond(302,b'','text/plain')
            target=(ROOT/name).resolve()
            allowed=(target.parent==ROOT and target.suffix in ('.html','.css','.js')) or (target.is_relative_to(ROOT/'fonts') and target.suffix.lower() in ('.ttf','.woff2')) or (target.is_relative_to(ROOT/'images') and target.suffix.lower() in ('.jpg','.jpeg','.png','.webp','.svg'))
            if not target.is_relative_to(ROOT) or not allowed or not target.is_file():raise HTTPError(404,'Not found.')
            headers.append(('Cache-Control','no-cache' if target.suffix in ('.html','.js','.css','.json') else 'public, max-age=86400'))
            return respond(200,target.read_bytes(),mimetypes.guess_type(target)[0] or 'application/octet-stream')
        headers.append(('Cache-Control','no-store'))
        if not PUBLIC_URL:raise HTTPError(503,'Set YSPH_PUBLIC_URL before starting the production service.')
        expected=urlsplit(PUBLIC_URL).netloc
        if environ.get('HTTP_HOST')!=expected:raise HTTPError(403,'Invalid host.')
        if method not in ('GET','HEAD'):
            if environ.get('HTTP_ORIGIN')!=PUBLIC_URL:raise HTTPError(403,'Invalid request origin.')
            if not environ.get('CONTENT_TYPE','').startswith('application/json'):raise HTTPError(400,'JSON required.')
            size=int(environ.get('CONTENT_LENGTH') or 0)
            if size>250000:raise HTTPError(413,'Request is too large.')
            try:payload=json.loads(environ['wsgi.input'].read(size))
            except (ValueError,UnicodeError):raise HTTPError(400,'Invalid JSON.')
            if not isinstance(payload,dict):raise HTTPError(400,'JSON object required.')
        else:payload={}
        cookie=SimpleCookie()
        try:cookie.load(environ.get('HTTP_COOKIE',''))
        except Exception:pass
        token=cookie['ysph_session'].value if 'ysph_session' in cookie else ''
        token_hash=hashlib.sha256(token.encode()).hexdigest()
        with db() as conn:
            now=time.time();conn.execute('DELETE FROM sessions WHERE expires < ?', (now,))
            session=conn.execute('SELECT * FROM sessions WHERE token=?',(token_hash,)).fetchone()
            admin=conn.execute('SELECT * FROM admin WHERE id=1').fetchone()
            if path=='/api/session' and method=='GET':return respond(200,{'authenticated':bool(session),'csrf':session['csrf'] if session else '', 'needsSetup':not bool(admin),'localSetup':DEV})
            if path in ('/api/setup','/api/login') and method=='POST':
                ip=environ.get('REMOTE_ADDR','unknown');conn.execute('DELETE FROM attempts WHERE timestamp < ?',(now-900,))
                attempts=conn.execute('SELECT count(*) FROM attempts WHERE ip=?',(ip,)).fetchone()[0]
                if attempts>=10:raise HTTPError(429,'Too many attempts. Try again in 15 minutes.')
                password=payload.get('password','')
                if not isinstance(password,str) or len(password)>256:raise HTTPError(400,'Invalid password.')
                valid=False
                if path=='/api/setup':
                    if admin:raise HTTPError(409,'Administrator is already configured.')
                    setup_ok=DEV or (bool(SETUP_TOKEN) and hmac.compare_digest(str(payload.get('setupToken','')),SETUP_TOKEN))
                    if setup_ok:
                        if len(password)<12:raise HTTPError(400,'Choose a password of at least 12 characters.')
                        salt=secrets.token_hex(16);conn.execute('INSERT INTO admin VALUES (1,?,?)',(salt,digest(password,salt)));valid=True
                elif admin:valid=hmac.compare_digest(digest(password,admin['salt']),admin['password'])
                if not valid:
                    conn.execute('INSERT INTO attempts VALUES (?,?)',(ip,now));conn.commit();raise HTTPError(401,'Sign-in failed. Check your credentials.')
                conn.execute('DELETE FROM attempts WHERE ip=?',(ip,))
                token=secrets.token_urlsafe(32);csrf=secrets.token_urlsafe(32)
                conn.execute('INSERT INTO sessions VALUES (?,?,?)',(hashlib.sha256(token.encode()).hexdigest(),csrf,now+43200))
                headers.append(('Set-Cookie','ysph_session='+token+'; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200'+('' if DEV else '; Secure')))
                return respond(200,{'authenticated':True,'csrf':csrf})
            if path=='/api/articles' and method=='GET':return respond(200,read_articles(conn))
            if path.startswith('/api/articles/') and method=='GET':
                ident=path.rsplit('/',1)[-1]
                article=next((a for a in read_articles(conn) if a['id']==ident),None)
                if not article:raise HTTPError(404,'Article not found.')
                return respond(200,article)
            if not session:raise HTTPError(401,'Please sign in.')
            if method not in ('GET','HEAD') and not hmac.compare_digest(environ.get('HTTP_X_CSRF_TOKEN',''),session['csrf']):raise HTTPError(403,'Please refresh and try again.')
            if path=='/api/logout' and method=='POST':
                conn.execute('DELETE FROM sessions WHERE token=?',(token_hash,));headers.append(('Set-Cookie','ysph_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'+('' if DEV else '; Secure')));return respond(200,{'ok':True})
            if path=='/api/admin/articles' and method=='GET':return respond(200,read_articles(conn,False))
            if path=='/api/admin/backup' and method=='GET':
                headers.append(('Content-Disposition','attachment; filename="ysph-articles.json"'))
                return respond(200,{'version':1,'exportedAt':datetime.now(timezone.utc).isoformat(),'articles':read_articles(conn,False)})
            if path=='/api/admin/articles' and method=='POST':
                ident=str(payload.get('id',''))
                existing=conn.execute('SELECT data FROM articles WHERE id=?',(ident,)).fetchone() if ident else None
                if ident and not existing:raise HTTPError(404,'Article no longer exists.')
                a=validate(payload);stamp=datetime.now(timezone.utc).isoformat()
                old=json.loads(existing['data']) if existing else None
                if old and payload.get('updatedAt')!=old['updatedAt']:raise HTTPError(409,'This article changed in another session. Reload it before saving.')
                a.update(id=ident or secrets.token_hex(12),createdAt=old['createdAt'] if old else stamp,updatedAt=stamp)
                conn.execute('INSERT INTO articles VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data',(a['id'],json.dumps(a,ensure_ascii=False)))
                return respond(200,a)
            raise HTTPError(404,'Not found.')
    except HTTPError as e:return respond(e.status,{'error':e.message})
    except (ValueError,TypeError) as e:return respond(400,{'error':str(e)})
    except Exception:
        import traceback;traceback.print_exc()
        return respond(500,{'error':'The request could not be completed. Please try again.'})

from socketserver import ThreadingMixIn
from wsgiref.simple_server import WSGIServer, WSGIRequestHandler

class PreviewServer(ThreadingMixIn, WSGIServer):
    daemon_threads = True
    request_queue_size = 32

    def get_request(self):
        connection, address = super().get_request()
        connection.settimeout(15)
        return connection, address

class PreviewHandler(WSGIRequestHandler):
    def address_string(self):
        return self.client_address[0]

if __name__=='__main__':
    if not DEV:raise SystemExit('For local preview set YSPH_DEVELOPMENT=1. Use Gunicorn for production.')
    from wsgiref.simple_server import make_server
    port=int(os.environ.get('PORT','8080'))
    with make_server('127.0.0.1',port,application,server_class=PreviewServer,handler_class=PreviewHandler) as httpd:
        print('YSPH preview: '+PUBLIC_URL,flush=True);httpd.serve_forever()
