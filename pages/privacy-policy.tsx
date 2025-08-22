import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacy-policy');
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'pt';

  // 生成多语言URL
  const getLocalizedUrl = (locale: string) => {
    return `https://cortarcarrossel.com${locale === 'pt' ? '' : `/${locale}`}/privacy-policy`;
  };

  return (
    <>
      <Head>
        <title>{t('page_title')}</title>
        <meta name="description" content={t('meta_description')} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('page_title')} />
        <meta property="og:description" content={t('meta_description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={getLocalizedUrl(currentLocale)} />
        <meta property="og:site_name" content="Cortar Carrossel" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t('page_title')} />
        <meta name="twitter:description" content={t('meta_description')} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={getLocalizedUrl(currentLocale)} />
        
        {/* Hreflang */}
        <link rel="alternate" hrefLang="pt" href={getLocalizedUrl('pt')} />
        <link rel="alternate" hrefLang="en" href={getLocalizedUrl('en')} />
        <link rel="alternate" hrefLang="zh" href={getLocalizedUrl('zh')} />
        <link rel="alternate" hrefLang="hi" href={getLocalizedUrl('hi')} />
        <link rel="alternate" hrefLang="ru" href={getLocalizedUrl('ru')} />
        <link rel="alternate" hrefLang="x-default" href={getLocalizedUrl('pt')} />

        {/* JSON-LD结构化数据 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": t('page_title'),
            "description": t('meta_description'),
            "url": getLocalizedUrl(currentLocale),
            "inLanguage": currentLocale,
            "isPartOf": {
              "@type": "WebSite",
              "name": "Cortar Carrossel",
              "url": "https://cortarcarrossel.com"
            },
            "about": {
              "@type": "Thing",
              "name": "Privacy Policy",
              "description": "Privacy policy for Cortar Carrossel image splitting tool"
            }
          })}
        </script>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('heading')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('last_updated')}
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            {/* 简介 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('introduction.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('introduction.content')}
              </p>
            </section>

            {/* 信息收集 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('data_collection.title')}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {t('data_collection.image_processing.subtitle')}
                  </h3>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                    <p className="text-gray-700">
                      {t('data_collection.image_processing.content')}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {t('data_collection.analytics.subtitle')}
                  </h3>
                  <p className="text-gray-700">
                    {t('data_collection.analytics.content')}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {t('data_collection.preferences.subtitle')}
                  </h3>
                  <p className="text-gray-700">
                    {t('data_collection.preferences.content')}
                  </p>
                </div>
              </div>
            </section>

            {/* 信息使用 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('data_use.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('data_use.purposes', { returnObjects: true }) as string[]).map((purpose, index) => (
                  <li key={index}>{purpose}</li>
                ))}
              </ul>
            </section>

            {/* Cookie和本地存储 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('cookies.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('cookies.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                {(t('cookies.types', { returnObjects: true }) as string[]).map((type, index) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
              <p className="text-gray-700">
                {t('cookies.management')}
              </p>
            </section>

            {/* 第三方服务 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('third_party.title')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {t('third_party.google_analytics.subtitle')}
                  </h3>
                  <p className="text-gray-700">
                    {t('third_party.google_analytics.content')}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {t('third_party.vercel.subtitle')}
                  </h3>
                  <p className="text-gray-700">
                    {t('third_party.vercel.content')}
                  </p>
                </div>
              </div>
            </section>

            {/* 数据安全 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('data_security.title')}
              </h2>
              <p className="text-gray-700">
                {t('data_security.content')}
              </p>
            </section>

            {/* 用户权利 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('user_rights.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                {(t('user_rights.rights', { returnObjects: true }) as string[]).map((right, index) => (
                  <li key={index}>{right}</li>
                ))}
              </ul>
              <p className="text-gray-700">
                {t('user_rights.contact')}
              </p>
            </section>

            {/* 儿童隐私 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('children_privacy.title')}
              </h2>
              <p className="text-gray-700">
                {t('children_privacy.content')}
              </p>
            </section>

            {/* 政策更新 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('policy_changes.title')}
              </h2>
              <p className="text-gray-700">
                {t('policy_changes.content')}
              </p>
            </section>

            {/* 联系我们 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('contact.title')}
              </h2>
              <p className="text-gray-700 mb-2">
                {t('contact.content')}
              </p>
              <p className="text-blue-600 font-medium">
                {t('contact.website')}
              </p>
            </section>
          </div>

          {/* 返回首页链接 */}
          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← {tCommon('back_to_home')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'pt', ['privacy-policy', 'common'])),
    },
  };
};

export default PrivacyPolicy; 