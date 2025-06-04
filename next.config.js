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
      // 只保留www到非www的重定向
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
      }
    ]
  }
};
