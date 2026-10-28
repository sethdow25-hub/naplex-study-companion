(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.NaplexFocusCore = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  // Scores are best correct-answer counts. A missing week differs from a score of 0.
  function clean(input) {
    const out = {};
    if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
    for (let week = 1; week <= 12; week++) {
      const value = input[String(week)];
      if (Number.isInteger(value) && value >= 0 && value <= 100) out[week] = value;
    }
    return out;
  }
  function merge(first, second) {
    const a = clean(first), b = clean(second), out = {};
    for (let week = 1; week <= 12; week++) {
      const key = String(week);
      if (Object.hasOwn(a, key) || Object.hasOwn(b, key)) out[key] = Math.max(a[key] ?? 0, b[key] ?? 0);
    }
    return out;
  }
  const same = (a, b) => JSON.stringify(clean(a)) === JSON.stringify(clean(b));
  return {clean, merge, same};
});
