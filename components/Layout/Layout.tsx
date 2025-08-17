import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showHeaderFooter?: boolean; // 控制是否显示Header和Footer
}

const Layout: React.FC<LayoutProps> = ({ children, showHeaderFooter = true }) => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const handleLanguageChange = (newLanguage: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLanguage });
  };

  // 如果不需要显示Header和Footer，直接返回children
  if (!showHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#eef0ff] to-[#ecebfc] font-[Inter,sans-serif] text-black">
      <Header
        onLanguageChange={handleLanguageChange}
        i18nLanguage={i18n.language}
      />

      {/* 内容容器 - 使用flex-grow确保占据所有可用空间 */}
      <div className="flex-grow flex flex-col">
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
