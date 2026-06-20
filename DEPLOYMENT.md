# GitHub Pages deployment

Wordbound is deployed as a static site from the `gh-pages` branch.

## Required repository setting

Open **Settings → Pages** and select:

- Source: **Deploy from a branch**
- Branch: **gh-pages**
- Folder: **/(root)**

No custom GitHub Actions workflow is required.

## Release process

1. Merge validated changes into `main`.
2. Move `gh-pages` to the same commit as `main`.
3. Confirm `index.html`, `.nojekyll`, `manifest.webmanifest` and `service-worker.js` exist on `gh-pages`.
4. Open `https://joaoccaldas.github.io/EnglishLearningApp/` with a cache-busting query after a release.

## Local validation

Run:

```bash
npm run check
npm test
```

Progress is stored locally in the browser under `wordbound-state-v1`.
