---
title: Portfolio website
sidebar_position: 1
description: How this site is built, hosted and secured.
---

# Portfolio website

**Status:** in progress

This site: a landing page, a wiki for project documentation and a blog for progress notes.

## Goal

One place to document every project, readable by a recruiter in a minute and detailed enough for a technical reviewer.

## Stack

| Part | Choice | Why |
|---|---|---|
| Site generator | [Docusaurus](https://docusaurus.io) | Wiki (docs), blog and custom pages built in, actively maintained |
| Content | Markdown in Git | Every change is versioned and reviewable |
| Hosting | GitHub Pages | Free, HTTPS by default |
| Deploy | GitHub Actions | Every push to `main` builds and publishes |
| Fonts | Departure Mono, IBM Plex Sans | Self-hosted, no requests to font CDNs |

## Structure

```text
docs/            wiki pages (sidebar generated from folders)
blog/            blog posts, one file per post
src/pages/       landing page
src/links.js     GitHub and LinkedIn links
static/img/      pixel-art sprite and favicon
```

## Security and privacy decisions

- **No third-party requests.** Fonts are bundled with the site, there is no analytics and no external JavaScript. A visitor's browser only talks to GitHub Pages.
- **Static output.** No server-side code, no database, no login: nothing to exploit beyond the hosting itself.
- **External links** open with `rel="noopener noreferrer"`.
- **Dependencies** are pinned in `package-lock.json`; `npm audit` runs before upgrades.

## To do

- [x] Landing page, wiki and blog
- [ ] Deploy to GitHub Pages
- [ ] Add LinkedIn link
- [ ] First full project writeup
