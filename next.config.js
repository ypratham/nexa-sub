/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["logo.clearbit.com", "img.logo.dev"],
    unoptimized: true,
  },
}

module.exports = nextConfig
