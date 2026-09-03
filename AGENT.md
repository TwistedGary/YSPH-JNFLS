# AGENT.md

## Mission

Build and maintain the official English website for **Youth Society for Public Health in JNFLS (YSPH-JNFLS)**, 中文名称为 **济南外国语学校青年公共卫生学会**.

The site must communicate a student-led public health society that is professional, academic, warm, and action-oriented.

## Language Rules

- User-facing website copy must be in English.
- Code comments, if necessary, must be written in Chinese.
- Commit messages, developer notes, and documentation may be in English unless the user requests Chinese.
- Do not mix Chinese into the public website UI except where the Chinese official name is intentionally displayed as brand context.

## Design Direction

Follow the visual direction in `design.md`.

Core qualities:

- editorial institutional design
- restrained warm palette
- large confident typography
- precise grid and spacing
- thin dividers and numbered sections
- real, specific public-health or school-community imagery
- no generic student-club decoration

The reference inspiration is Old Tom Capital's calm, highly structured visual language. Adapt the mood for a public health society rather than copying financial-industry content or layout literally.

## Implementation Principles

1. Make the first screen useful.
   The homepage must immediately show `Youth Society for Public Health in JNFLS`, a concise mission statement, and clear CTAs.

2. Prioritize real content structure.
   Programs, research, events, publications, team, and contact information should be modeled as maintainable data where possible.

3. Keep visual surfaces restrained.
   Use full-width sections, clean grids, thin borders, and compact cards only for repeated content.

4. Avoid decorative excess.
   Do not use gradient blobs, random abstract SVGs, oversized generic icons, or marketing-template hero sections.

5. Respect accessibility.
   All interactive elements need keyboard focus, adequate contrast, semantic markup, and readable mobile behavior.

6. Keep the project maintainable.
   Prefer simple, documented structures that future student members can edit without deep engineering knowledge.

## Recommended Site Structure

For a full site:

- `/` Home
- `/about`
- `/programs`
- `/research`
- `/events`
- `/publications`
- `/team`
- `/join`
- `/contact`

For an MVP single-page site:

- `#mission`
- `#programs`
- `#research`
- `#events`
- `#team`
- `#join`

## Required Content Themes

The website should make these themes visible:

- public health literacy
- epidemiology and data thinking
- disease prevention
- health equity
- campus and community outreach
- student research
- evidence-based communication
- collaboration with teachers, peers, families, and community partners

## Suggested Components

- Sticky header
- Editorial hero
- Section label component, for example `01 / MISSION`
- Program card
- Research/publication list item
- Event list item
- Team profile card
- Statistic block
- Join/contact CTA
- Footer with official name and short mission

## Content Model Suggestions

Use structured content for:

```json
{
  "programs": [
    {
      "number": "01",
      "title": "Health Literacy Workshops",
      "description": "Student-led sessions that translate public health concepts into practical campus knowledge.",
      "format": "Workshop",
      "output": "Peer education materials"
    }
  ]
}
```

```json
{
  "events": [
    {
      "date": "2026-09-14",
      "title": "Campus Health Literacy Forum",
      "type": "Forum",
      "location": "JNFLS",
      "status": "Upcoming"
    }
  ]
}
```

## Copywriting Guidance

Use clear, credible English. Prefer exact verbs and concrete nouns.

Good:

- `We turn evidence into school-based public health action.`
- `Students investigate health questions through surveys, reading groups, and community education.`
- `Our work connects prevention, data, equity, and everyday decisions.`

Avoid:

- `We are changing the world.`
- `We empower future leaders.`
- `Health is wealth.`
- `Join us to make a difference.`

## Code Comment Rule

If adding comments inside source code, write them in Chinese.

Example:

```ts
// 这里集中维护首页展示的数据，方便后续社团成员更新。
const programs = [];
```

Do not add unnecessary comments for obvious code.

## Frontend Quality Checklist

Before considering a website task complete:

- Header and navigation work on desktop and mobile.
- Hero clearly identifies YSPH-JNFLS in the first viewport.
- All visible public copy is English.
- Mobile view has no clipped, overlapping, or overflowing text.
- Images have meaningful alt text.
- Buttons and links have visible focus states.
- Cards are not nested inside cards.
- Section spacing is consistent.
- No page is dominated by a single hue.
- The final design feels professional, academic, warm, and action-oriented.

## Collaboration Notes

When implementing:

- Inspect the existing project before editing.
- Preserve user changes.
- Keep changes scoped.
- Use the existing framework and conventions if a project already exists.
- Start the dev server after substantial frontend work and provide the local URL.
- Verify with browser screenshots when possible after visual changes.

