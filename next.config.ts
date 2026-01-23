import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['flagcdn.com', 'placehold.co', 'api.qrserver.com', 'images.unsplash.com', 'mcom-backend.vercel.app'],
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
