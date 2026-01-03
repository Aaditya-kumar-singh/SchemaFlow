/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimize for faster startup in development
    experimental: {
        // Disable type checking during development for faster builds
        typedRoutes: false,
    },
    // Reduce compilation time
    swcMinify: true,
    // Only compile what's needed
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    // Disable source maps in development for faster builds
    productionBrowserSourceMaps: false,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
    // Force specific timeout to allow more time for static generation
    staticPageGenerationTimeout: 200,
}

module.exports = nextConfig
