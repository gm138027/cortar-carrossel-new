/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://cortarcarrossel.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  autoLastmod: true,
  sitemapSize: 7000,

  // 多语言配置
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'zh', 'hi', 'ru'],
  },

  // 排除不需要的页面 - 基于当前项目结构优化
  exclude: [
    '/debug*',
    '/test-*',
    '/p/*',           // 动态照片页面暂时排除
    '/*debug*',
    '/*test*',
    '/api/*',         // API路由排除
    '/_next/*',       // Next.js内部文件
    '/404',           // 错误页面
    '/500'            // 错误页面
  ],

  // 自定义页面优先级和更新频率 - 基于当前项目优化后的结构
  transform: async (config, path) => {
    // 首页 - 最高优先级 (主要品牌关键词"cortar carrossel"已排名第2)
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: [
          { href: 'https://cortarcarrossel.com/', hreflang: 'pt' },
          { href: 'https://cortarcarrossel.com/en/', hreflang: 'en' },
          { href: 'https://cortarcarrossel.com/zh/', hreflang: 'zh' },
          { href: 'https://cortarcarrossel.com/hi/', hreflang: 'hi' },
          { href: 'https://cortarcarrossel.com/ru/', hreflang: 'ru' },
          { href: 'https://cortarcarrossel.com/', hreflang: 'x-default' }
        ]
      }
    }

    // 多语言首页 - 高优先级
    if (path === '/en' || path === '/zh' || path === '/hi' || path === '/ru') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }

    // 核心工具页面 - 最高优先级 (主要流量来源)
    if (path === '/split-image') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.95,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }

    // 英文关键词页面 - 高优先级
    if (path === '/image-splitter-online' || path === '/split-image-instagram') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }

    // 葡萄牙语工具页面 - 高优先级 (本地化关键词)
    if (path === '/cortar-carrossel-infinito' || path === '/cortar-imagem-carrossel' || path === '/dividir-imagem-carrossel') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.85,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }

    // 多语言版本的工具页面 - 中高优先级
    if (path.includes('/split-image') || path.includes('/image-splitter') ||
        path.includes('/cortar-') || path.includes('/dividir-')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }

    // 其他页面 - 标准优先级
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/debug*',
          '/test-*',
          '/p/*',           // 动态照片页面
          '/*debug*',
          '/*test*',
          '/api/*',         // API路由
          '/_next/*',       // Next.js内部文件
          '/404',
          '/500',
          '/*?*utm*',       // 带UTM参数的URL
          '/*?*ref*',       // 带ref参数的URL
        ],
        crawlDelay: 1,      // 爬取延迟1秒，避免服务器压力
      },
      // 针对主要搜索引擎的特殊配置
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/debug*',
          '/test-*',
          '/p/*',
          '/api/*',
          '/_next/*'
        ],
        crawlDelay: 0,      // Google可以更频繁爬取
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/debug*',
          '/test-*',
          '/p/*',
          '/api/*',
          '/_next/*'
        ],
        crawlDelay: 1,
      }
    ],
    additionalSitemaps: [
      'https://cortarcarrossel.com/sitemap.xml'
    ],
    transformRobotsTxt: async (_, robotsTxt) => {
      return robotsTxt + `
# Additional sitemap location
Sitemap: https://cortarcarrossel.com/sitemap.xml

# Website description for search engines
# This site provides free image splitting and carousel creation tools
# All tool pages are welcome to be indexed by search engines

# Recommended crawl frequency guidelines
# Homepage and main tool pages: daily check
# Multi-language pages: weekly check
# Other pages: monthly check

# Last updated: August 2025
`;
    }
  },
};