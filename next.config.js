/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    minimumCacheTTL: 60,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ["api-digisalev2-dev.mltechsoft.com"],
  },
  output: "standalone",
};

module.exports = nextConfig;
