# Youth Society for Public Health in JNFLS Website Design

## 1. Brand Positioning

**Official English name:** Youth Society for Public Health in JNFLS  
**Chinese name:** 济南外国语学校青年公共卫生学会  
**Short name:** YSPH-JNFLS  

The website should present YSPH-JNFLS as a student-led public health society with academic discipline, civic warmth, and real-world momentum. It should feel credible enough for teachers, partner institutions, and parents, while still carrying the energy of young people who study, organize, investigate, and act.

The site should be written entirely in English. If source code comments are needed, comments should be written in Chinese.

## 2. Reference Direction

The visual direction is inspired by the refined institutional design language of Old Tom Capital:

- restrained editorial layout
- strong typography with generous spacing
- warm neutral backgrounds
- disciplined grids and clear content hierarchy
- understated motion and precise interactions
- numerical labels, compact metadata, and structured sections
- a feeling of trust built through calm design rather than decoration

This inspiration should be adapted for a public health student society. The result should feel academic, humane, and action-oriented, not financial, corporate, or luxury.

## 3. Design Principles

### Professional

Use confident typography, clear navigation, concise copy, and rigorous alignment. Avoid playful clutter, generic student-club decoration, and stock-like wellness imagery.

### Academic

Make research, evidence, learning, and publication visible. Use section structures that resemble briefs, field notes, research indexes, and program reports.

### Warm

Balance the institutional tone with human language, soft contrast, and images of students, classrooms, fieldwork, public spaces, health education, and community engagement.

### Action-Oriented

The site should show what the society does: campaigns, research projects, health education, events, partnerships, and student leadership. Every major page should make the next action obvious.

## 4. Visual Identity

### Color Palette

Use a restrained, warm institutional palette with one public-health accent.

| Token | Hex | Use |
| --- | --- | --- |
| `--color-ink` | `#111111` | Primary text, navigation, key rules |
| `--color-charcoal` | `#2B2B28` | Secondary dark surfaces |
| `--color-paper` | `#F6F2EA` | Main page background |
| `--color-white` | `#FFFFFF` | Content surfaces and contrast areas |
| `--color-stone` | `#D8D1C5` | Borders, dividers, quiet backgrounds |
| `--color-sage` | `#6F8F7A` | Public health accent |
| `--color-red` | `#A64235` | Urgent highlights, alerts, active markers |
| `--color-blue` | `#315C7C` | Academic links, data, reports |

Avoid making the site dominated by only green or blue. Public health should be suggested through clarity, trust, and action, not a single-color medical theme.

### Typography

Use a strong serif/sans pairing.

Recommended stack:

- Display serif: `Cormorant Garamond`, `Libre Baskerville`, or `Georgia`
- Interface sans: `Inter`, `Source Sans 3`, `Arial`, or system sans

Typography behavior:

- Hero headlines should be large, editorial, and line-broken deliberately.
- Body copy should be quiet and highly readable.
- Metadata, labels, and section numbers should use uppercase sans text.
- Do not use negative letter spacing.
- Do not scale font size directly with viewport width.

Suggested scale:

| Role | Desktop | Mobile |
| --- | --- | --- |
| Hero title | 72-104px | 42-56px |
| Section title | 40-64px | 32-40px |
| Card title | 20-28px | 20-24px |
| Body | 17-19px | 16-18px |
| Metadata | 12-14px | 12-13px |

### Imagery

Images should feel real, observational, and specific:

- students discussing public health topics
- classroom or seminar scenes
- community health education
- research notes, charts, books, posters
- Jinan/JNFLS campus or city context where available
- vaccination, hygiene, nutrition, mental health, environment, epidemiology, and health equity themes

Avoid dark, blurred, generic medical stock images. Do not rely on abstract gradients or decorative SVGs as primary visuals.

### Layout

The layout should use full-width bands and a disciplined content grid.

Recommended grid:

- Max content width: `1440px`
- Desktop margin: `48-72px`
- Tablet margin: `32px`
- Mobile margin: `20px`
- Grid: 12 columns desktop, 6 tablet, 4 mobile

Layout habits:

- Use large empty space intentionally.
- Place important text directly on the page, not inside decorative cards.
- Use cards only for repeated items such as programs, publications, team members, or event listings.
- Keep card border radius at `8px` or less.
- Use thin rules, numbered sections, and compact metadata to create structure.

## 5. Interaction Style

Interactions should be precise and quiet.

- Links: underline or rule movement on hover.
- Buttons: simple outlined or filled rectangles with subtle hover states.
- Navigation: sticky header with compact wordmark and clear page links.
- Motion: short fades, line reveals, and image scale of `1.02` max.
- Avoid excessive parallax, bouncy animations, or playful cursor effects.

