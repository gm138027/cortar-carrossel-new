import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    // 检测当前语言，使用locale参数或默认为'en'
    const locale = this.props.__NEXT_DATA__.locale || 'en';
    
    return (
      <Html lang={locale}>
        <Head>
                  <link rel="icon" href="/logo/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo/android-chrome-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo/android-chrome-512x512.png" />
                  <link rel="icon" type="image/png" sizes="32x32" href="/logo/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          
          {/* 添加明确的robots指令，确保允许索引 */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />
          
          {/* Google站点验证 */}
          <meta name="google-site-verification" content="5a4dcea1a15c6d1b" />
          
          {/* 其他重要meta标签 */}
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          
          {/* DNS预取和预连接，优化加载速度 */}
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

          {/* 字体预加载优化 */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
            as="style"
          />
          <noscript>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
              rel="stylesheet"
            />
          </noscript>

          {/* Google AdSense */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9027033456343227"
            crossOrigin="anonymous"
          ></script>
          
          {/* 更新为网站正确的基本信息 */}
          <meta
            name="description"
            content="Cortar Carrossel - 免费专业轮播图切割工具，适用于Instagram与各大社交媒体平台"
          />
          <meta property="og:site_name" content="cortarcarrossel.com" />
          <meta
            property="og:description"
            content="免费在线工具，轻松创建完美的Instagram轮播图和拼图帖子"
          />
          <meta property="og:title" content="Cortar Carrossel - 轮播图切割工具" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://cortarcarrossel.com/cortar-carrossel-preview.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="https://cortarcarrossel.com" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Cortar Carrossel - 轮播图切割工具" />
          <meta
            name="twitter:description"
            content="免费在线工具，轻松创建完美的Instagram轮播图和拼图帖子"
          />
          <meta name="twitter:image" content="https://cortarcarrossel.com/cortar-carrossel-preview.png" />
          
          {/* 结构化CSP策略 - 基于最小权限原则设计 */}
          <meta httpEquiv="Content-Security-Policy" content={`
            upgrade-insecure-requests;

            script-src 'self' 'unsafe-inline' 'unsafe-eval'
              https://pagead2.googlesyndication.com
              https://www.googletagmanager.com
              https://partner.googleadservices.com
              https://tpc.googlesyndication.com
              https://fundingchoicesmessages.google.com
              https://googleads.g.doubleclick.net
              https://securepubads.g.doubleclick.net
              https://www.google.com;

            style-src 'self' 'unsafe-inline'
              https://fonts.googleapis.com
              https://tagmanager.google.com;

            font-src 'self'
              https://fonts.gstatic.com;

            img-src 'self' data: blob:
              https://cortarcarrossel.com
              https://res.cloudinary.com
              https://googleads.g.doubleclick.net
              https://www.google.com
              https://www.google-analytics.com;

            connect-src 'self'
              https://res.cloudinary.com
              https://www.google-analytics.com
              https://www.googletagmanager.com
              https://googleads.g.doubleclick.net
              https://securepubads.g.doubleclick.net
              https://partner.googleadservices.com
              https://pagead2.googlesyndication.com
              https://fundingchoicesmessages.google.com;

            frame-src 'self'
              https://googleads.g.doubleclick.net
              https://tpc.googlesyndication.com
              https://safeframe.googlesyndication.com
              https://www.google.com;

            worker-src 'self'
              https://pagead2.googlesyndication.com;

            child-src 'self'
              https://googleads.g.doubleclick.net
              https://tpc.googlesyndication.com;

            manifest-src 'self';
            media-src 'self' data: blob:;
            object-src 'none';
            base-uri 'self';
            form-action 'self';
          `.replace(/\s+/g, ' ').trim()} />
        </Head>
        <body className="bg-gradient-to-br from-[#eef0ff] to-[#ecebfc] antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
