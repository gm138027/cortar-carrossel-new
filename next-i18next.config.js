module.exports = {
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'zh', 'hi', 'ru'],
    localeDetection: false, // 绂佺敤鑷姩妫€娴嬩互绗﹀悎 Next.js 15 閰嶇疆瑕佹眰
  },
  ns: [
    'common',
    'home',
    'dividir-imagem-carrossel',
    'cortar-carrossel-infinito',
    'cortar-imagem-carrossel',
    'image-splitter-online',
    'split-image',
    'split-image-instagram',
    'privacy-policy',
    'terms-of-service'
  ],
  defaultNS: 'common',
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: {
    useSuspense: false
  }
}
