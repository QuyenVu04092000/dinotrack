// next.config.mjs
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repoName = "financial_management_fe"; // your GitHub repo name

const baseConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  // optional: remove deprecated experimental.appDir for Next 14
  // experimental: {
  //   appDir: true,
  // },
};

const withPWANextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // remove or comment out the fallbacks block to avoid building fallback worker
  fallbacks: {
    document: "/offline",
  },
})(baseConfig);

export default withPWANextConfig;
