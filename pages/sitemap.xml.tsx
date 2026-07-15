import type { GetServerSideProps } from 'next';
import { hotels } from '@/data/hotels';
import { destinations } from '@/data/destinations';
import { interests } from '@/data/interests';
import { experiences } from '@/data/experiences';
import { SITE_URL } from '@/lib/site';

const STATIC_PATHS = ['/', '/search', '/destinations', '/reviews', '/experiences', '/interests', '/about', '/for-hotels', '/contact'];

function buildSitemap(): string {
  const urls = [
    ...STATIC_PATHS,
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...interests.map((i) => `/interests/${i.slug}`),
    ...hotels.map((h) => `/hotels/${h.slug}`),
    ...experiences.map((e) => `/experiences/${e.id}`),
  ];

  const entries = urls
    .map(
      (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'application/xml');
  res.write(buildSitemap());
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
