(() => {
 const feed = document.querySelector('#article-feed');
 const search = document.querySelector('#article-search');
 const category = document.querySelector('#article-category');
 const sort = document.querySelector('#article-sort');
 let articles = [];
 const lang = () => document.body.dataset.language || 'en';
 const text = (value) => typeof value === 'string' ? value : value?.[lang()] || value?.zh || value?.en || '';
 const el = (tag, content, className) => { const node=document.createElement(tag); if(content)node.textContent=content; if(className)node.className=className; return node; };
 const categoryKey = a => a.category?.en || a.category?.zh || '';
 function categories() {
   const selected=category.value;
   category.replaceChildren(new Option(lang()==='zh'?'全部分类':'All categories',''));
   const seen=new Set(); articles.forEach(a=>{const key=categoryKey(a);if(key&&!seen.has(key)){seen.add(key);category.add(new Option(text(a.category),key));}});
   category.value=selected;
 }
 function render() {
  const zh=lang()==='zh';
  search.placeholder=zh?'搜索标题、分类或正文…':'Search titles, topics, or text…';
  sort.options[0].text=zh?'最新发布优先':'Newest first';sort.options[1].text=zh?'最早发布优先':'Oldest first';
  const result=YSPHJournal.filterArticles(articles,search.value,category.value,sort.value);
  feed.replaceChildren();
  feed.setAttribute("aria-busy", "false");
  result.forEach((a,index)=>{
   const lead=index===0 && !search.value.trim() && !category.value && sort.value==='newest';
   const row=el('article',null,lead?'journal-row journal-lead':'journal-row');
   const cover=el('a',null,'journal-thumbnail');cover.href='article.html?id='+encodeURIComponent(a.id);cover.setAttribute('aria-label',text(a.title));
   if(a.cover){const im=el('img');im.src=a.cover;im.alt=a.imageAlt||text(a.title);im.loading=lead?'eager':'lazy';im.width=900;im.height=600;cover.append(im);}else{cover.classList.add('journal-no-image');cover.append(el('span','YSPH / NOTES'));}
   const content=el('div',null,'journal-row-content');
   content.append(el('span',lead?(zh?'最新发布 / 值得一读':'LATEST ENTRY / A CLOSER LOOK'):(String(index+1).padStart(2,'0')+' / '+(zh?'知识笔记':'FIELD NOTES')),'journal-index'));
const meta=el('div',null,'journal-meta');const date=el('time',a.date);date.dateTime=a.date;meta.append(date,el('span',text(a.category)));
   const h=el('h3');const link=el('a',text(a.title));link.href=cover.href;h.append(link);content.append(meta,h,el('p',text(a.summary)));
   const read=el('a',zh?'阅读全文 ↗':'Read article ↗','text-link');read.href=cover.href;content.append(read);row.append(cover,content);feed.append(row);
  });
  document.querySelector('#article-count').textContent=zh?`${result.length} 篇文章`:`${result.length} articles`;
  document.querySelector('#article-empty').hidden=result.length>0;
 }
 [search,category,sort].forEach(control=>control.addEventListener(control===search?'input':'change',render));
 document.querySelector('#clear-filters').addEventListener('click',()=>{search.value='';category.value='';sort.value='newest';render();search.focus();});
 document.addEventListener('ysph-language',()=>{categories();render();});
 fetch('/api/articles', { signal: AbortSignal.timeout(12000) }).then(async r=>{
   if(r.status===404){const fallback=await fetch('articles-seed.json');if(!fallback.ok)throw Error();return fallback.json();}
   if(!r.ok)throw Error();return r.json();
 }).then(data=>{articles=data;categories();render();}).catch(()=>{feed.replaceChildren();feed.setAttribute('aria-busy','false');const node=document.querySelector('#journal-error');node.hidden=false;node.textContent=lang()==='zh'?'文章暂时无法加载，请刷新重试。':'Articles could not be loaded. Please refresh to retry.';});
})();
