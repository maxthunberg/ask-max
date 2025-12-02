/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true, // Better compatibility for Figma Make and Vercel
  },
  // Support for Figma assets and image imports
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'figma:asset': '/public',
    };
    
    // Handle image imports
    config.module.rules.push({
      test: /\.(jpg|jpeg|png|gif|webp)$/,
      type: 'asset/resource',
    });
    
    return config;
  },
};

module.exports = nextConfig;
