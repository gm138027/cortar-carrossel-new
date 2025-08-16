import type { AppProps } from "next/app";
import "../styles/index.css";
import { appWithTranslation } from 'next-i18next';
import Analytics from '../components/Analytics';
import FontLoader from '../components/FontLoader';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* 字体加载 - 异步加载不阻塞渲染 */}
      <FontLoader />
      
      {/* Google Analytics - 独立组件管理 */}
      <Analytics trackingId="G-F41WJR47SH" />
      
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
