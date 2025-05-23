module.exports = {
  siteUrl: 'https://cortarcarrossel.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" }
    ],
    additionalSitemaps: [
      'https://cortarcarrossel.com/sitemap.xml',
    ],
  },
  exclude: ['/404'],
} 