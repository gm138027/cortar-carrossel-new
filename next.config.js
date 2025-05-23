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
};
