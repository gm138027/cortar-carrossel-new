import { useEffect } from 'react';

const FontLoader: React.FC = () => {
  useEffect(() => {
    // 简化的异步字体加载
    const loadFonts = () => {
      // 创建字体样式表链接
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap';
      link.rel = 'stylesheet';
      
      // 使用media="print"技巧实现异步加载
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      
      // 预连接到字体服务
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      
      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      
      // 添加到head
      document.head.appendChild(preconnect1);
      document.head.appendChild(preconnect2);
      document.head.appendChild(link);
    };

    // 在下一个事件循环中加载，不阻塞当前渲染
    const timer = setTimeout(loadFonts, 0);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default FontLoader;