import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://schemaflow.pages.dev';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/price', '/pricing', '/login', '/register'],
      disallow: ['/dashboard', '/dashboard/', '/editor', '/editor/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
