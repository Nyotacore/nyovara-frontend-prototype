/* =========================================================================
   NYOCREW LAYOUT SHELL — sidebar navigation, top bar, global search,
   notification centre, user menu, demo controls. One shell, four portals.
   ========================================================================= */
(function () {
  'use strict';
  const N = window.N, esc = N.esc;
  const P = (p) => 'pages/' + p + '.html';

  N.NAV = {
    app: [
      { section: 'Overview' },
      { label: 'Dashboard', icon: 'layout-dashboard', href: P('organisation/dashboard') },
      { section: 'Workforce' },
      { label: 'Crew Management', icon: 'users', perm: 'crew', children: [
        ['Dashboard', 'crew/index'], ['Crew Directory', 'crew/directory'], ['Add New Crew', 'crew/create'], ['Crew Pool', 'crew/pool'], ['Available Crew', 'crew/available'], ['Active Crew', 'crew/active'], ['Crew Onboard', 'crew/onboard'], ['Crew On Leave', 'crew/on-leave'], ['Inactive Crew', 'crew/inactive'], ['Blacklisted / Terminated', 'crew/blacklisted'], ['Certificates', 'crew/certificates'], ['Medical Records', 'crew/medical'], ['Travel Documents', 'crew/travel-documents'], ['Sea Service', 'crew/sea-service'], ['Employment History', 'crew/employment-history'], ['Crew Contracts', 'crew/contracts'], ['Crew Changes', 'crew/changes'], ['Crew Reports', 'crew/reports']] },
      { label: 'Recruitment', icon: 'user-plus', perm: 'recruitment', children: [['Dashboard', 'recruitment/index'], ['Job Vacancies', 'recruitment/vacancies'], ['Applications', 'recruitment/applications'], ['Interviews', 'recruitment/interviews'], ['Candidate Evaluation', 'recruitment/evaluation'], ['Recruitment Approvals', 'recruitment/approvals']] },
      { label: 'Crew Planning', icon: 'calendar-range', perm: 'planning', children: [['Crew Planning', 'recruitment/crew-planning'], ['Relief Planning', 'recruitment/relief-planning'], ['Crew Changes', 'crew/changes'], ['Sign-On / Sign-Off', 'recruitment/sign-on-off']] },
      { section: 'Operations' },
      { label: 'Vessels', icon: 'ship', perm: 'vessels', children: [['Dashboard', 'vessels/index'], ['Vessel Directory', 'vessels/directory'], ['Crew Manifest', 'vessels/manifest']] },
      { label: 'Voyages', icon: 'route', perm: 'voyages', children: [['Dashboard', 'voyages/index'], ['Voyage Directory', 'voyages/directory'], ['Create Voyage', 'voyages/create'], ['Port Calls', 'voyages/port-calls'], ['Voyage Monitoring', 'voyages/monitoring']] },
      { label: 'Rest Hours', icon: 'clock', perm: 'resthours', children: [['Dashboard', 'rest-hours/index'], ['Working Arrangements', 'rest-hours/working-arrangements'], ['Record Hours', 'rest-hours/record'], ['Daily Rest Hours', 'rest-hours/daily'], ['Monthly Calendar', 'rest-hours/calendar'], ['Review Queue', 'rest-hours/review'], ['Lock / Unlock Month', 'rest-hours/lock'], ['Rest Hours Reports', 'rest-hours/reports'], ['Rule Configuration', 'rest-hours/rules']] },
      { section: 'People' },
      { label: 'Welfare', icon: 'heart-handshake', perm: 'welfare', children: [['Dashboard', 'welfare/index'], ['Welfare Check-ins', 'welfare/check-ins'], ['Welfare Requests', 'welfare/requests'], ['Complaints & Grievances', 'welfare/complaints'], ['Incident Reporting', 'welfare/incidents'], ['Case Management', 'welfare/cases']] },
      { label: 'Training', icon: 'graduation-cap', perm: 'training', children: [['Dashboard', 'training/index'], ['Courses', 'training/courses'], ['Assignments', 'training/assignments'], ['Training Records', 'training/records'], ['Competency Assessment', 'training/competency'], ['Performance Appraisal', 'training/appraisals']] },
      { label: 'Payroll', icon: 'wallet', perm: 'payroll', children: [['Dashboard', 'payroll/index'], ['Wage Structures', 'payroll/wage-structures'], ['Crew Compensation', 'payroll/compensation'], ['Crew Allotments', 'payroll/allotments'], ['Payroll Processing', 'payroll/processing'], ['Payslips', 'payroll/payslips'], ['Payments', 'payroll/payments'], ['Crew Expenses', 'payroll/expenses']] },
      { section: 'Insights & Admin' },
      { label: 'Reports & Analytics', icon: 'bar-chart-3', href: P('reports/index'), perm: 'reports' },
      { label: 'Settings', icon: 'settings', perm: 'settings', children: [['Organisation', 'administration/settings'], ['Users', 'administration/users'], ['Roles & Permissions', 'administration/roles'], ['Reference Data', 'administration/reference-data'], ['Approval Workflows', 'administration/workflows'], ['Notification Settings', 'administration/notifications'], ['Integrations', 'administration/integrations'], ['Audit Logs', 'administration/audit-logs'], ['Onboarding Wizard', 'authentication/onboarding']] }
    ],
    seafarer: [
      { section: 'My Nyocrew' },
      { label: 'Dashboard', icon: 'layout-dashboard', href: P('seafarer/dashboard') },
      { label: 'My Profile', icon: 'user-round', href: P('seafarer/profile') },
      { label: 'My Documents', icon: 'folder-open', href: P('seafarer/documents') },
      { label: 'My Certificates', icon: 'award', href: P('seafarer/certificates') },
      { section: 'Work' },
      { label: 'My Employment', icon: 'briefcase', href: P('seafarer/employment') },
      { label: 'Vessel Assignments', icon: 'ship', href: P('seafarer/assignments') },
      { label: 'My Rest Hours', icon: 'clock', href: P('seafarer/rest-hours') },
      { section: 'Wellbeing & Growth' },
      { label: 'My Welfare', icon: 'heart-handshake', href: P('seafarer/welfare') },
      { label: 'My Training', icon: 'graduation-cap', href: P('seafarer/training') },
      { label: 'My Payroll', icon: 'wallet', href: P('seafarer/payroll') },
      { label: 'Notifications', icon: 'bell', href: P('seafarer/notifications') },
      { section: 'Opportunities' },
      { label: 'Job Vacancies', icon: 'search', href: P('public/careers') }
    ],
    vessel: [
      { section: 'MV Atlantic Aurora' },
      { label: 'Vessel Dashboard', icon: 'layout-dashboard', href: P('vessel-portal/dashboard') },
      { label: 'Crew Manifest', icon: 'clipboard-list', href: P('vessel-portal/manifest') },
      { label: 'Crew Profiles', icon: 'id-card', href: P('vessel-portal/crew') },
      { label: 'Crew Changes', icon: 'repeat', href: P('vessel-portal/crew-changes') },
      { section: 'Rest Hours' },
      { label: 'Record Rest Hours', icon: 'clock', href: P('vessel-portal/rest-hours') },
      { label: 'Review & Approve', icon: 'check-check', href: P('vessel-portal/rest-hours-review') },
      { label: 'Sync Centre', icon: 'refresh-cw', href: P('vessel-portal/sync') },
      { section: 'Operations' },
      { label: 'Voyage Information', icon: 'route', href: P('vessel-portal/voyage') },
      { label: 'Incident Reporting', icon: 'siren', href: P('vessel-portal/incidents') },
      { label: 'Welfare Reporting', icon: 'heart-handshake', href: P('vessel-portal/welfare') },
      { label: 'Vessel Documents', icon: 'folder-lock', href: P('vessel-portal/documents') }
    ],
    platform: [
      { section: 'NyotaCore Platform' },
      { label: 'Platform Dashboard', icon: 'layout-dashboard', href: P('platform/dashboard') },
      { label: 'Organisations', icon: 'building-2', href: P('platform/organisations') },
      { label: 'Platform Users', icon: 'users', href: P('platform/users') },
      { label: 'Subscriptions', icon: 'credit-card', href: P('platform/subscriptions') },
      { label: 'Support Enquiries', icon: 'inbox', href: P('platform/enquiries') },
      { label: 'Support Access', icon: 'key-round', href: P('platform/support-access') },
      { label: 'Configuration', icon: 'sliders-horizontal', href: P('platform/configuration') },
      { label: 'System Monitoring', icon: 'activity', href: P('platform/monitoring') },
      { label: 'Platform Audit Logs', icon: 'scroll-text', href: P('platform/audit-logs') }
    ]
  };
  const PORTAL = {
    app: { name: 'Management Portal', icon: 'building-2', home: P('organisation/dashboard') },
    seafarer: { name: 'Seafarer Self-Service', icon: 'anchor', home: P('seafarer/dashboard') },
    vessel: { name: 'Vessel Operations', icon: 'ship-wheel', home: P('vessel-portal/dashboard') },
    platform: { name: 'Platform Administration', icon: 'shield', home: P('platform/dashboard') }
  };
  N.PORTAL = PORTAL;

  // role → module visibility (demonstrates RBAC in the UI; enforced server-side in production)
  N.ROLE_MODULES = {
    'Organisation Administrator': '*',
    'Crewing Manager': ['crew', 'recruitment', 'planning', 'vessels', 'voyages', 'training', 'reports'],
    'Recruitment Officer': ['crew', 'recruitment', 'reports'],
    'Compliance Officer': ['crew', 'vessels', 'voyages', 'resthours', 'reports'],
    'Welfare Officer': ['welfare', 'reports'],
    'Payroll Officer': ['payroll', 'reports'],
    'Vessel Master (shore view)': ['vessels', 'voyages', 'resthours']
  };
  const allowed = (perm) => { if (!perm) return true; const r = N.viewRole(); if (!r) return true; const m = N.ROLE_MODULES[r]; return m === '*' || (m || []).includes(perm); };
  N.moduleAllowed = allowed;

  N.shell = (portal) => {
    const body = document.body; body.classList.add('portal-' + portal);
    const content = N.$('#content'); content.classList.add('content');
    const u = N.user();
    try { if (localStorage.getItem('nyocrew.sb') === '1') body.classList.add('sb-collapsed'); } catch (e) {}
    const nav = N.NAV[portal] || [];
    const cur = N.route;
    const sb = N.h(`<aside class="sidebar" aria-label="Main navigation"><div class="sb-brand"><a href="${N.url(PORTAL[portal].home)}"><img class="full" src="${N.root}assets/images/logo-light.png" alt="Nyocrew"><img class="mark" src="${N.root}assets/icons/favicon-64.png" alt="Nyocrew"></a></div><div class="sb-portal">${N.ico(PORTAL[portal].icon)}<div><b>${esc(PORTAL[portal].name)}</b>${esc(u.org || (portal === 'seafarer' ? 'Personal account' : ''))}</div></div><nav class="sb-nav"></nav><div class="sb-foot">Nyocrew v1.0 · Prototype<br>© NyotaCore Solutions &amp; Services</div></aside>`);
    const navEl = N.$('.sb-nav', sb);
    nav.forEach((it) => {
      if (it.section) { navEl.appendChild(N.h(`<div class="sb-section">${esc(it.section)}</div>`)); return; }
      if (!allowed(it.perm)) return;
      if (it.children) {
        const kids = it.children.map(([l, p]) => ({ l, href: P(p) }));
        const open = kids.some((k) => k.href === cur);
        const g = N.h(`<div class="sb-group ${open ? 'open' : ''}"><button class="sb-link" aria-expanded="${open}">${N.ico(it.icon)}<span>${esc(it.label)}</span>${N.ico('chevron-right', 'chev')}</button><div class="sb-sub">${kids.map((k) => `<a href="${N.url(k.href)}" class="${k.href === cur ? 'active' : ''}">${esc(k.l)}</a>`).join('')}</div></div>`);
        N.$('button', g).onclick = () => { if (body.classList.contains('sb-collapsed') && innerWidth > 860) { location.href = N.url(kids[0].href); return; } g.classList.toggle('open'); };
        navEl.appendChild(g);
      } else {
        const cnt = it.label === 'Notifications' ? N.db.where('notifications', (n) => n.portal === portal && !n.read).length : 0;
        navEl.appendChild(N.h(`<a class="sb-link ${it.href === cur ? 'active' : ''}" href="${N.url(it.href)}" title="${esc(it.label)}">${N.ico(it.icon)}<span>${esc(it.label)}</span>${cnt ? `<b class="cnt">${cnt}</b>` : ''}</a>`));
      }
    });
    const main = N.h(`<div class="main"><div class="demo-bar no-print">${N.ico('flask-conical')}<span><b>Demonstration prototype</b> — sample data stored in this browser only. Authentication, permissions and calculations shown here are re-validated server-side in production.</span><button data-reset>Reset demo data</button></div><header class="topbar"><button class="tb-btn" data-burger aria-label="Toggle navigation">${N.ico('panel-left')}</button><div class="gsearch"><div class="input-icon">${N.ico('search')}<input class="input" type="search" placeholder="Search crew, vessels, voyages, documents… ( / )" aria-label="Global search"></div><div class="gs-results"></div></div><div class="tb-actions"></div></header></div>`);
    const tba = N.$('.tb-actions', main);
    if (portal === 'vessel') { const pill = N.h(`<button class="offline-pill" data-net>${N.ico('wifi')}<span>Online</span></button>`); tba.appendChild(pill); N.netPill(pill); }
    // portal switcher (demo)
    tba.appendChild(N.menu(Object.entries(PORTAL).map(([k, v]) => ({ label: v.name, icon: v.icon, href: N.url(v.home) })).concat(['-', { label: 'Public website', icon: 'globe', href: N.url('index.html') }]), N.ico('layout-grid'), 'portal-dd'));
    N.$('.portal-dd [data-dd]', tba).className = 'tb-btn'; N.$('.portal-dd [data-dd]', tba).title = 'Switch portal (demo)';
    // notifications
    const nd = N.h(`<div class="dd"><button class="tb-btn" data-dd aria-label="Notifications">${N.ico('bell')}<span class="dot hidden"></span></button><div class="dd-menu notif-panel"><div class="np-head"><b>Notifications</b><button class="btn btn-ghost btn-sm" data-all>Mark all as read</button></div><div class="notif-list"></div><div style="padding:8px;text-align:center"><a href="${N.url(portal === 'seafarer' ? P('seafarer/notifications') : portal === 'app' ? P('organisation/notifications') : portal === 'vessel' ? P('vessel-portal/dashboard') : P('platform/dashboard'))}">View all notifications</a></div></div></div>`);
    tba.appendChild(nd);
    const drawNotifs = () => {
      const list = N.db.where('notifications', (n) => n.portal === portal);
      const unread = list.filter((n) => !n.read).length;
      const dot = N.$('.dot', nd); dot.textContent = unread; dot.classList.toggle('hidden', !unread);
      N.$('.notif-list', nd).innerHTML = list.slice(0, 8).map((n) => `<div class="notif ${n.read ? '' : 'unread'}" data-id="${n.id}"><span class="n-ico">${N.ico(n.icon || 'bell')}</span><div><div style="font-weight:600">${esc(n.title)}</div><div class="muted small">${esc(n.body)}</div><div class="muted small">${N.fmt.rel(n.ts)}</div></div></div>`).join('') || N.empty('You are all caught up', '', 'bell-off');
      N.$$('.notif', nd).forEach((el) => (el.onclick = () => { const n = N.db.get('notifications', el.dataset.id); N.db.save('notifications', { id: n.id, read: true }, { silent: true }); if (n.link) location.href = N.url(n.link); else drawNotifs(); }));
      N.icons(nd);
    };
    N.$('[data-all]', nd).onclick = (e) => { e.stopPropagation(); N.db.where('notifications', (n) => n.portal === portal).forEach((n) => (n.read = true)); N.db.persist(); drawNotifs(); N.toast('All notifications marked as read.'); };
    N.refreshNotifs = drawNotifs;
    // user menu
    const roles = Object.keys(N.ROLE_MODULES);
    const um = N.h(`<div class="dd"><button class="tb-user" data-dd>${N.avatar(u.name, null, 'sm')}<div class="text-left"><div class="nm">${esc(u.name)}</div><div class="rl">${esc(N.viewRole() && portal === 'app' ? 'Viewing as: ' + N.viewRole() : u.role)}</div></div>${N.ico('chevron-down')}</button><div class="dd-menu"></div></div>`);
    const umm = N.$('.dd-menu', um);
    const items = [
      { label: 'My account', icon: 'user', onClick: () => N.accountModal() },
      portal === 'app' ? { label: 'Organisation settings', icon: 'settings', href: N.url(P('administration/settings')) } : null,
      portal === 'app' ? { label: 'View as role (RBAC demo)', icon: 'eye', onClick: () => N.viewAsModal(roles) } : null,
      { label: 'Login history', icon: 'history', onClick: () => N.loginHistoryModal() },
      '-',
      { label: 'Reset demo data', icon: 'rotate-ccw', onClick: () => N.resetDemo() },
      { label: 'Sign out', icon: 'log-out', danger: true, onClick: () => { N.audit('Logout', 'auth', { ref: u.email }); N.db.persist(); try { localStorage.removeItem('nyocrew.session'); } catch (e) {} location.href = N.url(P('authentication/login')) + '?signedout=1'; } }
    ].filter(Boolean);
    items.forEach((i) => { if (i === '-') { umm.appendChild(document.createElement('hr')); return; } const b = i.href ? N.h(`<a href="${i.href}">${N.ico(i.icon)}${esc(i.label)}</a>`) : N.h(`<button class="${i.danger ? 'danger' : ''}">${N.ico(i.icon)}${esc(i.label)}</button>`); if (i.onClick) b.onclick = i.onClick; umm.appendChild(b); });
    tba.appendChild(um);

    content.parentNode.insertBefore(sb, content);
    sb.after(main); main.appendChild(content);
    main.appendChild(N.h(`<footer class="app-foot no-print"><span>© ${new Date().getFullYear()} NyotaCore Solutions &amp; Services · Nyocrew</span><span><a href="${N.url(P('public/privacy'))}">Privacy</a> · <a href="${N.url(P('public/terms'))}">Terms</a> · <a href="${N.url(P('public/contact'))}">Support</a></span></footer>`));
    const wrapApp = N.h('<div class="app"></div>'); sb.parentNode.insertBefore(wrapApp, sb); wrapApp.appendChild(sb); wrapApp.appendChild(main);
    wrapApp.appendChild(N.h('<div class="sb-overlay"></div>'));
    N.$('.sb-overlay').onclick = () => body.classList.remove('sb-open');
    N.$('[data-burger]', main).onclick = () => { if (innerWidth <= 860) body.classList.toggle('sb-open'); else { body.classList.toggle('sb-collapsed'); try { localStorage.setItem('nyocrew.sb', body.classList.contains('sb-collapsed') ? '1' : '0'); } catch (e) {} } };
    N.$('[data-reset]', main).onclick = () => N.resetDemo();
    if (portal === 'seafarer') {
      const bn = N.h(`<nav class="bottom-nav">${[['Home', 'layout-dashboard', 'seafarer/dashboard'], ['Documents', 'folder-open', 'seafarer/documents'], ['Rest', 'clock', 'seafarer/rest-hours'], ['Welfare', 'heart-handshake', 'seafarer/welfare'], ['Pay', 'wallet', 'seafarer/payroll']].map(([l, i, p]) => `<a href="${N.url(P(p))}" class="${P(p) === cur ? 'active' : ''}">${N.ico(i)}${l}</a>`).join('')}</nav>`);
      body.appendChild(bn);
    }
    initSearch(N.$('.gsearch', main), portal);
    drawNotifs();
  };

  N.resetDemo = async () => {
    const ok = await N.confirm({ title: 'Reset demonstration data?', msg: 'All changes made in this browser will be discarded and the original sample data restored.', ok: 'Reset demo' });
    if (!ok) return; N.db.reset(); N.toast('Demo data restored.'); setTimeout(() => location.reload(), 500);
  };
  N.viewAsModal = (roles) => {
    N.formModal({ title: 'View as role', intro: 'Demonstrates role-based navigation and module visibility. In production, permissions are enforced by the API for every request — the UI only reflects them.', fields: [{ k: 'role', label: 'Role', type: 'select', options: ['— Full administrator (default) —', ...roles.slice(1)] }], values: { role: N.viewRole() || '' }, saveLabel: 'Apply', onSave: (v) => { N.db.set('viewAsRole', v.role && !v.role.startsWith('—') ? v.role : null); setTimeout(() => location.reload(), 200); } });
  };
  N.accountModal = () => {
    const u = N.user();
    N.modal({ title: 'My account', body: `<div class="row mb-2">${N.avatar(u.name, null, 'lg')}<div><h3 class="mb-0">${esc(u.name)}</h3><div class="muted">${esc(u.email)}</div>${N.badge(u.role, 'navy')}</div></div>${N.dl([['Organisation', esc(u.org || '—')], ['Multi-factor authentication', N.badge('Enabled')], ['Session expires', 'After 30 minutes of inactivity'], ['Last password change', N.fmt.date(N.addDays(N.today(), -41))]])}`, buttons: [{ label: 'Change password', cls: 'btn-outline', onClick: () => { N.toast('Password change email sent (demo).', 'info'); } }, { label: 'Close' }] });
  };
  N.loginHistoryModal = () => {
    const rows = N.db.all('loginHistory').slice(0, 12);
    N.modal({ title: 'Login history', size: 'lg', body: `<div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Result</th><th>IP address</th><th>Device</th><th>MFA</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${N.fmt.dateTime(r.ts)}</td><td>${N.badge(r.result)}</td><td class="mono">${esc(r.ip)}</td><td>${esc(r.device)}</td><td>${r.mfa ? N.badge('Verified') : '—'}</td></tr>`).join('')}</tbody></table></div>` });
  };

  /* ----------------------------- global search ------------------------- */
  function initSearch(box, portal) {
    const inp = N.$('input', box), res = N.$('.gs-results', box);
    if (portal === 'seafarer') { box.style.visibility = 'hidden'; return; }
    document.addEventListener('keydown', (e) => { if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); inp.focus(); } });
    const run = () => {
      const q = inp.value.trim().toLowerCase(); if (q.length < 2) { res.classList.remove('open'); return; }
      const groups = N.globalSearch(q, portal);
      res.innerHTML = groups.length ? groups.map((g) => `<div class="gs-group">${esc(g.label)}</div>${g.items.slice(0, 5).map((i) => `<a class="gs-item" href="${i.href}">${N.ico(g.icon)}<div><div style="font-weight:600">${esc(i.title)}</div><div class="muted small">${esc(i.sub || '')}</div></div></a>`).join('')}`).join('') : `<div class="empty small">No results for “${esc(q)}”.</div>`;
      res.classList.add('open'); N.icons(res);
    };
    inp.addEventListener('input', N.debounce(run, 120));
    inp.addEventListener('focus', run);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const a = N.$('.gs-item', res); if (a) location.href = a.href; } if (e.key === 'Escape') { res.classList.remove('open'); inp.blur(); } });
    document.addEventListener('click', (e) => { if (!box.contains(e.target)) res.classList.remove('open'); });
  }
  N.globalSearch = (q, portal) => {
    const m = (...s) => s.join(' ').toLowerCase().includes(q);
    const vesselOnly = portal === 'vessel' ? N.user().vessel : null;
    const crewHref = (c) => portal === 'vessel' ? N.url(P('vessel-portal/crew'), { id: c.id }) : N.url(P('crew/profile'), { id: c.id });
    const groups = [];
    const crew = N.db.all('crew').filter((c) => (!vesselOnly || c.vesselId === vesselOnly) && m(c.givenName, c.surname, c.code, c.rank, c.nationality));
    groups.push({ label: 'Crew', icon: 'user', items: crew.map((c) => ({ title: `${c.givenName} ${c.surname}`, sub: `${c.code} · ${c.rank} · ${c.status}`, href: crewHref(c) })) });
    if (portal !== 'vessel') groups.push({ label: 'Vessels', icon: 'ship', items: N.db.all('vessels').filter((v) => m(v.name, v.imo, v.type, v.flag)).map((v) => ({ title: v.name, sub: `IMO ${v.imo} · ${v.type}`, href: N.url(P('vessels/profile'), { id: v.id }) })) });
    groups.push({ label: 'Voyages', icon: 'route', items: N.db.all('voyages').filter((v) => (!vesselOnly || v.vesselId === vesselOnly) && m(v.ref, v.from, v.to, N.vesselName(v.vesselId))).map((v) => ({ title: v.ref, sub: `${v.from} → ${v.to} · ${v.status}`, href: portal === 'vessel' ? N.url(P('vessel-portal/voyage')) : N.url(P('voyages/detail'), { id: v.id }) })) });
    if (portal === 'app' || portal === 'platform') {
      groups.push({ label: 'Applications', icon: 'file-user', items: N.db.all('applications').filter((a) => m(a.ref, a.candidate, a.rank)).map((a) => ({ title: a.candidate, sub: `${a.ref} · ${a.rank} · ${a.status}`, href: N.url(P('recruitment/evaluation'), { id: a.id }) })) });
      groups.push({ label: 'Documents', icon: 'file-badge', items: N.db.all('certificates').filter((d) => m(d.name, d.number)).map((d) => ({ title: d.name, sub: `${d.number} · ${N.crewName(d.crewId)}`, href: N.url(P('crew/profile'), { id: d.crewId }) + '#certificates' })).concat(N.db.all('travelDocs').filter((d) => m(d.docType, d.number)).map((d) => ({ title: d.docType, sub: `${d.number} · ${N.crewName(d.crewId)}`, href: N.url(P('crew/profile'), { id: d.crewId }) + '#travel' }))) });
      groups.push({ label: 'Welfare cases', icon: 'heart-handshake', items: N.db.all('welfareRequests').filter((w) => m(w.ref, w.subject, w.category)).map((w) => ({ title: w.subject, sub: `${w.ref} · ${w.status}`, href: N.url(P('welfare/case'), { type: 'request', id: w.id }) })).concat(N.db.all('incidents').filter((w) => m(w.ref, w.category, w.description)).map((w) => ({ title: w.ref + ' · ' + w.category, sub: w.status, href: N.url(P('welfare/case'), { type: 'incident', id: w.id }) }))) });
      groups.push({ label: 'Training courses', icon: 'graduation-cap', items: N.db.all('courses').filter((c) => m(c.name, c.code, c.category)).map((c) => ({ title: c.name, sub: `${c.code} · ${c.category}`, href: N.url(P('training/courses'), { q: c.code }) })) });
    }
    return groups.filter((g) => g.items.length);
  };

  /* ----------------------------- offline indicator (vessel) ------------ */
  N.isOffline = () => N.db.getKey('vesselOffline', false);
  N.netPill = (pill) => {
    const draw = () => { const off = N.isOffline(); pill.classList.toggle('off', off); N.$('span', pill).textContent = off ? 'Offline mode' : 'Online'; pill.title = 'Demo: click to simulate connectivity loss / restore'; };
    pill.onclick = () => { N.db.set('vesselOffline', !N.isOffline()); draw(); N.toast(N.isOffline() ? 'Connectivity lost. Records will be saved to the secure offline queue.' : 'Connection restored. Open the Sync Centre to synchronise queued records.', N.isOffline() ? 'warning' : 'info'); document.dispatchEvent(new Event('nyo-net')); };
    draw();
  };

  /* ----------------------------- lookups -------------------------------- */
  N.crew = (id) => N.db.get('crew', id);
  N.crewName = (id) => { const c = N.crew(id); return c ? `${c.givenName} ${c.surname}` : '—'; };
  N.vesselName = (id) => { const v = N.db.get('vessels', id); return v ? v.name : '—'; };
  N.crewOptions = (f) => N.db.all('crew').filter(f || (() => true)).map((c) => ({ value: c.id, label: `${c.givenName} ${c.surname} · ${c.rank} (${c.code})` }));
  N.vesselOptions = () => N.db.all('vessels').map((v) => ({ value: v.id, label: v.name }));
  N.crewLink = (id) => { const c = N.crew(id); if (!c) return '—'; return N.person(`${c.givenName} ${c.surname}`, `${c.code} · ${c.rank}`, c.photo && c.photo.data, N.url(P('crew/profile'), { id })); };
})();
