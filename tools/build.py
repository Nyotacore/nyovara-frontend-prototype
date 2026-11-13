#!/usr/bin/env python3
"""Generates every HTML screen of the Nyovara frontend prototype.

Application screens are thin shells: shared layout + page handler in assets/js.
Public pages carry static, SEO-friendly HTML. Run: python3 build.py
"""
import os, html

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
VENDOR = ['assets/vendor/chart.umd.min.js', 'assets/vendor/lucide.min.js']
CORE = ['assets/js/core.js', 'assets/js/data.js', 'assets/js/layout.js', 'assets/js/components.js']
APP = VENDOR + CORE + ['assets/js/resthours.js', 'assets/js/pages-crew.js', 'assets/js/pages-ops.js', 'assets/js/pages-rest.js', 'assets/js/pages-people.js', 'assets/js/pages-admin.js', 'assets/js/pages-portals.js']
PUB = ['assets/vendor/lucide.min.js'] + CORE + ['assets/js/pages-ops.js', 'assets/js/public.js']

def root_of(path):
    return '../' * path.count('/')

def head(path, title, desc='Nyovara — maritime workforce and seafarer welfare management platform by NyotaCore Solutions & Services.'):
    r = root_of(path)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)} · Nyovara</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="theme-color" content="#102B46">
<link rel="icon" href="{r}assets/icons/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="{r}assets/icons/favicon-32.png">
<link rel="apple-touch-icon" href="{r}assets/icons/apple-touch-icon.png">
<link rel="stylesheet" href="{r}assets/css/nyovara.css">
</head>'''

def scripts(path, lst):
    r = root_of(path)
    return '\n'.join(f'<script src="{r}{s}"></script>' for s in lst)

def write(path, content):
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)

COUNT = {'app': 0, 'pub': 0}
def app_page(path, title, page, portal='app', preset=None):
    COUNT['app'] += 1
    p = f' data-preset="{preset}"' if preset else ''
    write(path, f'''{head(path, title)}
