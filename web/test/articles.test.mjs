import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArticle } from '../src/lib/articles.mjs';

const ok = '---\ntitle: عنوان\ndescription: وصف\ndate: 2026-10-30\n---\n<p>نص</p>';
test('يقرأ المقال والـ slug', () => {
  const a = parseArticle('2026-10-30-how-to-buy.html', ok);
  assert.equal(a.slug, 'how-to-buy'); assert.equal(a.title, 'عنوان'); assert.equal(a.lang, 'ar'); assert.equal(a.html, '<p>نص</p>');
});
test('يرفض حقلاً ناقصاً أو تاريخاً خاطئاً أو اسماً غير لاتيني', () => {
  assert.throws(() => parseArticle('a.html', '---\ntitle: x\ndate: 2026-10-30\n---\nz'));
  assert.throws(() => parseArticle('a.html', ok.replace('2026-10-30', '30/10/2026')));
  assert.throws(() => parseArticle('مقال.html', ok));
  assert.throws(() => parseArticle('a.html', 'بدون'));
});
