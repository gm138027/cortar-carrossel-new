import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="w-full p-6 text-center text-gray-500 sm:p-8 relative z-10 border-t border-gray-200 bg-white/80 backdrop-blur-xl mt-auto">
      <div className="max-w-6xl mx-auto">
        {/* Logo和版权部分 */}
        <div className="flex justify-center items-center mb-6">
          <div className="h-8 w-8 relative mr-2">
            <Image
              src="/logo.png"
              alt={t('site_name') + ' Logo'}
              fill
              className="object-contain"
            />
          </div>
          <span className="font-light text-black">{t('site_name')} © {new Date().getFullYear()}</span>
        </div>

        {/* 社交媒体平台部分 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">{t('suitablePlatforms')}</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto">
            {t('platformDescription')}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 mt-4">
            {/* Instagram */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 p-2">
                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600">Instagram</span>
            </div>

            {/* Twitter/X */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-black p-2">
                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600">Twitter/X</span>
            </div>

            {/* Facebook */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-blue-600 p-2">
                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600">Facebook</span>
            </div>

            {/* TikTok */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-black p-2">
                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600">TikTok</span>
            </div>

            {/* Pinterest */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-red-600 p-2">
                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600">Pinterest</span>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 relative mb-2 rounded-lg overflow-hidden bg-blue-700 p-2">
                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600">LinkedIn</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          {t('subtitle')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
