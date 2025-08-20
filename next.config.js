/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,

  i18n,

  // 精准代码分割，优化移动端和桌面端性能
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 8,  // 平衡加载性能和执行效率
        maxAsyncRequests: 12,   // 允许更多异步chunk
        cacheGroups: {
          // React核心库 - 最高优先级，避免重复初始化
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            chunks: 'all',
            priority: 30,
            enforce: true,  // 强制分离，确保不重复
          },
          // Next.js框架核心
          nextjs: {
            name: 'nextjs',
            test: /[\\/]node_modules[\\/](next)[\\/]/,
            chunks: 'all',
            priority: 25,
          },
          // UI组件库 - 中等优先级
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](@headlessui|@heroicons)[\\/]/,
            chunks: 'all',
            priority: 20,
            minSize: 10000,
          },
          // 国际化库 - 重要但可延迟
          i18n: {
            name: 'i18n',
            test: /[\\/]node_modules[\\/](next-i18next|react-i18next|i18next)[\\/]/,
            chunks: 'all',
            priority: 18,
            minSize: 15000,
          },
          // 动画和交互库
          animation: {
            name: 'animation',
            test: /[\\/]node_modules[\\/](framer-motion|react-swipeable|react-dropzone)[\\/]/,
            chunks: 'all',
            priority: 15,
            minSize: 10000,
          },
          // 工具库
          utils: {
            name: 'utils',
            test: /[\\/]node_modules[\\/](file-saver|react-use-keypress|react-hooks-global-state)[\\/]/,
            chunks: 'all',
            priority: 12,
            minSize: 8000,
          },
          // 其他第三方库
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
            minSize: 20000,  // 避免过小的chunk
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
