/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/shieldsense-platform',
  assetPrefix: '/shieldsense-platform/',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
