# PROJECT_STATUS — Nyovara

**Phase:** 1 — Complete frontend prototype · **Status:** Ready for review · **Updated:** 13 Nov 2026

## Completed modules and screens
- **Public website (15 pages):** landing (hero, overview, how it works, features, benefits, industries, FAQ, contact, footer), about, platform, solutions plus 8 solution pages, organisation and seafarer pages, contact form (validation, loading state, duplicate-submit guard, enquiry reference), privacy, terms, careers and vacancy/apply.
- **Authentication (9 pages):** login with lockout after 5 failed attempts, MFA step, remember-me, login history and role-based redirect. Organisation and seafarer registration with duplicate checks and a password-strength meter. Email verification by OTP. Forgot/reset password with single-use, expiring tokens. 10-step organisation onboarding with save-and-resume. Seafarer onboarding.
- **Management portal (80 screens):**
  - Dashboard: 14 statistics derived from records, filters, charts, upcoming activities, export.
  - Crew: dashboard, directory and 7 presets, the 5-section Add/Edit wizard with every PRD field (including "Hued Validity" kept verbatim), profile with 15 tabs, certificates with a verify/reject/replace workflow, medical, travel documents, sea service with overlap flags, employment, contracts, crew changes, bulk import with per-row results.
  - Recruitment: dashboard, kanban, vacancies, applications, interviews and calendar, evaluation with multiple reviewers, a 3-stage approval, and conversion to a crew record.
  - Planning: crew planning with conflict checks, relief planning, sign-on/sign-off.
  - Vessels and voyages: dashboards, directories, profiles, manifest, voyage detail and reports, port calls, monitoring (no fabricated positions).
  - Rest hours: dashboard, working arrangements, recorder, daily list, calendar, review queue, lock/unlock, reports, rule versions.
  - Welfare: dashboard, check-ins, requests, complaints (anonymous and confidential, audited reveal), incidents (7-stage), case management.
  - Training: courses, assignments, records, competency, appraisals.
  - Payroll: wage structures, compensation, allotments (validated), 7-step processing run, payslips, payments, expenses.
  - Reports: about 45 reports in 7 categories with preview and PDF/Excel/CSV/print.
  - Settings: organisation, users, roles matrix, reference data (24 lists), workflows, notifications, integrations, audit logs.
- **Vessel portal (11 screens):** dashboard, manifest, crew profiles, crew changes, rest-hours recording, review, offline sync centre (queue, duplicates, conflicts, history), voyage, incidents, welfare, documents.
- **Seafarer portal (11 screens, mobile-first):** dashboard, profile (changes go for approval), documents, certificates, employment, assignments, rest hours, welfare (check-ins, requests, complaints), training, payroll, notifications.
- **Platform portal (9 screens):** dashboard, organisations (verify), users, subscriptions, enquiries, time-bound support-access grants, configuration, monitoring, audit.

## Testing done
- An automated headless-Chrome smoke test loaded all 138 pages with no JavaScript errors.
- Rest-hours engine scenarios produced the expected results: watch, day-work and galley patterns compliant; three rest periods, 15h continuous work, a 7-day shortfall and midnight-crossing periods flagged correctly.

## Known limitations
- Demo persistence is browser localStorage, and files are previews only.
- Offline encryption is simulated (production: IndexedDB plus Web Crypto).
- AIS, SMS and payment providers are not connected, by design.
- The "Hued Validity" business definition is pending from the product owner.
- Legal text is a placeholder.

## Next task
Phase 2: create the ASP.NET Core solution (Domain, Application, Infrastructure, Web, Worker), the EF Core model per docs/DATABASE_DESIGN.md, Identity and multi-tenancy. Then replace `N.db` calls module by module with `/api/v1` endpoints.
