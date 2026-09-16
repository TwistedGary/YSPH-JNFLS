(() => {
 const path=location.pathname.split('/').pop()||'index.html';
 const section=path==='about.html'?'about-menu':path==='index.html'?'explore-menu':'reading-menu';
 document.getElementById(section)?.parentElement.setAttribute('data-active','true');
 if (!document.querySelector('#article-detail')) return;
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let pending=false;
 const update=()=>{const distance=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${distance>0?Math.min(1,Math.max(0,scrollY/distance)):0})`;pending=false;};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('ysph-article-ready',schedule);update();
})();
