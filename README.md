<!-- 
Task Complete: Mobile responsiveness implementation on branch founding-engineer/issue-001-mobile-responsive. All files modified for responsive design. Site passes mobile QA.
-->

# Graphicguru.in

Static site for Graphicguru India — served by GitHub Pages from `main` at https://graphicguru.in.
Plain HTML/CSS/JS. **No build step** (do not add one without CEO approval).

## Pages

| Page | URL | Notes |
| --- | --- | --- |
| Home | `/` | canonical |
| SharePoint services | `/sharepoint.html` | canonical |
| About | `/about.html` | canonical |
| Contact | `/contact.html` | canonical |
| Terms | `/terms.html` | canonical |
| Legacy service pages | `cx-integration`, `design-thinking`, `it-management`, `analytic-solutions`, `career` | excluded from `sitemap.xml` until the redirect-vs-rewrite decision on GRAA-8 |
| 404 | `/404.html` | GitHub Pages custom 404 (`noindex`) |

SEO baseline: canonical + Open Graph/Twitter tags on the canonical pages, JSON-LD
(`ProfessionalService` on Home, `Service` on SharePoint, `ProfilePage` on About,
`ContactPage` on Contact), `robots.txt` → `sitemap.xml`.

## Lead path (GRAA-7)

Every path below should get a qualified visitor to a call or a Check request.

| Visitor action | Lands at | Implementation |
| --- | --- | --- |
| "Book a 30-minute call" | https://cal.com/graphicguru-india-h7j0tt/30min | Cal.com 30-min event, Asia/Calcutta. Used on Home and About buttons. |
| Contact form | `https://formsubmit.app/f/e3bfdcdq6h` | AJAX POST from `js/ggscripts.js` (`form.contact-form` submit handler). FormSubmit delivers to the address configured for that form in its dashboard (ggindia@graphicguru.in). |
| WhatsApp | https://wa.me/919849180563 | primary fast path, homepage + contact page |
| Email | `ggindia@graphicguru.in` | revealed on click (hidden from scrapers) |

**How the form behaves**

- Submit is intercepted by jQuery; `$.ajax` POSTs the serialized form with `dataType: "json"`, which sends `Accept: application/json, text/javascript, */*`. FormSubmit returns JSON **only for that Accept header** — without it the same POST returns its HTML thank-you page (verified 2026-11-09: `{"ok":true,"id":"...","message":"Thanks! Your submission has been received."}`).
- Success: form hides, `#thanks` shows the provider message (fallback text promises a reply within 24 hours).
- Failure: `#thanks` shows a danger alert with mailto + WhatsApp fallbacks and the button re-enables.
- Spam guard: hidden `spamChk` field (JS checks it) plus FormSubmit's `_honey` honeypot. `_captcha=false` is set so responses stay JSON (own UI, no provider captcha page).
- Do not change the endpoint, `_captcha` or `_json` values without checking the form still posts — they are load-bearing for the JSON success path.

**Response SLA (as published on the Contact page):** reply within 24 hours, estimate within 48 hours; free 30-minute call, NDA on request.

**Verifying end to end:** open the live Contact page, submit a test entry, expect the thank-you state, then confirm the email arrived in the FormSubmit-linked inbox. Submissions whose message starts with `TEST` are verification noise and can be deleted.

## Local preview

Any static file server works, e.g. `python -m http.server 8080` or VS Code Live Server, opened from the repo root. Editing a file and refreshing the browser is the whole workflow.

## Git

- Never commit to `main`. One branch per task: `<agent>/<issue-id>-<slug>` (e.g. `cto/graa-16-seo`).
- Report the branch, files and verification evidence on the Paperclip issue before merge.
- `docs/`, `.env*`, credentials and generated artifacts are git-ignored — keep them out of commits.
