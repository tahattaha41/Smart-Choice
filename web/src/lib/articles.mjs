import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** يقرأ مقالاً بصيغة: front matter (title, description, date, updated, lang) ثم HTML. */
export function parseArticle(file, text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
  if (!m) throw new Error(`${file}: لا يوجد front matter`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  for (const k of ['title', 'description', 'date']) if (!meta[k]) throw new Error(`${file}: الحقل ${k} مطلوب`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: صيغة التاريخ YYYY-MM-DD`);
  const slug = file.replace(/\.html$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`${file}: اسم الملف يجب أن يكون أحرفاً لاتينية صغيرة وشرطات`);
  const html = m[2].trim();
  return { slug, title: meta.title, description: meta.description, published: meta.date, updated: meta.updated || '', lang: meta.lang || 'ar', html, excerpt: meta.description, image: '' };
}

export function loadArticles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.html') && !f.startsWith('_'))
    .map((f) => parseArticle(f, readFileSync(join(dir, f), 'utf8')))
    .sort((a, b) => b.published.localeCompare(a.published));
}
