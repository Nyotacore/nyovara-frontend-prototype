# Nyovara — Frontend Prototype (Phase 1)

Maritime Workforce & Seafarer Welfare Management Platform · NyotaCore Solutions & Services

This is the interactive HTML5 / CSS3 / vanilla-JavaScript prototype that the Nyovara PRD asks for as the first milestone. It has 138 screens across the public website, registration and authentication, the management portal, the vessel portal, the seafarer portal and the platform-admin portal. The screens run on realistic demo data stored in your browser.

> **Demonstration only.** Authentication, permissions, compliance calculations and payroll arithmetic are re-implemented in the frontend so you can review how they behave. In production they must be enforced server-side in ASP.NET Core. Do not use this prototype in production.

## Run it
- **Simplest:** open `index.html` in Chrome, Edge or Firefox. There's no build step, and all libraries, fonts and images are included locally.
- **Recommended (closest to IIS):** from this folder run `python -m http.server 8080` and browse to http://localhost:8080.

## Demo accounts
Every account uses the password `Nyovara@2026` and the MFA code `246810`.

| Portal | Email |
|---|---|
| Management (`/app`) | admin@atlanticmeridian.com |
| Vessel operations (`/vessel-portal`) | master.aurora@atlanticmeridian.com |
| Seafarer (`/seafarer`) | e.adeyemi@mail.com |
| Platform admin (`/platform`) | ops@nyotacore.com |

You can also jump straight between portals from the grid icon in the top bar. The **Reset demo data** link restores the original data set.

## Acceptance journey (PRD Part 30)
Landing → Get Started → Register organisation → Verify email (the code is shown in the demo inbox) → 10-step onboarding → Dashboard → Add crew (5-section wizard) → Profile → Upload certificates / travel documents → Vessels → Assign crew (sign-on) → Create voyage → Record rest hours → Review rest hours → Welfare request → Assign training → Reports.

## Structure
```
index.html                 landing page
pages/public/              about, platform, solutions/*, for-*, contact, careers, privacy, terms
pages/authentication/      login, get-started, register-*, verify-email, forgot/reset-password, onboarding, seafarer-onboarding
pages/organisation|crew|recruitment|vessels|voyages|rest-hours|welfare|training|payroll|reports|administration/
pages/seafarer/  pages/vessel-portal/  pages/platform/
assets/css/nyovara.css     design system (tokens, components, layouts, responsive, print)
assets/js/core.js          demo store, utilities, table/form/modal/chart/calendar components, router
assets/js/layout.js        sidebar, top bar, global search, notification centre, RBAC demo
assets/js/components.js    reusable list/create/edit/view/workflow screens
assets/js/resthours.js     rest-hours compliance engine and timeline recorder
assets/js/data.js          deterministic seed data (all fictional)
assets/js/pages-*.js       module page handlers
tools/build.py             regenerates the HTML shells (python3 tools/build.py)
docs/                      ARCHITECTURE, DATABASE_DESIGN, API_SPECIFICATION
```
Also see `PROJECT_STATUS.md` and `CHANGELOG.md`.
