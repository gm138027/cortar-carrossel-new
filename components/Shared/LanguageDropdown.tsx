import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'next-i18next';
import FlagIcon from '../Icons/FlagIcon';

interface LanguageDropdownProps {
  currentLanguage: string;
  onLanguageChange: (locale: string) => void;
}

// 语言配置 - 完全国际化，无硬编码
const LANGUAGE_CONFIG = [
  { code: 'pt', key: 'portuguese' },
  { code: 'en', key: 'english' },
  { code: 'zh', key: 'chinese' },
  { code: 'hi', key: 'hindi' },
  { code: 'ru', key: 'russian' }
];

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const { t } = useTranslation('common');

  // 获取当前语言的显示名称
  const getCurrentLanguageDisplay = () => {
    const current = LANGUAGE_CONFIG.find(lang => lang.code === currentLanguage);
    return current ? t(`languages.${current.key}`) : (currentLanguage || 'PT').toUpperCase();
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button 
          className="inline-flex w-full justify-center items-center gap-x-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label={t('language_selector')}
        >
          <FlagIcon locale={currentLanguage} className="w-5 h-4" />
          <span className="hidden sm:inline">{getCurrentLanguageDisplay()}</span>
          <span className="sm:hidden">{(currentLanguage || 'PT').toUpperCase()}</span>
          <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {LANGUAGE_CONFIG.map((language) => (
              <Menu.Item key={language.code}>
                {({ active }) => (
                  <button
                    onClick={() => onLanguageChange(language.code)}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } ${
                      currentLanguage === language.code ? 'bg-indigo-50 text-indigo-700' : ''
                    } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150`}
                    aria-label={t(`languages.select_${language.key}`)}
                  >
                    <FlagIcon locale={language.code} className="w-5 h-4 mr-3" />
                    <span className="flex-1 text-left">
                      {t(`languages.${language.key}`)}
                    </span>
                    {currentLanguage === language.code && (
                      <span className="text-indigo-600 ml-2" aria-hidden="true">✓</span>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageDropdown;
