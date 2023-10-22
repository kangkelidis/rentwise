/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com']
  }
}

module.exports = {
    experimental: {
      serverActions: true,
    },
  }