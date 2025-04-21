/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const API_URL = process.env.API_URL;

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', // For Unsplash images
      'plus.unsplash.com',
      "www.google.com",   // For premium Unsplash
      'source.unsplash.com',
      "media.istockphoto.com" // For random Unsplash
      // Add other domains as needed
    ],
    // Optional: Configure image quality and formats
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // 60 seconds
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/v1/:path*`,
      },
    ];
  },
  // Optional: Add remotePatterns for more control over remote images
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
  ],
};

export default withPWA(nextConfig);