<body data-root="{root_of(path)}" data-route="{path}" data-portal="{portal}" data-shell="{portal}" data-page="{page}"{p}>
<main id="content"><div class="skeleton" style="width:40%;height:22px;margin-bottom:12px"></div><div class="skeleton" style="height:120px"></div></main>
<noscript><p style="padding:24px">Nyovara requires JavaScript.</p></noscript>
{scripts(path, APP)}
</body>
</html>''')

# ---------------------------------------------------------------- app screens
A = [
 ('organisation/dashboard', 'Dashboard', 'app-dashboard'), ('organisation/notifications', 'Notifications', 'app-notifications'),
 ('crew/index', 'Crew Management', 'crew-dashboard'), ('crew/directory', 'Crew Directory', 'crew-directory', 'all'),
 ('crew/pool', 'Crew Pool', 'crew-directory', 'pool'), ('crew/available', 'Available Crew', 'crew-directory', 'available'), ('crew/active', 'Active Crew', 'crew-directory', 'active'),
 ('crew/onboard', 'Crew Onboard', 'crew-directory', 'onboard'), ('crew/on-leave', 'Crew On Leave', 'crew-directory', 'on-leave'), ('crew/inactive', 'Inactive Crew', 'crew-directory', 'inactive'),
 ('crew/blacklisted', 'Blacklisted / Terminated', 'crew-directory', 'blacklisted'), ('crew/create', 'Add / Edit Crew', 'crew-form'), ('crew/profile', 'Crew Profile', 'crew-profile'),
 ('crew/certificates', 'Certificates', 'crew-certificates'), ('crew/medical', 'Medical Records', 'crew-medical'), ('crew/travel-documents', 'Travel Documents', 'crew-travel'),
 ('crew/sea-service', 'Sea Service', 'crew-sea-service'), ('crew/employment-history', 'Employment History', 'crew-employment'), ('crew/contracts', 'Crew Contracts', 'crew-contracts'),
 ('crew/changes', 'Crew Changes', 'crew-changes'), ('crew/reports', 'Crew Reports', 'reports', 'Crew'),
 ('recruitment/index', 'Recruitment', 'recruitment-dashboard'), ('recruitment/vacancies', 'Job Vacancies', 'recruitment-vacancies'), ('recruitment/applications', 'Applications', 'recruitment-applications'),
 ('recruitment/interviews', 'Interviews', 'recruitment-interviews'), ('recruitment/evaluation', 'Candidate Evaluation', 'recruitment-evaluation'), ('recruitment/approvals', 'Recruitment Approvals', 'recruitment-approvals'),
 ('recruitment/crew-planning', 'Crew Planning', 'crew-planning'), ('recruitment/relief-planning', 'Relief Planning', 'relief-planning'), ('recruitment/sign-on-off', 'Sign-On / Sign-Off', 'sign-on-off'),
 ('vessels/index', 'Vessels', 'vessels-dashboard'), ('vessels/directory', 'Vessel Directory', 'vessels-directory'), ('vessels/profile', 'Vessel Profile', 'vessels-profile'), ('vessels/manifest', 'Crew Manifest', 'vessels-manifest'),
 ('voyages/index', 'Voyages', 'voyages-dashboard'), ('voyages/directory', 'Voyage Directory', 'voyages-directory'), ('voyages/create', 'Create Voyage', 'voyages-create'), ('voyages/detail', 'Voyage', 'voyages-detail'),
 ('voyages/port-calls', 'Port Calls', 'voyages-port-calls'), ('voyages/monitoring', 'Voyage Monitoring', 'voyages-monitoring'),
 ('rest-hours/index', 'Rest Hours', 'rest-dashboard'), ('rest-hours/working-arrangements', 'Working Arrangements', 'rest-working-arrangements'), ('rest-hours/record', 'Record Rest Hours', 'rest-record'),
 ('rest-hours/daily', 'Daily Rest Hours', 'rest-daily'), ('rest-hours/calendar', 'Monthly Calendar', 'rest-calendar'), ('rest-hours/review', 'Rest Hours Review', 'rest-review'),
 ('rest-hours/lock', 'Lock / Unlock Month', 'rest-lock'), ('rest-hours/reports', 'Rest Hours Reports', 'rest-reports'), ('rest-hours/rules', 'Rule Configuration', 'rest-rules'),
 ('welfare/index', 'Welfare', 'welfare-dashboard'), ('welfare/check-ins', 'Welfare Check-ins', 'welfare-checkins'), ('welfare/requests', 'Welfare Requests', 'welfare-requests'),
 ('welfare/complaints', 'Complaints', 'welfare-complaints'), ('welfare/incidents', 'Incidents', 'welfare-incidents'), ('welfare/cases', 'Case Management', 'welfare-cases'), ('welfare/case', 'Welfare Case', 'welfare-case'),
 ('training/index', 'Training', 'training-dashboard'), ('training/courses', 'Courses', 'training-courses'), ('training/assignments', 'Training Assignments', 'training-assignments'),
 ('training/records', 'Training Records', 'training-records'), ('training/competency', 'Competency', 'training-competency'), ('training/appraisals', 'Performance Appraisal', 'training-appraisals'),
 ('payroll/index', 'Payroll', 'payroll-dashboard'), ('payroll/wage-structures', 'Wage Structures', 'payroll-wages'), ('payroll/compensation', 'Crew Compensation', 'payroll-compensation'),
 ('payroll/allotments', 'Crew Allotments', 'payroll-allotments'), ('payroll/processing', 'Payroll Processing', 'payroll-processing'), ('payroll/payslips', 'Payslips', 'payroll-payslips'),
 ('payroll/payments', 'Payments', 'payroll-payments'), ('payroll/expenses', 'Crew Expenses', 'payroll-expenses'),
 ('reports/index', 'Reports & Analytics', 'reports'),
 ('administration/settings', 'Organisation Settings', 'settings-org'), ('administration/users', 'Users', 'settings-users'), ('administration/roles', 'Roles & Permissions', 'settings-roles'),
 ('administration/reference-data', 'Reference Data', 'settings-reference'), ('administration/workflows', 'Approval Workflows', 'settings-workflows'), ('administration/notifications', 'Notification Settings', 'settings-notifications'),
 ('administration/integrations', 'Integrations', 'settings-integrations'), ('administration/audit-logs', 'Audit Logs', 'settings-audit'),
]
for a in A:
    app_page('pages/' + a[0] + '.html', a[1], a[2], 'app', a[3] if len(a) > 3 else None)
for a in [('dashboard', 'My Nyovara', 'sf-dashboard'), ('profile', 'My Profile', 'sf-profile'), ('documents', 'My Documents', 'sf-documents'), ('certificates', 'My Certificates', 'sf-certificates'), ('employment', 'My Employment', 'sf-employment'), ('assignments', 'My Vessel Assignments', 'sf-assignments'), ('rest-hours', 'My Rest Hours', 'sf-rest'), ('welfare', 'My Welfare', 'sf-welfare'), ('training', 'My Training', 'sf-training'), ('payroll', 'My Payroll', 'sf-payroll'), ('notifications', 'My Notifications', 'app-notifications')]:
    app_page('pages/seafarer/' + a[0] + '.html', a[1], a[2], 'seafarer')
for a in [('dashboard', 'Vessel Dashboard', 'vp-dashboard'), ('manifest', 'Crew Manifest', 'vp-manifest'), ('crew', 'Crew Profiles', 'vp-crew'), ('crew-changes', 'Crew Changes', 'vp-crew-changes'), ('rest-hours', 'Record Rest Hours', 'vp-rest'), ('rest-hours-review', 'Rest Hours Review', 'vp-review'), ('sync', 'Sync Centre', 'vp-sync'), ('voyage', 'Voyage Information', 'vp-voyage'), ('incidents', 'Incident Reporting', 'vp-incidents'), ('welfare', 'Welfare Reporting', 'vp-welfare'), ('documents', 'Vessel Documents', 'vp-documents')]:
    app_page('pages/vessel-portal/' + a[0] + '.html', a[1], a[2], 'vessel')
for a in [('dashboard', 'Platform Dashboard', 'platform-dashboard'), ('organisations', 'Organisations', 'platform-orgs'), ('users', 'Platform Users', 'platform-users'), ('subscriptions', 'Subscriptions', 'platform-subscriptions'), ('enquiries', 'Support Enquiries', 'platform-enquiries'), ('support-access', 'Support Access', 'platform-support'), ('configuration', 'Configuration', 'platform-config'), ('monitoring', 'System Monitoring', 'platform-monitoring'), ('audit-logs', 'Platform Audit Logs', 'platform-audit')]:
    app_page('pages/platform/' + a[0] + '.html', a[1], a[2], 'platform')

# ---------------------------------------------------------------- public site
def I(name, cls=''):
    return f'<i data-lucide="{name}"{" class=" + chr(34) + cls + chr(34) if cls else ""}></i>'

def nav(path, active=''):
    r = root_of(path); P = lambda p: f'{r}pages/{p}.html'
    links = [('Home', f'{r}index.html', 'home'), ('Platform', P('public/platform'), 'platform'), ('Solutions', P('public/solutions'), 'solutions'), ('For Maritime Organisations', P('public/for-organisations'), 'orgs'), ('For Seafarers', P('public/for-seafarers'), 'seafarers'), ('About', P('public/about'), 'about'), ('Contact', P('public/contact'), 'contact')]
    return f'''<header class="pub-nav"><div class="wrap"><a class="logo" href="{r}index.html"><img src="{r}assets/images/logo.png" alt="Nyovara"></a>
