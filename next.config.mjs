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

};

export default withPWA(nextConfig);