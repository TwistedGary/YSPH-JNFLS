# YSPH / Editorial redesign

## Design Read

- Artifact: public health publication, with homepage, searchable journal, article reader and society pages.
- Audience: students and readers seeking approachable, evidence-based health knowledge.
- Mode: Redesign · Preserve. Upgrade the composition, retain URLs, bilingual content, navigation, search, date ordering, publishing workflow and stored articles.
- Visual language: independent science journal; warm editorial typography with documentary photography.
- Dials: visual variance 7/10, motion 3/10, density 4/10, asset dependence 8/10, brand fidelity 8/10.

## Positioning

The homepage introduces curiosity; the journal is a browsing surface; the article is a focused reading surface; the campus page establishes the people and place behind the publication. Design for phones and laptops. Maintain an authoritative but warm tone. The journal first viewport combines its masthead, search controls and the start of the latest article; search and date ordering must remain primary.

## System

- Paper #F6F2EA, ink #232923, muted ink #62675E, rule #D8D1C5, oxblood #A64235. Existing sage and blue remain as subdued institutional accents in legacy content.
- Display: Cormorant Garamond, fallback Georgia. Body/interface: Manrope, fallback Avenir Next / sans-serif. Chinese uses Songti SC / Noto Serif CJK SC for display, PingFang SC for body. Font loading uses swap.
- 8px base rhythm; desktop margins 64px, tablet 32px, mobile 20px. Content max-width 1440px.
- Mostly square surfaces. Pills only for topical navigation and small controls. Cards use flat rules; shadow reserved for menus.
- 180–240ms interaction transitions; short entry fade/translation. Respect reduced motion. No continuous background animation or required external animation library.
- Distinctive gestures: oversized italic display words, compact publication masthead, red circular directional controls, photographic lead article, numbered archive rows, a spacious closing masthead.

## Real assets

- Logo: `images/LOGO/society-mark-transparent.png`; society lockup: `images/LOGO/society-logo-transparent.png`.
- Campus: `images/JNFLS/9c23fe79a8b282987402b739eb961bec.jpg` (Who We Are full-screen cover).
- Editorial photographs: `images/editorial/microscope.jpg`, `hands.jpg`, `nutrition.jpg`, `laboratory.jpg`, `movement.jpg`.
- Image credit/source records: `images/editorial/credits.json`.
- Existing community, project, and team photographs stay in their established locations.

The supplied SKILL.md was read. Its referenced `references/` package was not present; the decisions above use the supplied skill, project design specification and existing source. Existing session authorization covers this visual redesign. No publishing or browser acceptance was requested.

## Implemented surfaces

- `editorial.css` provides the shared visual layer; `fonts.css` loads the existing local Cormorant Garamond and Manrope assets. No Google Fonts requests or external animation library is needed.
- Homepage: split editorial opening, microscope cover with credit, quiet institutional masthead, readable TB guide and photographic topic index.
- Journal: oversized two-line masthead, in-page search strip, a photographic lead entry followed by numbered archive rows. The lead entry remains the first item from the existing date sort; no article is manually promoted out of sequence. Filtered views keep ordinary rows.
- Article: centered title, credited cover, generated section navigation, readable column, source references and reading progress.
- About: full-screen campus image and restrained supporting society content. No team or certification facts were added.
- Mobile navigation uses the same 1100px breakpoint in CSS and JavaScript; bilingual labels, keyboard controls, empty states and reduced-motion handling remain available.
- Daily publishing, authentication, persistence, article IDs and public API contracts remain unchanged.

## Delivery checks

Static file/anchor checks and JavaScript syntax checks passed. Existing search tests passed for Chinese/English matching, category filtering, both date orders and no-results cases. Local routes, data, styles and font files responded successfully. Browser acceptance was not requested, so no screenshot or cross-viewport browser test is claimed.
