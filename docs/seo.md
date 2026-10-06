# Puro SEO and sharing

Puro is a private learning app with one public sign-in entry page. The sitemap contains only the production root URL. Hash routes represent authenticated application views; they are not advertised as separate public pages. Personal progress, writing, and partner statistics are not included in metadata or sharing assets.

## Assets

- `public/social/puro-og.png`: original Puro social card, 1200 × 630, used by Open Graph and large-image cards. `puro-og.svg` is its editable vector source.
- `public/favicon.svg`: scalable brand mark.
- `public/favicon.ico`: 16, 32, and 48 pixel compatibility icons.
- `public/icons/favicon-96.png`: 96 pixel search/browser fallback.
- `public/apple-touch-icon.png`: opaque 180 pixel home-screen icon.
- `public/icons/icon-192.png` and `icon-512.png`: manifest icons.
- `public/icons/icon-maskable-512.png`: opaque maskable icon with the mark inside the safe area.
- `public/site.webmanifest`: app name, theme, launch URL, and icon declarations. No service worker or offline capability is claimed.

`tools/generate-brand-assets.py` preserves the asset recipe. It uses existing Pillow and macOS Helvetica when regenerating locally; Vercel serves the checked-in images and needs neither dependency.

## Metadata and build

`node build.mjs` generates the head metadata, robots file, and sitemap. Vercel runs `node build.mjs --deploy`, which requires a production origin even if system variables have been disabled. It uses `SITE_URL` when explicitly provided, otherwise Vercel’s production-domain variable. Local builds omit the unknown canonical and use a relative share-image path. Production builds require a valid public HTTPS origin. Preview and local builds use `noindex, nofollow`, while permitting crawlers to read that instruction.

The head includes a descriptive title, description, canonical, Open Graph title/description/image/type/locale/dimensions/alt text, large-image card metadata, favicon links, manifest, and Schema.org WebApplication data. Structured data describes the actual app; it includes no invented prices, reviews, certifications, or fluency guarantees. Its fixed CSP hash allows that data without enabling executable inline scripts.

Font loading uses direct stylesheet links and preconnects instead of a CSS import. The initial HTML contains a useful course introduction and a JavaScript-disabled explanation. The sign-in introduction keeps the same learning description when JavaScript runs. `/index.html` redirects permanently to `/` to consolidate duplicate entry URLs. Existing account authentication and database policies remain intact.

## Verification

Run these from the project root:

```sh
node check.mjs
node cloud-check.mjs
node seo-check.mjs
```

The SEO check verifies real icon/image file signatures and dimensions, manifest references, structured data and CSP, canonical/social URL agreement, production versus preview indexing, one public sitemap entry, invalid domains, rebuilding, and preservation of the application body, and the authenticated indexing transition with a local SDK/DOM fixture. Builds are tested in isolated temporary files and removed afterward.

Deployment-specific checks remain: verify the production host, HTTPS reachability, public social-image access, search indexing through Search Console, and actual previews in the sharing services you use. A social service may retain an older preview until its cache refreshes. No search ranking or performance score is promised.

## References

- [Open Graph metadata and image properties](https://ogp.me/)
- [Google: JavaScript SEO and canonical URLs](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Google: build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: robots meta directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Vercel: production-domain system variable](https://vercel.com/docs/environment-variables/system-environment-variables#vercel_project_production_url)
- [Schema.org: WebApplication](https://schema.org/WebApplication)

Local verification completed 7 October 2026: all three Node checks passed; 13 public URLs returned HTTP 200 with the expected MIME types; `/index.html` returned 308 and unknown files returned 404. The browser displayed the 1200 × 630 PNG correctly, confirmed metadata and icon links, and reported no console warnings or errors on the sign-in page. The verified sign-in screenshot is saved as `docs/preview.jpg`; the full sharing artwork is `public/social/puro-og.png`. Production domain and third-party preview checks remain for deployment.
