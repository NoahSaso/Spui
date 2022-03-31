const withPWA = require("next-pwa")

const nextConfig = withPWA(
  /** @type {import('next').NextConfig} */
  {
    pwa: {
      dest: "public",
    },
    reactStrictMode: true,
    experimental: {
      emotion: true,
    },
  }
)

module.exports = nextConfig