<nav class="pub-links" aria-label="Main">{''.join(f'<a href="{h}" class="{"active" if k == active else ""}">{l}</a>' for l, h, k in links)}</nav>
<div class="pub-cta"><a class="btn btn-outline" href="{P('authentication/login')}">Login</a><a class="btn btn-primary" href="{P('authentication/get-started')}">Get Started</a></div>
<button class="btn btn-ghost btn-icon pub-burger" aria-label="Menu">{I('menu')}</button></div></header>'''

def footer(path):
    r = root_of(path); P = lambda p: f'{r}pages/{p}.html'
    return f'''<footer class="pub-foot"><div class="wrap"><div class="cols">
<div><img src="{r}assets/images/logo-light.png" alt="Nyovara" style="height:38px;margin-bottom:14px"><p>Empowering Seafarers. Advancing Maritime Workforces.</p><p class="small">A product of <b style="color:#fff">NyotaCore Solutions &amp; Services</b>.</p><form data-newsletter class="row mt-2" style="flex-wrap:nowrap"><input class="input" type="email" placeholder="Work email" aria-label="Email for newsletter" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#fff"><button class="btn btn-teal">Subscribe</button></form></div>
<div><h4>Platform</h4><a href="{P('public/platform')}">Overview</a><a href="{P('public/solutions/crew-management')}">Crew Management</a><a href="{P('public/solutions/rest-hours')}">Rest Hours</a><a href="{P('public/solutions/seafarer-welfare')}">Seafarer Welfare</a><a href="{P('public/solutions/payroll')}">Payroll</a></div>
<div><h4>Solutions</h4><a href="{P('public/for-organisations')}">Shipowners &amp; managers</a><a href="{P('public/for-organisations')}#agencies">Manning &amp; crewing agencies</a><a href="{P('public/for-seafarers')}">Seafarers</a><a href="{P('public/careers')}">Seafarer jobs</a></div>
<div><h4>Company</h4><a href="{P('public/about')}">About NyotaCore</a><a href="{P('public/contact')}">Contact</a><a href="{P('public/privacy')}">Privacy</a><a href="{P('public/terms')}">Terms</a></div>
<div><h4>Access</h4><a href="{P('authentication/login')}">Sign in</a><a href="{P('authentication/register-organisation')}">Register organisation</a><a href="{P('authentication/register-seafarer')}">Seafarer sign-up</a><a href="#" data-demo-portal="app">Demo: management</a><a href="#" data-demo-portal="vessel">Demo: vessel portal</a><a href="#" data-demo-portal="seafarer">Demo: seafarer portal</a></div>
</div><div class="bottom"><span>© 2026 NyotaCore Solutions &amp; Services. All rights reserved.</span><span>Built for MLC 2006 &amp; STCW-aligned operations · Prototype v1.0</span></div></div></footer>'''

def pub_page(path, title, body, page='', active='', desc=None, scripts_extra=None):
    COUNT['pub'] += 1
    write(path, f'''{head(path, title, desc or 'Nyovara — maritime workforce and seafarer welfare management platform.')}
