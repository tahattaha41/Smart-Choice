// @ts-check
/** حالة حداثة السعر: demo | fresh | stale | unknown */
export function freshness(offer, now = new Date(), maxDays = 30) {
  if (!offer) return { state: 'unknown', days: null };
  if (offer.source === 'demo') return { state: 'demo', days: daysSince(offer.verifiedAt, now) };
  const days = daysSince(offer.verifiedAt, now);
  if (days === null) return { state: 'unknown', days: null };
  return { state: days <= maxDays ? 'fresh' : 'stale', days };
}

export function daysSince(iso, now = new Date()) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((now.getTime() - t) / 86400000));
}
