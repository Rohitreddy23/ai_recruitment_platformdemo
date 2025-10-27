/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://YOUR-RENDER-SERVICE.onrender.com/api/:path*' },
      { source: '/health',     destination: 'https://YOUR-RENDER-SERVICE.onrender.com/health' }
    ];
  }
};
module.exports = nextConfig;

