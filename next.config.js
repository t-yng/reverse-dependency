const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: true,
  },
  pageExtensions: ["tsx"],
  env: {
    isDevelopment: process.env.NODE_ENV !== "production",
  },
};

module.exports = withVanillaExtract(nextConfig);
