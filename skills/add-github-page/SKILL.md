---
name: add-github-page
description: Add or update a GitHub Pages project in this repository's project hub. Use when a user provides a GitHub repository, GitHub Pages URL, or asks to publish, list, feature, reorder, or refresh a project on the dashboard.
---

# Add a GitHub Pages project

Keep the project catalog accurate and the site buildable.

## Workflow

1. Read `projects.js` and preserve its array structure, ordering, and formatting.
2. Determine the repository owner and name from the supplied repository URL. If only one URL is supplied, derive the other:
   - Repository: `https://github.com/{owner}/{repo}`
   - Default Pages site: `https://{owner}.github.io/{repo}/`
   - For an `{owner}.github.io` repository, use `https://{owner}.github.io/`.
3. Prefer repository metadata or user-provided copy for the title, description, tags, and year. Do not invent claims about project behavior. If essential metadata is unavailable, use a concise title derived from the repository name and a factual one-line description.
4. Add one object to `window.PROJECTS` or update the existing object with the same `slug` or `repoUrl`. Never create duplicates.
5. Use a lowercase kebab-case `slug`, a concise category, at most three short tags, and one of the existing `accent` values. Rotate accents when practical so adjacent cards differ.
6. Put newly added projects first unless the user requests another order.
7. Run `node --check projects.js` and `node --check app.js`. Fix validation errors caused by the change.
8. Report the project title, site URL, repository URL, and validation result.

Do not change page layout or styling unless the user explicitly asks. Do not enable GitHub Pages or alter repository settings without explicit authorization.
