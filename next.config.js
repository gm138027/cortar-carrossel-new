const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/my-account/**",
        search: "",
      },
    ],
  },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'zh', 'hi', 'ru'],
  },
  async redirects() {
    return [
      // 强制HTTP到HTTPS的跳转 (不依赖于主机名)
      {
        source: '/:path*',
        permanent: true,
        destination: 'https://cortarcarrossel.com/:path*',
        basePath: false,
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http'
          }
        ]
      },
      // 将HTTP非www版本重定向到HTTPS非www版本
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'cortarcarrossel.com',
          },
        ],
        permanent: true,
        destination: 'https://cortarcarrossel.com/:path*',
      },
      // 将HTTP www版本重定向到HTTPS非www版本
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.cortarcarrossel.com',
          },
        ],
        permanent: true,
        destination: 'https://cortarcarrossel.com/:path*',
      },
      // 处理带有ref参数的URL
      {
        source: '/:path*',
        has: [
          { type: 'query', key: 'ref' }
        ],
        destination: 'https://cortarcarrossel.com/:path*',
        permanent: true,
      },
      // 处理带有utm_source参数的URL
      {
        source: '/:path*',
        has: [
          { type: 'query', key: 'utm_source' }
        ],
        destination: 'https://cortarcarrossel.com/:path*',
        permanent: true,
      },
      // 处理带有utm_medium参数的URL
      {
        source: '/:path*',
        has: [
          { type: 'query', key: 'utm_medium' }
        ],
        destination: 'https://cortarcarrossel.com/:path*',
        permanent: true,
      },
      // 处理带有utm_campaign参数的URL
      {
        source: '/:path*',
        has: [
          { type: 'query', key: 'utm_campaign' }
        ],
        destination: 'https://cortarcarrossel.com/:path*',
        permanent: true,
      },
      // 处理带有utm_content参数的URL
      {
        source: '/:path*',
        has: [
          { type: 'query', key: 'utm_content' }
        ],
        destination: 'https://cortarcarrossel.com/:path*',
        permanent: true,
      },
      // 处理带有utm_term参数的URL
      {
        source: '/:path*',
        has: [
          { type: 'query', key: 'utm_term' }
        ],
        destination: 'https://cortarcarrossel.com/:path*',
        permanent: true,
      }
    ]
  }
};
