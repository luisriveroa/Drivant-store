/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from external domains if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
