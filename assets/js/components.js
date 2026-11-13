/* =========================================================================
   NYOCREW RESOURCE SCREENS — configurable list/create/edit/view/workflow
   screens used by most modules (consistent behaviour everywhere).
   ========================================================================= */
(function () {
  'use strict';
  const N = window.N, esc = N.esc;

  N.resource = (content, cfg) => {
    const data = () => (cfg.data ? cfg.data() : N.db.all(cfg.coll));
    const head = N.header({ title: cfg.title, sub: cfg.sub, crumbs: cfg.crumbs, actions: [
      ...(cfg.headActions || []),
      cfg.create === false ? null : { label: cfg.createLabel || 'Add ' + (cfg.entity || 'record'), icon: 'plus', onClick: () => edit() }
    ] });
    content.appendChild(head);
    if (cfg.intro) content.appendChild(N.h(`<div class="alert alert-info mb-2">${N.ico('info')}<div>${cfg.intro}</div></div>`));
    const statsBox = N.h('<div class="mb-3"></div>'); if (cfg.stats) content.appendChild(statsBox);
    const above = N.h('<div></div>'); content.appendChild(above);
    if (cfg.above) cfg.above(above);
    const drawStats = () => { if (cfg.stats) { statsBox.innerHTML = N.statCards(cfg.stats(data())); N.icons(statsBox); } };
    const refresh = () => { drawStats(); table.render(); cfg.onChange && cfg.onChange(); };
    const edit = (rec) => {
      const isNew = !rec;
      N.formModal({
        title: (isNew ? (cfg.createLabel || 'Add ' + (cfg.entity || 'record')) : 'Edit ' + (cfg.entity || 'record')) + (rec && rec.ref ? ' · ' + rec.ref : ''),
        fields: typeof cfg.fields === 'function' ? cfg.fields(rec) : cfg.fields, values: rec || (cfg.defaults ? cfg.defaults() : {}), size: cfg.modalSize, intro: cfg.formIntro,
        saveLabel: isNew ? cfg.saveLabel || 'Create' : 'Save changes',
        onSave: (v) => {
          if (cfg.beforeSave) { const r = cfg.beforeSave(v, rec); if (r === false) return false; if (r && typeof r === 'object') v = r; }
          if (isNew && cfg.refPrefix && !v.ref) v.ref = N.db.nextRef(cfg.refPrefix, cfg.coll);
          if (isNew && cfg.initialStatus && !v.status) v.status = cfg.initialStatus;
          if (isNew) v.history = [{ status: v.status || 'Created', ts: new Date().toISOString(), user: N.user().name }];
          const saved = N.db.save(cfg.coll, rec ? { ...v, id: rec.id } : v);
          cfg.afterSave && cfg.afterSave(saved, isNew);
          N.toast(`${cfg.entity ? cfg.entity[0].toUpperCase() + cfg.entity.slice(1) : 'Record'} ${isNew ? 'created' : 'updated'}${saved.ref ? ' — ' + saved.ref : ''}.`);
          refresh();
        }
      });
    };
    const view = (rec) => {
      rec = N.db.get(cfg.coll, rec.id) || rec;
      const flds = (typeof cfg.fields === 'function' ? cfg.fields(rec) : cfg.fields).filter((f) => f.k && !f.hideView);
      const body = cfg.view ? cfg.view(rec) : `${N.dl(flds.map((f) => [f.label, N.fieldDisplay(f, rec[f.k], rec)]))}${rec.history && rec.history.length ? `<h4 class="mt-3">Status history</h4>${N.timeline(rec.history.slice().reverse().map((h) => ({ title: h.status, ts: h.ts, user: h.user, note: h.note })))}` : ''}`;
      const flow = cfg.workflow ? cfg.workflow(rec).filter((w) => w && !w.hidden) : [];
      N.modal({ title: (cfg.viewTitle ? cfg.viewTitle(rec) : rec.ref || rec.name || cfg.entity), size: cfg.viewSize || 'lg', body, buttons: [
        ...flow.map((w) => ({ label: w.label, cls: w.danger ? 'btn-soft-danger' : 'btn-outline', icon: w.icon, onClick: async (b, close) => { close(); await doFlow(rec, w); return false; } })),
        cfg.editable === false ? null : { label: 'Edit', cls: 'btn-outline', icon: 'pencil', onClick: (b, close) => { close(); edit(rec); return false; } },
        { label: 'Close', cls: 'btn-primary' }
      ].filter(Boolean) });
    };
    const doFlow = async (rec, w) => {
      if (w.onClick) { await w.onClick(rec, refresh); return; }
      const ok = await N.setStatus(cfg.coll, rec, w.to, { reason: w.reason, danger: w.danger, ok: w.label, extra: w.extra ? w.extra(rec) : null });
      if (ok) { w.after && w.after(rec); refresh(); }
    };
    const table = N.table(content, {
      title: cfg.tableTitle, data, columns: cfg.columns, filters: cfg.filters, preset: cfg.preset, exportName: cfg.exportName || cfg.coll, exportTitle: cfg.title, searchPlaceholder: cfg.searchPlaceholder, emptyText: cfg.emptyText, sort: cfg.sort, dir: cfg.dir, bulk: cfg.bulk,
      buttons: cfg.tableButtons, onRowClick: cfg.rowClick === false ? null : cfg.rowClick || ((r) => view(r)),
      actions: (r) => [
        { label: 'View', icon: 'eye', primary: true, onClick: view },
        ...(cfg.rowActions ? cfg.rowActions(r, refresh) : []),
        ...(cfg.workflow ? cfg.workflow(r).filter((w) => w && !w.hidden).map((w) => ({ label: w.label, icon: w.icon || 'arrow-right-circle', danger: w.danger, onClick: () => doFlow(r, w) })) : []),
        cfg.editable === false ? null : { label: 'Edit', icon: 'pencil', onClick: edit },
        cfg.deletable === false ? null : { label: cfg.deleteLabel || 'Delete', icon: cfg.deleteLabel === 'Archive' ? 'archive' : 'trash-2', danger: true, onClick: async (rr) => {
          const ok = await N.confirm({ title: `${cfg.deleteLabel || 'Delete'} ${rr.ref || rr.name || 'record'}?`, msg: cfg.deleteLabel === 'Archive' ? 'The record will be archived and remain in history.' : 'This action is recorded in the audit log.', ok: cfg.deleteLabel || 'Delete' });
          if (!ok) return; if (cfg.deleteLabel === 'Archive') N.db.save(cfg.coll, { id: rr.id, status: 'Archived', archived: true }); else N.db.remove(cfg.coll, rr.id); N.toast('Record ' + (cfg.deleteLabel === 'Archive' ? 'archived' : 'deleted') + '.'); refresh();
        } }
      ].filter(Boolean)
    });
    drawStats();
    if (cfg.below) cfg.below(content, refresh);
    const id = N.params.get('id'); if (id && N.db.get(cfg.coll, id) && cfg.autoOpen !== false) setTimeout(() => view(N.db.get(cfg.coll, id)), 200);
    if (N.params.get('new') === '1') setTimeout(() => edit(), 200);
    return { table, refresh, edit, view };
  };
  N.fieldDisplay = (f, v, rec) => {
    if (f.display) return f.display(v, rec);
    if (v == null || v === '') return '';
    if (f.type === 'date') return N.fmt.date(v);
    if (f.type === 'datetime') return N.fmt.dateTime(v);
    if (f.type === 'currency') return N.fmt.money(v, rec.currency || 'USD');
    if (f.type === 'toggle' || f.type === 'checkbox') return v ? 'Yes' : 'No';
    if (f.type === 'file' || f.type === 'image') return (Array.isArray(v) ? v : [v]).map(N.fileLink).join('<br>');
    if (f.type === 'multiselect') return esc((v || []).join(', '));
    if (f.type === 'select') { const o = (typeof f.options === 'function' ? f.options(rec) : f.options || []).find((x) => (typeof x === 'object' ? String(x.value) === String(v) : x === v)); return esc(o ? (typeof o === 'object' ? o.label : o) : v); }
    if (f.k === 'status') return N.badge(v);
    return esc(v);
  };

  /* shared field factories */
  N.F = {
    crew: (k, label, req, filter) => ({ k: k || 'crewId', label: label || 'Crew member', type: 'select', req: req !== false, options: () => N.crewOptions(filter), display: (v) => N.crewLink(v) }),
    vessel: (k, label, req) => ({ k: k || 'vesselId', label: label || 'Vessel', type: 'select', req: !!req, options: N.vesselOptions, display: (v) => esc(N.vesselName(v)) }),
    ref: (k, label, key, req, extra) => ({ k, label, type: 'select', req: !!req, options: () => N.ref(key), ...(extra || {}) }),
    status: (opts, req) => ({ k: 'status', label: 'Status', type: 'select', req: req !== false, options: opts })
  };
  N.colCrew = (k) => ({ key: k || 'crewId', label: 'Crew member', render: (r) => N.crewLink(r[k || 'crewId']), sortVal: (r) => N.crewName(r[k || 'crewId']), exportVal: (r) => N.crewName(r[k || 'crewId']) });
  N.colVessel = (k) => ({ key: k || 'vesselId', label: 'Vessel', render: (r) => esc(N.vesselName(r[k || 'vesselId'])), sortVal: (r) => N.vesselName(r[k || 'vesselId']) });
  N.colStatus = (k, label) => ({ key: k || 'status', label: label || 'Status', render: (r) => N.badge(r[k || 'status']), exportVal: (r) => r[k || 'status'] });
  N.colDate = (k, label) => ({ key: k, label, render: (r) => N.fmt.date(r[k]), nowrap: true });
  N.colExpiry = (k, label, activeKey) => ({ key: k, label: label || 'Expiry', nowrap: true, render: (r) => { const st = N.expiryStatus(r[k], activeKey ? r[activeKey] : undefined); const days = r[k] ? N.daysBetween(N.today(), r[k]) : null; return `${N.fmt.date(r[k])}<div>${N.badge(st)}${days != null && days >= 0 && days <= 120 ? ` <span class="muted small">${days}d</span>` : ''}</div>`; }, exportVal: (r) => r[k] });
  N.filterVessel = () => ({ key: 'vesselId', label: 'Vessel', options: () => N.vesselOptions() });
  N.filterExpiry = (k, activeKey) => ({ key: '_exp', label: 'Validity', options: ['Valid', 'Expiring Soon', 'Expired', 'Inactive'], match: (r, v) => N.expiryStatus(r[k], activeKey ? r[activeKey] : undefined) === v });
  N.filterStatus = (opts) => ({ key: 'status', label: 'Status', options: opts });
})();
