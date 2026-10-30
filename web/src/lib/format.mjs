// @ts-check
const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export const money = (n) => nf.format(Math.round(n));
export const num = (n) => nf1.format(n);
export const pct = (n) => `${nf1.format(n)}%`;

/** تفاعل نصوص {name} */
export function interpolate(str, params = {}) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (k in params ? String(params[k]) : `{${k}}`));
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
