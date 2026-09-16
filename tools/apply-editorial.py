from pathlib import Path
import re,html
ROOT=Path(__file__).resolve().parent.parent

def t(tag,z,e,attrs=''):
 return f'<{tag} {attrs} data-zh="{html.escape(z,quote=True)}" data-en="{html.escape(e,quote=True)}">{html.escape(e)}</{tag}>'

def apply():
 for p in ROOT.glob('*.html'):
  s=p.read_text()
  s=re.sub(r'<link[^>]+href="https://fonts\.(?:googleapis|gstatic)\.com[^>]*>','',s)
  if 'href="editorial.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="fonts.css?v=editorial11"><link rel="stylesheet" href="editorial.css?v=editorial11"></head>')
  if 'src="editorial.js' not in s:s=s.replace('</body>','<script src="editorial.js?v=editorial11" defer></script></body>')
  s=s.replace('script.js?v=journal10','script.js?v=editorial11').replace('journal.js?v=journal10','journal.js?v=editorial11').replace('article.js?v=journal10','article.js?v=editorial11')
  if 'class="brand-name"' not in s:
   s=s.replace('<span>YSPH-JNFLS</span>','<span class="brand-copy"><span class="brand-name">YSPH-JNFLS</span>'+t('span','青年公共卫生学会','Youth Society for Public Health','class="brand-descriptor"')+'</span>')
  if 'class="footer-masthead"' not in s and '<footer' in s:
   s=s.replace('<footer class="site-footer">','<footer class="site-footer"><div class="footer-masthead">'+t('span','让知识','Science,')+t('em','与生活相遇。','shared.')+'</div>')
  if p.name=='index.html':
   hero='''<section class="science-hero section-pad" aria-labelledby="hero-title"><div class="science-masthead"><span>YSPH / THE PUBLIC HEALTH READER</span>'''+t('span','从好奇出发 · 用证据理解','CURIOSITY, MEET EVIDENCE.')+'''</div><div class="science-hero-grid"><div class="science-hero-text">'''
   hero+=t('p','给每一个关心健康的你','FOR CURIOUS MINDS. FOR EVERYDAY LIFE.','class="eyebrow"')+'<h1 id="hero-title">'+t('span','从一个问题，','A little curiosity.')+t('em','读懂公共健康。','A healthier world.')+'</h1>'
   hero+=t('p','结核病如何传播？感染就意味着生病吗？从清楚的解释和可靠的证据开始，一起理解身边的健康。','How does TB spread? Does infection always mean illness? Explore the science behind the questions that matter to everyday life.','class="science-deck"')
   hero+='<div class="science-actions">'+t('a','探索科普大全','Explore the journal','href="encyclopedia.html" class="button science-button"')+t('a','从结核病开始 ↗','Start with TB ↗','href="#tb-knowledge" class="text-link"')+'</div></div>'
   hero+='''<figure class="science-cover"><img src="images/editorial/microscope.jpg" alt="Close-up of a laboratory microscope" width="1800" height="2700" fetchpriority="high"><div class="science-cover-label"><span>01 / IN FOCUS</span>'''+t('strong','看见知识的细节。','A closer look.')+'''</div><figcaption><a href="https://unsplash.com/photos/fN6K30xtiKE">Logan Gutierrez / Unsplash</a>'''+t('span','实验室影像','LABORATORY STUDIES')+'''</figcaption></figure></div><div class="science-bottomline">'''+t('span','由济南外国语学校青年公共卫生学会呈现','A PUBLICATION BY YOUTH SOCIETY FOR PUBLIC HEALTH IN JNFLS')+t('a','向下探索 ↓','SCROLL TO DISCOVER ↓','href="#tb-knowledge"')+'</div></section>'
   s=re.sub(r'<section class="science-hero section-pad".*?</section>',lambda _:hero,s,count=1,flags=re.S)
  if p.name=='encyclopedia.html':
   masthead='<div class="journal-publication-line">'+t('span','YSPH / 科普大全','YSPH / AN OPEN NOTEBOOK ON PUBLIC HEALTH')+t('a','所有文章 ↓','ALL ARTICLES ↓','href="#daily-knowledge"')+'</div><div class="journal-masthead"><h1>'+t('span','科普','The Knowledge')+t('em','大全','Journal.')+'</h1><div class="journal-intro-note">'+t('p','每个问题，都值得一次探索。','Good questions deserve thoughtful answers.','class="journal-note-title"')+t('p','记录新发现，分享可靠知识。关于健康，也关于我们共同生活的世界。','New discoveries, useful knowledge, and a closer look at the world we share.','class="library-deck"')+'</div></div>'
   s=re.sub(r'(<section class="section-pad journal-intro">).*?(<div class="journal-tools">)',lambda m:m[1]+masthead+m[2],s,count=1,flags=re.S)
   s=s.replace('<div class="journal-section-head">','<div class="journal-section-head"><span class="archive-label">THE READING ROOM</span>') if 'class="archive-label"' not in s else s
   s=s.replace('<div id="article-feed"></div>','<div id="article-feed" aria-busy="true"><div class="journal-loading"><span></span><span></span><span></span></div></div>')
  if p.name=='about.html':
   s=s.replace('<h1 id="about-title" data-en="Who We Are" data-zh="我们是谁">Who We Are</h1>','<h1 id="about-title">'+t('span','我们','Who we')+t('em','是谁','are.')+'</h1>')
   s=s.replace('class="campus-hero-content"','class="campus-hero-content"')
  p.write_text(s)

if __name__=='__main__':apply()
