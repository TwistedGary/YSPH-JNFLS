(function (root) {
 function filterArticles(articles, query, category, order) {
  const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return articles.filter(a=>(!category||(a.category?.en||a.category?.zh||'')===category)&&terms.every(q=>JSON.stringify([a.title,a.summary,a.category,a.body]).toLocaleLowerCase().includes(q))).sort((a,b)=>{
   const d=a.date.localeCompare(b.date)||a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id);
   return order==='oldest'?d:-d;
  });
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={filterArticles};
 else root.YSPHJournal={filterArticles};
})(globalThis);
