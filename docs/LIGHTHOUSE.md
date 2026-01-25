# Lighthouse Report — Summary (2026-01-25)

This document summarizes the Lighthouse run and outlines quick improvements for Accessibility and SEO. For exact scores and metrics, refer to the JSON report:
- docs/lighthouse/lighthouse-2026-01-25.json

## Scores
- Performance: see JSON report
- Accessibility: see JSON report
- SEO: see JSON report
- Best Practices: see JSON report

## Key Metrics (if present)
- First Contentful Paint (FCP): see report
- Largest Contentful Paint (LCP): see report
- Cumulative Layout Shift (CLS): see report
- Total Blocking Time (TBT): see report

## Findings — Accessibility
- Single main landmark: ensure a single <main> and add a skip link.
- Color contrast: adjust muted/secondary text to meet WCAG AA.
- Controls without accessible name: ensure labels or aria-labels for inputs/selects.

## Findings — SEO
- Add meta description and basic Open Graph/Twitter card tags.
- Provide robots.txt and sitemap.xml, ensure they are served as static files.

## Action Checklist
- [ ] Wrap main content in <main id="main-content" role="main">
- [ ] Add “Skip to content” link
- [ ] Ensure visible/accessible label for artifact type select
- [ ] Adjust low-contrast text color tokens
- [ ] Add meta description + OG/Twitter tags in index.html
- [ ] Create public/robots.txt and public/sitemap.xml

## Rerun Lighthouse (no new deps)
Run Lighthouse from Chrome DevTools or the CLI outside the project:
1. Open the deployed site in Chrome (e.g., https://ai-copilot-wine-seven.vercel.app/).
2. DevTools → Lighthouse → select categories → Analyze page load.
3. Export JSON and replace docs/lighthouse/lighthouse-YYYY-MM-DD.json.
