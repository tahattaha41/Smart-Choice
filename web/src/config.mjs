// إعدادات الموقع (مكان واحد لاسم الموقع والروابط).
const clean = (p) => { p = (p || '').trim(); if (!p || p === '/') return ''; return '/' + p.replace(/^\/+|\/+$/g, ''); };

export const config = {
  siteName: { ar: process.env.SITE_NAME_AR || 'Smart Choice', en: process.env.SITE_NAME_EN || 'Smart Choice' },
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  siteUrl: (process.env.SITE_URL || 'https://tahattaha41.github.io').replace(/\/$/, ''),
  basePath: clean(process.env.BASE_PATH ?? '/Smart-Choice'),
  contactEmail: (process.env.CONTACT_EMAIL || '').trim(),
  currencyCode: 'EGP',
  staleAfterDays: 30,
  vatRate: 14, // نسبة افتراضية قابلة للتعديل في الأداة
  indexDemoData: false, // صفحات المنتجات التجريبية لا تُفهرس في محركات البحث
  lastUpdated: '2026-10-29',
};
