from pathlib import Path
import json,re,html
ROOT=Path(__file__).resolve().parent.parent
E=html.escape
credits=json.loads((ROOT/'images/editorial/credits.json').read_text())
mapping={'tuberculosis':'microscope','hand-hygiene':'hands','nutrition':'nutrition','movement':'movement','antimicrobials':'laboratory'}
base=(ROOT/'index.html').read_text()
header=re.search(r'<header.*?</header>',base,re.S)[0]
footer=re.search(r'<footer.*?</footer>',base,re.S)[0]
def t(tag,z,e,attrs=''):return f'<{tag} {attrs} data-zh="{E(z,quote=True)}" data-en="{E(e,quote=True)}">{E(e)}</{tag}>'
def page(name,title,body,js):
 (ROOT/name).write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' | YSPH-JNFLS</title><link rel="stylesheet" href="styles.css?v=journal10"></head><body>'+header+'<main class="library-main" id="top">'+body+'</main>'+footer+'<script src="script.js?v=journal10"></script><script src="'+js+'" defer></script></body></html>')
seeds=[]
for row in json.loads((ROOT/'tools/library-content.json').read_text()):
 slug,zh,en,dzh,den,sections,myth,action,sources=row
 body={lang:'\n\n'.join('## '+sec[i]+'\n'+sec[i+2] for sec in sections)+'\n\n## '+myth[i]+'\n'+myth[i+2]+'\n\n## '+('日常做法' if lang=='zh' else 'In practice')+'\n'+action[i] for lang,i in [('zh',0),('en',1)]}
 im=credits.get(mapping.get(slug,''),{})
 seeds.append({'id':slug,'title':{'zh':zh,'en':en},'summary':{'zh':dzh,'en':den},'category':{'zh':zh,'en':en},'date':'2026-09-08','body':body,'sources':[{'title':a,'url':b} for a,b in sources],'cover':im.get('path',''),'credit':im.get('credit',''),'imageSource':im.get('source',''),'imageAlt':im.get('alt',''),'status':'published','createdAt':'2026-09-08T00:00:00Z','updatedAt':'2026-09-08T00:00:00Z'})
 if im:
  path=ROOT/f'learn-{slug}.html';s=path.read_text()
  figure=f'<figure class="article-cover"><img src="{im["path"]}" alt="{E(im["alt"],quote=True)}" width="1800" height="1200"><figcaption><a href="{im["source"]}">{E(im["credit"])}</a> · Illustrative photograph</figcaption></figure>'
  s=re.sub(r'<figure class="article-cover">.*?</figure>','',s,flags=re.S)
  s=s.replace('<div class="article-layout section-pad">',figure+'<div class="article-layout section-pad">');path.write_text(s)
(ROOT/'articles-seed.json').write_text(json.dumps(seeds,ensure_ascii=False,indent=2)+'\n')
body='<section class="section-pad journal-intro">'+t('p','YSPH / 每日知识','YSPH / THE KNOWLEDGE JOURNAL','class="eyebrow"')+t('h1','科普大全','The Knowledge Journal')+t('p','新的问题，新的发现。按时间浏览知识文章，或搜索你今天感兴趣的内容。','New questions. Fresh discoveries. Browse our knowledge journal by date, or search for what interests you today.','class="library-deck"')+'<div class="journal-tools"><label>'+t('span','搜索文章','Search articles')+'<input id="article-search" type="search" placeholder="Search titles, topics, or text…"></label><label>'+t('span','分类','Category')+'<select id="article-category"><option value="">All categories</option></select></label><label>'+t('span','排序','Sort by')+'<select id="article-sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div></section><section class="section-pad journal-section" id="daily-knowledge"><div class="journal-section-head">'+t('h2','每日知识','Knowledge updates')+'<p id="article-count" role="status" aria-live="polite"></p></div><div id="article-feed"></div><div id="article-empty" hidden>'+t('h3','没有找到相关文章','No matching articles')+t('p','试试其他关键词，或清除筛选查看全部文章。','Try another keyword or clear the filters to see all articles.')+'<button id="clear-filters" type="button">'+t('span','清除筛选','Clear filters')+'</button></div><p id="journal-error" role="alert" hidden></p><noscript><p>Enable JavaScript to search articles. <a href="learn-tuberculosis.html">Read the TB guide</a></p></noscript></section>'
page('encyclopedia.html','Knowledge Journal',body,'journal.js?v=journal10')
p=ROOT/'encyclopedia.html';s=p.read_text().replace('<script src="journal.js','<script src="journal-data.js?v=journal10"></script><script src="journal.js');p.write_text(s)
page('article.html','Knowledge Article','<section class="section-pad" id="article-detail"><p role="status">Loading article…</p></section>','article.js?v=journal10')
# 首页的已有专题卡片配上经过核对的图片。
p=ROOT/'index.html';s=p.read_text()
for slug,key in mapping.items():
 im=credits[key];start=f'<a class="library-card" href="learn-{slug}.html">'
 if start+'<img' not in s:s=s.replace(start,start+f'<img class="library-card-image" src="{im["path"]}" alt="{E(im["alt"],quote=True)}" loading="lazy" width="600" height="400">')
s=s.replace('Browse all topics →','Browse all articles →').replace('浏览全部专题 →','浏览全部文章 →');p.write_text(s)
for p in ROOT.glob('*.html'):
 s=p.read_text().replace('library9','journal10')
 s=s.replace('data-zh="全部专题" data-en="All Topics"','data-zh="全部文章" data-en="All Articles"').replace('>All Topics<','>All Articles<')
 # 全站保留一个低调的编辑入口。
 if 'href="admin.html"' not in s:s=s.replace('</footer>','<a class="editor-link" href="admin.html" data-en="Editor login" data-zh="编辑登录">Editor login</a></footer>')
 p.write_text(s)

# 内容重建后保留当前的编辑设计。
import runpy
runpy.run_path(str(ROOT / "tools/apply-editorial.py"), run_name="__main__")
