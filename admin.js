(() => {
 let csrf='',needsSetup=false,articles=[],dirty=false;
 const form=document.querySelector('#article-form'),message=document.querySelector('#admin-status');
 const field=name=>form.elements.namedItem(name);
 function status(text,error=false){message.textContent=text;message.classList.toggle('is-error',error);}
 if(location.hostname==='github.io'||location.hostname.endsWith('.github.io')){
  document.querySelector('#login-panel').hidden=false;
  document.querySelector('#login-title').textContent='Publishing is hosted separately.';
  document.querySelector('#login-help').textContent='This public GitHub Pages edition does not include the private publishing service. Use the full YSPH server to sign in and publish articles.';
  document.querySelector('#login-form').hidden=true;
  status('Public website mode: publishing is available on the full server.');
  return;
 }
 async function api(path,method='GET',data){
  const r=await fetch(path,{method,headers:method==='GET'?{}:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:data?JSON.stringify(data):undefined});
  let result;try{result=await r.json();}catch{throw Error('The publishing service is not available. Run the complete website server.');}
  if(!r.ok)throw Error(result.error||'Request failed.');return result;
 }
 async function session(){
  const s=await api('/api/session');csrf=s.csrf;needsSetup=s.needsSetup;
  document.querySelector('#login-panel').hidden=s.authenticated;document.querySelector('#editor-panel').hidden=!s.authenticated;
  if(s.authenticated){await load();newArticle();}
  else{
   document.querySelector('#login-title').textContent=needsSetup?'Set up your editorial desk.':'Welcome back.';
   document.querySelector('#login-help').textContent=needsSetup?'Choose an administrator password of at least 12 characters.':'Sign in to write, edit and publish knowledge articles.';
   document.querySelector('#setup-token-label').hidden=!needsSetup||s.localSetup;
   document.querySelector('#login-form button').textContent=needsSetup?'Create administrator':'Sign in';
   document.querySelector('#login-form [name=password]').autocomplete=needsSetup?'new-password':'current-password';
  }
 }
 function changed(){return !dirty||window.confirm('You have unsaved changes. Discard them?');}
 function newArticle(){form.reset();field('id').value='';field('updatedAt').value='';const now=new Date();field('date').value=new Date(now-now.getTimezoneOffset()*60000).toISOString().slice(0,10);field('date').max=field('date').value;dirty=false;sync();document.querySelector('#article-preview').hidden=true;}
 function sync(){document.querySelector('#save-article').textContent=field('status').value==='published'?'Publish article':'Save draft';const view=document.querySelector('#view-article');view.hidden=!field('id').value||field('status').value!=='published';view.href='article.html?id='+encodeURIComponent(field('id').value);}
 async function load(){
  articles=await api('/api/admin/articles');const list=document.querySelector('#admin-articles');list.replaceChildren();
  articles.forEach(a=>{const b=document.createElement('button');b.type='button';b.textContent=(a.title.zh||a.title.en)+' · '+a.date+' · '+a.status;b.addEventListener('click',()=>{if(!changed())return;for(const key of ['id','updatedAt','date','status','cover','imageAlt','credit','imageSource'])field(key).value=a[key]||'';for(const key of ['title','category','summary','body'])for(const [lang,suffix] of [['zh','Zh'],['en','En']])field(key+suffix).value=a[key][lang]||'';field('sources').value=a.sources.map(s=>s.title+' | '+s.url).join('\n');dirty=false;sync();document.querySelector('#article-preview').hidden=true;status('Editing article.');});list.append(b);});
  for(const lang of ['zh','en']){const list=document.querySelector('#categories-'+lang);list.replaceChildren();[...new Set(articles.map(a=>a.category[lang]).filter(Boolean))].forEach(c=>list.append(new Option(c,c)));}
 }
 function data(){
  const a={};for(const k of ['id','updatedAt','date','status','cover','imageAlt','credit','imageSource'])a[k]=field(k).value;
  for(const k of ['title','category','summary','body'])a[k]={zh:field(k+'Zh').value,en:field(k+'En').value};
  a.sources=field('sources').value.split('\n').filter(l=>l.trim()).map(l=>{const i=l.indexOf('|');if(i<1)throw Error('Use title | https://… for each reference.');return {title:l.slice(0,i).trim(),url:l.slice(i+1).trim()};});return a;
 }
 document.querySelector('#login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.currentTarget.querySelector('button');b.disabled=true;try{const f=new FormData(e.currentTarget);await api(needsSetup?'/api/setup':'/api/login','POST',Object.fromEntries(f));e.target.reset();await session();status('Signed in.');}catch(err){status(err.message,true);}finally{b.disabled=false;}});
 form.addEventListener('input',()=>{dirty=true;sync();});
 form.addEventListener('submit',async e=>{e.preventDefault();const b=document.querySelector('#save-article');b.disabled=true;try{const saved=await api('/api/admin/articles','POST',data());field('id').value=saved.id;field('updatedAt').value=saved.updatedAt;dirty=false;await load();sync();status(saved.status==='published'?'Published. Your article is now in the public journal.':'Draft saved. Only signed-in editors can see it.');}catch(err){status(err.message,true);}finally{b.disabled=false;}});
 document.querySelector('#new-article').addEventListener('click',()=>{if(changed()){newArticle();status('New article.');field('titleZh').focus();}});
 document.querySelector('#logout').addEventListener('click',async()=>{if(!changed())return;try{await api('/api/logout','POST',{});dirty=false;await session();status('Signed out.');}catch(e){status(e.message,true);}});
 document.querySelector('#preview-article').addEventListener('click',()=>{const preview=document.querySelector('#article-preview');preview.replaceChildren();for(const [name,tag] of [['title','h2'],['summary','p'],['body','p']]){const node=document.createElement(tag);node.textContent=field(name+'Zh').value||field(name+'En').value;node.style.whiteSpace='pre-wrap';preview.append(node);}preview.hidden=false;window.scrollTo({top:window.scrollY+preview.getBoundingClientRect().top-30,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
 session().catch(e=>status(e.message,true));
})();
