/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api-dashboard.iysa.or.id" }],
  },
};
export default nextConfig;
