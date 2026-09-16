(async () => {
 const root=document.querySelector('#article-detail');
 let article;
 const lang=()=>document.body.dataset.language||'en';
 const txt=v=>v?.[lang()]||v?.zh||v?.en||'';
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 function render(){
  const zh=lang()==='zh';root.replaceChildren();
  const breadcrumb=el('div',null,'article-breadcrumb');
  const back=el('a',zh?'← 返回科普大全':'← BACK TO THE JOURNAL','text-link');back.href='encyclopedia.html';breadcrumb.append(back,el('span','YSPH / FIELD NOTES'));root.append(breadcrumb);
  const title=el('header',null,'article-title-block');
  const meta=el('p',null,'journal-meta');const date=el('time',article.date);date.dateTime=article.date;meta.append(date,el('span',txt(article.category)));
  title.append(meta,el('h1',txt(article.title)),el('p',txt(article.summary),'library-deck'),el('span',zh?'YSPH-JNFLS / 公共健康知识库':'YSPH-JNFLS / THE PUBLIC HEALTH READER','article-byline'));root.append(title);
  if(article.cover){const fig=el('figure',null,'article-cover');const img=el('img');img.src=article.cover;img.alt=article.imageAlt||txt(article.title);img.width=1600;img.height=800;fig.append(img);const caption=el('figcaption');if(article.imageSource){const a=el('a',article.credit);a.href=article.imageSource;caption.append(a);}else caption.textContent=article.credit;fig.append(caption);root.append(fig);}
  const layout=el('div',null,'article-reading-layout');
  const sidebar=el('aside',null,'reading-sidebar');sidebar.append(el('p',zh?'本篇导读':'IN THIS ARTICLE'));const toc=el('nav');toc.setAttribute('aria-label',zh?'文章目录':'Article contents');sidebar.append(toc);
  const content=el('div',null,'article-body journal-body');let headingCount=0;
  function heading(text){const h=el('h2',text);h.id='read-section-'+(++headingCount);content.append(h);const a=el('a',text);a.href='#'+h.id;toc.append(a);}
  txt(article.body).split(/\n\s*\n/).forEach(block=>{
    block.split(/\n(?=## )/).forEach(part=>{
      if(part.startsWith('## ')){const [title,...rest]=part.split('\n');heading(title.slice(3));if(rest.length)content.append(el('p',rest.join('\n')));}
      else if(part.trim())content.append(el('p',part));
    });
  });
  if(article.sources.length){heading(zh?'参考资料':'Sources & further reading');const list=el('ul');article.sources.forEach(s=>{const li=el('li');const a=el('a',s.title);a.href=s.url;li.append(a);list.append(li);});content.append(list);}
  const ending=el('div',null,'article-ending');ending.append(el('span','YSPH-JNFLS'));const all=el('a',zh?'继续探索科普大全 ↗':'More from the journal ↗');all.href='encyclopedia.html';ending.append(all);content.append(ending);
  if(headingCount)layout.append(sidebar);else layout.classList.add('without-sidebar');layout.append(content);root.append(layout);
  document.title=txt(article.title)+' | YSPH-JNFLS';document.dispatchEvent(new Event('ysph-article-ready'));
 }
 try {
  const id=new URLSearchParams(location.search).get('id');if(!id)throw Error('missing');
  const r=await fetch('/api/articles/'+encodeURIComponent(id),{signal:AbortSignal.timeout(12000)});
  if(r.ok) article=await r.json();
  else {
   const fallback=await fetch('articles-seed.json',{signal:AbortSignal.timeout(12000)});
   if(!fallback.ok)throw Error('server');
   article=(await fallback.json()).find(item=>item.id===id);
  }
  if(!article)throw Error('missing');render();document.addEventListener('ysph-language',render);
 }catch(e){root.replaceChildren(el('h1',lang()==='zh'?'暂时无法打开文章':'Article unavailable'),el('p',lang()==='zh'?'文章可能尚未发布，或服务暂时不可用。':'This article may be unpublished, or the service may be temporarily unavailable.'));const a=el('a',lang()==='zh'?'返回全部文章':'Back to all articles');a.href='encyclopedia.html';root.append(a);}
})();
