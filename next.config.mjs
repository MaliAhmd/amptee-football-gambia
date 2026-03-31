/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or higher if needed
    },
  },
};

console.log('Next.js experimental config loaded:', nextConfig.experimental.serverActions);
export default nextConfig;