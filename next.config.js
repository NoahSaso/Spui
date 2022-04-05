const withTM = require("next-transpile-modules")(["react-slider"])
const withPWA = require("next-pwa")

/** @type {import('next').NextConfig} */
const nextConfig = {
  pwa: {
    dest: "public",
  },
  reactStrictMode: true,
  experimental: {
    emotion: true,
  },
}

module.exports = withTM(withPWA(nextConfig))
