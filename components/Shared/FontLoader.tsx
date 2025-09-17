import { useEffect } from 'react';

const FontLoader: React.FC = () => {
  useEffect(() => {
    // 检查字体是否已经加载
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (existingLink) {
      return; // 字体已经加载，避免重复加载
    }

    // 优化的异步字体加载
    const loadFonts = () => {
      // 预连接到字体服务（提高性能）
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';

      // 创建字体样式表链接，使用font-display: swap优化
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap';
      link.rel = 'stylesheet';

      // 使用media="print"技巧实现异步加载，避免阻塞渲染
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };

      // 错误处理
      link.onerror = () => {
        console.warn('Failed to load Google Fonts, using fallback fonts');
      };

      // 添加到head
      document.head.appendChild(preconnect1);
      document.head.appendChild(preconnect2);
      document.head.appendChild(link);
    };

    // 延迟加载字体，优先加载关键内容
    const timer = setTimeout(loadFonts, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default FontLoader;