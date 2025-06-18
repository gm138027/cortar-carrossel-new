/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://cortarcarrossel.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  
  // 排除不需要的页面
  exclude: ['/debug*', '/test-*'],
  
  // 自定义页面优先级和更新频率
  transform: async (config, path) => {
    // Split image 相关页面 - 最高优先级
    if (path === '/split-image' || path === '/image-splitter-online') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }
    
    // 首页 - 高优先级
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }
    
    // 其他工具页面 - 中等优先级
    if (path.includes('/cortar-') || path.includes('/dividir-')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }
    
    // How-to 页面 - 中等优先级
    if (path.includes('/how-to-')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }
    
    // 其他页面 - 较低优先级
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
        disallow: ['/debug', '/test-i18n'],
      },
    ],
    additionalSitemaps: [
      'https://cortarcarrossel.com/split-image',
      'https://cortarcarrossel.com/image-splitter-online',
    ],
  },
}; 