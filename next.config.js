/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // Using Pages Router
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig