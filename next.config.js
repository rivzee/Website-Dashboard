/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    // Enable React Strict Mode for better development experience
    reactStrictMode: true,

    // Enable SWC minification for faster builds
    swcMinify: true,

    // Ignore ESLint and TypeScript errors during build to prevent deployment failures
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    // Configure source directory for monorepo
    distDir: '.next',

    // Page extensions
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

    // Webpack configuration for monorepo
    webpack: (config, { dev, isServer }) => {
        // Add alias for src/client
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, 'src/client'),
            '@client': path.resolve(__dirname, 'src/client'),
            '@shared': path.resolve(__dirname, 'src/shared'),
        };

        // Production optimizations
        if (!dev && !isServer) {
            config.optimization = {
                ...config.optimization,
                moduleIds: 'deterministic',
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor chunk
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules/,
                            priority: 20
                        },
                        // Common chunk
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true,
                            enforce: true
                        }
                    }
                }
            };
        }

        return config;
    },

    // Optimize images
    images: {
        domains: ['localhost'],
        formats: ['image/webp', 'image/avif'],
    },

    // Compiler optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Experimental features for better performance
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },

    // Headers for caching
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