Use accessible focus states for all interactive elements.

## 6. Site Architecture

Recommended pages:

1. Home
2. About
3. Programs
4. Research
5. Events
6. Publications
7. Team
8. Join
9. Contact

For an MVP, combine pages into a polished single-page site with anchored sections:

- Mission
- Programs
- Research & Publications
- Events
- Team
- Join / Contact

## 7. Homepage Structure

### Header

The header should include:

- `YSPH-JNFLS` wordmark
- navigation links: About, Programs, Research, Events, Join
- one primary CTA: `Join the Society`

The header should be slim, sticky, and lightly separated by a bottom border.

### Hero

The first viewport should immediately identify the society.

Hero headline:

> Youth Society for Public Health in JNFLS

Suggested supporting copy:

> A student-led academic society advancing public health literacy, research practice, and community action at Jinan Foreign Language School.

Hero components:

- large editorial headline
- concise mission statement
- two CTAs: `Explore Our Work`, `Join Us`
- a right or lower visual field using real student/public-health imagery
- a compact fact row:
  - `Founded by students`
  - `Public health education`
  - `Research-based action`
  - `JNFLS community`

### Mission Band

Use a strong statement:

> We study public health as both evidence and responsibility.

Below it, present three pillars:

- Learn: seminars, reading groups, health literacy sessions
- Research: surveys, data interpretation, public health writing
- Act: campaigns, school/community outreach, peer education

### Programs

Program cards should be structured, not decorative.

Suggested program categories:

- Health Literacy Workshops
- Epidemiology & Data Lab
- Campus Health Campaigns
- Public Health Reading Group
- Community Outreach
- Student Research Projects

Each card should include:

- program number
- title
- one-line description
- format
- output

### Research & Publications

This section should feel like an academic index.

Content types:

- research briefs
- survey reports
- explainers
- public health essays
- translated or summarized academic resources
- campaign impact notes

Each item should include:

- title
- topic tag
- date
- authors or working group
- short abstract

### Events

Show upcoming and past events in a clean list.

Fields:

- date
- event title
- type
- location
- status

### Team

Present team members with restraint.

Fields:

- name
- role
- working group
- short responsibility line

Avoid overly casual bios. Keep the tone warm and capable.

### Join / Contact

End with a direct invitation.

Suggested copy:

> Join YSPH-JNFLS if you care about evidence, health equity, and practical change in the school community.

CTA options:

- `Apply to Join`
- `Contact the Executive Team`
- `Propose a Collaboration`

## 8. Content Voice

The English copy should be:

- clear
- academically credible
- youthful but not childish
- warm without being sentimental
- action-focused

Preferred words:

- evidence
- literacy
- prevention
- community
- inquiry
- fieldwork
- responsibility
- equity
- collaboration
- practice

Avoid overused slogans:

- changing the world
- empowering youth
- future leaders
- making a difference
- health is wealth

## 9. Component System

### Wordmark

Text-based wordmark:

`YSPH-JNFLS`

Optional lockup:

`Youth Society for Public Health in JNFLS`

Use no medical cross icon unless it is heavily abstracted and original.

### Buttons

Primary:

- black background
- paper text
- rectangular with `6px` radius
- subtle hover darkening or color inversion

Secondary:

- transparent background
- dark border
- dark text
- hover fill in dark

### Section Labels

Use a consistent format:

`01 / MISSION`  
`02 / PROGRAMS`  
`03 / RESEARCH`  

### Cards

Cards should be white or paper surfaces with thin borders.

Rules:

- radius: `8px` max
- no nested cards
- no heavy shadows
- use top metadata and bottom action link

### Data Blocks

Use compact statistic blocks for credibility:

- number
- label
- short explanation

Example:

`06`  
`Working Groups`  
`Student-led teams focused on education, research, outreach, publications, design, and partnerships.`

## 10. Accessibility

Requirements:

- WCAG AA color contrast
- keyboard navigable menus and buttons
- visible focus states
- semantic headings
- alt text for all meaningful images
- responsive type and layout
- no text overlap on mobile
- no hover-only critical information

## 11. Technical Notes

Implementation may use any modern frontend stack, but the first version should remain lightweight. Recommended options:

- static HTML/CSS/JS
- Astro
- Next.js
- Vite + React

If comments are added in code, write comments in Chinese.

The site should be easy to maintain by student editors. Prefer structured content files such as JSON, Markdown, or MDX for programs, events, research items, and team members.

## 12. Quality Bar

Before delivery, verify:

- the first viewport clearly shows the society name
- the site is fully in English
- mobile layout has no overlapping text
- cards and buttons keep stable dimensions
- imagery loads correctly
- navigation anchors or pages work
- the tone feels professional, academic, warm, and action-oriented
- no section looks like a generic club template

