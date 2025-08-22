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
          
          {/* 安全和兼容性头部 */}
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
