/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // Support for Figma assets
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'figma:asset': '/public',
    };
    return config;
  },
};

module.exports = nextConfig;
