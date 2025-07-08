// scripts/generate-sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const HOST = 'https://mtvd-design.com';

const staticRoutes = [
  '/',            // Home
  '/intro',
  '/projects',
  '/projectsHome',
  '/awardsandpress',
  '/studio',
  '/contact',
];

(async () => {
  const stream = new SitemapStream({ hostname: HOST });

  staticRoutes.forEach(url =>
    stream.write({
      url,
      changefreq: 'monthly',
      priority: url === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    })
  );

  stream.end();
  const xml = await streamToPromise(stream);
  createWriteStream('public/sitemap.xml').end(xml.toString());
  console.log(`✅  sitemap.xml generado (${staticRoutes.length} URLs)`);
})();
