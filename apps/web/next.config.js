/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'INMO'; // GitHub repo name — used as base path on Pages

const nextConfig = {
  output: 'export',           // static HTML export
  trailingSlash: true,        // required for GitHub Pages routing
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',

  images: {
    unoptimized: true,        // Next image optimization needs a server; disable for static
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : '',
  },
};

module.exports = nextConfig;
