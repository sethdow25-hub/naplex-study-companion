(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.NaplexSyncCore = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  const empty = () => ({version: 1, examDate: '', days: {}, lessons: {}, scores: {}, notes: {}});
  const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  function validKey(key) {
    if (key === 'date') return true;
    const match = /^(d|l)\/(\d{1,2})-(\d)$|^(s|n)\/(\d{1,2})$/.exec(key);
    if (!match) return false;
    const week = Number(match[2] || match[5]);
    return week >= 1 && week <= 12 && (!match[3] || Number(match[3]) < 5);
  }
  function validValue(key, value) {
    if (key === 'date') return typeof value === 'string' && (value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value));
    if (key.startsWith('d/') || key.startsWith('l/')) return typeof value === 'boolean';
    if (key.startsWith('s/')) return value === null || (Number.isInteger(value) && value >= 0 && value <= 100);
    return typeof value === 'string' && value.length <= 30000;
  }
  function cleanRecords(input) {
    const out = Object.create(null);
    if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
    for (const [key, r] of Object.entries(input)) {
      if (!validKey(key) || !r || typeof r !== 'object' || !Number.isSafeInteger(r.n) || r.n < 1 ||
          typeof r.d !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(r.d) || !validValue(key, r.v)) continue;
      out[key] = {n: r.n, d: r.d, v: r.v};
    }
    return out;
  }
  function newer(a, b) {
    if (!a) return b;
    if (!b) return a;
    if (a.n !== b.n) return a.n > b.n ? a : b;
    if (a.d !== b.d) return a.d > b.d ? a : b;
    // A deterministic tie-breaker also handles malformed duplicate revisions.
    return JSON.stringify(a.v) >= JSON.stringify(b.v) ? a : b;
  }
  function merge(first, second) {
    const a = cleanRecords(first), b = cleanRecords(second), out = Object.create(null);
    for (const key of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) out[key] = newer(a[key], b[key]);
    return out;
  }
  function project(records) {
    const result = empty();
    for (const [key, r] of Object.entries(cleanRecords(records))) {
      if (key === 'date') result.examDate = r.v;
      else if (key.startsWith('d/') && r.v) result.days[key.slice(2)] = true;
      else if (key.startsWith('l/') && r.v) result.lessons[key.slice(2)] = true;
      else if (key.startsWith('s/') && r.v !== null) result.scores[key.slice(2)] = r.v;
      else if (key.startsWith('n/') && r.v !== '') result.notes[key.slice(2)] = r.v;
    }
    return result;
  }
  function flatten(state) {
    const out = Object.create(null);
    out.date = state && typeof state.examDate === 'string' ? state.examDate : '';
    for (const [group, prefix] of [['days','d/'], ['lessons','l/'], ['scores','s/'], ['notes','n/']]) {
      const values = state && state[group];
      if (values && typeof values === 'object') for (const [key, value] of Object.entries(values)) {
        const full = prefix + key;
        if (validKey(full) && validValue(full, value)) out[full] = value;
      }
    }
    return out;
  }
  function missingValue(key) {
    if (key === 'date' || key.startsWith('n/')) return '';
    if (key.startsWith('s/')) return null;
    return false;
  }
  function recordChanges(records, state, device, clock) {
    const out = cleanRecords(records), current = flatten(project(out)), next = flatten(state);
    let counter = Math.max(Number.isSafeInteger(clock) ? clock : 0, ...Object.values(out).map(r => r.n), 0);
    for (const key of [...new Set([...Object.keys(current), ...Object.keys(next)])].sort()) {
      const before = own(current, key) ? current[key] : missingValue(key);
      const after = own(next, key) ? next[key] : missingValue(key);
      if (before !== after) out[key] = {n: ++counter, d: device, v: after};
    }
    return {records: out, clock: counter};
  }
  function combineGuest(account, guest) {
    const out = JSON.parse(JSON.stringify(account || empty()));
    for (const group of ['days','lessons']) for (const [key, value] of Object.entries((guest && guest[group]) || {})) if (value === true) out[group][key] = true;
    for (const [key, value] of Object.entries((guest && guest.scores) || {})) if (Number.isInteger(value)) out.scores[key] = Math.max(out.scores[key] || 0, value);
    if (!out.examDate && guest && guest.examDate) out.examDate = guest.examDate;
    for (const [key, note] of Object.entries((guest && guest.notes) || {})) {
      if (!note || typeof note !== 'string') continue;
      if (!out.notes[key]) out.notes[key] = note;
      else if (out.notes[key] !== note && !out.notes[key].includes(note)) out.notes[key] = (out.notes[key] + '\n\nImported from this device:\n' + note).slice(0, 30000);
    }
    return out;
  }
  const sameRecords = (a, b) => JSON.stringify(merge(a, {})) === JSON.stringify(merge(b, {}));
  return {empty, cleanRecords, merge, project, recordChanges, combineGuest, sameRecords};
});
