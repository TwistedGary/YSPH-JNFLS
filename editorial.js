(() => {
 const path=location.pathname.split('/').pop()||'index.html';
 const section=path==='about.html'?'about-menu':path==='index.html'?'explore-menu':'reading-menu';
 document.getElementById(section)?.parentElement.setAttribute('data-active','true');
 const guideCategories={
  'learn-tuberculosis.html':'Tuberculosis',
  'learn-hand-hygiene.html':'Infectious Diseases',
  'learn-nutrition.html':'Balanced Nutrition',
  'learn-movement.html':'Everyday Movement',
  'learn-antimicrobials.html':'Antimicrobial Resistance',
  'learn-health-information.html':'Health Information'
 };
 if(guideCategories[path]||document.querySelector('#article-detail')){
  let articlesPromise;
  const loadArticles=()=>articlesPromise ||= fetch('/api/articles',{signal:AbortSignal.timeout(12000)}).then(async response=>{
   if(response.ok)return response.json();
   if(response.status!==404)throw Error('Articles unavailable');
   const fallback=await fetch('articles-seed.json');
   if(!fallback.ok)throw Error('Articles unavailable');
   return fallback.json();
  });
  async function related(){
   const detail=document.querySelector('#article-detail');
   const body=document.querySelector('.article-body');
   const category=detail?.dataset.category||guideCategories[path];
   if(!body||!category)return;
   try{
    const articles=await loadArticles();
    if(!body.isConnected)return;
    const matches=articles.filter(a=>(a.category.en||a.category.zh)===category&&a.id!==detail?.dataset.articleId&&a.title.en!==a.category.en)
     .sort((a,b)=>b.date.localeCompare(a.date)).slice(0,2);
    body.querySelector('.related-reading')?.remove();
    if(!matches.length)return;
    const lang=document.body.dataset.language||'en';const zh=lang==='zh';
    const section=document.createElement('section');section.className='related-reading';
    const heading=document.createElement('h2');heading.textContent=zh?'继续阅读本类短文':'Short reads in this topic';section.append(heading);
    const list=document.createElement('ul');
    matches.forEach(a=>{const item=document.createElement('li');const link=document.createElement('a');link.href='article.html?id='+encodeURIComponent(a.id);link.textContent=a.title[lang]||a.title.zh||a.title.en;const date=document.createElement('time');date.dateTime=a.date;date.textContent=a.date;item.append(date,link);list.append(item);});
    section.append(list);body.insertBefore(section,body.querySelector('.article-ending,.article-next'));
   }catch{articlesPromise=undefined;}
  }
  document.addEventListener('ysph-article-ready',related);
  document.addEventListener('ysph-language',related);
  related();
 }
 if (!document.querySelector('#article-detail')) return;
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let pending=false;
 const update=()=>{const distance=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${distance>0?Math.min(1,Math.max(0,scrollY/distance)):0})`;pending=false;};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('ysph-article-ready',schedule);update();
})();
