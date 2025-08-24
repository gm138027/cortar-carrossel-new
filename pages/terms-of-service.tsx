import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const TermsOfService = () => {
  const { t } = useTranslation('terms-of-service');
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'pt';

  // 生成多语言URL
  const getLocalizedUrl = (locale: string) => {
    return `https://cortarcarrossel.com${locale === 'pt' ? '' : `/${locale}`}/terms-of-service`;
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
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
                "name": "Terms of Service",
                "description": "Terms of service for Cortar Carrossel image splitting tool"
              }
            })
          }}
        />
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

            {/* 服务描述 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('service_description.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('service_description.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('service_description.features', { returnObjects: true }) as string[]).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </section>

            {/* 用户义务 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('user_obligations.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('user_obligations.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('user_obligations.obligations', { returnObjects: true }) as string[]).map((obligation, index) => (
                  <li key={index}>{obligation}</li>
                ))}
              </ul>
            </section>

            {/* 知识产权 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('intellectual_property.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('intellectual_property.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('intellectual_property.rights', { returnObjects: true }) as string[]).map((right, index) => (
                  <li key={index}>{right}</li>
                ))}
              </ul>
            </section>

            {/* 隐私和数据 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy_and_data.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('privacy_and_data.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('privacy_and_data.data_practices', { returnObjects: true }) as string[]).map((practice, index) => (
                  <li key={index}>{practice}</li>
                ))}
              </ul>
            </section>

            {/* 服务可用性 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('service_availability.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('service_availability.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('service_availability.limitations', { returnObjects: true }) as string[]).map((limitation, index) => (
                  <li key={index}>{limitation}</li>
                ))}
              </ul>
            </section>

            {/* 免责声明 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('disclaimer.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('disclaimer.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('disclaimer.exclusions', { returnObjects: true }) as string[]).map((exclusion, index) => (
                  <li key={index}>{exclusion}</li>
                ))}
              </ul>
            </section>

            {/* 责任限制 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('limitation_of_liability.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('limitation_of_liability.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('limitation_of_liability.scope', { returnObjects: true }) as string[]).map((scope, index) => (
                  <li key={index}>{scope}</li>
                ))}
              </ul>
            </section>

            {/* 赔偿 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('indemnification.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('indemnification.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('indemnification.coverage', { returnObjects: true }) as string[]).map((coverage, index) => (
                  <li key={index}>{coverage}</li>
                ))}
              </ul>
            </section>

            {/* 服务终止 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('termination.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('termination.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(t('termination.circumstances', { returnObjects: true }) as string[]).map((circumstance, index) => (
                  <li key={index}>{circumstance}</li>
                ))}
              </ul>
            </section>

            {/* 适用法律 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('governing_law.title')}
              </h2>
              <p className="text-gray-700">
                {t('governing_law.content')}
              </p>
            </section>

            {/* 条款变更 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('changes_to_terms.title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('changes_to_terms.content')}
              </p>
              <p className="text-gray-700">
                {t('changes_to_terms.notification')}
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
      ...(await serverSideTranslations(locale ?? 'pt', ['terms-of-service', 'common'])),
    },
  };
};

export default TermsOfService; 