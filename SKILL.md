# Skill: Build YSPH-JNFLS Website

## When to Use

Use this skill when creating, editing, or reviewing the official website for **Youth Society for Public Health in JNFLS (YSPH-JNFLS)**.

This skill applies to:

- homepage design
- multi-page site structure
- public health society content
- visual system implementation
- frontend review
- copywriting for the website
- maintenance-friendly content modeling

## Goal

Create an English-language website for **Youth Society for Public Health in JNFLS** that feels professional, academic, warm, and action-oriented.

The Chinese name is **济南外国语学校青年公共卫生学会**. Use it only where brand context benefits from bilingual identification.

## Required Inputs

Before building, check whether the project already has:

- a frontend framework
- existing design tokens
- existing content files
- image assets
- routing conventions
- deployment configuration

If the folder is empty, a lightweight static site or modern frontend scaffold is acceptable.

## Required References

Read `design.md` before making visual decisions.

Read `AGENT.md` before implementation or review work.

## Language Rules

- Website UI and page copy: English.
- Source code comments: Chinese if comments are needed.
- Keep code comments sparse and useful.

## Workflow

### 1. Inspect

Check the current project structure with fast file search. Identify the framework, package manager, and relevant entry files.

### 2. Plan the Site Shape

Choose one of two structures:

- MVP single-page site with anchored sections
- full multi-page site

Prefer the MVP single-page site when the user asks for a first official website and has not provided detailed content for every page.

### 3. Define Content

Ensure these sections exist:

- Hero
- Mission
- Programs
- Research & Publications
- Events
- Team
- Join / Contact

Use realistic placeholder content only when the user has not supplied actual data. Placeholder content should still sound credible and editable.

### 4. Build the Visual System

Use:

- warm paper background
- black or charcoal primary text
- sage, red, and blue accents
- editorial serif display type
- clean sans-serif interface type
- numbered section labels
- thin dividers
- disciplined responsive grids

Avoid:

- generic medical icons
- heavy shadows
- nested cards
- one-color green/blue theme
- oversized marketing-style feature cards
- gradient blobs or decorative abstract backgrounds

### 5. Implement Responsively

Verify:

- first viewport brand clarity
- mobile navigation
- stable card dimensions
- no text overflow
- no overlapping UI
- accessible contrast
- visible focus states

### 6. Verify

After substantial frontend work:

- run the project build or test command if available
- start the dev server
- inspect the page in browser
- check desktop and mobile widths
- confirm images render
- confirm navigation works

### 7. Report

Final response should include:

- what was created or changed
- where the main files are
- verification performed
- any remaining assumptions

## Recommended Homepage Copy

Hero title:

```text
Youth Society for Public Health in JNFLS
```

Hero copy:

```text
A student-led academic society advancing public health literacy, research practice, and community action at Jinan Foreign Language School.
```

Mission statement:

```text
We study public health as both evidence and responsibility.
```

Join CTA:

```text
Join YSPH-JNFLS if you care about evidence, health equity, and practical change in the school community.
```

## Suggested Data Structures

Programs:

```json
{
  "number": "01",
  "title": "Health Literacy Workshops",
  "description": "Student-led sessions that translate public health concepts into practical campus knowledge.",
  "format": "Workshop",
  "output": "Peer education materials"
}
```

Research item:

```json
{
  "title": "Campus Hand Hygiene Awareness Brief",
  "topic": "Prevention",
  "date": "2026",
  "authors": "YSPH-JNFLS Research Group",
  "abstract": "A short evidence-based report on hygiene awareness and practical prevention habits in school settings."
}
```

Event:

```json
{
  "date": "2026-09-14",
  "title": "Campus Health Literacy Forum",
  "type": "Forum",
  "location": "JNFLS",
  "status": "Upcoming"
}
```

## Review Checklist

When reviewing the site, check:

- Does it look like an official academic society rather than a generic club page?
- Is the society name visible immediately?
- Is all public copy in English?
- Are public health themes specific and credible?
- Does the layout use the design system from `design.md`?
- Does mobile work without visual collisions?
- Are images real and relevant?
- Are CTAs clear?
- Can future student members update the content easily?

