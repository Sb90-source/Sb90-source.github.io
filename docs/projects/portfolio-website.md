---
title: Portfoliowebsite
sidebar_position: 1
description: Hoe deze site is gebouwd, gehost en beveiligd.
---

# Portfoliowebsite

**Status:** in uitvoering

Deze site: een landingspagina, een wiki voor projectdocumentatie en een blog voor voortgang.

## Doel

Eén plek om elk project te documenteren, in een minuut te lezen voor een recruiter en gedetailleerd genoeg voor een technische beoordelaar.

## Stack

| Onderdeel | Keuze | Waarom |
|---|---|---|
| Sitegenerator | [Docusaurus](https://docusaurus.io) | Wiki (docs), blog en eigen pagina's ingebouwd, actief onderhouden |
| Content | Markdown in Git | Elke wijziging is geversioneerd en te reviewen |
| Hosting | GitHub Pages | Gratis, standaard HTTPS |
| Deploy | GitHub Actions | Elke push naar `main` wordt gebouwd en gepubliceerd |
| Lettertypen | Departure Mono, IBM Plex Sans | Zelf gehost, geen verzoeken naar font-CDN's |

## Structuur

```text
docs/            wikipagina's (zijbalk gegenereerd uit mappen)
blog/            blogberichten, één bestand per bericht
src/pages/       landingspagina
src/links.js     GitHub- en LinkedIn-links
static/img/      pixel-art sprite en favicon
```

## Beslissingen over beveiliging en privacy

- **Geen verzoeken naar derden.** Lettertypen worden met de site meegeleverd, er is geen analytics en geen externe JavaScript. De browser van een bezoeker praat alleen met GitHub Pages.
- **Statische output.** Geen servercode, geen database, geen login: niets om te misbruiken behalve de hosting zelf.
- **Externe links** openen met `rel="noopener noreferrer"`.
- **Dependencies** staan vast in `package-lock.json`; `npm audit` draait vóór upgrades.

## Te doen

- [x] Landingspagina, wiki en blog
- [ ] Deployen naar GitHub Pages
- [ ] LinkedIn-link toevoegen
- [ ] Eerste volledige project-writeup
