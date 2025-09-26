import type { AppProps } from "next/app";
import "../styles/index.css";
import { appWithTranslation } from 'next-i18next';
import Analytics from '../components/Shared/Analytics';
import Layout from '../components/Layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics - 独立组件管理 */}
      <Analytics trackingId="G-F41WJR47SH" />

      {/* 全局布局 - 为所有页面提供统一的导航和页脚 */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default appWithTranslation(MyApp);
