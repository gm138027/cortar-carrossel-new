import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useNavigation } from '../../hooks/navigation/useNavigation';
import LanguageDropdown from '../Shared/LanguageDropdown';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // 处理移动端菜单切换
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

        {/* 桌面端导航 */}
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

        {/* 右侧控件区域 */}
        <div className="flex items-center space-x-3">
          {/* 语言下拉菜单 */}
          <LanguageDropdown
            currentLanguage={i18nLanguage}
            onLanguageChange={onLanguageChange}
          />

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label={t('mobile_menu')}
            aria-expanded={isMobileMenuOpen}
          >
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/"
              onClick={(e) => {
                handleHomeClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="block text-gray-800 hover:text-indigo-600 font-medium transition-colors py-2"
            >
              {t('home', { ns: 'common' })}
            </Link>
            <Link
              href="/#faq"
              onClick={(e) => {
                handleFaqClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="block text-gray-800 hover:text-indigo-600 font-medium transition-colors py-2"
            >
              {t('faq', { ns: 'common' })}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
