module.exports = {
  siteUrl: 'https://cortarcarrossel.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "*", disallow: "/*?*" }
    ],
    additionalSitemaps: [
      'https://cortarcarrossel.com/sitemap.xml',
    ],
  },
  exclude: ['/404'],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false
} 