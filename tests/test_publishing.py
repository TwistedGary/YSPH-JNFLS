import io
import json
import os
import tempfile
import unittest
from pathlib import Path

TEMP=tempfile.TemporaryDirectory()
os.environ.update(YSPH_DB=str(Path(TEMP.name)/'test.sqlite3'),YSPH_PUBLIC_URL='https://example.test',YSPH_SETUP_TOKEN='test-bootstrap-token')
import server

class PublishingTests(unittest.TestCase):
    def setUp(self):
        self.cookie='';self.csrf=''
        with server.db() as c:
            for table in ('admin','sessions','attempts','articles','metadata'):c.execute('DELETE FROM '+table)
        server.init_db()
    def request(self,path,method='GET',data=None,auth=True,origin='https://example.test',host='example.test'):
        body=json.dumps(data or {}).encode();captured={}
        env={'REQUEST_METHOD':method,'PATH_INFO':path,'HTTP_HOST':host,'HTTP_ORIGIN':origin,'CONTENT_TYPE':'application/json','CONTENT_LENGTH':str(len(body)),'wsgi.input':io.BytesIO(body),'REMOTE_ADDR':'127.0.0.1'}
        if auth:env.update(HTTP_COOKIE=self.cookie,HTTP_X_CSRF_TOKEN=self.csrf)
        def start(status,headers):captured.update(status=int(status.split()[0]),headers=dict(headers))
        result=b''.join(server.application(env,start))
        try:result=json.loads(result)
        except ValueError:pass
        return captured['status'],result,captured['headers']
    def setup_admin(self):
        code,data,h=self.request('/api/setup','POST',{'setupToken':'test-bootstrap-token','password':'test-password-long-enough'})
        self.assertEqual(code,200);self.csrf=data['csrf'];self.cookie=h['Set-Cookie'].split(';')[0]
        self.assertIn('Secure',h['Set-Cookie']);self.assertIn('HttpOnly',h['Set-Cookie'])
    def article(self,status='draft'):
        return {'title':{'zh':'新知识：睡眠','en':''},'summary':{'zh':'测试简介','en':''},'category':{'zh':'新分类','en':''},'body':{'zh':'## 正文\n测试内容 <script>alert(1)</script>','en':''},'date':'2026-09-08','status':status,'sources':[{'title':'WHO','url':'https://www.who.int/'}]}
    def test_auth_csrf_setup_and_logout(self):
        self.assertEqual(self.request('/api/setup','POST',{'password':'long-test-password','setupToken':'wrong'})[0],401)
        self.assertEqual(self.request('/api/admin/articles','POST',self.article(),auth=False)[0],401)
        self.setup_admin()
        self.assertEqual(self.request('/api/setup','POST',{})[0],409)
        self.assertEqual(self.request('/api/admin/articles','POST',self.article(),origin='https://evil.test')[0],403)
        old=self.csrf;self.csrf='wrong'
        self.assertEqual(self.request('/api/admin/articles','POST',self.article())[0],403);self.csrf=old
        self.assertEqual(self.request('/api/logout','POST',{})[0],200)
        self.assertEqual(self.request('/api/admin/articles')[0],401)
    def test_publish_edit_draft_persistence_backup(self):
        self.setup_admin();code,draft,_=self.request('/api/admin/articles','POST',self.article());self.assertEqual(code,200)
        self.assertEqual(self.request('/api/articles/'+draft['id'])[0],404)
        self.assertNotIn(draft['id'],[a['id'] for a in self.request('/api/articles')[1]])
        draft['status']='published';code,published,_=self.request('/api/admin/articles','POST',draft);self.assertEqual(code,200)
        self.assertEqual(self.request('/api/articles/'+draft['id'])[0],200)
        self.assertEqual(self.request('/api/admin/articles','POST',draft)[0],409)
        server.init_db()
        self.assertEqual(self.request('/api/articles/'+draft['id'])[1]['category']['zh'],'新分类')
        self.assertEqual(self.request('/api/admin/backup',auth=False)[0],401)
        self.assertEqual(len(self.request('/api/admin/backup')[1]['articles']),7)
        published['status']='draft';self.assertEqual(self.request('/api/admin/articles','POST',published)[0],200)
        self.assertEqual(self.request('/api/articles/'+draft['id'])[0],404)
    def test_validation_and_private_files(self):
        self.setup_admin()
        a=self.article();a['cover']='javascript:alert(1)';self.assertEqual(self.request('/api/admin/articles','POST',a)[0],400)
        a=self.article();a['date']='9999-01-01';self.assertEqual(self.request('/api/admin/articles','POST',a)[0],400)
        for path in ('/.env','/.git/config','/server.py','/tools/library-content.json','/.runtime/ysph.sqlite3','/articles-seed.json'):
            self.assertEqual(self.request(path)[0],404,path)
        self.assertEqual(self.request('/api/session',host='evil.test')[0],403)
    def test_unpublish_legacy_guide_and_rate_limit(self):
        self.setup_admin();a=next(a for a in self.request('/api/admin/articles')[1] if a['id']=='tuberculosis');a['status']='draft'
        self.assertEqual(self.request('/api/admin/articles','POST',a)[0],200)
        self.assertEqual(self.request('/learn-tuberculosis.html')[0],404)
        for _ in range(10):self.assertEqual(self.request('/api/login','POST',{'password':'wrong'})[0],401)
        self.assertEqual(self.request('/api/login','POST',{'password':'wrong'})[0],429)
    def test_public_sort_and_login(self):
        self.setup_admin();a=self.article('published');a['date']='2026-08-01';self.request('/api/admin/articles','POST',a)
        self.assertEqual(self.request('/api/articles')[1][-1]['date'],'2026-08-01')
        self.assertEqual(self.request('/api/login','POST',{'password':'test-password-long-enough'})[0],200)
        self.assertEqual(self.request('/learn-nutrition.html')[0],302)

if __name__=='__main__':unittest.main()
