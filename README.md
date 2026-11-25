# sb90-source.github.io

Personal site: landing page, wiki and blog. Built with [Docusaurus](https://docusaurus.io).

## Run locally

```
npm install
npm start          # dev server with live reload at http://localhost:3000
npm run build      # production build into build/
```

## Edit

| What | Where |
|---|---|
| GitHub / LinkedIn links | `src/links.js` (empty value hides the button) |
| Name and tagline | `title` and `tagline` in `docusaurus.config.js` |
| Wiki page | add a `.md` file under `docs/` (folders become sidebar sections) |
| Blog post | add `blog/YYYY-MM-DD-slug.md`; put `<!-- truncate -->` after the intro |
| Pixel sprite | `python3 tools/sprite.py static/img` regenerates the SVG and favicon (needs Pillow) |
| Colours and fonts | `src/css/custom.css` |

## Deploy

1. Create the repository `Sb90-source.github.io` on GitHub and push this folder to `main`.
2. Repository Settings > Pages > Source: **GitHub Actions**.
3. Every push to `main` now builds and publishes to https://sb90-source.github.io.

## Credits

- Departure Mono by Helena Zhang, SIL Open Font License (`static/fonts/DepartureMono-LICENSE.txt`)
- IBM Plex Sans, SIL Open Font License
- GitHub and LinkedIn icons from Font Awesome Free, CC BY 4.0