<body class="pub" data-root="{root_of(path)}" data-route="{path}" data-portal="public" data-page="{page}">
{nav(path, active)}
<main id="content">
{body}
</main>
{footer(path)}
{scripts(path, PUB)}
</body>
</html>''')

def page_hero(title, sub, img=None, eyebrow=''):
    style = f' style="background-image:url(%sassets/images/{img})"' if img else ''
    return f'<section class="page-hero{" img" if img else ""}"{style}><div class="wrap">{f"<span class=eyebrow style=color:#5FE3D7>{eyebrow}</span>" if eyebrow else ""}<h1>{title}</h1><p>{sub}</p></div></section>'

def cta(r):
    return f'''<section class="sec"><div class="wrap"><div class="cta-band"><div><h2>Ready to modernise your crew operations?</h2><p>Start a guided trial or book a walkthrough with the NyotaCore team.</p></div><div class="row"><a class="btn btn-white btn-lg" href="{r}pages/authentication/get-started.html">Get Started</a><a class="btn btn-glass btn-lg" href="{r}pages/public/contact.html">Talk to us</a></div></div></div></section>'''

MODS = [
 ('crew-management', 'users', 'Crew Management', 'One master record per seafarer — personal details, next of kin, documents, certificates, sea service and contracts with controlled status transitions.', ['Complete legacy-compatible crew master record', 'Certificates, medical and travel documents with expiry alerts', 'Sea-service calculation with overlap detection', 'Crew pool, availability and blacklist management', 'Bulk import with row-level validation']),
 ('recruitment', 'user-plus', 'Recruitment', 'Publish vacancies, receive applications, score candidates with multiple reviewers, interview and approve through configurable stages.', ['Public careers pages', 'Kanban pipeline & funnel analytics', 'Multi-reviewer scoring criteria', 'Configurable approval chain', 'Convert approved candidates to crew']),
 ('vessel-management', 'ship', 'Vessel Management', 'Fleet particulars, live crew manifests, crew changes and vessel documents in one place.', ['IMO-validated vessel registry', 'Crew manifest with authorised sign-off', 'Crew change workflow with document checks', 'Statutory certificate tracking', 'Vessel activity history']),
 ('voyage-monitoring', 'route', 'Voyage Monitoring', 'Plan voyages, record departures and arrivals, manage port calls and prepare for AIS-powered live tracking.', ['Voyage lifecycle & status tracking', 'Port calls and crew-change ports', 'Voyage reports', 'Architecture ready for AIS & weather providers', 'Never shows fabricated live positions']),
 ('rest-hours', 'clock', 'Rest Hours', 'A genuine work/rest recording and compliance engine for MLC 2006 Standard A2.3 and STCW — rolling windows, not calendar-day guesses.', ['Visual 24-hour timeline at 30-minute resolution', 'Rolling 24h and 7-day calculations', 'Split-rest, 6-hour period and 14-hour interval checks', 'Versioned flag-state & CBA rule sets', 'Offline recording with conflict-safe sync']),
 ('seafarer-welfare', 'heart-handshake', 'Seafarer Welfare', 'Check-ins, welfare requests, confidential grievances and incident investigations with protected identities and audited access.', ['Scheduled wellbeing check-ins', 'Anonymous & confidential complaints', 'Incident investigation workflow', 'Escalation rules', 'Seafarer case tracking']),
 ('training', 'graduation-cap', 'Training', 'Courses, assignments by rank, department or vessel, competency frameworks and performance appraisals.', ['Course catalogue & providers', 'Bulk assignment with reminders', 'Competency assessments', 'Seven-area appraisals with approval', 'Certificate validity tracking']),
 ('payroll', 'wallet', 'Payroll', 'Wage structures, compensation, allotments and a controlled payroll run from calculation to approval, payslips and payments.', ['Wage scales by rank', 'Allotments with validation', 'Exception review before approval', 'Payslips seafarers can access', 'Duplicate processing prevention']),
]

def feature_grid(r, mods=MODS):
    return '<div class="grid g4">' + ''.join(f'<a class="feature" href="{r}pages/public/solutions/{k}.html"><div class="fi">{I(ic)}</div><h3>{t}</h3><p>{d}</p><span class="more">Learn more {I("arrow-right")}</span></a>' for k, ic, t, d, _ in mods) + '</div>'

def mock():
    bars = ''.join(f'<span style="height:{h}%"></span>' for h in [42, 58, 51, 66, 72, 61, 80, 74, 88, 70, 92, 84])
    rh = ''.join(f'<i class="{"w" if i in (0,1,2,3,12,13,14,15) else ""}"></i>' for i in range(24))
    return f'''<div class="mock" aria-hidden="true"><div class="mock-top"><i></i><i></i><i></i></div><div class="mock-body"><div class="mock-side"><span class="on"></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="mock-main"><div class="mock-stats"><div><b>482</b><small>Total crew</small></div><div><b>211</b><small>Onboard</small></div><div><b>98.4%</b><small>Rest compliance</small></div><div><b>12</b><small>Crew changes</small></div></div><div class="mock-chart">{bars}</div><div class="mock-rh"><small style="font-size:10px;color:#718096">Rest hours · 2nd Officer · today</small><div class="bar">{rh}</div></div></div></div></div>'''

# Landing page
r = ''
landing = f'''
<section class="hero"><div class="hero-bg" role="img" aria-label="Maritime operations at sunrise"></div><div class="wrap">
<div><span class="eyebrow">{I('anchor')} Maritime workforce &amp; welfare platform</span>
<h1>Every seafarer, every vessel, <em>one connected platform.</em></h1>
<p class="lead">Nyovara digitises crew administration, rest-hours compliance and seafarer welfare — connecting shore teams, vessels and the people who sail them.</p>
<div class="row mt-3"><a class="btn btn-teal btn-lg" href="pages/authentication/get-started.html">Get Started {I('arrow-right')}</a><a class="btn btn-glass btn-lg" href="pages/public/platform.html">Explore Platform</a></div>
<div class="hero-trust"><div><b>14</b><span>integrated modules</span></div><div><b>MLC 2006</b><span>&amp; STCW-aligned rest rules</span></div><div><b>3</b><span>portals: shore, vessel, seafarer</span></div></div></div>
{mock()}</div></section>
<section class="sec"><div class="wrap"><div class="sec-head"><span class="eyebrow">Platform overview</span><h2>Everything your crewing operation runs on</h2><p>Purpose-built modules that share one record of every seafarer — no spreadsheets, no re-keying, no blind spots.</p></div>{feature_grid(r)}</div></section>
<section class="sec dark" id="how"><div class="wrap"><div class="sec-head"><span class="eyebrow" style="color:#5FE3D7">How it works</span><h2>Shore, ship and seafarer — in sync</h2><p>One backend, one source of truth, three experiences tailored to how each group works.</p></div><div class="how">
<div class="how-card"><div class="num">01</div><h3>Maritime organisations</h3><p>Shore teams manage crew records, recruitment, planning, payroll and compliance from the management portal.</p><ul><li>Crew planning with conflict checks</li><li>Approvals and audit trails</li><li>Fleet-wide analytics</li></ul></div>
<div class="how-card"><div class="num">02</div><h3>Vessel operations</h3><p>Masters and officers record rest hours, review crew submissions and report incidents — even offline.</p><ul><li>Crew manifest &amp; changes</li><li>Rest-hours review</li><li>Offline queue with safe sync</li></ul></div>
<div class="how-card"><div class="num">03</div><h3>Seafarers</h3><p>A mobile-first self-service portal for documents, rest hours, welfare requests, training and payslips.</p><ul><li>Own documents &amp; expiry alerts</li><li>Confidential welfare channel</li><li>Payslips &amp; allotments</li></ul></div>
</div></div></section>
<section class="sec"><div class="wrap split"><img src="assets/images/ship-officer.jpg" alt="Ship's officer on the bridge wing"><div><span class="eyebrow">Platform features</span><h2 style="font-size:34px">Built for how crewing really works</h2><p class="muted" style="font-size:16px">Nyovara preserves the detail your legacy crew system holds while giving every team a modern, auditable workflow.</p><ul class="ticks"><li>Controlled crew status transitions — no one is “Available” and “Onboard” at once</li><li>Rolling-window rest-hours engine with versioned flag-state rules</li><li>Restricted access for medical, welfare, payroll and children’s data</li><li>Role- and vessel-scoped permissions with full audit logging</li><li>Exports to PDF, Excel and CSV from every list and report</li></ul><a class="btn btn-primary" href="pages/public/platform.html">See the full platform {I('arrow-right')}</a></div></div></section>
<section class="sec alt"><div class="wrap"><div class="sec-head"><span class="eyebrow">Benefits</span><h2>Measurable gains across the operation</h2></div><div class="grid g4">
{''.join(f'<div class="feature"><div class="fi">{I(i)}</div><h3>{t}</h3><p>{d}</p></div>' for i, t, d in [('shield-check', 'Compliance confidence', 'Spot potential rest-hours non-compliance and expiring certificates before inspections do.'), ('timer', 'Hours back every week', 'Crew changes, document checks and payroll runs move from email chains to guided workflows.'), ('heart-pulse', 'Healthier crews', 'Regular check-ins and a confidential channel surface welfare issues early.'), ('eye', 'Operational visibility', 'Live dashboards built from real records — not monthly spreadsheets.')])}
</div></div></section>
<section class="sec"><div class="wrap"><div class="sec-head"><span class="eyebrow">Industry solutions</span><h2>Designed for every maritime employer</h2></div><div class="grid g3">
{''.join(f'<a class="feature" href="pages/public/for-organisations.html"><div class="fi">{I(i)}</div><h3>{t}</h3><p>{d}</p><span class="more">Explore {I("arrow-right")}</span></a>' for i, t, d in [('anchor', 'Shipowners & ship managers', 'Fleet-wide crew deployment, vessel manifests, rest-hours oversight and payroll in one tenant.'), ('briefcase', 'Manning & crewing agencies', 'Large crew pools, recruitment pipelines, document verification and client-vessel deployments.'), ('waves', 'Offshore service companies', 'Rotational crews, short-turnaround crew changes and offline-capable vessel reporting.')])}
</div></div></section>
<section class="sec alt"><div class="wrap split"><div><span class="eyebrow">For seafarers</span><h2 style="font-size:34px">Your career, in your pocket</h2><p class="muted" style="font-size:16px">Seafarers get their own secure account — documents, certificates, contracts, rest hours, payslips and a private line to welfare support. Registration never ties you to an employer.</p><ul class="ticks"><li>Expiry reminders for passports, certificates and medicals</li><li>Record and track your rest hours</li><li>Raise welfare requests or confidential complaints</li></ul><a class="btn btn-teal" href="pages/authentication/register-seafarer.html">Create a free seafarer account</a></div><img src="assets/images/seafarer-tablet.jpg" alt="Seafarer using a tablet on the quayside"></div></section>
<section class="sec" id="faq"><div class="wrap" style="max-width:860px"><div class="sec-head"><span class="eyebrow">FAQ</span><h2>Frequently asked questions</h2></div>
{''.join(f'<div class="faq-item"><button class="faq-q">{q}{I("plus")}</button><div class="faq-a">{a}</div></div>' for q, a in [('Does Nyovara replace our existing crew system?', 'Yes. Nyovara’s crew master record preserves the fields from typical legacy crewing systems (including unusual ones) and adds structured related records for documents, sea service and employment. Bulk import validates every row individually.'), ('How does the rest-hours engine decide compliance?', 'It evaluates rolling 24-hour and 7-day windows at 30-minute resolution against the MLC 2006 Standard A2.3 / STCW baseline and any flag-state or collective-agreement rule version you configure. Calculated results are kept separate from reviewer decisions, and exceptions are never automatically treated as compliance.'), ('Can vessels use Nyovara with poor connectivity?', 'The vessel portal supports offline drafts and a queued submission model. Records keep their original event time and receive a separate server-receipt time; they are not reported as submitted until synchronisation succeeds. Duplicates and conflicts are detected.'), ('Who can see sensitive seafarer information?', 'Medical details, welfare cases, payroll and children’s information are restricted by role and scope, and access to confidential cases is audited. NyotaCore platform staff cannot access tenant records without a time-bound, approved support grant.'), ('Is a seafarer account linked to an employer?', 'No. Seafarer registration never establishes employment. Organisations invite seafarers or seafarers apply to published vacancies.'), ('What does deployment look like?', 'Nyovara runs on ASP.NET Core with Microsoft SQL Server on Windows Server / IIS over HTTPS, with background processing, structured logging and automated backups.')])}
</div></section>
<section class="sec alt" id="contact"><div class="wrap split"><div><span class="eyebrow">Contact</span><h2 style="font-size:34px">Let’s talk about your fleet</h2><p class="muted" style="font-size:16px">Tell us about your organisation and we’ll tailor a walkthrough of the modules that matter most to you.</p><div class="stack mt-2"><div class="row">{I('mail')} hello@nyotacore.com</div><div class="row">{I('phone')} +234 1 700 0000</div><div class="row">{I('map-pin')} Lagos, Nigeria</div></div></div><div class="card card-body"><h3>Quick enquiry</h3><p class="muted">Use our full contact form to reach the right team.</p><a class="btn btn-primary btn-lg w-100" href="pages/public/contact.html">Open contact form {I('arrow-right')}</a><a class="btn btn-outline btn-lg w-100 mt-1" href="pages/authentication/get-started.html">Start a trial</a></div></div></section>
{cta(r)}'''
pub_page('index.html', 'Maritime Workforce & Seafarer Welfare Platform', landing, '', 'home', 'Nyovara digitises crew management, rest-hours compliance and seafarer welfare for shipowners, ship managers and manning agencies.')

def sub(path):
    return root_of(path)

# About
p = 'pages/public/about.html'; r = sub(p)
pub_page(p, 'About', page_hero('Built by NyotaCore, for the people who keep the world moving', 'Nyovara exists to make maritime workforce management simpler and seafarer welfare visible.', None, 'About us').replace('%s', r) + f'''
<section class="sec"><div class="wrap split"><div class="prose"><h2>Our vision</h2><p>To become an integrated maritime workforce technology platform that simplifies crew administration, strengthens seafarer welfare and improves operational visibility across maritime organisations.</p><h2>Why we built Nyovara</h2><p>Crewing teams still juggle spreadsheets, email threads and legacy desktop systems to keep vessels manned and compliant. Seafarers chase paper copies of their own certificates. Welfare issues surface too late. NyotaCore Solutions &amp; Services built Nyovara to give every party — shore, ship and seafarer — one trustworthy record and the right tools for their job.</p><h2>What we believe</h2><ul class="ticks"><li>Compliance should be calculated, not guessed</li><li>Seafarer data belongs behind strong, audited access controls</li><li>Software must work at sea, not just in the office</li><li>Every seafarer deserves a voice that reaches someone who can help</li></ul></div><img src="{r}assets/images/bridge-officers.jpg" alt="Officers on a ship's bridge"></div></section>
<section class="sec alt"><div class="wrap"><div class="grid g4">{''.join(f'<div class="card card-body text-center"><div class="stat-value" style="font-size:30px">{v}</div><div class="muted">{l}</div></div>' for v, l in [('14', 'Product objectives'), ('4', 'User portals'), ('60+', 'Management screens'), ('100%', 'Records audited')])}</div></div></section>{cta(r)}''', '', 'about')

# Platform
p = 'pages/public/platform.html'; r = sub(p)
pub_page(p, 'Platform', page_hero('The Nyovara platform', 'A modular platform with one shared record of every seafarer, vessel and voyage — and four portals on one secure backend.', 'container-ship.jpg', 'Platform').replace('%s', r) + f'''
<section class="sec"><div class="wrap"><div class="sec-head"><h2>Core modules</h2><p>Each module can evolve independently inside a modular monolith — simple to run, easy to extend.</p></div>{feature_grid(r)}</div></section>
<section class="sec alt"><div class="wrap"><div class="sec-head"><h2>Four portals, one platform</h2></div><div class="grid g4">{''.join(f'<div class="feature"><div class="fi">{I(i)}</div><h3>{t}</h3><p>{d}</p><span class="small muted">{route}</span></div>' for i, t, d, route in [('shield', 'Platform administration', 'NyotaCore manages organisations, subscriptions, support and monitoring — without automatic access to tenant data.', '/platform'), ('building-2', 'Organisation management', 'The full management suite for crewing, operations, welfare, training, payroll and reporting.', '/app'), ('ship-wheel', 'Vessel operations', 'Onboard manifest, rest-hours recording and review, incidents and vessel documents — offline-ready.', '/vessel-portal'), ('anchor', 'Seafarer self-service', 'Mobile-first access to personal records, rest hours, welfare, training and payroll.', '/seafarer')])}</div></div></section>
<section class="sec"><div class="wrap split"><div><h2 style="font-size:32px">Security &amp; architecture</h2><ul class="ticks"><li>ASP.NET Core, Entity Framework Core and Microsoft SQL Server</li><li>ASP.NET Core Identity with MFA, lockout and session management</li><li>Organisation-level data isolation, RBAC by module and record scope</li><li>CSRF/XSS/SQL-injection protection, rate limiting, secure cookies</li><li>Malware-scanned uploads stored outside the public web root</li><li>Immutable audit logs with before/after values</li></ul></div><div class="card card-body"><h3>Integration-ready</h3><p class="muted">Configurable provider interfaces — credentials kept in a secret store, never in code.</p><div class="row">{''.join(f'<span class="chip">{x}</span>' for x in ['Microsoft 365', 'Entra ID', 'Email', 'SMS', 'AIS data', 'Mapping', 'Payments', 'Document storage', 'Training LMS'])}</div></div></div></section>{cta(r)}''', '', 'platform')

# Solutions index + subpages
p = 'pages/public/solutions.html'; r = sub(p)
pub_page(p, 'Solutions', page_hero('Solutions for every crewing challenge', 'Explore how each Nyovara module solves a specific part of maritime workforce management.', None, 'Solutions').replace('%s', r) + f'<section class="sec"><div class="wrap">{feature_grid(r)}</div></section>{cta(r)}', '', 'solutions')
IMG = {'crew-management': 'bridge-officers.jpg', 'recruitment': 'seafarer-tablet.jpg', 'vessel-management': 'container-ship.jpg', 'voyage-monitoring': 'hero-operations.jpg', 'rest-hours': 'ship-officer.jpg', 'seafarer-welfare': 'seafarer-tablet.jpg', 'training': 'bridge-officers.jpg', 'payroll': 'harbour-vessel.jpg'}
DEMO = {'crew-management': 'crew/directory', 'recruitment': 'recruitment/index', 'vessel-management': 'vessels/index', 'voyage-monitoring': 'voyages/index', 'rest-hours': 'rest-hours/record', 'seafarer-welfare': 'welfare/index', 'training': 'training/index', 'payroll': 'payroll/processing'}
for k, ic, t, d, pts in MODS:
    p = f'pages/public/solutions/{k}.html'; r = sub(p)
    others = [m for m in MODS if m[0] != k][:4]
    pub_page(p, t, page_hero(t, d, IMG[k], 'Solution').replace('%s', r) + f'''
