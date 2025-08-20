/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  i18n,

  // 优化代码分割，减少主线程阻塞时间
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 简化代码分割，优化移动端性能
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 6,  // 减少初始请求数
        maxAsyncRequests: 10,   // 减少异步请求数
        cacheGroups: {
          // 只保留最重要的分割：vendor包
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
            minSize: 30000,  // 增加最小大小，避免过小的chunk
          },
        },
      };
    }
    return config;
  },



  async redirects() {
    return [
      // 重定向流量关键词到主要页面
      {
        source: '/split-images',
        destination: '/split-image',
        permanent: true,
      },
      {
        source: '/image-split',
        destination: '/split-image', 
        permanent: true,
      },
      {
        source: '/split-image-online',
        destination: '/split-image',
        permanent: true,
      },
      {
        source: '/split-image-free',
        destination: '/split-image',
        permanent: true,
      },
      {
        source: '/image-splitter',
        destination: '/split-image',
        permanent: true,
      },
      {
        source: '/grid-image-splitter',
        destination: '/split-image',
        permanent: true,
      },
      // 品牌词到流量词的重定向
      {
        source: '/cortar-carrossel',
        destination: '/',
        permanent: false,
      }
    ];
  },

  async rewrites() {
    return [
      // URL重写以支持SEO友好的路径
      {
        source: '/split-image-2x2',
        destination: '/split-image?grid=2x2',
      },
      {
        source: '/split-image-3x3', 
        destination: '/split-image?grid=3x3',
      },
      {
        source: '/split-image-4x4',
        destination: '/split-image?grid=4x4',
      }
    ];
  },

  // 优化图像加载
  images: {
    domains: ['cortarcarrossel.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // 压缩和性能优化
  compress: true,
  poweredByHeader: false,
  
  // 生产环境优化
  env: {
    CUSTOM_KEY: 'split-image-tool',
  },
}

module.exports = nextConfig
