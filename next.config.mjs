/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Ensure TypeScript and ESLint errors are checked during build
    typescript: {
      ignoreBuildErrors: false,
    },
    eslint: {
      ignoreDuringBuilds: false,
    },
    // Optimize for Vercel deployment
    output: 'standalone',
};

export default nextConfig;