from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / 'tools/library-content.json').read_text())

def t(tag, zh, en, attrs=''):
    return f'<{tag} {attrs} data-zh="{html.escape(zh, quote=True)}" data-en="{html.escape(en, quote=True)}">{html.escape(en)}</{tag}>'

def navlink(url, zh, en):
    return f'<a href="{url}">{t("span", zh, en)}<span class="nav-link-arrow" aria-hidden="true">↗</span></a>'

menu = '<div class="nav-dropdown" data-dropdown><button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="reading-menu" data-dropdown-toggle>' + t('span', '科普大全', 'Health Encyclopedia') + '<span class="nav-chevron" aria-hidden="true"></span></button><div class="nav-dropdown-menu" id="reading-menu">' + t('p', '按主题探索公共健康', 'Explore public health by topic', 'class="nav-menu-caption"') + navlink('encyclopedia.html', '全部专题', 'All Topics')
for slug, zh, en, *_ in data:
    menu += navlink(f'learn-{slug}.html', zh, en)
menu += '</div></div>'
for name in ['index.html', 'about.html']:
    path = ROOT / name
    s = path.read_text()
    s = re.sub(r'<div class="nav-dropdown" data-dropdown><button[^>]*aria-controls="reading-menu".*?</div></div>', lambda _: menu, s, flags=re.S)
    s = s.replace('navigation8', 'library9')
    path.write_text(s)
base = (ROOT / 'index.html').read_text()
header = re.search(r'<header.*?</header>', base, re.S)[0]
footer = re.search(r'<footer.*?</footer>', base, re.S)[0]

def page(filename, title, description, body):
    output = '<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
    output += f'<title>{html.escape(title)} | YSPH-JNFLS</title><meta name="description" content="{html.escape(description, quote=True)}">'
    output += '<link rel="stylesheet" href="styles.css?v=library9"></head><body>' + header + '<main id="top" class="library-main">' + body + '</main>' + footer + '<script src="script.js?v=library9"></script></body></html>\n'
    (ROOT / filename).write_text(output)

def cards():
    result = '<div class="library-grid">'
    for n, (slug, zh, en, desczh, descen, *_) in enumerate(data, 1):
        result += f'<a class="library-card" href="learn-{slug}.html"><span class="library-number">0{n}</span>' + t('h3', zh, en) + t('p', desczh, descen) + t('span', '阅读全文 ↗', 'Read the guide ↗', 'class="text-link"') + '</a>'
    return result + '</div>'

body = '<section class="section-pad library-intro">' + t('p', 'YSPH / 公共健康知识库', 'YSPH / THE HEALTH LIBRARY', 'class="eyebrow"') + t('h1', '科普大全', 'Health Encyclopedia') + t('p', '从身边的问题开始，探索六个公共健康专题。每篇都有知识解释、常见误区、日常做法与参考来源。', 'Start with an everyday question. Explore six public health guides, each with explanations, a misconception, a practical takeaway and references.', 'class="library-deck"') + cards() + '</section>'
page('encyclopedia.html', 'Health Encyclopedia', 'Six public health guides for students and communities.', body)
for n, (slug, zh, en, desczh, descen, sections, myth, action, sources) in enumerate(data):
    body = '<section class="section-pad article-heading"><nav class="breadcrumbs" aria-label="Breadcrumb">' + navlink('encyclopedia.html','科普大全','Health Encyclopedia') + '</nav>' + t('p', '科普专题 / ' + str(n+1).zfill(2), 'FIELD GUIDE / ' + str(n+1).zfill(2), 'class="eyebrow"') + t('h1', zh, en) + t('p', desczh, descen, 'class="library-deck"') + t('p', '资料核对：2026年9月8日 · YSPH 科普整理', 'Sources checked: 8 September 2026 · YSPH educational overview', 'class="article-meta"') + '</section><div class="article-layout section-pad"><aside class="article-toc">' + t('p','本页目录','On this page')
    for i, (ztitle, etitle, *_ ) in enumerate(sections):
        body += t('a',ztitle,etitle,f'href="#section-{i+1}"')
    body += t('a','常见误区','Common misconception','href="#myth"') + t('a','参考资料','References','href="#references"') + '</aside><article class="article-body">'
    for i, (ztitle, etitle, ztext, etext) in enumerate(sections):
        body += f'<section id="section-{i+1}">' + t('span',f'0{i+1} / 知识',f'0{i+1} / EXPLAINED','class="section-label"') + t('h2',ztitle,etitle) + t('p',ztext,etext) + '</section>'
    body += '<section id="myth" class="article-myth">' + t('span','常见误区','COMMON MISCONCEPTION','class="section-label"') + t('h2',myth[0],myth[1]) + t('p',myth[2],myth[3]) + '</section><section class="article-action">' + t('h2','日常可以做什么？','One thing to put into practice') + t('p',action[0],action[1]) + '</section><section id="references">' + t('h2','参考资料','References') + '<ul>'
    for title,url in sources:body+=f'<li><a href="{url}">{html.escape(title)}</a></li>'
    body += '</ul>' + t('p','用于公共健康学习，不替代个人诊断或治疗建议。','For public health education; not a substitute for individual diagnosis or treatment advice.','class="article-meta"') + '</section><div class="article-next">' + t('a','返回科普大全','Back to all topics','href="encyclopedia.html"')
    nxt=data[(n+1)%len(data)]
    body += t('a','继续阅读：'+nxt[1]+' →','Read next: '+nxt[2]+' →',f'href="learn-{nxt[0]}.html"') + '</div></article></div>'
    page(f'learn-{slug}.html',en,descen,body)
path=ROOT/'index.html';s=path.read_text()
s=re.sub(r'<section class="reading-room section-pad" id="reading">.*?</section>',lambda _: '<section class="reading-room section-pad" id="reading">' + t('div','02 / 科普大全','02 / HEALTH ENCYCLOPEDIA','class="section-label"') + t('h2','从好奇开始，把健康读明白。','Follow your curiosity. Understand your health.') + cards() + t('a','浏览全部专题 →','Browse all topics →','href="encyclopedia.html" class="text-link"') + '</section>',s,flags=re.S)
for old,new in [('index.html#check-source','learn-health-information.html#section-1'),('index.html#check-evidence','learn-health-information.html#section-2'),('index.html#check-date','learn-health-information.html#section-3')]:
    s=s.replace(old,new)
path.write_text(s)
