module.exports = {
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'zh', 'hi', 'ru'],
    localeDetection: true,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: { 
    useSuspense: false
  }
} 