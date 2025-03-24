/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'youtube.com',
      'www.youtube.com',
      'img.youtube.com',
      'i.ytimg.com'
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
      '@/types': './types',
      '@/components': './components',
      '@/lib': './lib'
    }
    return config
  }
}

module.exports = nextConfig
