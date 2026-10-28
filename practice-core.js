(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.NaplexPractice = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  function numericValue(value) {
    if (typeof value !== 'string') return null;
    const text = value.trim();
    if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return null;
    const number = Number(text);
    return Number.isFinite(number) ? number : null;
  }
  function ready(question, selected) {
    if (question.type === 'numeric') return numericValue(selected) !== null;
    if (question.type === 'multiple') return Array.isArray(selected) && selected.length > 0 && new Set(selected).size === selected.length && selected.every(n => Number.isInteger(n) && n >= 0 && n < question.options.length);
    return Number.isInteger(selected) && selected >= 0 && selected < question.options.length;
  }
  function grade(question, selected) {
    if (!ready(question, selected)) return false;
    if (question.type === 'numeric') return Math.abs(numericValue(selected) - question.answer) < 1e-9;
    if (question.type === 'multiple') return new Set(selected).size === question.correct.length && question.correct.every(n => selected.includes(n));
    return selected === question.correct;
  }
  return {ready, grade};
});
