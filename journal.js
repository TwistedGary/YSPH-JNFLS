(() => {
 const feed=document.querySelector('#article-feed');
 const search=document.querySelector('#article-search');
 const category=document.querySelector('#article-category');
 const sort=document.querySelector('#article-sort');
 const query=new URLSearchParams(location.search);
 const pageSize=6;
 let page=Math.max(1,Number.parseInt(query.get('page'),10)||1);
 let articles=[];
 const lang=()=>document.body.dataset.language||'en';
 const text=value=>typeof value==='string'?value:value?.[lang()]||value?.zh||value?.en||'';
 const el=(tag,value,className)=>{const node=document.createElement(tag);if(value)node.textContent=value;if(className)node.className=className;return node;};
 const categoryKey=article=>article.category?.en||article.category?.zh||'';
 const retired=new Set(['hand-hygiene','nutrition','movement','antimicrobials','health-information']);
 const pagination=el('nav',null,'journal-pagination');
 const previous=el('button','←');previous.type='button';
 const position=el('form',null,'journal-page-form');
 const pageInput=el('input');pageInput.type='number';pageInput.min='1';pageInput.step='1';pageInput.required=true;
 const pageTotal=el('span');
 const go=el('button',null,'journal-page-go');go.type='submit';
 position.append(pageInput,pageTotal,go);
 const next=el('button','→');next.type='button';
 pagination.append(previous,position,next);pagination.hidden=true;feed.after(pagination);

 function updateURL(){
  const url=new URL(location.href);
  if(category.value)url.searchParams.set('category',category.value);else url.searchParams.delete('category');
  if(search.value.trim())url.searchParams.set('q',search.value.trim());else url.searchParams.delete('q');
  if(page>1)url.searchParams.set('page',String(page));else url.searchParams.delete('page');
  history.replaceState(null,'',url);
 }
 function categories(){
  const selected=category.value;
  category.replaceChildren(new Option(lang()==='zh'?'全部分类':'All topics',''));
  const seen=new Set();
  articles.forEach(article=>{const key=categoryKey(article);if(key&&!seen.has(key)){seen.add(key);category.add(new Option(text(article.category),key));}});
  category.value=selected;
 }
 function render(){
  const zh=lang()==='zh';
  document.querySelector('.journal-masthead h1').textContent=zh?'健康科普':'Health Library';
  search.setAttribute('aria-label',zh?'搜索文章':'Search articles');
  category.setAttribute('aria-label',zh?'分类':'Category');
  sort.setAttribute('aria-label',zh?'排序':'Sort by');
  const selected=articles.find(article=>categoryKey(article)===category.value);
  document.querySelector('.journal-section-head h2').textContent=selected?text(selected.category):(zh?'全部文章':'All articles');
  search.placeholder=zh?'输入关键词搜索标题和正文':'Search titles and article text';
  sort.options[0].text=zh?'最新发布':'Newest';sort.options[1].text=zh?'最早发布':'Oldest';
  const visible=articles.filter(article=>article.id!=='tuberculosis'||category.value==='Tuberculosis'||search.value.trim());
  const result=YSPHJournal.filterArticles(visible,search.value,category.value,sort.value);
  const pages=Math.max(1,Math.ceil(result.length/pageSize));
  page=Math.min(page,pages);
  feed.replaceChildren();feed.setAttribute('aria-busy','false');
  if(!category.value&&!search.value.trim()){
   const topic=el('aside',null,'journal-topic');
   const link=el('a',null,'journal-topic-link');link.href='encyclopedia.html?category=Tuberculosis';
   const count=articles.filter(article=>categoryKey(article)==='Tuberculosis').length;
   link.append(el('strong',zh?'TB · 结核病专题':'TB · Tuberculosis'),el('span',zh?`${count} 篇文章 →`:`${count} articles →`));
   topic.append(link);feed.append(topic);
  }
  result.slice((page-1)*pageSize,page*pageSize).forEach((article,index)=>{
   const row=el('article',null,'journal-row');
   const link=el('a',null,'journal-card-link');link.href='article.html?id='+encodeURIComponent(article.id);link.setAttribute('aria-label',text(article.title));
   const cover=el('div',null,'journal-thumbnail');
   if(article.cover){
    const image=el('img');image.src=article.cover;image.alt=article.imageAlt||text(article.title);image.width=900;image.height=600;image.loading=index<2?'eager':'lazy';image.decoding='async';cover.append(image);
   }else{cover.classList.add('journal-no-image');cover.append(el('span',text(article.category)));}
   const content=el('div',null,'journal-row-content');
   const meta=el('div',null,'journal-meta');const date=el('time',article.date);date.dateTime=article.date;
   if(!category.value)meta.append(el('span',text(article.category)));
   meta.append(date);
   content.append(meta,el('h3',text(article.title)));link.append(cover,content);row.append(link);feed.append(row);
  });
  document.querySelector('#article-count').textContent=zh?`${result.length} 篇`:`${result.length} articles`;
  document.querySelector('#article-empty').hidden=result.length>0;
  pagination.hidden=pages<2;pagination.setAttribute('aria-label',zh?'文章分页':'Article pages');
  previous.disabled=page===1;next.disabled=page===pages;
  previous.title=previous.ariaLabel=zh?'上一页':'Previous page';next.title=next.ariaLabel=zh?'下一页':'Next page';
  pageInput.max=String(pages);pageInput.value=String(page);pageInput.setAttribute('aria-label',zh?'跳转到页码':'Jump to page');
  pageTotal.textContent=zh?`/ ${pages} 页`:`/ ${pages}`;go.textContent=zh?'跳转':'Go';
 }
 function turnPage(delta){
  page+=delta;render();updateURL();
  const top=document.querySelector('.journal-section').getBoundingClientRect().top+scrollY-100;
  window.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 previous.addEventListener('click',()=>turnPage(-1));next.addEventListener('click',()=>turnPage(1));
 position.addEventListener('submit',event=>{event.preventDefault();const requested=Number(pageInput.value);if(!Number.isInteger(requested))return;page=Math.max(1,Math.min(Number(pageInput.max),requested));turnPage(0);});
 [search,category,sort].forEach(control=>control.addEventListener(control===search?'input':'change',()=>{page=1;render();updateURL();}));
 document.querySelector('#clear-filters').addEventListener('click',()=>{search.value='';category.value='';sort.value='newest';page=1;render();updateURL();search.focus();});
 document.addEventListener('ysph-language',()=>{categories();render();});
 fetch('/api/articles',{signal:AbortSignal.timeout(12000)}).then(async response=>{
  if(response.status===404){const fallback=await fetch('articles-seed.json',{cache:'no-store'});if(!fallback.ok)throw Error();return fallback.json();}
  if(!response.ok)throw Error();return response.json();
 }).then(data=>{articles=data.filter(article=>!retired.has(article.id));categories();category.value=query.get('category')||'';search.value=query.get('q')||'';render();}).catch(()=>{
  feed.replaceChildren();feed.setAttribute('aria-busy','false');pagination.hidden=true;
  const error=document.querySelector('#journal-error');error.hidden=false;error.textContent=lang()==='zh'?'文章暂时无法加载，请刷新重试。':'Articles could not be loaded. Please refresh to retry.';
 });
})();
