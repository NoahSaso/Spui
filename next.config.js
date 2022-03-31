const withPWA = require("next-pwa")

const nextConfig = withPWA()({
  pwa: {
    dest: "public",
  },
})(
  /** @type {import('next').NextConfig} */
  {
    reactStrictMode: true,
    experimental: {
      emotion: true,
    },
  }
)

module.exports = nextConfig
