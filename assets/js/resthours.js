/* =========================================================================
   NYOVARA REST-HOURS ENGINE (frontend demonstration)
   - 30-minute resolution; each record is one ship's day for one seafarer.
   - Rolling 24-hour windows ending at every slot boundary of the day.
   - Rolling 7-day (168h) windows; continuous / split rest detection;
     maximum interval between rest periods; missing records; midnight-
     crossing periods (concatenated timeline); clock changes (23h / 25h
     ship's days) and versioned rule sets.
   - Calculated results are kept separate from reviewer decisions and an
     exception is never converted into compliance automatically.
   Production: the authoritative engine is a C# domain service.
   ========================================================================= */
(function () {
  'use strict';
  const N = window.N, esc = N.esc;
  const RH = (N.RH = {});
  RH.SLOTS = 48;
  let version = 0, index = null; const cache = new Map();
  RH.invalidate = () => { version++; index = null; cache.clear(); };
  const idx = () => {
    if (index) return index;
    index = new Map();
    N.db.all('restRecords').forEach((r) => { if (!index.has(r.crewId)) index.set(r.crewId, new Map()); index.get(r.crewId).set(r.date, r); });
    return index;
  };
  RH.get = (crewId, date) => { const m = idx().get(crewId); return m ? m.get(date) : null; };
  RH.daySlots = (rec) => RH.SLOTS + Math.round(((rec && rec.clockAdj) || 0) / 30);
  RH.toSlots = (rec) => { const n = RH.daySlots(rec); const a = new Array(n).fill(0); (rec.work || []).forEach(([s, e]) => { for (let i = Math.max(0, s); i < Math.min(n, e); i++) a[i] = 1; }); return a; };
  RH.toPeriods = (slots) => { const out = []; let s = -1; slots.forEach((v, i) => { if (v && s < 0) s = i; if (!v && s >= 0) { out.push([s, i]); s = -1; } }); if (s >= 0) out.push([s, slots.length]); return out; };
  RH.slotTime = (i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`;
  RH.timeSlot = (t) => { const [h, m] = String(t).split(':').map(Number); return h * 2 + (m >= 30 ? 1 : 0); };
  RH.periodsLabel = (work) => (work || []).map(([s, e]) => `${RH.slotTime(s)}–${RH.slotTime(e)}`).join(', ') || 'No work recorded';

  RH.rulesFor = (vesselId, date) => {
    const v = N.db.get('vessels', vesselId) || {};
    const all = N.db.all('restRules').filter((r) => r.status === 'Active' && r.effective <= (date || N.today()));
    return all.find((r) => r.flag === v.flag) || all.find((r) => /baseline/i.test(r.flag)) || N.db.all('restRules')[0];
  };
  RH.isLocked = (vesselId, date) => !!N.db.all('restLocks').find((l) => l.vesselId === vesselId && l.month === String(date).slice(0, 7) && l.locked);

  RH.evaluate = (crewId, date) => {
    const key = crewId + '|' + date + '|' + version;
    if (cache.has(key)) return cache.get(key);
    const rec = RH.get(crewId, date);
    if (!rec) { const r = { calc: 'Missing Records', rules: [], viol: new Set(), workMin: 0, restMin: 0, periods: 0 }; cache.set(key, r); return r; }
    const rule = RH.rulesFor(rec.vesselId, date);
    // assemble 8-day timeline (D-7 … D)
    const arr = [], known = []; let startD = 0, missingDays = [];
    for (let k = 7; k >= 0; k--) {
      const dd = N.addDays(date, -k); const r = RH.get(crewId, dd);
      if (k === 0) startD = arr.length;
      if (r) { const sl = RH.toSlots(r); sl.forEach((v) => { arr.push(v); known.push(1); }); }
      else { if (k <= 6) missingDays.push(dd); for (let i = 0; i < RH.SLOTS; i++) { arr.push(1); known.push(0); } }
    }
    const endD = arr.length, n = arr.length;
    const pre = [0], preK = [0]; for (let i = 0; i < n; i++) { pre.push(pre[i] + (arr[i] ? 0 : 1)); preK.push(preK[i] + (known[i] ? 0 : 1)); }
    const restIn = (s, e) => pre[e] - pre[s];
    const allKnown = (s, e) => preK[e] - preK[s] === 0;
    const W = 48, W7 = 336;
    const blockLen = new Array(n).fill(0);
    for (let i = 0; i < n;) { if (!arr[i]) { let j = i; while (j < n && !arr[j]) j++; for (let k = i; k < j; k++) blockLen[k] = j - i; i = j; } else i++; }
    const viol = new Set();
    let min24 = Infinity, minTwo = Infinity, minLong = Infinity, worstPeriods = 0, windows = 0;
    const evalWin = (s, e) => {
      windows++;
      const rest = restIn(s, e); const segs = []; let cur = 0, long = 0;
      for (let i = s; i < e; i++) { if (!arr[i]) { cur++; long = Math.max(long, blockLen[i]); } else if (cur) { segs.push(cur); cur = 0; } } if (cur) segs.push(cur);
      segs.sort((a, b) => b - a);
      const two = (segs[0] || 0) + (segs[1] || 0);
      min24 = Math.min(min24, rest); minTwo = Math.min(minTwo, two); minLong = Math.min(minLong, long); worstPeriods = Math.max(worstPeriods, segs.length);
      const f1 = rest < rule.minRest24 * 2, f3 = two < rule.minRest24 * 2, f4 = long < rule.minLongPeriod * 2;
      if (f1 || f3 || f4) viol.add(Math.min(e - 1, endD - 1) - startD);
      return { f1, f3, f4 };
    };
    let fail1 = false, fail3 = false, fail4 = false, partial24 = false;
    for (let e = startD + 1; e <= endD; e++) {
      const s = e - W; if (s < 0) continue;
      if (!allKnown(s, e)) { partial24 = true; continue; }
      const r = evalWin(s, e); fail1 = fail1 || r.f1; fail3 = fail3 || r.f3; fail4 = fail4 || r.f4;
    }
    if (partial24 && windows === 0) { const r = evalWin(startD, endD); fail1 = r.f1; fail3 = r.f3; fail4 = r.f4; }
    // 7-day
    let min7 = Infinity, have7 = false, fail2 = false;
    for (let e = startD + 1; e <= endD; e++) { const s = e - W7; if (s < 0 || !allKnown(s, e)) continue; have7 = true; const r = restIn(s, e); min7 = Math.min(min7, r); if (r < rule.minRest7d * 2) { fail2 = true; viol.add(e - 1 - startD); } }
    // max interval between rest periods (short breaks under minCounted hours treated as work)
    const minC = Math.round((rule.minCounted == null ? 1 : rule.minCounted) * 2);
    const eff = arr.slice(); let i0 = 0;
    while (i0 < n) { if (!eff[i0] && known[i0]) { let j = i0; while (j < n && !arr[j] && known[j]) j++; if (j - i0 < minC) for (let k = i0; k < j; k++) eff[k] = 1; i0 = j; } else i0++; }
    let maxGap = 0, fail5 = false; let gs = -1;
    for (let i = 0; i <= n; i++) {
      const w = i < n && eff[i] && known[i];
      if (w && gs < 0) gs = i;
      if (!w && gs >= 0) { const len = i - gs; if (i > startD && gs < endD) { maxGap = Math.max(maxGap, len); if (len > rule.maxGap * 2) { fail5 = true; for (let k = Math.max(gs, startD); k < Math.min(i, endD); k++) viol.add(k - startD); } } gs = -1; }
    }
    const daySl = arr.slice(startD, endD);
    const workMin = daySl.filter(Boolean).length * 30, restMin = daySl.filter((x) => !x).length * 30;
    const restPeriods = RH.toPeriods(daySl.map((x) => (x ? 0 : 1))).length;
    const H = (x) => (x === Infinity ? '—' : (x / 2).toString().replace('.5', '½') + 'h');
    const rules = [
      { key: 'r24', label: `Minimum ${rule.minRest24} hours of rest in any 24-hour period`, pass: !fail1, detail: `Lowest rolling 24h rest: ${H(min24)}${partial24 ? ' · previous day missing — calendar-day window used where needed' : ''}` },
      { key: 'r7', label: `Minimum ${rule.minRest7d} hours of rest in any 7-day period`, pass: have7 ? !fail2 : null, detail: have7 ? `Lowest rolling 7-day rest: ${H(min7)}` : `Insufficient records for a complete 7-day window${missingDays.length ? ' (missing: ' + missingDays.map((x) => N.fmt.date(x)).join(', ') + ')' : ''}` },
      { key: 'rsplit', label: `Daily minimum achieved within no more than ${rule.maxPeriods} rest periods`, pass: !fail3, detail: `Lowest rest in the two longest periods of any 24h window: ${H(minTwo)} (most periods in a window: ${worstPeriods})` },
      { key: 'rlong', label: `One rest period of at least ${rule.minLongPeriod} hours`, pass: !fail4, detail: `Shortest qualifying rest period available in any 24h window: ${H(minLong)} (full period length, incl. across midnight)` },
      { key: 'rgap', label: `No more than ${rule.maxGap} hours between consecutive rest periods`, pass: !fail5, detail: `Longest interval touching this day: ${H(maxGap)} (breaks under ${rule.minCounted || 1}h not counted as rest)` }
    ];
    const res = { calc: fail1 || fail2 || fail3 || fail4 || fail5 ? 'Potential Non-Compliance' : 'Compliant', rules, viol, workMin, restMin, periods: restPeriods, ruleVersion: rule.version, missingContext: missingDays.length > 0, rec };
    cache.set(key, res); return res;
  };
  RH.monthDays = (month) => { const [y, m] = month.split('-').map(Number); const out = []; const d = new Date(y, m - 1, 1); while (d.getMonth() === m - 1) { out.push(N.isoDate(d)); d.setDate(d.getDate() + 1); } return out; };

  /* --------- save / submit with lock + offline handling --------- */
  RH.save = (crewId, date, patch, opts) => {
    opts = opts || {};
    const c = N.crew(crewId); const ex = RH.get(crewId, date);
    const vesselId = (ex && ex.vesselId) || c.vesselId;
    if (RH.isLocked(vesselId, date)) { N.toast('This month is locked. An authorised user must unlock it before changes.', 'error', 'Period locked'); return null; }
    const offline = opts.context === 'vessel' && N.isOffline();
    let rec = { id: (ex && ex.id) || `rh_${crewId}_${date}`, crewId, vesselId, date, tz: (ex && ex.tz) || 'UTC+00:00', clockAdj: 0, remarks: '', reviews: [], recordedBy: N.user().name, source: opts.context === 'vessel' ? 'Vessel portal' : opts.context === 'seafarer' ? 'Seafarer portal' : 'Web', ...(ex || {}), ...patch };
    if (offline) {
      rec.localStatus = patch.status === 'Submitted' ? 'Queued' : 'Offline Draft'; rec.eventTs = new Date().toISOString();
      const q = N.db.all('syncQueue'); const qi = q.findIndex((x) => x.recId === rec.id);
      const item = { id: 'q_' + N.uid(), recId: rec.id, crewId, date, payload: { work: rec.work, remarks: rec.remarks, clockAdj: rec.clockAdj, status: patch.status || 'Draft' }, eventTs: rec.eventTs, baseUpdatedOn: ex ? ex.updatedOn || ex.createdOn || '' : '', state: 'Queued' };
      if (qi >= 0) q[qi] = item; else q.unshift(item);
      N.db.persist();
      N.toast(patch.status === 'Submitted' ? 'Saved to the secure offline queue. It is NOT submitted until synchronisation succeeds.' : 'Offline draft saved on this device.', 'warning', 'Offline');
      return { ...rec, offline: true };
    }
    if (patch.status === 'Submitted') { rec.submittedOn = new Date().toISOString(); rec.receivedOn = rec.submittedOn; if (ex && ex.status === 'Correction Requested') rec.corrected = true; }
    rec = N.db.save('restRecords', rec);
    RH.invalidate();
    return rec;
  };

  /* --------- recorder component --------- */
  RH.recorder = (container, o) => {
    o = o || {};
    let crewId = o.crewId, date = o.date || N.today();
    const el = N.h('<div class="rh-recorder"></div>'); container.appendChild(el);
    let slots, rec, paintVal = null, dirty = false;
    const load = () => { rec = RH.get(crewId, date); slots = rec ? RH.toSlots(rec) : new Array(RH.SLOTS).fill(0); dirty = false; };
    const editable = () => { if (!rec) return !RH.isLocked((N.crew(crewId) || {}).vesselId, date); if (RH.isLocked(rec.vesselId, date)) return false; if (o.reviewer) return false; return ['Draft', 'Correction Requested', undefined, ''].includes(rec.status) || rec.localStatus; };
    function draw() {
      const c = N.crew(crewId); if (!c) { el.innerHTML = N.empty('Select a crew member', '', 'user'); return; }
      const ed = editable(); const locked = RH.isLocked((rec && rec.vesselId) || c.vesselId, date);
      const tmp = { ...(rec || { crewId, vesselId: c.vesselId, date }), work: RH.toPeriods(slots), clockAdj: (slots.length - RH.SLOTS) * 30 };
      // temporary evaluation with unsaved slots
      const saved = RH.get(crewId, date); const list = N.db.all('restRecords'); let injected = false;
      if (dirty || !saved) { if (saved) Object.assign(saved, { _bak: saved.work, _bakAdj: saved.clockAdj, work: tmp.work, clockAdj: tmp.clockAdj }); else { list.push({ ...tmp, id: '__tmp', status: 'Draft' }); injected = true; } RH.invalidate(); }
      const ev = RH.evaluate(crewId, date);
      if (dirty || injected) { if (injected) list.splice(list.findIndex((x) => x.id === '__tmp'), 1); else { saved.work = saved._bak; saved.clockAdj = saved._bakAdj; delete saved._bak; delete saved._bakAdj; } RH.invalidate(); }
      const n = slots.length;
      const week = Array.from({ length: 7 }, (_, k) => N.addDays(date, k - 6));
      el.innerHTML = `
        ${locked ? `<div class="alert alert-warning mb-2">${N.ico('lock')}<div><b>${N.MONTHS[+date.slice(5, 7) - 1]} ${date.slice(0, 4)} is locked</b> for this vessel. Records are read-only until an authorised user unlocks the period.</div></div>` : ''}
        ${rec && rec.status === 'Correction Requested' ? `<div class="alert alert-warning mb-2">${N.ico('message-square-warning')}<div><b>Correction requested</b> by ${esc((rec.reviews.slice(-1)[0] || {}).user || 'reviewer')}: ${esc((rec.reviews.slice(-1)[0] || {}).note || '')}</div></div>` : ''}
        ${rec && rec.localStatus ? `<div class="alert alert-warning mb-2">${N.ico('cloud-off')}<div>Stored on this device (${esc(rec.localStatus)}). Not submitted until synchronised.</div></div>` : ''}
        <div class="grid g-2-1">
          <div class="card"><div class="card-head"><div><h3>${esc(c.givenName + ' ' + c.surname)} · ${N.fmt.date(date)}</h3><div class="muted small">${esc(c.rank)} · ${esc(N.vesselName(c.vesselId))} · Ship's time ${esc((rec && rec.tz) || 'UTC+00:00')} · Rule set ${esc(ev.ruleVersion || RH.rulesFor(c.vesselId, date).version)}</div></div><div class="row">${rec ? N.badge(rec.status) : N.badge('Not Started')}${rec && rec.corrected ? N.badge('Corrected') : ''}</div></div>
            <div class="card-body">
              <div class="row between mb-2"><div class="rh-legend"><span><i style="background:var(--ocean)"></i>Work</span><span><i style="background:#DDF3F1;border:1px solid #BFE3DF"></i>Rest</span><span><i style="background:#fff;box-shadow:inset 0 -4px 0 var(--danger);border:1px solid var(--border)"></i>Potential violation window</span></div>
              ${ed ? `<div class="pills" role="group" aria-label="Paint mode"><button data-mode="1" class="active">Paint work</button><button data-mode="0">Paint rest</button></div>` : ''}</div>
              <div class="rh-scroll"><div class="rh-inner"><div class="rh-grid ${ed ? '' : 'locked'}" style="grid-template-columns:repeat(${n},1fr)">${slots.map((v, i) => `<div class="rh-cell ${v ? 'work' : ''} ${ev.viol.has(i) ? 'viol' : ''}" data-i="${i}" title="${RH.slotTime(i)}–${RH.slotTime(i + 1)} ${v ? 'Work' : 'Rest'}"></div>`).join('')}</div>
              <div class="rh-hours" style="grid-template-columns:repeat(${n / 2},1fr)">${Array.from({ length: n / 2 }, (_, h) => `<span>${String(h % 24).padStart(2, '0')}</span>`).join('')}</div></div></div>
              <div class="grid g3 mt-2">
                <div class="card card-body tight"><div class="stat-label">Work</div><div class="stat-value" style="font-size:20px">${N.fmt.hours(ev.workMin)}</div></div>
                <div class="card card-body tight"><div class="stat-label">Rest</div><div class="stat-value" style="font-size:20px">${N.fmt.hours(ev.restMin)}</div></div>
                <div class="card card-body tight"><div class="stat-label">Rest periods (calendar day)</div><div class="stat-value" style="font-size:20px">${ev.periods}</div></div>
              </div>
              <div class="mt-2"><b class="small">Work periods:</b> <span class="small">${esc(RH.periodsLabel(RH.toPeriods(slots)))}</span></div>
              ${ed ? `<div class="fieldset mt-2" style="margin-bottom:0"><div class="fieldset-title">${N.ico('plus-circle')}Add period</div><div class="row" style="align-items:flex-end">
                <div class="field"><label>Type</label><select class="input" data-ptype style="width:110px"><option value="1">Work</option><option value="0">Rest</option></select></div>
                <div class="field"><label>Start</label><input class="input" type="time" step="1800" value="08:00" data-ps></div>
                <div class="field"><label>End</label><input class="input" type="time" step="1800" value="12:00" data-pe></div>
                <button class="btn btn-outline" data-padd>${N.ico('plus')}Add</button>
                <span class="small muted grow">Periods ending at or before the start time cross midnight and continue on the next day's draft.</span></div></div>` : ''}
              <div class="form-grid mt-2">
                <div class="field"><label>Clock change on this day</label><select class="input" data-clock ${ed ? '' : 'disabled'}><option value="0">None (24-hour day)</option><option value="60">Clocks retarded 1h (25-hour day)</option><option value="-60">Clocks advanced 1h (23-hour day)</option></select></div>
                <div class="field"><label>Ship's time zone</label><select class="input" data-tz ${ed ? '' : 'disabled'}>${['UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+08:00'].map((z) => `<option ${(rec && rec.tz) === z ? 'selected' : ''}>${z}</option>`).join('')}</select></div>
                <div class="field full"><label>Remarks</label><textarea class="input" rows="2" data-rem ${ed ? '' : 'readonly'} placeholder="e.g. cargo operations, drills, emergency">${esc((rec && rec.remarks) || '')}</textarea></div>
              </div>
            </div>
            <div class="card-foot row between">
              <div class="row">${ed ? `<button class="btn btn-ghost btn-sm" data-clear>${N.ico('eraser')}Clear</button><button class="btn btn-ghost btn-sm" data-copy>${N.ico('copy')}Copy previous day</button><div class="dd"><button class="btn btn-ghost btn-sm" data-dd>${N.ico('layout-template')}Apply arrangement</button><div class="dd-menu" style="left:0;right:auto;min-width:280px">${N.db.all('workingArrangements').filter((w) => w.status === 'Approved').map((w) => `<button data-wa="${w.id}">${esc(w.name)}</button>`).join('')}</div></div>` : ''}</div>
              <div class="row">${ed ? `<button class="btn btn-outline" data-save>${N.ico('save')}Save draft</button><button class="btn btn-primary" data-submit>${N.ico('send')}Submit</button>` : rec && o.allowReopen && !locked ? '' : ''}</div>
            </div>
          </div>
          <div class="stack">
            <div class="card"><div class="card-head"><h3>Compliance check</h3>${N.badge(ev.calc)}</div><div class="card-body"><div class="rule-list">${ev.rules.map((r) => `<div class="rule ${r.pass === null ? 'na' : r.pass ? 'pass' : 'fail'}"><span class="ri">${N.ico(r.pass === null ? 'minus' : r.pass ? 'check' : 'x')}</span><div><div style="font-weight:600">${esc(r.label)}</div><div class="muted small">${esc(r.detail)}</div></div></div>`).join('')}</div><p class="small muted mt-2 mb-0">Calculated result only. Reviewer decisions are recorded separately and an exception is never treated as compliance.</p></div></div>
            <div class="card"><div class="card-head"><h3>Rolling 7 days</h3></div><div class="card-body tight">${week.map((dd) => { const e2 = RH.evaluate(crewId, dd); const r2 = RH.get(crewId, dd); return `<a href="#" class="kv" data-goto="${dd}" style="text-decoration:none;color:inherit"><span>${N.fmt.date(dd)}${dd === date ? ' <b>(selected)</b>' : ''}</span><span class="row" style="gap:6px">${r2 ? N.fmt.hours(e2.restMin) + ' rest' : ''} ${N.badge(e2.calc)}</span></a>`; }).join('')}</div></div>
            ${rec && rec.reviews && rec.reviews.length ? `<div class="card"><div class="card-head"><h3>Review history</h3></div><div class="card-body">${N.timeline(rec.reviews.slice().reverse().map((r) => ({ title: r.decision, ts: r.ts, user: r.user, note: r.note, tone: /Reject|Correction/.test(r.decision) ? 'warn' : 'teal' })))}</div></div>` : ''}
          </div>
        </div>`;
      N.$('[data-clock]', el) && (N.$('[data-clock]', el).value = String((slots.length - RH.SLOTS) * 30));
      bind(ed); N.icons(el);
    }
    function bind(ed) {
      N.$$('[data-goto]', el).forEach((a) => (a.onclick = (e) => { e.preventDefault(); if (dirty && !confirm('Discard unsaved changes?')) return; date = a.dataset.goto; o.onDate && o.onDate(date); load(); draw(); }));
      if (!ed) return;
      let mode = 1;
      N.$$('[data-mode]', el).forEach((b) => (b.onclick = () => { mode = +b.dataset.mode; N.$$('[data-mode]', el).forEach((x) => x.classList.toggle('active', x === b)); }));
      const grid = N.$('.rh-grid', el);
      const paint = (cell) => { const i = +cell.dataset.i; if (slots[i] !== paintVal) { slots[i] = paintVal; cell.classList.toggle('work', !!paintVal); dirty = true; } };
      grid.addEventListener('pointerdown', (e) => { const c = e.target.closest('.rh-cell'); if (!c) return; e.preventDefault(); paintVal = slots[+c.dataset.i] === mode ? (mode ? 0 : 1) : mode; paint(c); grid.setPointerCapture(e.pointerId); });
      grid.addEventListener('pointermove', (e) => { if (paintVal == null) return; const c = document.elementFromPoint(e.clientX, e.clientY); if (c && c.classList.contains('rh-cell') && grid.contains(c)) paint(c); });
      const end = () => { if (paintVal != null) { paintVal = null; draw(); } };
      grid.addEventListener('pointerup', end); grid.addEventListener('pointercancel', end);
      N.$('[data-clock]', el).onchange = (e) => { const adj = +e.target.value; const nn = RH.SLOTS + adj / 30; slots = slots.slice(0, nn).concat(new Array(Math.max(0, nn - slots.length)).fill(0)); dirty = true; draw(); };
      N.$('[data-padd]', el).onclick = () => {
        const s = RH.timeSlot(N.$('[data-ps]', el).value), e = RH.timeSlot(N.$('[data-pe]', el).value), v = +N.$('[data-ptype]', el).value;
        if (isNaN(s) || isNaN(e)) { N.toast('Enter a valid start and end time.', 'error'); return; }
        if (s === e) { N.toast('Start and end time cannot be the same.', 'error', 'Invalid period'); return; }
        if (e > s) { for (let i = s; i < e; i++) slots[i] = v; dirty = true; draw(); return; }
        for (let i = s; i < slots.length; i++) slots[i] = v; dirty = true;
        // midnight crossing → next day draft
        const nd = N.addDays(date, 1); const nx = RH.get(crewId, nd); const ns = nx ? RH.toSlots(nx) : new Array(RH.SLOTS).fill(0);
        for (let i = 0; i < e; i++) ns[i] = v;
        if (nx && !['Draft', 'Correction Requested'].includes(nx.status)) { N.toast('Next day is already submitted — the after-midnight part was not applied.', 'warning'); }
        else { RH.save(crewId, nd, { work: RH.toPeriods(ns), status: nx ? nx.status : 'Draft' }, { context: o.context }); N.toast(`Period crosses midnight: ${RH.slotTime(0)}–${RH.slotTime(e)} added to ${N.fmt.date(nd)} (draft).`, 'info'); }
        draw();
      };
      N.$('[data-clear]', el).onclick = () => { slots = slots.map(() => 0); dirty = true; draw(); };
      N.$('[data-copy]', el).onclick = () => { const p = RH.get(crewId, N.addDays(date, -1)); if (!p) { N.toast('No record for the previous day.', 'warning'); return; } const ps = RH.toSlots(p); slots = slots.map((_, i) => ps[i] || 0); dirty = true; draw(); };
      N.$$('[data-wa]', el).forEach((b) => (b.onclick = () => { const w = N.db.get('workingArrangements', b.dataset.wa); slots = slots.map(() => 0); w.pattern.forEach(([s, e]) => { for (let i = s; i < e; i++) slots[i] = 1; }); dirty = true; draw(); N.toast('Applied “' + w.name + '”. Adjust for actual hours worked.', 'info'); }));
      const doSave = async (status) => {
        const work = RH.toPeriods(slots);
        if (status === 'Submitted') {
          if (!work.length && !(await N.confirm({ title: 'Submit a full day of rest?', msg: 'No work periods are recorded for this day.', danger: false, ok: 'Submit' }))) return;
          const ev = RH.evaluate(crewId, date);
          if (ev.calc !== 'Compliant' && !N.$('[data-rem]', el).value.trim()) { N.toast('Potential non-compliance detected — add a remark explaining the circumstances before submitting.', 'error', 'Remark required'); N.$('[data-rem]', el).focus(); N.$('[data-rem]', el).closest('.field').classList.add('invalid'); return; }
        }
        const r = RH.save(crewId, date, { work, status: status === 'Submitted' ? 'Submitted' : (rec && rec.status === 'Correction Requested' ? 'Correction Requested' : 'Draft'), remarks: N.$('[data-rem]', el).value.trim(), tz: N.$('[data-tz]', el).value, clockAdj: +N.$('[data-clock]', el).value });
        if (!r) return;
        if (!r.offline) { N.activity('crew', crewId, status === 'Submitted' ? `Rest hours submitted for ${N.fmt.date(date)}` : `Rest hours draft saved for ${N.fmt.date(date)}`); N.toast(status === 'Submitted' ? 'Record submitted for review.' : 'Draft saved.', 'success'); if (status === 'Submitted') N.notify('Rest-hours record submitted', `${N.crewName(crewId)} · ${N.fmt.date(date)}`, { icon: 'clock', link: 'pages/vessel-portal/rest-hours-review.html', portal: 'vessel' }); }
        load(); if (r.offline) { rec = r; slots = RH.toSlots(r); } draw(); o.onSaved && o.onSaved(r);
      };
      N.$('[data-save]', el).onclick = () => doSave('Draft');
      N.$('[data-submit]', el).onclick = () => doSave('Submitted');
    }
    load(); draw();
    return { set(c, d2) { if (c) crewId = c; if (d2) date = d2; load(); draw(); }, get date() { return date; } };
  };

  /* --------- review modal --------- */
  RH.reviewModal = (rec, after, opts) => {
    opts = opts || {};
    const ev = RH.evaluate(rec.crewId, rec.date);
    const sl = RH.toSlots(rec); const c = N.crew(rec.crewId);
    const locked = RH.isLocked(rec.vesselId, rec.date);
    const body = N.h(`<div>
      <div class="row between mb-2"><div>${N.crewLink(rec.crewId)}</div><div class="row">${N.badge(ev.calc)}${N.badge(rec.status)}</div></div>
      <div class="rh-scroll"><div class="rh-inner"><div class="rh-grid locked" style="grid-template-columns:repeat(${sl.length},1fr)">${sl.map((v, i) => `<div class="rh-cell ${v ? 'work' : ''} ${ev.viol.has(i) ? 'viol' : ''}" title="${RH.slotTime(i)}"></div>`).join('')}</div><div class="rh-hours" style="grid-template-columns:repeat(${sl.length / 2},1fr)">${Array.from({ length: sl.length / 2 }, (_, h) => `<span>${String(h % 24).padStart(2, '0')}</span>`).join('')}</div></div></div>
      <div class="grid g2 mt-2"><div>${N.dl([['Date', N.fmt.date(rec.date)], ['Vessel', esc(N.vesselName(rec.vesselId))], ['Work', N.fmt.hours(ev.workMin)], ['Rest', N.fmt.hours(ev.restMin)], ['Work periods', esc(RH.periodsLabel(rec.work))], ['Submitted', N.fmt.dateTime(rec.submittedOn)], ['Server receipt', N.fmt.dateTime(rec.receivedOn)], ['Recorded by', esc(rec.recordedBy)], ['Remarks', esc(rec.remarks || '—')]])}</div>
      <div class="rule-list">${ev.rules.map((r) => `<div class="rule ${r.pass === null ? 'na' : r.pass ? 'pass' : 'fail'}"><span class="ri">${N.ico(r.pass === null ? 'minus' : r.pass ? 'check' : 'x')}</span><div><div style="font-weight:600;font-size:12.5px">${esc(r.label)}</div><div class="muted small">${esc(r.detail)}</div></div></div>`).join('')}</div></div>
      ${rec.reviews && rec.reviews.length ? `<h4 class="mt-3">Review history</h4>${N.timeline(rec.reviews.slice().reverse().map((r) => ({ title: r.decision, ts: r.ts, user: r.user, note: r.note })))}` : ''}
      ${locked ? `<div class="alert alert-warning mt-2">${N.ico('lock')}<div>Period locked — review actions unavailable.</div></div>` : ''}
    </div>`);
    const decide = async (decision, close) => {
      let note = '';
      if (decision !== 'Approved') { note = await N.confirm({ title: decision, msg: decision === 'Approved Exception' ? 'Record the applicable exception (e.g. safety of ship/emergency, A2.3 para 14) — the calculated result remains “Potential Non-Compliance”.' : 'Explain what needs to change.', reason: true, reasonLabel: 'Reviewer remarks', ok: decision, danger: decision !== 'Approved Exception' }); if (!note) return false; }
      else if (ev.calc !== 'Compliant' && !(await N.confirm({ title: 'Approve a record with potential non-compliance?', msg: 'Approval confirms the record is accurate. The calculated non-compliance remains on record and in reports.', ok: 'Approve as accurate', danger: false }))) return false;
      const reviews = (rec.reviews || []).concat([{ decision, user: N.user().name, ts: new Date().toISOString(), note: note === true ? '' : note }]);
      N.db.save('restRecords', { id: rec.id, status: decision, reviews }); RH.invalidate();
      N.activity('crew', rec.crewId, `Rest hours ${decision.toLowerCase()} — ${N.fmt.date(rec.date)}`, decision === 'Approved' ? 'teal' : 'warn');
      if (decision === 'Correction Requested') N.notify('Correction requested on your rest hours', `${N.fmt.date(rec.date)}: ${note}`, { icon: 'clock', link: 'pages/seafarer/rest-hours.html', portal: 'seafarer' });
      N.toast(`Record ${decision.toLowerCase()}.`); close(); after && after();
      return true;
    };
    const canAct = !locked && rec.status === 'Submitted' && !opts.readonly;
    N.modal({ title: 'Rest-hours record review', size: 'lg', body, buttons: canAct ? [
      { label: 'Reject', cls: 'btn-soft-danger', keepOpen: true, onClick: (b, close) => decide('Rejected', close).then(() => false) },
      { label: 'Request correction', cls: 'btn-outline', keepOpen: true, onClick: (b, close) => { decide('Correction Requested', close); return false; } },
      ...(ev.calc !== 'Compliant' ? [{ label: 'Approve exception', cls: 'btn-outline', onClick: (b, close) => { decide('Approved Exception', close); return false; } }] : []),
      { label: 'Approve', cls: 'btn-success', icon: 'check', onClick: (b, close) => { decide('Approved', close); return false; } }
    ] : [{ label: 'Close', cls: 'btn-outline' }] });
  };
})();