<section class="sec"><div class="wrap split"><div><h2 style="font-size:32px">What you get</h2><ul class="ticks">{''.join(f'<li>{x}</li>' for x in pts)}</ul><div class="row mt-2"><a class="btn btn-primary" href="{r}pages/authentication/get-started.html">Get Started</a><a class="btn btn-outline" href="{r}pages/{DEMO[k]}.html">Open the live demo</a></div></div><img src="{r}assets/images/{IMG[k]}" alt="{t}"></div></section>
<section class="sec alt"><div class="wrap"><div class="sec-head"><h2>Works with the rest of Nyovara</h2></div><div class="grid g4">{''.join(f'<a class="feature" href="{r}pages/public/solutions/{m[0]}.html"><div class="fi">{I(m[1])}</div><h3>{m[2]}</h3><p>{m[3][:110]}…</p></a>' for m in others)}</div></div></section>{cta(r)}''', '', 'solutions')

# For organisations / seafarers
p = 'pages/public/for-organisations.html'; r = sub(p)
pub_page(p, 'For Maritime Organisations', page_hero('For maritime organisations', 'Shipowners, ship managers, manning and crewing agencies, offshore operators and recruiters run their workforce on Nyovara.', 'container-ship.jpg', 'Organisations').replace('%s', r) + f'''
<section class="sec"><div class="wrap"><div class="grid g3">{''.join(f'<div class="feature" id="{i2}"><div class="fi">{I(i)}</div><h3>{t}</h3><p>{d}</p><ul class="ticks small">{"".join(f"<li>{x}</li>" for x in pts)}</ul></div>' for i, i2, t, d, pts in [('anchor', 'owners', 'Shipowners & ship managers', 'Keep every vessel manned, compliant and audited.', ['Fleet dashboards', 'Crew change workflow', 'Rest-hours oversight']), ('briefcase', 'agencies', 'Manning & crewing agencies', 'Manage large pools and deploy to client vessels.', ['Crew pool & availability', 'Recruitment pipeline', 'Document verification']), ('waves', 'offshore', 'Offshore & shipping operators', 'Rotational crews with short turnarounds.', ['Relief planning', 'Offline vessel reporting', 'Payroll & allotments'])])}</div></div></section>
<section class="sec alt"><div class="wrap split"><img src="{r}assets/images/harbour-vessel.jpg" alt="Vessel moored in harbour"><div><h2 style="font-size:32px">From registration to first crew change in days</h2><ol class="prose"><li>Register your organisation and verify your email</li><li>Complete the guided 10-step onboarding</li><li>Import crew in bulk and register vessels</li><li>Invite shore users, masters and seafarers</li></ol><a class="btn btn-primary" href="{r}pages/authentication/register-organisation.html">Register your organisation</a></div></div></section>{cta(r)}''', '', 'orgs')
p = 'pages/public/for-seafarers.html'; r = sub(p)
pub_page(p, 'For Seafarers', page_hero('For seafarers', 'Your documents, rest hours, welfare support, training and payslips — securely in your pocket.', 'seafarer-tablet.jpg', 'Seafarers').replace('%s', r) + f'''
<section class="sec"><div class="wrap"><div class="grid g4">{''.join(f'<div class="feature"><div class="fi">{I(i)}</div><h3>{t}</h3><p>{d}</p></div>' for i, t, d in [('folder-open', 'All your documents', 'Passport, seaman’s book, certificates and medicals with expiry reminders.'), ('clock', 'Rest hours', 'Record your hours and see your compliance at a glance.'), ('heart-handshake', 'Welfare support', 'Raise requests, join check-ins or file a confidential complaint.'), ('wallet', 'Pay & allotments', 'View payslips, payment history and family allotments.')])}</div>
<div class="alert alert-info mt-3">{I('info')}<div>Creating a Nyovara account never establishes employment with an organisation. You stay in control of your profile.</div></div></div></section>
<section class="sec alt"><div class="wrap split"><div><h2 style="font-size:32px">Looking for your next contract?</h2><p class="muted">Browse vacancies published by organisations on Nyovara and apply in minutes.</p><div class="row"><a class="btn btn-teal" href="{r}pages/authentication/register-seafarer.html">Create free account</a><a class="btn btn-outline" href="{r}pages/public/careers.html">Browse jobs</a></div></div><img src="{r}assets/images/ship-officer.jpg" alt="Ship officer"></div></section>''', '', 'seafarers')

# Contact
p = 'pages/public/contact.html'; r = sub(p)
pub_page(p, 'Contact', page_hero('Contact NyotaCore', 'Questions, demos, partnerships or support — we’re here to help.', None, 'Contact').replace('%s', r) + f'''
<section class="sec"><div class="wrap"><div class="grid g-1-2"><div class="stack"><div class="card card-body"><h3>{I('building-2')} NyotaCore Solutions &amp; Services</h3><p class="muted mb-0">Lagos, Nigeria</p></div><div class="card card-body"><h3>{I('mail')} Email</h3><p class="mb-0">hello@nyotacore.com<br>support@nyotacore.com</p></div><div class="card card-body"><h3>{I('phone')} Phone</h3><p class="mb-0">+234 1 700 0000 (Mon–Fri, 08:00–18:00 WAT)</p></div><div class="card card-body"><h3>{I('life-buoy')} Existing customers</h3><p class="mb-0">Sign in and use the support options in your portal for faster help.</p></div></div>
<div class="card"><div class="card-head"><h3>Send us a message</h3></div><div class="card-body" id="contact-form"></div></div></div></div></section>''', 'contact', 'contact')

# Privacy / Terms
LEGAL = {
 'privacy': ('Privacy Policy', [('Who we are', 'Nyovara is operated by NyotaCore Solutions & Services. Organisations using Nyovara act as data controllers for their crew records; NyotaCore processes that data on their behalf.'), ('What we collect', 'Account details, crew and employment records entered by organisations or seafarers, documents uploaded to the platform, rest-hour records, welfare cases and technical logs needed to secure the service.'), ('Sensitive information', 'Medical, welfare, payroll, identification and children’s information is restricted by role and scope, encrypted in transit and at rest, and access to confidential records is audited.'), ('Platform staff access', 'NyotaCore staff cannot access tenant records without a documented reason, explicit scope, tenant approval and an expiry. Every action during support access is logged.'), ('Retention', 'Records are retained according to the organisation’s configuration and applicable maritime and labour regulations. Historical records use soft deletion to preserve audit integrity.'), ('Your rights', 'Seafarers may view their own records in the self-service portal and request corrections. Contact privacy@nyotacore.com for data-protection requests.')]),
 'terms': ('Terms of Service', [('Acceptance', 'By creating an account you agree to these terms on behalf of yourself or the organisation you represent.'), ('Accounts', 'You are responsible for keeping credentials secure and for enabling multi-factor authentication where required.'), ('Acceptable use', 'You must not attempt to access other organisations’ data, upload malicious files or misuse the platform. Cross-tenant access attempts are logged and investigated.'), ('Compliance tools', 'Nyovara calculates potential rest-hours non-compliance against configured rules to support your obligations. Responsibility for compliance remains with the organisation and vessel management.'), ('Payments', 'Payroll features record payments; Nyovara does not execute bank transfers unless a payment provider integration is explicitly configured.'), ('Changes', 'We may update these terms; material changes are notified in advance.')])
}
for k, (t, secs) in LEGAL.items():
    p = f'pages/public/{k}.html'; r = sub(p)
    pub_page(p, t, page_hero(t, 'Last updated 1 November 2026', None, 'Legal').replace('%s', r) + f'<section class="sec"><div class="wrap prose">' + ''.join(f'<h2>{h}</h2><p>{b}</p>' for h, b in secs) + '<div class="alert alert-warning mt-3"><i data-lucide="flask-conical"></i><div>Prototype placeholder text — final legal copy to be provided by NyotaCore counsel.</div></div></div></section>')

# Careers
p = 'pages/public/careers.html'; r = sub(p)
pub_page(p, 'Seafarer Jobs', page_hero('Seafarer vacancies', 'Current openings published by organisations on Nyovara.', 'harbour-vessel.jpg', 'Careers').replace('%s', r) + '<section class="sec"><div class="wrap" id="jobs"></div></section>', 'careers', 'seafarers')
p = 'pages/public/careers-job.html'; r = sub(p)
pub_page(p, 'Vacancy', '<section class="sec"><div class="wrap" id="job"></div></section>', 'careers-job', 'seafarers')

# ---------------------------------------------------------------- auth screens
def auth_page(path, title, page, side_title, side_text, wide=False):
    COUNT['pub'] += 1
    r = root_of(path)
    write(path, f'''{head(path, title)}
