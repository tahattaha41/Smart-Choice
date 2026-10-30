import { ui } from './ui.mjs';
import { interpolate } from './lib/format.mjs';

/** دالة ترجمة صارمة وقت البناء: أي مفتاح ناقص يوقف البناء */
export function makeT(lang) {
  const dict = ui[lang];
  return (key, params) => {
    if (!(key in dict)) throw new Error(`مفتاح ترجمة ناقص: ${key} (${lang})`);
    return params ? interpolate(dict[key], params) : dict[key];
  };
}
export const jsDict = (lang) => Object.fromEntries(Object.entries(ui[lang]).filter(([k]) => k.startsWith('js.')));
export const dirOf = (lang) => (lang === 'ar' ? 'rtl' : 'ltr');
export const otherLang = (lang) => (lang === 'ar' ? 'en' : 'ar');
