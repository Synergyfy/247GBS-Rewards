import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['flagcdn.com'],
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
