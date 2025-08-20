import Script from 'next/script';
import { useEffect, useState } from 'react';

interface AnalyticsProps {
  trackingId: string;
}

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

const Analytics: React.FC<AnalyticsProps> = ({ trackingId }) => {
  const [shouldLoadGTM, setShouldLoadGTM] = useState(false);

  useEffect(() => {
    // 初始化dataLayer
    window.dataLayer = window.dataLayer || [];

    // 延迟5秒后再加载GTM，确保关键内容先渲染
    const timer = setTimeout(() => {
      setShouldLoadGTM(true);
    }, 5000);

    // 或者在用户交互后立即加载
    const handleUserInteraction = () => {
      setShouldLoadGTM(true);
      clearTimeout(timer);
    };

    // 监听用户交互事件
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
    });

    return () => {
      clearTimeout(timer);
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  // 只有在shouldLoadGTM为true时才渲染GTM脚本
  if (!shouldLoadGTM) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
};

export default Analytics;