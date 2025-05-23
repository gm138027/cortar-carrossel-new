import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

const Debug: NextPage = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation(['common']);

  const allTranslations = {
    home: t('home'),
    previewArea: t('preview_area'),
    settings: t('settings'),
    moreTools: t('more_tools'),
    title: t('title'),
    subtitle: t('subtitle'),
    upload: t('upload'),
    columns: t('columns'),
    rows: t('rows'),
    preview: t('preview')
  };

  const changeLanguage = (locale: string) => {
    router.push('/debug', '/debug', { locale });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Head>
        <title>i18n 调试页面</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Next.js i18n 调试页面</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">路由信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-medium">当前语言:</span> {router.locale}</div>
            <div><span className="font-medium">默认语言:</span> {router.defaultLocale}</div>
            <div><span className="font-medium">可用语言:</span> {router.locales?.join(', ')}</div>
            <div><span className="font-medium">路径:</span> {router.asPath}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">语言切换测试</h2>
          <div className="flex space-x-2 mb-4">
            {['en', 'zh', 'pt', 'hi', 'ru'].map((locale) => (
              <button
                key={locale}
                onClick={() => changeLanguage(locale)}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  router.locale === locale 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">翻译内容测试</h2>
          <div className="divide-y">
            {Object.entries(allTranslations).map(([key, value]) => (
              <div key={key} className="py-3 flex">
                <div className="w-1/3 font-medium">{key}:</div>
                <div className="w-2/3">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">调试信息</h2>
          <div className="mb-4">
            <div><span className="font-medium">i18n 初始化状态:</span> {i18n.isInitialized ? '已初始化' : '未初始化'}</div>
            <div><span className="font-medium">i18n 语言:</span> {i18n.language}</div>
            <div><span className="font-medium">i18n 命名空间:</span> {Array.isArray(i18n.options?.ns) ? i18n.options.ns.join(', ') : i18n.options?.ns}</div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" legacyBehavior>
            <a className="text-blue-600 hover:text-blue-800">返回主页</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Debug; 