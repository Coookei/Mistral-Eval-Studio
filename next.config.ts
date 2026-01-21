import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true, // allow forbidden() and unauthorized() in server actions/components
  },
};

export default nextConfig;
