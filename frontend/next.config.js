/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ai-recruitment-platformdemo.onrender.com/api/:path*'
      },
      {
        source: '/health',
        destination: 'https://ai-recruitment-platformdemo.onrender.com/health'
      }
    ];
  }
};

module.exports = nextConfig;