<body data-root="{r}" data-route="{path}" data-portal="public" data-page="{page}">
<div class="auth"><aside class="auth-side"><a href="{r}index.html"><img class="logo" src="{r}assets/images/logo-light.png" alt="Nyovara"></a><div><h2>{side_title}</h2><p>{side_text}</p><div class="row mt-2" style="color:#9FB6CE;font-size:13px"><span>{I('shield-check')} MFA &amp; encrypted sessions</span><span>{I('lock')} Audited access</span></div></div><p class="small" style="color:#9FB6CE">© 2026 NyotaCore Solutions &amp; Services</p></aside>
<main class="auth-main" id="content"><div class="auth-card{' wide' if wide else ''}" id="auth"></div></main></div>
{scripts(path, PUB)}
</body>
</html>''')
auth_page('pages/authentication/login.html', 'Sign in', 'login', 'Empowering Seafarers. Advancing Maritime Workforces.', 'Sign in once — Nyovara takes you to the right portal for your role.')
auth_page('pages/authentication/register-organisation.html', 'Register organisation', 'register-org', 'Bring your whole crewing operation onto one platform.', 'Crew records, recruitment, vessels, rest hours, welfare, training and payroll — connected.', True)
auth_page('pages/authentication/register-seafarer.html', 'Seafarer registration', 'register-seafarer', 'Your seafaring career, organised.', 'Documents, rest hours, welfare and payslips — in your pocket, under your control.', True)
auth_page('pages/authentication/verify-email.html', 'Verify email', 'verify-email', 'One quick step to secure your account.', 'Email verification protects your account and your crew’s data.')
auth_page('pages/authentication/forgot-password.html', 'Forgot password', 'forgot-password', 'Locked out? We’ll get you back on watch.', 'Reset links are single-use and expire after 30 minutes.')
auth_page('pages/authentication/reset-password.html', 'Reset password', 'reset-password', 'Choose a strong new password.', 'Use 10+ characters with a mix of letters, numbers and symbols.')
auth_page('pages/authentication/onboarding.html', 'Organisation onboarding', 'onboarding', 'Let’s set up your workspace.', 'Ten short steps. Save and continue any time.', True)
auth_page('pages/authentication/seafarer-onboarding.html', 'Complete your profile', 'seafarer-onboarding', 'Welcome aboard.', 'Complete your profile and upload your documents for verification.', True)
# get started chooser
p = 'pages/authentication/get-started.html'; r = root_of(p)
auth_page(p, 'Get started', 'get-started', 'Choose how you’ll use Nyovara.', 'Organisations manage crews and vessels; seafarers manage their own careers.', True)
with open(os.path.join(OUT, p), encoding='utf-8') as f:
    s = f.read()
s = s.replace('<div class="auth-card wide" id="auth"></div>', f'''<div class="auth-card wide" id="auth"><h1>Get started with Nyovara</h1><p class="muted">Select the account type that fits you.</p><div class="grid g2 mt-2"><a class="feature" href="{r}pages/authentication/register-organisation.html"><div class="fi">{I('building-2')}</div><h3>Maritime organisation</h3><p>Shipowners, ship managers, manning &amp; crewing agencies, offshore operators.</p><span class="more">Register organisation {I('arrow-right')}</span></a><a class="feature" href="{r}pages/authentication/register-seafarer.html"><div class="fi">{I('anchor')}</div><h3>Seafarer</h3><p>Manage your documents, rest hours, welfare, training and payslips.</p><span class="more">Create seafarer account {I('arrow-right')}</span></a></div><p class="small muted mt-3">Already have an account? <a href="{r}pages/authentication/login.html">Sign in</a> · Want to explore first? <a href="#" data-demo-portal="app">Open the management demo</a></p></div>''')
with open(os.path.join(OUT, p), 'w', encoding='utf-8') as f:
    f.write(s)

print('app screens:', COUNT['app'], ' public/auth screens:', COUNT['pub'])
