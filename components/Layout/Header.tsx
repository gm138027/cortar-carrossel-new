import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useNavigation } from '../../hooks/useNavigation';

interface HeaderProps {
  onLanguageChange: (lang: string) => void;
  i18nLanguage: string;
}

const Header: React.FC<HeaderProps> = ({
  onLanguageChange,
  i18nLanguage
}) => {
  const { t } = useTranslation('common');
  const { navigateHome, navigateToFaq } = useNavigation();

  // 处理品牌名称和首页点击
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateHome();
  };

  // 处理FAQ点击
  const handleFaqClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToFaq();
  };

  return (
    <header className="relative bg-white/80 backdrop-blur-xl p-4 border-b border-gray-200 sticky top-0 z-50 shadow-sm" key={i18nLanguage}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-8 w-8 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Cortar Carrossel Logo"
              width={32}
              height={32}
              priority
            />
          </div>
          <Link
            href="/"
            className="text-xl font-bold text-black hover:text-indigo-600 transition-colors"
            onClick={handleHomeClick}
          >
            {t('site_name')}
          </Link>
        </div>

        {/* 主导航 */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            onClick={handleHomeClick}
            className="text-gray-800 hover:text-indigo-600 font-medium transition-colors"
          >
            {t('home', { ns: 'common' })}
          </Link>
          <Link
            href="/#faq"
            onClick={handleFaqClick}
            className="text-gray-800 hover:text-indigo-600 font-medium transition-colors"
          >
            {t('faq', { ns: 'common' })}
          </Link>
        </div>

        {/* 语言切换按钮组 */}
        <div className="flex space-x-2">
          {['en', 'zh', 'pt', 'hi', 'ru'].map((locale) => (
            <button
              key={locale}
              onClick={() => onLanguageChange(locale)}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 text-black bg-gray-100 hover:bg-gray-200`}
            >
              {locale === 'en' ? 'EN' :
               locale === 'zh' ? '中' :
               locale === 'pt' ? 'PT' :
               locale === 'hi' ? 'HI' : 'RU'}
            </button>
          ))}
        </div>

        {/* 移动端菜单按钮 */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
