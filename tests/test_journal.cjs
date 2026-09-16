const assert=require('node:assert/strict');
const {filterArticles}=require('../journal-data.js');
const a=[
 {id:'a',date:'2026-09-08',createdAt:'2026-09-08T10:00:00Z',title:{zh:'健康新知识',en:'Health update'},summary:{zh:'营养'},category:{zh:'新分类',en:''},body:{zh:'全文可以检索维生素',en:''}},
 {id:'b',date:'2026-09-07',createdAt:'2026-09-07T10:00:00Z',title:{en:'Sleep science'},summary:{en:'Rest'},category:{en:'Sleep'},body:{en:'Evidence from a new study'}},
 {id:'c',date:'2026-09-08',createdAt:'2026-09-08T12:00:00Z',title:{en:'Latest'},summary:{en:''},category:{en:'News'},body:{en:'Health update'}}
];
assert.deepEqual(filterArticles(a,'','','newest').map(a=>a.id),['c','a','b']);
assert.deepEqual(filterArticles(a,'','','oldest').map(a=>a.id),['b','a','c']);
assert.equal(filterArticles(a,'维生素','','newest')[0].id,'a');
assert.equal(filterArticles(a,'  HEALTH update  ','新分类','newest')[0].id,'a');
assert.equal(filterArticles(a,'','Sleep','newest')[0].id,'b');
assert.equal(filterArticles(a,'notfound','','newest').length,0);
assert.deepEqual(a.map(a=>a.id),['a','b','c']);
console.log('Journal: Chinese/English full-text search, free-form categories, date sorting, stable tie-breaks and empty results passed.');
