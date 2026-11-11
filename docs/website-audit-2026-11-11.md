# Mahamana Malaviya Mission (Bihar Unit) — Website Audit

**Audit date:** 11 November 2026  
**Repository:** `canecsu/mahamanamalviyamissionbiharunit`  
**Baseline:** Draft PR #1 — `fix/mmm-contact-security-preview-20261111`  
**Follow-up:** Draft PR #2 — `fix/mmm-functional-language-audit-20261111`

## Release safety

This audit and the fixes are **review-only**. Neither `main` nor production Vercel, Render backend, or Supabase data is intentionally changed. PR #2 is stacked on PR #1; merging PR #2 directly to `main` without PR #1 reviewed would combine their changes.

## Findings and improvements prepared in PR #2

| Severity | Finding | Proposed fix |
|---|---|---|
| Critical | `/donation` served duplicate Activities page | Safe donation *enquiry* page; no unverified payment details or online payment |
| Critical | Join form displayed success without submitting data | Explicit email-draft workflow; visitor must send the email; no claim that application is stored |
| High | Public API default incorrectly ended in `/docs` | Shared production API base with CRA environment-variable override |
| High | Gallery depended on `import.meta.env` from Vite in a CRA application | Gallery now uses the shared API client |
| High | Public lists had unhandled rejected promises and ambiguous empty state | Shared collection renderer with bilingual loading/error/empty UI |
| High | Event and blog detail could remain stuck on loading | Abortable requests, not-found and error states |
| High | Public `pages` list could return unpublished records in PR #1 backend | Apply published-only filter to public page listing |
| Medium | `/objectives` was actually a members listing | Separate `/objectives` content and `/members` listing |
| Medium | Navigation labels, language document attribute, content captions lacked locale parity | Filled keys and improved Hindi labels; `html lang` reacts to language switch |
| Medium | Homepage advertised unverified future events | Removed hardcoded future announcements, kept existing neutral update |
| Medium | Browser metadata was generic | Updated default title, meta description and Open Graph text |
| Medium | Unknown URLs had no dedicated 404 page | Bilingual 404 |
| Medium | Mobile donation button had Join Us label | Correct donation label in both languages |

## Verification undertaken

- PR #1 checked: draft, open, head at `f1d729009d997602f246a0fd10f60a65fc6b868b`, production base remains `main`.
- PR #1 Vercel preview: state `READY`, correct branch/commit.
- PR #2 initial preview on Vercel: state `READY`, React build `Compiled successfully`; re-check final updated commit separately before release.
- Read-only Python syntax check on `backend/main.py`: passed.
- Translation coverage: **125 literal `t('...')` usages resolved in both English and Hindi** after the corrections; nested lists and objects are handled.
- Static verification confirms no `import.meta.env` in JSX and no `onrender.com/docs` API fallback.
- Deployment protection: unauthenticated Preview URL returned **HTTP 302** to Vercel SSO. This is expected under the project’s current access restrictions; it prevents unauthenticated visual browser verification.
- Read-only API probe: Render `/healthz` and `/activities` did not respond within a **12-second** timeout from the isolated test environment. This **does not establish that the service is down**; startup, routing, and hosting logs require separate investigation.
- Repository media audit: **19** local team-photo paths under `/images/` are missing from `frontend/public`. The existing component attempts to use initial-based fallback avatars.

## Outstanding and blocked work

1. **Render production:** backend security changes proposed in PR #1 and PR #2 are *not yet deployed* to Render. Private donation data and publication filtering **must be tested and released separately** with proper rollback.
2. **Supabase:** connected Supabase accounts currently did not list the mission's project. Therefore table schema, RLS policies, membership records, backups, and any live database data have **not been verified**.
3. **Membership:** no approved backend storage endpoint/table exists for membership applications. PR #2 deliberately offers a manual email draft instead of displaying a false submission success. Real applications and admin review require confirmed requirements, storage and privacy measures.
4. **Donations:** banking / UPI / QR information has not been independently confirmed. PR #2 intentionally uses verified contact details only, without processing payments.
5. **Bilingual CMS:** dynamic news, activities, blogs, events, store products and members currently do not have a verified dual-language content schema. The interface is translated, but database content appears in the language in which it was entered. Proper per-language fields or translations need an approved migration and editorial workflow.
6. **Historical and official text:** remaining long-form Hindi content in About and Mahamana pages contains Hinglish phrasing. Official titles, personal names, historical details, office map pin, and membership/donation claims should be confirmed before editorial rewriting.
7. **Media:** the 19 missing committee/member photos need genuine approved images; do not synthesize images of real officeholders to replace them.
8. **Legal and SEO:** valid Privacy Policy and Terms of Service content, sitemap for an approved canonical domain, accessibility checks, structured data, and search indexing require additional review.
9. **Testing:** Vercel/Render/Supabase integration tests for authenticated sessions, uploads, role access, mobile viewport layouts, language toggling, and form submissions remain pending; a successful frontend build is not sufficient proof.
10. **Backend availability:** review Render startup, DNS/SSL, service health and cold-start characteristics before any public release.

## Required sequence before production

1. Review PR #1 and PR #2 individually; confirm bilingual content, contact details and donation wording.
2. Obtain Render access and identify the correct Supabase project, verify backups and staging environment.
3. Test backend role permissions, donor privacy and API responses against staging with non-sensitive test records.
4. Authenticate into protected Vercel preview and test desktop and mobile pages interactively.
5. Only after explicit final approval, merge in the agreed sequence and deploy the frontend/backend with rollback readiness.

**No production deployment or database migration is authorized by this audit.**
