import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SchemaFlow Database Modeler',
    short_name: 'SchemaFlow',
    description: 'Visual Database Design Tool for PostgreSQL, MySQL, and MongoDB with real-time collaboration.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
