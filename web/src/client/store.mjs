// @ts-check
// مفضلة ومقارنات محفوظة على الجهاز فقط (localStorage). قابلة للاختبار بتمرير storage.

const FAV = 'fav:v1';
const CMP = 'cmp:v1';

export function createStore(storage) {
  const read = (k, fallback) => {
    try { const v = JSON.parse(storage.getItem(k) ?? 'null'); return Array.isArray(v) ? v : fallback; } catch { return fallback; }
  };
  const write = (k, v) => { try { storage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
  const listeners = new Set();
  const emit = () => listeners.forEach((f) => { try { f(); } catch {} });

  return {
    favorites: () => read(FAV, []).filter((s) => typeof s === 'string'),
    isFav(slug) { return this.favorites().includes(slug); },
    toggleFav(slug) {
      const list = this.favorites();
      const i = list.indexOf(slug);
      if (i >= 0) list.splice(i, 1); else list.unshift(slug);
      const ok = write(FAV, list.slice(0, 200));
      emit();
      return ok ? i < 0 : this.isFav(slug);
    },
    comparisons: () => read(CMP, []).filter((c) => c && typeof c.id === 'string' && Array.isArray(c.slugs)),
    saveComparison({ name, slugs }) {
      const list = this.comparisons();
      const key = [...slugs].sort().join(',');
      const existing = list.findIndex((c) => [...c.slugs].sort().join(',') === key);
      if (existing >= 0) list.splice(existing, 1);
      list.unshift({ id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: String(name).slice(0, 80), slugs: slugs.slice(0, 4), at: new Date().toISOString() });
      write(CMP, list.slice(0, 30));
      emit();
    },
    deleteComparison(id) { write(CMP, this.comparisons().filter((c) => c.id !== id)); emit(); },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };
}

export function browserStorage() {
  try { const s = window.localStorage; s.setItem('__t', '1'); s.removeItem('__t'); return s; }
  catch { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, String(v)), removeItem: (k) => void m.delete(k) }; }
}
