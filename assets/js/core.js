/* =========================================================================
   NYOVARA FRONTEND CORE
   Demo store · utilities · UI components · layout shell · page router
   DEMONSTRATION ONLY: persistence is browser localStorage; authentication,
   authorisation and all compliance/financial calculations are re-implemented
   server-side in the ASP.NET Core phase. Never trust these checks in production.
   ========================================================================= */
(function () {
  'use strict';
  const N = (window.N = window.N || {});
  const body = document.body;
  N.root = (body && body.dataset.root) || '';
  N.route = (body && body.dataset.route) || '';
  N.params = new URLSearchParams(location.search);
  N.pages = {};
  N.page = (name, fn) => { N.pages[name] = fn; };

  /* ----------------------------- utilities ----------------------------- */
  const esc = (N.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  N.url = (path, params) => {
    let u = N.root + path;
    if (params) { const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '')); const s = q.toString(); if (s) u += '?' + s; }
    return u;
  };
  N.go = (path, params) => { location.href = N.url(path, params); };
  N.$ = (sel, el) => (el || document).querySelector(sel);
  N.$$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  N.h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  N.icons = (root) => {
    if (!window.lucide) return;
    N.$$('i[data-lucide]', root).forEach((el) => {
      const name = el.getAttribute('data-lucide');
      const key = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
      const node = lucide.icons[key] || lucide.icons.Circle;
      try { const svg = lucide.createElement(node); svg.setAttribute('data-lucide', name); svg.setAttribute('aria-hidden', 'true'); if (el.getAttribute('class')) el.getAttribute('class').split(' ').filter(Boolean).forEach((c) => svg.classList.add(c)); el.replaceWith(svg); } catch (e) {}
    });
  };
  N.ico = (name, cls) => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ''}></i>`;
  N.uid = () => Math.random().toString(36).slice(2, 10);
  N.today = () => N.isoDate(new Date());
  N.isoDate = (d) => { d = new Date(d); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  N.addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return N.isoDate(d); };
  N.daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  N.MONTHS = MONTHS;
  N.fmt = {
    date(v) { if (!v) return '—'; const d = new Date(String(v).length === 10 ? v + 'T00:00:00' : v); if (isNaN(d)) return esc(v); return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; },
    dateTime(v) { if (!v) return '—'; const d = new Date(v); if (isNaN(d)) return esc(v); return `${N.fmt.date(N.isoDate(d))}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; },
    money(v, cur) { if (v == null || v === '') return '—'; return (cur ? cur + ' ' : '') + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    num(v, d) { return v == null || v === '' ? '—' : Number(v).toLocaleString('en-US', { maximumFractionDigits: d == null ? 1 : d }); },
    rel(v) { const s = (Date.now() - new Date(v)) / 1000; if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago'; if (s < 86400 * 30) return Math.floor(s / 86400) + 'd ago'; return N.fmt.date(N.isoDate(v)); },
    hours(min) { const h = min / 60; return (Math.round(h * 10) / 10).toString() + 'h'; },
    bytes(b) { if (!b) return ''; return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.ceil(b / 1024) + ' KB'; }
  };
  N.initials = (name) => String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  N.avatar = (name, photo, cls) => photo ? `<img class="avatar ${cls || ''}" src="${esc(photo)}" alt="">` : `<span class="avatar ${cls || ''}" style="background:${N.hue(name)}">${esc(N.initials(name))}</span>`;
  N.hue = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h},55%,90%);color:hsl(${h},50%,32%)`; };
  N.person = (name, sub, photo, href) => `<div class="person">${N.avatar(name, photo)}<div><div class="nm">${href ? `<a href="${href}">${esc(name)}</a>` : esc(name)}</div>${sub ? `<div class="sub">${esc(sub)}</div>` : ''}</div></div>`;
  N.debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms || 200); }; };
  N.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  N.age = (dob) => { if (!dob) return ''; const d = new Date(dob), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--; return a; };
  N.sum = (arr, f) => arr.reduce((s, x) => s + (Number(typeof f === 'function' ? f(x) : x[f]) || 0), 0);
  N.groupCount = (arr, f) => { const m = {}; arr.forEach((x) => { const k = (typeof f === 'function' ? f(x) : x[f]) || 'Unspecified'; m[k] = (m[k] || 0) + 1; }); return m; };
  N.expiryStatus = (exp, active, days) => {
    if (active === false) return 'Inactive';
    if (!exp) return 'Pending Verification';
    const d = N.daysBetween(N.today(), exp);
    if (d < 0) return 'Expired';
    if (d <= (days || 90)) return 'Expiring Soon';
    return 'Valid';
  };

  /* ----------------------------- demo store ---------------------------- */
  const KEY = 'nyovara.demo.v1';
  let mem = null, lsOk = true;
  function load() {
    if (mem) return mem;
    try { const raw = localStorage.getItem(KEY); if (raw) mem = JSON.parse(raw); } catch (e) { lsOk = false; }
    if (!mem) { mem = N.seed ? N.seed() : {}; persist(); }
    return mem;
  }
  function persist() { if (!lsOk) return; try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { console.warn('Demo storage full / unavailable', e); } }
  N.db = {
    all(c) { const d = load(); return (d[c] = d[c] || []); },
    get(c, id) { return N.db.all(c).find((x) => String(x.id) === String(id)); },
    where(c, f) { return N.db.all(c).filter(f); },
    nextRef(prefix, c) { const n = N.db.all(c).length + 1001 + Math.floor(Math.random() * 9); return `${prefix}-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`; },
    save(c, obj, opts) {
      const list = N.db.all(c); opts = opts || {};
      let before = null;
      if (obj.id && list.find((x) => x.id === obj.id)) {
        const i = list.findIndex((x) => x.id === obj.id); before = { ...list[i] };
        list[i] = { ...list[i], ...obj, updatedOn: new Date().toISOString(), updatedBy: N.user().name };
        obj = list[i];
      } else {
        obj = { id: obj.id || c.slice(0, 3) + '_' + N.uid(), createdOn: new Date().toISOString(), createdBy: N.user().name, ...obj };
        list.unshift(obj);
      }
      if (!opts.silent && c !== 'audit') N.audit(before ? 'Record modified' : 'Record created', c, obj, before);
      persist(); return obj;
    },
    remove(c, id) { const d = load(); const before = N.db.get(c, id); d[c] = N.db.all(c).filter((x) => String(x.id) !== String(id)); N.audit('Record deleted', c, before || { id }); persist(); },
    set(key, val) { load()[key] = val; persist(); },
    getKey(key, def) { const d = load(); return d[key] === undefined ? def : d[key]; },
    reset() { try { localStorage.removeItem(KEY); localStorage.removeItem('nyovara.session'); } catch (e) {} mem = null; },
    persist
  };
  N.audit = (action, entity, rec, before) => {
    const changed = before ? Object.keys(rec).filter((k) => !['updatedOn', 'updatedBy'].includes(k) && JSON.stringify(rec[k]) !== JSON.stringify(before[k])) : [];
    const entry = { id: 'aud_' + N.uid(), ts: new Date().toISOString(), user: N.user().name, org: N.user().org || 'Atlantic Meridian Shipmanagement', action, entity, ref: rec && (rec.ref || rec.code || rec.name || rec.id), ip: '10.20.4.' + (20 + Math.floor(Math.random() * 40)), changes: changed.slice(0, 6).map((k) => ({ field: k, from: before && before[k], to: rec[k] })) };
    const list = N.db.all('audit'); list.unshift(entry); if (list.length > 600) list.length = 600;
  };
  N.activity = (entity, refId, title, tone) => { N.db.all('activity').unshift({ id: 'act_' + N.uid(), entity, refId, title, tone: tone || '', ts: new Date().toISOString(), user: N.user().name }); N.db.persist(); };
  N.notify = (title, bodyTxt, opts) => { N.db.all('notifications').unshift({ id: 'ntf_' + N.uid(), title, body: bodyTxt, ts: new Date().toISOString(), read: false, icon: (opts && opts.icon) || 'bell', link: (opts && opts.link) || '', portal: (opts && opts.portal) || 'app' }); N.db.persist(); };
  N.ref = (key) => (N.db.getKey('reference', {})[key] || []).filter((x) => x.active !== false).map((x) => x.name);

  /* ----------------------------- session -------------------------------- */
  N.users = {
    app: { name: 'Adaeze Okafor', email: 'admin@atlanticmeridian.com', role: 'Organisation Administrator', org: 'Atlantic Meridian Shipmanagement', portal: 'app', perms: ['*'] },
    vessel: { name: 'Capt. Marek Kowalski', email: 'master.aurora@atlanticmeridian.com', role: 'Vessel Master', org: 'Atlantic Meridian Shipmanagement', portal: 'vessel', vessel: 'ves_1', perms: ['crew.view', 'resthours.*', 'welfare.report', 'voyages.view'] },
    seafarer: { name: 'Emmanuel Adeyemi', email: 'e.adeyemi@mail.com', role: 'Seafarer', portal: 'seafarer', crewId: 'crw_1', perms: ['self'] },
    platform: { name: 'Tunde Bakare', email: 'ops@nyotacoreltd.com', role: 'Platform Administrator', org: 'NyotaCore Solutions & Services', portal: 'platform', perms: ['platform.*'] }
  };
  N.user = () => {
    let s = null; try { s = JSON.parse(localStorage.getItem('nyovara.session') || 'null'); } catch (e) {}
    const portal = (body && body.dataset.portal) || 'app';
    if (s && s.portal === portal) return s;
    return N.users[portal] || N.users.app;
  };
  N.setSession = (u) => { try { localStorage.setItem('nyovara.session', JSON.stringify(u)); } catch (e) {} };
  N.can = (perm) => { const p = N.user().perms || []; if (p.includes('*')) return true; return p.some((x) => x === perm || (x.endsWith('.*') && perm.startsWith(x.slice(0, -1)))); };
  N.viewRole = () => N.db.getKey('viewAsRole', null);

  /* ----------------------------- status badges ------------------------- */
  const TONE = {
    success: ['Active', 'Valid', 'Approved', 'Compliant', 'Completed', 'Resolved', 'Closed', 'Paid', 'Verified', 'Published', 'Onboard', 'Employed', 'Selected', 'Fit', 'Fit for Duty', 'Passed', 'Signed On', 'Reimbursed', 'Locked', 'Synced', 'Online', 'Healthy', 'Underway', 'Present', 'Enabled', 'Yes', 'Submitted & Synced'],
    info: ['Available', 'Submitted', 'Planned', 'Scheduled', 'In Progress', 'Under Review', 'Received', 'Assigned', 'Interview', 'Enrolled', 'Open', 'In Port', 'Trial', 'Calculated', 'Processing', 'Shortlisted', 'Sent', 'Corrected'],
    warning: ['Expiring Soon', 'Pending', 'Pending Review', 'Pending Approval', 'Pending Verification', 'Awaiting Information', 'Draft', 'On Leave', 'Delayed', 'Escalated', 'Correction Requested', 'Overdue', 'Fit with Restrictions', 'Queued', 'Missing Records', 'Under Investigation', 'Outstanding', 'Unpublished', 'Proposed', 'Suspended', 'Partially Paid'],
    danger: ['Expired', 'Rejected', 'Terminated', 'Blacklisted', 'Potential Non-Compliance', 'Urgent', 'Critical', 'Cancelled', 'Unfit', 'Failed', 'Disabled', 'Conflict', 'High', 'Withdrawn', 'Not Recommended'],
    purple: ['Approved Exception', 'Confidential', 'Anonymous', 'Interviewing', 'Sign-off Due'],
    muted: ['Inactive', 'Archived', 'Unlocked', 'Medium', 'Low', 'No', 'Not Started', 'Offline Draft']
  };
  const toneMap = {}; Object.entries(TONE).forEach(([t, arr]) => arr.forEach((s) => (toneMap[s.toLowerCase()] = t)));
  N.badge = (s, tone) => { if (s == null || s === '') return '<span class="muted">—</span>'; const t = tone || toneMap[String(s).toLowerCase()] || 'navy'; return `<span class="badge b-${t}">${esc(s)}</span>`; };

  /* ----------------------------- toasts --------------------------------- */
  N.toast = (msg, type, title) => {
    let box = N.$('.toasts'); if (!box) { box = N.h('<div class="toasts" role="status" aria-live="polite"></div>'); document.body.appendChild(box); }
    type = type || 'success';
    const ic = { success: 'check-circle-2', error: 'alert-octagon', warning: 'alert-triangle', info: 'info' }[type] || 'info';
    const t = N.h(`<div class="toast ${type}">${N.ico(ic)}<div>${title ? `<div class="t-title">${esc(title)}</div>` : ''}${esc(msg)}</div></div>`);
    box.appendChild(t); N.icons(); setTimeout(() => { t.style.transition = '.3s'; t.style.opacity = 0; setTimeout(() => t.remove(), 300); }, 3600);
  };

  /* ----------------------------- modals --------------------------------- */
  N.modal = (o) => {
    const bd = N.h(`<div class="modal-backdrop"><div class="modal ${o.size || ''}" role="dialog" aria-modal="true"><div class="modal-head"><h3>${esc(o.title || '')}</h3><button class="btn btn-ghost btn-icon" data-x aria-label="Close">${N.ico('x')}</button></div><div class="modal-body"></div>${o.foot === false ? '' : '<div class="modal-foot"></div>'}</div></div>`);
    const mb = N.$('.modal-body', bd); if (typeof o.body === 'string') mb.innerHTML = o.body; else if (o.body) mb.appendChild(o.body);
    const close = () => { bd.remove(); document.removeEventListener('keydown', onKey); o.onClose && o.onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    N.$('[data-x]', bd).onclick = close;
    bd.addEventListener('mousedown', (e) => { if (e.target === bd && !o.sticky) close(); });
    const foot = N.$('.modal-foot', bd);
    if (foot) (o.buttons || [{ label: 'Close', cls: 'btn-outline', onClick: close }]).forEach((b) => {
      const btn = N.h(`<button class="btn ${b.cls || 'btn-primary'}">${b.icon ? N.ico(b.icon) : ''}${esc(b.label)}</button>`);
      btn.onclick = async () => { if (b.onClick) { const r = await b.onClick(btn, close); if (r === false) return; } if (b.close !== false && !b.keepOpen) close(); };
      foot.appendChild(btn);
    });
    document.body.appendChild(bd); N.icons();
    const f = N.$('input,select,textarea', mb); if (f && !o.noFocus) setTimeout(() => f.focus(), 50);
    return { el: bd, body: mb, close };
  };
  N.confirm = (o) => new Promise((res) => {
    o = typeof o === 'string' ? { msg: o } : o;
    let reasonEl;
    const b = N.h(`<div class="text-center"><div class="confirm-ico ${o.danger === false ? 'info' : ''}">${N.ico(o.icon || (o.danger === false ? 'help-circle' : 'alert-triangle'))}</div><h3>${esc(o.title || 'Are you sure?')}</h3><p class="muted">${esc(o.msg || '')}</p>${o.reason ? `<div class="field" style="text-align:left"><label>${esc(o.reasonLabel || 'Reason')} <span class="req">*</span></label><textarea class="input" rows="3"></textarea><span class="err">Please provide a reason.</span></div>` : ''}</div>`);
    reasonEl = N.$('textarea', b);
    N.modal({ title: '', body: b, size: 'sm', onClose: () => res(false), buttons: [
      { label: 'Cancel', cls: 'btn-outline' },
      { label: o.ok || 'Confirm', cls: o.danger === false ? 'btn-primary' : 'btn-danger', onClick: (btn, close) => {
        if (reasonEl && !reasonEl.value.trim()) { reasonEl.closest('.field').classList.add('invalid'); return false; }
        const v = reasonEl ? reasonEl.value.trim() : true; o.onClose = null; res(v); close = null; return true;
      } }
    ] });
  });

  /* ----------------------------- dropdowns ------------------------------ */
  document.addEventListener('click', (e) => {
    const tog = e.target.closest('[data-dd]');
    N.$$('.dd.open').forEach((d) => { if (!tog || d !== tog.closest('.dd')) d.classList.remove('open'); });
    if (tog) { e.preventDefault(); tog.closest('.dd').classList.toggle('open'); }
    else if (!e.target.closest('.dd-menu')) N.$$('.dd.open').forEach((d) => d.classList.remove('open'));
    if (e.target.closest('.dd-menu a, .dd-menu button')) N.$$('.dd.open').forEach((d) => d.classList.remove('open'));
  });
  N.menu = (items, btnHtml, cls) => {
    const el = N.h(`<div class="dd ${cls || ''}"><button class="btn btn-ghost btn-sm btn-icon" data-dd aria-label="More actions">${btnHtml || N.ico('more-horizontal')}</button><div class="dd-menu"></div></div>`);
    const m = N.$('.dd-menu', el);
    items.filter((i) => i && !i.hidden).forEach((i) => {
      if (i === '-' || i.sep) { m.appendChild(document.createElement('hr')); return; }
      const b = i.href ? N.h(`<a href="${i.href}">${i.icon ? N.ico(i.icon) : ''}${esc(i.label)}</a>`) : N.h(`<button type="button" class="${i.danger ? 'danger' : ''}">${i.icon ? N.ico(i.icon) : ''}${esc(i.label)}</button>`);
      if (i.onClick) b.addEventListener('click', (e) => { e.preventDefault(); i.onClick(); });
      m.appendChild(b);
    });
    return el;
  };

  /* ----------------------------- tabs ----------------------------------- */
  N.tabs = (container, tabs, opts) => {
    opts = opts || {};
    const el = N.h(`<div><div class="tabs" role="tablist"></div><div class="tab-panels" style="padding-top:${opts.pad == null ? 18 : opts.pad}px"></div></div>`);
    const bar = N.$('.tabs', el), panels = N.$('.tab-panels', el);
    const rendered = {};
    tabs.forEach((t, i) => {
      const b = N.h(`<button class="tab" role="tab" data-k="${t.key}">${t.icon ? N.ico(t.icon) : ''}${esc(t.label)}${t.count != null ? `<span class="count">${t.count}</span>` : ''}</button>`);
      const p = N.h(`<div class="tab-panel" data-k="${t.key}"></div>`);
      bar.appendChild(b); panels.appendChild(p);
      b.onclick = () => activate(t.key);
    });
    function activate(k) {
      N.$$('.tab', bar).forEach((b) => b.classList.toggle('active', b.dataset.k === k));
      N.$$('.tab-panel', panels).forEach((p) => p.classList.toggle('active', p.dataset.k === k));
      const t = tabs.find((x) => x.key === k); const p = N.$(`.tab-panel[data-k="${k}"]`, panels);
      if (t && (!rendered[k] || t.always)) { p.innerHTML = ''; t.render(p); rendered[k] = true; N.icons(); }
      if (opts.hash) history.replaceState(null, '', '#' + k);
      opts.onChange && opts.onChange(k);
    }
    container.appendChild(el);
    const start = (opts.hash && location.hash.slice(1)) || opts.active || tabs[0].key;
    activate(tabs.find((t) => t.key === start) ? start : tabs[0].key);
    return { activate, rerender: (k) => { rendered[k] = false; activate(k); } };
  };

  /* ----------------------------- export --------------------------------- */
  const download = (name, content, mime) => { const b = new Blob([content], { type: mime }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
  const plain = (html) => { const d = document.createElement('div'); d.innerHTML = html == null ? '' : String(html); return d.textContent.trim(); };
  N.exportRows = (format, name, cols, rows, title) => {
    const head = cols.map((c) => c.label);
    const vals = rows.map((r) => cols.map((c) => plain(c.exportVal ? c.exportVal(r) : c.render ? c.render(r) : r[c.key])));
    const stamp = N.today();
    if (format === 'csv') { const csv = [head, ...vals].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n'); download(`${name}-${stamp}.csv`, '﻿' + csv, 'text/csv'); }
    else if (format === 'xls') { const t = `<html><head><meta charset="utf-8"></head><body><table border="1"><tr>${head.map((h) => `<th style="background:#102B46;color:#fff">${esc(h)}</th>`).join('')}</tr>${vals.map((r) => `<tr>${r.map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table></body></html>`; download(`${name}-${stamp}.xls`, t, 'application/vnd.ms-excel'); }
    else { N.printReport(title || name, `<table class="table"><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${vals.map((r) => `<tr>${r.map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`); }
    N.audit('Export (' + format.toUpperCase() + ')', 'reports', { ref: name }); N.db.persist();
    if (format !== 'pdf') N.toast(`${rows.length} records exported to ${format === 'csv' ? 'CSV' : 'Excel'}.`, 'success', 'Export ready');
  };
  N.reportHeader = (title, sub) => `<div class="rp-head"><div><img src="${N.root}assets/images/logo.png" alt="Nyovara"><div class="muted small" style="margin-top:6px">${esc(N.user().org || 'Atlantic Meridian Shipmanagement')}</div></div><div class="text-right"><h3 style="margin:0">${esc(title)}</h3><div class="muted small">${esc(sub || '')}</div><div class="muted small">Generated ${N.fmt.dateTime(new Date())} by ${esc(N.user().name)}</div></div></div>`;
  N.printReport = (title, html, sub) => {
    const w = window.open('', '_blank');
    if (!w) { N.toast('Allow pop-ups to print / save as PDF.', 'warning'); return; }
    w.document.write(`<!doctype html><html><head><title>${esc(title)}</title><link rel="stylesheet" href="${new URL(N.root + 'assets/css/nyovara.css', location.href).href}"><style>body{background:#fff;padding:24px}.report-paper{box-shadow:none;border:0;padding:0}@page{margin:14mm}</style></head><body><div class="report-paper">${N.reportHeader(title, sub).replace(/src="[^"]*logo.png"/, `src="${new URL(N.root + 'assets/images/logo.png', location.href).href}"`)}${html}<p class="muted small" style="margin-top:20px">Nyovara demonstration report — confidential. Generated from prototype demonstration data.</p></div><script>setTimeout(()=>window.print(),400)<\/script></body></html>`);
    w.document.close();
  };

  /* ----------------------------- data table ----------------------------- */
  N.table = (container, cfg) => {
    const q0 = cfg.q != null ? cfg.q : (N.params.get('q') || '');
    const st = { q: q0.toLowerCase(), f: { ...(cfg.preset || {}) }, sort: cfg.sort || null, dir: cfg.dir || 'asc', page: 1, size: cfg.pageSize || 10, sel: new Set() };
    const card = N.h(`<div class="card dt">${cfg.title ? `<div class="card-head"><h3>${esc(cfg.title)}</h3><div class="row dt-head-r"></div></div>` : ''}<div class="toolbar"></div><div class="table-wrap"><table class="table"><thead></thead><tbody></tbody></table></div><div class="pager"></div></div>`);
    const tb = N.$('.toolbar', card), thead = N.$('thead', card), tbody = N.$('tbody', card), pager = N.$('.pager', card);
    if (cfg.search !== false) {
      const s = N.h(`<div class="input-icon search">${N.ico('search')}<input class="input" type="search" placeholder="${esc(cfg.searchPlaceholder || 'Search…')}" aria-label="Search" value="${esc(q0)}"></div>`);
      N.$('input', s).addEventListener('input', N.debounce((e) => { st.q = e.target.value.toLowerCase(); st.page = 1; render(); }, 150));
      tb.appendChild(s);
    }
    (cfg.filters || []).forEach((f) => {
      const opts = typeof f.options === 'function' ? f.options() : f.options;
      const sel = N.h(`<select class="input" aria-label="${esc(f.label)}"><option value="">${esc(f.label)}: All</option>${opts.map((o) => { const v = typeof o === 'object' ? o.value : o, l = typeof o === 'object' ? o.label : o; return `<option value="${esc(v)}">${esc(l)}</option>`; }).join('')}</select>`);
      if (st.f[f.key]) sel.value = st.f[f.key];
      sel.onchange = () => { st.f[f.key] = sel.value; st.page = 1; render(); };
      tb.appendChild(sel);
    });
    const spacer = N.h('<div class="grow"></div>'); tb.appendChild(spacer);
    const bulkBox = N.h('<div class="row bulk hidden"></div>'); tb.appendChild(bulkBox);
    if (cfg.export !== false) {
      tb.appendChild(N.menu([
        { label: 'Export CSV', icon: 'file-text', onClick: () => N.exportRows('csv', cfg.exportName || 'nyovara-export', visCols(), filtered()) },
        { label: 'Export Excel', icon: 'file-spreadsheet', onClick: () => N.exportRows('xls', cfg.exportName || 'nyovara-export', visCols(), filtered()) },
        { label: 'PDF / Print', icon: 'printer', onClick: () => N.exportRows('pdf', cfg.exportName || 'nyovara-export', visCols(), filtered(), cfg.title || cfg.exportTitle) }
      ], `${N.ico('download')}`, 'export-dd'));
      N.$('.export-dd [data-dd]', tb).className = 'btn btn-outline btn-sm'; N.$('.export-dd [data-dd]', tb).insertAdjacentHTML('beforeend', 'Export');
    }
    (cfg.buttons || []).forEach((b) => { if (b.hidden) return; const btn = N.h(`<button class="btn ${b.cls || 'btn-primary'} btn-sm">${b.icon ? N.ico(b.icon) : ''}${esc(b.label)}</button>`); btn.onclick = () => b.onClick(api); tb.appendChild(btn); });
    container.appendChild(card);
    const visCols = () => cfg.columns.filter((c) => !c.noExport && c.label);
    function filtered() {
      let rows = (typeof cfg.data === 'function' ? cfg.data() : cfg.data).slice();
      if (st.q) rows = rows.filter((r) => (cfg.searchFn ? cfg.searchFn(r) : cfg.columns.map((c) => plain(c.render ? c.render(r) : r[c.key])).join(' ') + ' ' + (cfg.searchExtra ? cfg.searchExtra(r) : '')).toLowerCase().includes(st.q));
      (cfg.filters || []).forEach((f) => { const v = st.f[f.key]; if (v) rows = rows.filter((r) => (f.match ? f.match(r, v) : String(r[f.key]) === v)); });
      if (st.sort) {
        const col = cfg.columns.find((c) => c.key === st.sort) || { key: st.sort };
        const g = col.sortVal || ((r) => r[col.key]);
        rows.sort((a, b) => { let x = g(a), y = g(b); if (x == null) x = ''; if (y == null) y = ''; const n = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true }); return st.dir === 'asc' ? n : -n; });
      }
      return rows;
    }
    function render() {
      const rows = filtered(); const pages = Math.max(1, Math.ceil(rows.length / st.size)); if (st.page > pages) st.page = pages;
      const slice = rows.slice((st.page - 1) * st.size, st.page * st.size);
      thead.innerHTML = `<tr>${cfg.bulk ? '<th style="width:36px"><input type="checkbox" class="sel-all" aria-label="Select all"></th>' : ''}${cfg.columns.map((c) => `<th class="${c.sort === false ? '' : 'sortable'} ${c.cls || ''}" data-k="${c.key || ''}">${esc(c.label || '')}${st.sort === c.key ? `<span class="sort-ind">${st.dir === 'asc' ? '▲' : '▼'}</span>` : ''}</th>`).join('')}${cfg.actions ? '<th class="text-right">Actions</th>' : ''}</tr>`;
      N.$$('th.sortable', thead).forEach((th) => (th.onclick = () => { const k = th.dataset.k; if (!k) return; st.dir = st.sort === k && st.dir === 'asc' ? 'desc' : 'asc'; st.sort = k; render(); }));
      tbody.innerHTML = '';
      if (!slice.length) tbody.innerHTML = `<tr><td colspan="99"><div class="empty"><div class="ico">${N.ico(cfg.emptyIcon || 'inbox')}</div><b>${esc(cfg.emptyText || 'No records found')}</b><div class="small">Try adjusting the search or filters.</div></div></td></tr>`;
      slice.forEach((r) => {
        const tr = document.createElement('tr');
        tr.innerHTML = (cfg.bulk ? `<td><input type="checkbox" class="sel" ${st.sel.has(r.id) ? 'checked' : ''} aria-label="Select row"></td>` : '') + cfg.columns.map((c) => `<td class="${c.cls || ''}${c.nowrap ? ' nowrap' : ''}">${c.render ? c.render(r) : esc(r[c.key] == null ? '—' : r[c.key])}</td>`).join('');
        if (cfg.actions) {
          const td = document.createElement('td'); const wrap = N.h('<div class="actions"></div>');
          const acts = cfg.actions(r).filter((a) => a && !a.hidden);
          const prim = acts.filter((a) => a.primary); const rest = acts.filter((a) => !a.primary);
          prim.forEach((a) => { const b = a.href ? N.h(`<a class="btn btn-ghost btn-sm btn-icon" title="${esc(a.label)}" href="${a.href}">${N.ico(a.icon || 'eye')}</a>`) : N.h(`<button class="btn btn-ghost btn-sm btn-icon" title="${esc(a.label)}">${N.ico(a.icon || 'eye')}</button>`); if (a.onClick) b.onclick = (e) => { e.stopPropagation(); a.onClick(r); }; wrap.appendChild(b); });
          if (rest.length) wrap.appendChild(N.menu(rest.map((a) => (a === '-' ? '-' : { ...a, onClick: a.onClick ? () => a.onClick(r) : null }))));
          td.appendChild(wrap); tr.appendChild(td);
        }
        if (cfg.onRowClick) { tr.style.cursor = 'pointer'; tr.addEventListener('click', (e) => { if (e.target.closest('a,button,input,.dd')) return; cfg.onRowClick(r); }); }
        const cb = N.$('.sel', tr); if (cb) cb.onchange = () => { cb.checked ? st.sel.add(r.id) : st.sel.delete(r.id); bulkUi(); };
        tbody.appendChild(tr);
      });
      const sa = N.$('.sel-all', thead); if (sa) { sa.checked = slice.length && slice.every((r) => st.sel.has(r.id)); sa.onchange = () => { slice.forEach((r) => (sa.checked ? st.sel.add(r.id) : st.sel.delete(r.id))); render(); bulkUi(); }; }
      const from = rows.length ? (st.page - 1) * st.size + 1 : 0;
      pager.innerHTML = `<div class="row" style="gap:8px">Showing <b>${from}–${Math.min(st.page * st.size, rows.length)}</b> of <b>${rows.length}</b><select class="input" style="height:30px;width:auto;font-size:12px" aria-label="Rows per page">${[10, 25, 50, 100].map((n) => `<option ${n === st.size ? 'selected' : ''}>${n}</option>`).join('')}</select></div><div class="pages"></div>`;
      N.$('select', pager).onchange = (e) => { st.size = +e.target.value; st.page = 1; render(); };
      const pg = N.$('.pages', pager);
      const mk = (lbl, p, dis, act) => { const b = N.h(`<button ${dis ? 'disabled' : ''} class="${act ? 'active' : ''}">${lbl}</button>`); b.onclick = () => { st.page = p; render(); }; pg.appendChild(b); };
      mk('‹', st.page - 1, st.page === 1);
      const win = []; for (let p = 1; p <= pages; p++) if (p === 1 || p === pages || Math.abs(p - st.page) <= 1) win.push(p);
      let last = 0; win.forEach((p) => { if (p - last > 1) pg.appendChild(N.h('<span style="padding:6px">…</span>')); mk(p, p, false, p === st.page); last = p; });
      mk('›', st.page + 1, st.page === pages);
      N.icons();
      cfg.onRender && cfg.onRender(rows);
    }
    function bulkUi() {
      if (!cfg.bulk) return;
      bulkBox.innerHTML = ''; bulkBox.classList.toggle('hidden', !st.sel.size);
      if (!st.sel.size) return;
      bulkBox.appendChild(N.h(`<span class="chip">${st.sel.size} selected</span>`));
      cfg.bulk.forEach((b) => { const btn = N.h(`<button class="btn btn-outline btn-sm">${b.icon ? N.ico(b.icon) : ''}${esc(b.label)}</button>`); btn.onclick = async () => { await b.onClick([...st.sel].map((id) => (typeof cfg.data === 'function' ? cfg.data() : cfg.data).find((r) => r.id === id)).filter(Boolean)); st.sel.clear(); bulkUi(); render(); }; bulkBox.appendChild(btn); });
      N.icons();
    }
    const api = { render, el: card, state: st, rows: filtered, setFilter: (k, v) => { st.f[k] = v; render(); } };
    render();
    return api;
  };

  /* ----------------------------- form builder --------------------------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^\+?[0-9 ()\-]{7,20}$/;
  N.form = (container, fields, values, opts) => {
    opts = opts || {}; values = { ...(values || {}) };
    const el = N.h(`<form class="form-grid ${opts.cols === 3 ? 'cols-3' : ''}" novalidate autocomplete="off"></form>`);
    const files = {};
    const canRestricted = N.can('crew.restricted') || N.can('*');
    fields.forEach((f) => {
      if (f.section) { el.appendChild(N.h(`<div class="full fieldset-title" style="margin:${el.children.length ? '10px' : '0'} 0 -4px">${f.icon ? N.ico(f.icon) : ''}${esc(f.section)}</div>`)); return; }
      if (f.html) { el.appendChild(N.h(`<div class="full">${f.html}</div>`)); return; }
      const v = values[f.k] != null ? values[f.k] : f.default != null ? (typeof f.default === 'function' ? f.default() : f.default) : '';
      const id = 'f_' + f.k + '_' + N.uid();
      const reqMark = f.req ? ' <span class="req">*</span>' : '<span class="req req-cond" style="display:none">*</span>';
      const restricted = f.restricted ? ' <span class="restricted-tag">Restricted</span>' : '';
      let ctl = '';
      const ro = f.readonly || (f.restricted && !canRestricted) ? 'readonly' : '';
      const ph = f.placeholder ? `placeholder="${esc(f.placeholder)}"` : '';
      const opt = () => (typeof f.options === 'function' ? f.options(values) : f.options || []);
      switch (f.type) {
        case 'select': ctl = `<select id="${id}" class="input" name="${f.k}" ${ro ? 'disabled' : ''}><option value="">${esc(f.placeholder || 'Select…')}</option>${opt().map((o) => { const ov = typeof o === 'object' ? o.value : o, ol = typeof o === 'object' ? o.label : o; return `<option value="${esc(ov)}" ${String(ov) === String(v) ? 'selected' : ''}>${esc(ol)}</option>`; }).join('')}</select>`; break;
        case 'textarea': ctl = `<textarea id="${id}" class="input" name="${f.k}" rows="${f.rows || 3}" ${ph} ${ro}>${esc(v)}</textarea>`; break;
        case 'toggle': ctl = `<label class="toggle"><input type="checkbox" name="${f.k}" ${v === true || v === 'Yes' ? 'checked' : ''} ${ro ? 'disabled' : ''}><span class="track"></span><span class="tl">${esc(f.onLabel || (v === true || v === 'Yes' ? 'Yes' : 'No'))}</span></label>`; break;
        case 'checkbox': ctl = `<label class="check"><input type="checkbox" name="${f.k}" ${v ? 'checked' : ''}><span>${f.text || ''}</span></label>`; break;
        case 'multiselect': ctl = `<div class="row" style="gap:6px">${opt().map((o) => `<label class="check" style="background:#F4F6F9;border-radius:8px;padding:6px 10px"><input type="checkbox" name="${f.k}" value="${esc(o)}" ${(Array.isArray(v) ? v : []).includes(o) ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`; break;
        case 'file': case 'image': ctl = `<div class="dropzone" tabindex="0">${N.ico(f.type === 'image' ? 'image-plus' : 'upload-cloud')}<div><b>Click to ${f.type === 'image' ? 'upload photo' : 'upload'}</b> or drag &amp; drop</div><div class="small">${esc(f.hint || (f.type === 'image' ? 'JPG or PNG, max 5 MB' : 'PDF, JPG, PNG, DOCX — max 10 MB each'))}</div><input type="file" hidden ${f.multiple ? 'multiple' : ''} accept="${esc(f.accept || (f.type === 'image' ? 'image/*' : '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx'))}"></div><div class="file-list"></div>`; break;
        case 'readonly': case 'calc': ctl = `<input id="${id}" class="input" name="${f.k}" value="${esc(v)}" readonly tabindex="-1">`; break;
        default: {
          const type = { currency: 'number', number: 'number', date: 'date', datetime: 'datetime-local', time: 'time', email: 'email', tel: 'tel', password: 'password', month: 'month' }[f.type] || 'text';
          const inp = `<input id="${id}" class="input" type="${type}" name="${f.k}" value="${esc(f.restricted && !canRestricted && v ? '••••••••' : v)}" ${ph} ${ro} ${f.min != null ? `min="${f.min}"` : ''} ${f.max != null ? `max="${f.max}"` : ''} ${f.step ? `step="${f.step}"` : f.type === 'currency' ? 'step="0.01"' : ''}>`;
          ctl = f.suffix || f.type === 'currency' ? `<div class="input-group">${inp}<span class="addon">${esc(f.suffix || values.currency || 'USD')}</span></div>` : inp;
        }
      }
      const wrap = N.h(`<div class="field ${f.span === 'full' || ['textarea', 'file', 'multiselect'].includes(f.type) && f.span !== 'half' ? 'full' : ''}" data-k="${f.k}"><label for="${id}">${esc(f.label)}${reqMark}${restricted}</label>${ctl}${f.help ? `<span class="help">${esc(f.help)}</span>` : ''}<span class="err"></span></div>`);
      el.appendChild(wrap);
      if (f.type === 'toggle') { const cb = N.$('input', wrap); cb.addEventListener('change', () => { N.$('.tl', wrap).textContent = f.onLabel || (cb.checked ? 'Yes' : 'No'); }); }
      if (f.type === 'file' || f.type === 'image') {
        files[f.k] = Array.isArray(v) ? v.slice() : v ? [v] : [];
        const dz = N.$('.dropzone', wrap), inp = N.$('input[type=file]', wrap), list = N.$('.file-list', wrap);
        const draw = () => {
          list.innerHTML = '';
          files[f.k].forEach((fi, i) => {
            const isImg = /^image\//.test(fi.type || '') || /\.(png|jpe?g|gif|webp)$/i.test(fi.name || '');
            const it = N.h(`<div class="file-item">${isImg && fi.data ? `<img class="thumb" src="${fi.data}" alt="">` : `<span class="thumb">${N.ico(isImg ? 'image' : 'file-text')}</span>`}<div class="grow"><div style="font-weight:600">${esc(fi.name)}</div><div class="muted small">${N.fmt.bytes(fi.size)} ${fi.scanned ? '· ' + N.ico('shield-check') + ' Scan passed (demo)' : ''}</div></div><button type="button" class="btn btn-ghost btn-sm" data-p>Preview</button><button type="button" class="btn btn-ghost btn-sm btn-icon" data-r aria-label="Remove">${N.ico('x')}</button></div>`);
            N.$('[data-r]', it).onclick = () => { files[f.k].splice(i, 1); draw(); };
            N.$('[data-p]', it).onclick = () => N.previewFile(fi);
            list.appendChild(it);
          });
          N.icons();
        };
        const add = async (fl) => {
          for (const file of fl) {
            if (file.size > 10 * 1048576) { N.toast(`${file.name} exceeds 10 MB.`, 'error', 'File rejected'); continue; }
            const meta = { name: file.name, size: file.size, type: file.type, scanned: true, uploadedOn: new Date().toISOString() };
            if (/^image\//.test(file.type)) meta.data = await N.shrinkImage(file, f.type === 'image' ? 320 : 900);
            else if (file.type === 'application/pdf' && file.size < 1.5 * 1048576) meta.data = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(file); });
            if (f.multiple) files[f.k].push(meta); else files[f.k] = [meta];
          }
          draw(); wrap.classList.remove('invalid');
          if (f.onFile) f.onFile(files[f.k], api);
        };
        dz.onclick = () => !ro && inp.click(); dz.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inp.click(); } };
        inp.onchange = () => { add(inp.files); inp.value = ''; };
        dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('drag'); }; dz.ondragleave = () => dz.classList.remove('drag');
        dz.ondrop = (e) => { e.preventDefault(); dz.classList.remove('drag'); add(e.dataTransfer.files); };
        draw();
      }
    });
    const getRaw = () => {
      const out = { ...values };
      fields.forEach((f) => {
        if (!f.k) return;
        const w = N.$(`.field[data-k="${f.k}"]`, el); if (!w) return;
        if (f.type === 'file' || f.type === 'image') out[f.k] = f.multiple ? files[f.k] : files[f.k][0] || null;
        else if (f.type === 'toggle') out[f.k] = N.$('input', w).checked;
        else if (f.type === 'checkbox') out[f.k] = N.$('input', w).checked;
        else if (f.type === 'multiselect') out[f.k] = N.$$('input:checked', w).map((x) => x.value);
        else { const i = N.$('[name]', w); if (f.restricted && !canRestricted) return; out[f.k] = ['number', 'currency'].includes(f.type) ? (i.value === '' ? '' : Number(i.value)) : i.value.trim(); }
      });
      return out;
    };
    const refresh = () => {
      const v = getRaw();
      fields.forEach((f) => {
        if (!f.k) return; const w = N.$(`.field[data-k="${f.k}"]`, el); if (!w) return;
        if (f.calc) { const i = N.$('[name]', w); const c = f.calc(v); i.value = c == null ? '' : c; v[f.k] = c; }
        if (f.show) w.classList.toggle('hidden', !f.show(v));
        if (f.reqIf) { const r = f.reqIf(v); N.$('.req-cond', w).style.display = r ? '' : 'none'; }
      });
      opts.onChange && opts.onChange(v, api);
    };
    el.addEventListener('input', refresh); el.addEventListener('change', refresh);
    el.addEventListener('input', (e) => { const w = e.target.closest('.field'); if (w) w.classList.remove('invalid'); });
    const validate = () => {
      const v = getRaw(); let first = null;
      fields.forEach((f) => {
        if (!f.k) return; const w = N.$(`.field[data-k="${f.k}"]`, el); if (!w || w.classList.contains('hidden')) return;
        let err = '';
        const val = v[f.k]; const empty = val == null || val === '' || (Array.isArray(val) && !val.length) || (f.type === 'checkbox' && !val);
        const required = f.req || (f.reqIf && f.reqIf(v));
        if (required && empty && !(f.restricted && !canRestricted)) err = f.type === 'checkbox' ? 'This must be accepted.' : `${f.label} is required.`;
        else if (!empty && f.type === 'email' && !EMAIL.test(val)) err = 'Enter a valid email address.';
        else if (!empty && f.type === 'tel' && !PHONE.test(val)) err = 'Enter a valid phone number (digits, +, spaces).';
        else if (!empty && (f.type === 'number' || f.type === 'currency') && ((f.min != null && val < f.min) || (f.max != null && val > f.max))) err = `Must be between ${f.min ?? '—'} and ${f.max ?? '—'}.`;
        if (!err && !empty && f.validate) err = f.validate(val, v) || '';
        w.classList.toggle('invalid', !!err); N.$('.err', w).textContent = err;
        if (err && !first) first = w;
      });
      if (first) { const i = N.$('input,select,textarea,.dropzone', first); first.scrollIntoView({ block: 'center', behavior: 'smooth' }); i && setTimeout(() => i.focus({ preventScroll: true }), 250); }
      return !first;
    };
    const api = { el, get: () => { const v = getRaw(); fields.forEach((f) => { if (f.calc) v[f.k] = f.calc(v); }); return v; }, validate, refresh, files, setError: (k, msg) => { const w = N.$(`.field[data-k="${k}"]`, el); if (w) { w.classList.add('invalid'); N.$('.err', w).textContent = msg; } } };
    container.appendChild(el); refresh(); N.icons();
    return api;
  };
  N.shrinkImage = (file, max) => new Promise((res) => {
    const fr = new FileReader();
    fr.onload = () => { const img = new Image(); img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = img.width * s; c.height = img.height * s; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.82)); }; img.onerror = () => res(null); img.src = fr.result; };
    fr.readAsDataURL(file);
  });
  N.previewFile = (fi) => {
    if (!fi) return;
    const isImg = /^image\//.test(fi.type || '') || /\.(png|jpe?g|gif|webp)$/i.test(fi.name || '');
    let inner;
    if (fi.data && isImg) inner = `<img src="${fi.data}" style="max-height:65vh;margin:0 auto;border-radius:8px">`;
    else if (fi.data && /pdf/.test(fi.type || '')) inner = `<iframe src="${fi.data}" style="width:100%;height:65vh;border:0;border-radius:8px"></iframe>`;
    else inner = `<div class="empty"><div class="ico">${N.ico('file-text')}</div><b>${esc(fi.name)}</b><p class="small">${N.fmt.bytes(fi.size)} · Stored securely outside the public web root (production).<br>Demo records reference sample file names only.</p></div>`;
    N.modal({ title: fi.name, size: 'lg', body: inner, buttons: [{ label: 'Download', cls: 'btn-outline', icon: 'download', onClick: () => { if (fi.data) { const a = document.createElement('a'); a.href = fi.data; a.download = fi.name; a.click(); } else N.toast('Demo file — authorised download is served by the API in production.', 'info'); return false; } }, { label: 'Close', cls: 'btn-primary' }] });
  };
  N.fileLink = (fi) => (fi ? `<a href="#" data-file='${esc(JSON.stringify({ name: fi.name, size: fi.size, type: fi.type, data: fi.data }))}'>${N.ico('paperclip', 'ic-sm')} ${esc(fi.name)}</a>` : '<span class="muted">—</span>');
  document.addEventListener('click', (e) => { const a = e.target.closest('[data-file]'); if (a) { e.preventDefault(); try { N.previewFile(JSON.parse(a.dataset.file)); } catch (x) {} } });

  N.formModal = (o) => {
    const holder = document.createElement('div');
    if (o.intro) holder.appendChild(N.h(`<div class="alert alert-info mb-2">${N.ico('info')}<div>${o.intro}</div></div>`));
    const frm = N.form(holder, o.fields, o.values, { cols: o.cols, onChange: o.onChange });
    const m = N.modal({ title: o.title, size: o.size || (o.fields.length > 8 ? 'lg' : ''), body: holder, sticky: true, buttons: [
      { label: 'Cancel', cls: 'btn-outline' },
      ...(o.extraButtons || []).map((b) => ({ ...b, onClick: () => b.onClick(frm, m) })),
      { label: o.saveLabel || 'Save', icon: o.saveIcon || 'check', cls: 'btn-primary', onClick: async (btn, close) => {
        if (!frm.validate()) { N.toast('Please correct the highlighted fields.', 'error', 'Validation failed'); return false; }
        btn.classList.add('loading'); await N.sleep(o.delay == null ? 450 : o.delay);
        try { const r = await o.onSave(frm.get(), frm); btn.classList.remove('loading'); if (r === false) return false; } catch (err) { btn.classList.remove('loading'); N.toast(String(err.message || err), 'error', 'Could not save'); return false; }
        return true;
      } }
    ] });
    return { modal: m, form: frm };
  };

  /* ----------------------------- charts --------------------------------- */
  N.palette = ['#1677D2', '#13A89E', '#102B46', '#F59E0B', '#7C3AED', '#EF4444', '#64748B', '#0EA5E9', '#84CC16', '#EC4899', '#14B8A6', '#A855F7'];
  N.chart = (canvas, type, labels, datasets, extra) => {
    if (!window.Chart) { canvas.parentElement.innerHTML = '<div class="empty small">Chart library unavailable.</div>'; return null; }
    const round = ['doughnut', 'pie', 'polarArea'].includes(type);
    datasets = datasets.map((d, i) => ({ borderWidth: round ? 2 : type === 'line' ? 2.5 : 0, borderColor: round ? '#fff' : d.color || N.palette[i], backgroundColor: round ? N.palette : type === 'line' ? (d.fill ? (d.color || N.palette[i]) + '22' : d.color || N.palette[i]) : d.color || N.palette[i], borderRadius: type === 'bar' ? 5 : 0, tension: 0.35, pointRadius: type === 'line' ? 3 : 0, maxBarThickness: 34, ...d }));
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif'; Chart.defaults.color = '#718096';
    const c = new Chart(canvas, { type, data: { labels, datasets }, options: { responsive: true, maintainAspectRatio: false, cutout: type === 'doughnut' ? '68%' : undefined, plugins: { legend: { display: round || datasets.length > 1, position: round ? 'right' : 'top', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 12 } }, tooltip: { backgroundColor: '#102B46', padding: 10, cornerRadius: 8 } }, scales: round ? {} : { x: { grid: { display: false }, stacked: extra && extra.stacked, ticks: { maxRotation: 0, autoSkip: true } }, y: { beginAtZero: true, grid: { color: '#EEF1F5' }, stacked: extra && extra.stacked, ticks: { precision: 0 } } }, indexAxis: extra && extra.horizontal ? 'y' : 'x', onClick: extra && extra.onClick ? (e, els) => { if (els[0]) extra.onClick(labels[els[0].index]); } : undefined, ...(extra && extra.options) } });
    return c;
  };
  N.chartCard = (title, type, labels, datasets, extra) => {
    const el = N.h(`<div class="card"><div class="card-head"><h3>${esc(title)}</h3>${extra && extra.sub ? `<span class="muted small">${esc(extra.sub)}</span>` : ''}</div><div class="card-body"><div class="chart-box ${(extra && extra.size) || ''}"><canvas></canvas></div></div></div>`);
    setTimeout(() => N.chart(N.$('canvas', el), type, labels, datasets, extra), 0);
    return el;
  };
  N.statCards = (items) => `<div class="stats">${items.map((s) => `<${s.href ? `a href="${s.href}"` : 'div'} class="card stat"><div class="stat-ico ${s.tone || ''}">${N.ico(s.icon || 'activity')}</div><div><div class="stat-label">${esc(s.label)}</div><div class="stat-value">${s.value}</div>${s.sub ? `<div class="stat-sub">${s.sub}</div>` : ''}</div></${s.href ? 'a' : 'div'}>`).join('')}</div>`;

  /* ----------------------------- calendar ------------------------------- */
  N.calendar = (container, o) => {
    let cur = o.month ? new Date(o.month + '-01T00:00:00') : new Date(); cur.setDate(1);
    const el = N.h(`<div><div class="row between mb-2"><div class="row"><button class="btn btn-outline btn-sm btn-icon" data-p aria-label="Previous month">${N.ico('chevron-left')}</button><h3 class="mb-0" data-t style="min-width:170px;text-align:center"></h3><button class="btn btn-outline btn-sm btn-icon" data-n aria-label="Next month">${N.ico('chevron-right')}</button><button class="btn btn-ghost btn-sm" data-today>Today</button></div><div class="cal-legend">${o.legend || ''}</div></div><div class="cal"></div></div>`);
    const grid = N.$('.cal', el);
    const draw = () => {
      N.$('[data-t]', el).textContent = cur.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
      grid.innerHTML = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<div class="cal-h">${d}</div>`).join('');
      const start = new Date(cur); const dow = (start.getDay() + 6) % 7; start.setDate(1 - dow);
      for (let i = 0; i < 42; i++) {
        const d = new Date(start); d.setDate(start.getDate() + i); const iso = N.isoDate(d); const out = d.getMonth() !== cur.getMonth();
        if (i >= 35 && out && i % 7 === 0) break;
        const info = out ? {} : (o.day && o.day(iso)) || {};
        const c = N.h(`<div class="cal-d ${out ? 'out' : ''} ${iso === N.today() ? 'today' : ''} ${info.cls || ''}" ${out ? '' : 'tabindex="0"'}><div class="dn">${d.getDate()}${info.badge || ''}</div>${info.html || ''}</div>`);
        if (!out && o.onClick) { c.onclick = () => o.onClick(iso); c.onkeydown = (e) => e.key === 'Enter' && o.onClick(iso); }
        grid.appendChild(c);
      }
      o.onMonth && o.onMonth(N.isoDate(cur).slice(0, 7)); N.icons();
    };
    N.$('[data-p]', el).onclick = () => { cur.setMonth(cur.getMonth() - 1); draw(); };
    N.$('[data-n]', el).onclick = () => { cur.setMonth(cur.getMonth() + 1); draw(); };
    N.$('[data-today]', el).onclick = () => { cur = new Date(); cur.setDate(1); draw(); };
    container.appendChild(el); draw();
    return { redraw: draw, month: () => N.isoDate(cur).slice(0, 7) };
  };

  /* ----------------------------- timeline ------------------------------- */
  N.timeline = (items) => items.length ? `<div class="timeline">${items.map((t) => `<div class="tl-item ${t.tone || ''}"><div class="tl-title">${esc(t.title)}</div><div class="tl-meta">${N.fmt.dateTime(t.ts)}${t.user ? ' · ' + esc(t.user) : ''}${t.note ? ' — ' + esc(t.note) : ''}</div></div>`).join('')}</div>` : `<div class="empty"><div class="ico">${N.ico('history')}</div>No activity recorded yet.</div>`;
  N.empty = (title, sub, icon) => `<div class="empty"><div class="ico">${N.ico(icon || 'inbox')}</div><b>${esc(title)}</b>${sub ? `<div class="small">${esc(sub)}</div>` : ''}</div>`;
  N.dl = (pairs) => `<dl class="dl">${pairs.filter(Boolean).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v == null || v === '' ? '<span class="muted">—</span>' : v}</dd></div>`).join('')}</dl>`;

  /* ----------------------------- workflow helper ------------------------ */
  N.setStatus = async (coll, rec, status, o) => {
    o = o || {};
    if (o.confirm !== false) { const ok = await N.confirm({ title: o.title || `Set status to “${status}”?`, msg: o.msg || `${rec.ref || rec.name || ''} will be updated and the change recorded in the audit log.`, ok: o.ok || status, danger: !!o.danger, reason: o.reason }); if (!ok) return false; if (typeof ok === 'string') o.note = ok; }
    const hist = (rec.history || []).concat([{ status, ts: new Date().toISOString(), user: N.user().name, note: o.note || '' }]);
    N.db.save(coll, { id: rec.id, status, history: hist, ...(o.extra || {}) });
    N.toast(`${rec.ref || rec.name || 'Record'} → ${status}`, 'success', 'Status updated');
    o.after && o.after(); return true;
  };

  /* ----------------------------- page header ---------------------------- */
  N.header = (o) => {
    const crumbs = (o.crumbs || []).map((c, i, a) => (c[1] && i < a.length - 1 ? `<a href="${N.url(c[1])}">${esc(c[0])}</a>` : `<span>${esc(c[0])}</span>`)).join(N.ico('chevron-right'));
    const el = N.h(`<div class="page-head"><div><div class="crumbs">${crumbs}</div><h1>${esc(o.title)}</h1>${o.sub ? `<p>${o.sub}</p>` : ''}</div><div class="row ph-actions"></div></div>`);
    const act = N.$('.ph-actions', el);
    (o.actions || []).forEach((a) => { if (!a || a.hidden) return; if (a.el) { act.appendChild(a.el); return; } const b = a.href ? N.h(`<a class="btn ${a.cls || 'btn-primary'}" href="${a.href}">${a.icon ? N.ico(a.icon) : ''}${esc(a.label)}</a>`) : N.h(`<button class="btn ${a.cls || 'btn-primary'}">${a.icon ? N.ico(a.icon) : ''}${esc(a.label)}</button>`); if (a.onClick) b.onclick = () => a.onClick(b); act.appendChild(b); });
    document.title = `${o.title} · Nyovara`;
    return el;
  };

  /* ----------------------------- boot ----------------------------------- */
  N.boot = () => {
    const name = body.dataset.page;
    if (body.dataset.shell && N.shell) N.shell(body.dataset.shell);
    const content = N.$('#content') || N.$('main') || body;
    if (body.dataset.shell) N.$$('.skeleton', content).forEach((x) => x.remove());
    const fn = N.pages[name];
    if (fn) { try { fn(content, N.params); } catch (e) { console.error(e); content.insertAdjacentHTML('beforeend', `<div class="alert alert-danger">${N.ico('bug')}<div>Page error: ${esc(e.message)}</div></div>`); } }
    else if (name) console.warn('No page handler for', name);
    N.icons();
    new MutationObserver(N.debounce(() => N.icons(), 10)).observe(document.body, { childList: true, subtree: true });
  };
  document.addEventListener('DOMContentLoaded', () => setTimeout(N.boot, 0));
})();
