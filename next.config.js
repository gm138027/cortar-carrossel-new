/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  i18n,

  // 优化代码分割，减少主线程阻塞时间
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 优化客户端代码分割
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        cacheGroups: {
          // 将React相关库单独打包
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            chunks: 'all',
            priority: 20,
          },
          // 将大型UI库单独打包
          ui: {
            name: 'ui-libs',
            test: /[\\/]node_modules[\\/](@headlessui|@heroicons|framer-motion)[\\/]/,
            chunks: 'all',
            priority: 15,
          },
          // 将工具库单独打包
          utils: {
            name: 'utils',
            test: /[\\/]node_modules[\\/](file-saver|react-dropzone|react-use-keypress)[\\/]/,
            chunks: 'all',
            priority: 10,
          },
          // 分割ImageSplitter相关组件
          imageSplitter: {
            name: 'image-splitter',
            test: /[\\/]components[\\/]Tools[\\/]ImageSplitter[\\/]/,
            chunks: 'all',
            priority: 8,
            minSize: 0,
          },
          // 分割其他组件
          components: {
            name: 'components',
            test: /[\\/]components[\\/]/,
            chunks: 'all',
            priority: 6,
            minSize: 20000,
          },
          // 默认vendor包
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 5,
            minChunks: 2,
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
