import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mcom-backend.vercel.app',
      },
    ],
  },
  // async rewrites() {
  //       return [
  //         {
  //           source: '/:path*',
  //           destination: '/',
  //         },
  //       ];
  //     },
};

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: '/:path*',
//         destination: '/',
//       },
//     ];
//   },
// };

export default nextConfig;
