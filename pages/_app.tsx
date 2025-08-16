import type { AppProps } from "next/app";
import Script from "next/script";
import "../styles/index.css";
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics - 延迟加载以优化性能 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-F41WJR47SH"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F41WJR47SH');
        `}
      </Script>
      
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
