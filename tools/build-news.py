from pathlib import Path
import html
import re

ROOT = Path(__file__).resolve().parent.parent


def t(tag, zh, en, attrs=''):
    return f'<{tag} {attrs} data-zh="{html.escape(zh, quote=True)}" data-en="{html.escape(en, quote=True)}">{html.escape(en)}</{tag}>'


base = (ROOT / 'index.html').read_text()
header = re.search(r'<header.*?</header>', base, re.S)[0]
footer = re.search(r'<footer.*?</footer>', base, re.S)[0]

masthead = '<section class="news-intro section-pad">'
masthead += '<div class="news-publication-line">' + t('span', 'YSPH / 学会新闻', 'YSPH / THE NEWSROOM') + t('a', '往日新闻 ↓', 'PAST NEWS ↓', 'href="#archive"') + '</div>'
masthead += '<div class="news-masthead"><h1>' + t('span', '学会', 'Society') + t('em', '新闻。', 'News.') + '</h1>'
masthead += t('p', '记录青年公共卫生行动、校园合作与社区里的每一次相遇。', 'A record of youth public-health action, campus collaboration and moments in the community.', 'class="news-deck"') + '</div></section>'

lead = '<section class="news-feature section-pad" id="latest">' + t('p', '01 / 最新发布', '01 / LATEST', 'class="section-label"')
lead += '<article class="news-lead"><figure class="news-lead-image"><img src="images/JNFLS/9c23fe79a8b282987402b739eb961bec.jpg" alt="Jinan Foreign Language School campus" width="1793" height="1346"></figure><div class="news-lead-content">'
lead += t('time', '2026 年 9 月 17 日', '17 SEPTEMBER 2026', 'datetime="2026-09-17"')
lead += t('p', '网站更新', 'YSPH UPDATE', 'class="news-kicker"')
lead += t('h2', 'YSPH-JNFLS 新闻室上线：让每一段行动留下可追溯的记录。', 'The YSPH-JNFLS newsroom opens: a place to keep each action on record.')
lead += t('p', '从今天起，学会的动态、项目进展和社区行动会在这里持续整理。每一条新闻都会标明日期与主题，让读者更容易找到我们正在做的事。', 'From today, society updates, project progress and community action will be gathered here. Each story carries a date and theme so readers can find what we are working on.', 'class="news-summary"')
lead += t('a', '查看往日新闻 ↓', 'Browse the archive ↓', 'href="#archive" class="text-link"') + '</div></article></section>'

archive = '<section class="news-archive section-pad" id="archive"><div class="news-archive-head">' + t('p', '02 / 往日新闻', '02 / PAST NEWS', 'class="section-label"') + t('h2', '在行动中，慢慢积累。', 'A growing record of action.') + '</div><div class="news-archive-list">'
stories = [
    ('08 SEPT 2026', '2026 年 9 月 8 日', '科普大全首批专题发布', 'The first six health guides are published', '结核病、传染类疾病、均衡饮食、日常运动、抗菌药物耐药与健康信息辨别，构成科普大全的第一批主题。', 'Tuberculosis, infectious diseases, nutrition, movement, antimicrobial resistance and health information form the first collection in the Health Encyclopedia.', '网站更新', 'SITE UPDATE', 'images/editorial/health-information.png', 'Research materials and health data on a desk'),
    ('PROJECT ARCHIVE', '项目档案', '健康微光：把公共健康带到更近的地方', 'Health Glimmer: bringing public health closer', '我们在真实的交流中练习倾听、查证与解释，让健康知识成为可以被讨论和分享的日常语言。', 'Through real conversations, we practise listening, checking and explaining, so health knowledge can become part of everyday life.', '社区行动', 'COMMUNITY ACTION', 'images/沂蒙山支教-健康微光/IMG_3627.JPG', 'Youth volunteers during a community education visit'),
    ('PROJECT ARCHIVE', '项目档案', '从课堂走向社区：青年公共卫生的现场学习', 'Beyond the classroom: public health in practice', '一次次志愿服务让我们看见健康议题与不同人群的生活如何相连，也提醒我们用更清楚、更尊重的方式传递信息。', 'Volunteer work shows us how health connects with people’s everyday lives, and calls for clearer, more respectful communication.', '志愿服务', 'VOLUNTEERING', 'images/千佛山医院白血病儿童跳蚤市场/IMG_4063.JPG', 'Volunteers visiting a hospital ward')
]
for en_date, zh_date, zh_title, en_title, zh_text, en_text, zh_tag, en_tag, image, alt in stories:
    archive += '<article class="news-story"><div class="news-story-date">' + t('time', zh_date, en_date) + '</div><div class="news-story-copy">' + t('p', zh_tag, en_tag, 'class="news-kicker"') + t('h3', zh_title, en_title) + t('p', zh_text, en_text) + '</div><figure class="news-story-image"><img src="' + image + '" alt="' + alt + '" loading="lazy"></figure></article>'
archive += '</div></section>'

page = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="News and project updates from YSPH-JNFLS."><title>News | YSPH-JNFLS</title><link rel="stylesheet" href="styles.css?v=journal10"></head><body>'
page += header + '<main class="library-main news-main" id="top">' + masthead + lead + archive + '</main>' + footer + '<script src="script.js?v=editorial11"></script></body></html>\n'
(ROOT / 'news.html').write_text(page)
