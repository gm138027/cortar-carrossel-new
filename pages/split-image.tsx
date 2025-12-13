import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const SplitImage: NextPage = () => {
  const { t, i18n } = useTranslation("split-image");

  return (
    <>
      <Head>
        <title>{t('split_image.page_title')}</title>
        <meta
          name="description"
          content={t('split_image.meta_description') as string}
        />
        <meta name="keywords" content={t('split_image.meta_keywords') as string} />
        {/* Canonical: current language version */} {/* 规范链接：当前语言版本 */}
        <link rel="canonical" href={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}split-image`} />

        {/* Hreflang for multilingual versions */} {/* 多语言版本的 hreflang 指示 */}
        <link rel="alternate" hrefLang="pt" href="https://cortarcarrossel.com/split-image" />
        <link rel="alternate" hrefLang="en" href="https://cortarcarrossel.com/en/split-image" />
        <link rel="alternate" hrefLang="zh" href="https://cortarcarrossel.com/zh/split-image" />
        <link rel="alternate" hrefLang="hi" href="https://cortarcarrossel.com/hi/split-image" />
        <link rel="alternate" hrefLang="ru" href="https://cortarcarrossel.com/ru/split-image" />
        <link rel="alternate" hrefLang="x-default" href="https://cortarcarrossel.com/split-image" />
        
        {/* Enhanced Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": t('split_image.hero.title') + ' - ' + t('split_image.hero.title_free'),
              "url": "https://cortarcarrossel.com/split-image",
              "description": t('split_image.meta_description'),
              "applicationCategory": "DesignApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                t('split_image.hero.feature_1'),
                t('split_image.hero.feature_2'), 
                t('split_image.hero.feature_3')
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "2847"
              }
            })
          }}
        />
        
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": t('split_image.faq.q1'),
                  "acceptedAnswer": {
                    "@type": "Answer", 
                    "text": t('split_image.faq.a1')
                  }
                },
                {
                  "@type": "Question",
                  "name": t('split_image.faq.q2'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('split_image.faq.a2')
                  }
                },
                {
                  "@type": "Question", 
                  "name": t('split_image.faq.q3'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('split_image.faq.a3')
                  }
                },
                {
                  "@type": "Question", 
                  "name": t('split_image.faq.q4'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('split_image.faq.a4')
                  }
                }
              ]
            })
          }}
        />
      </Head>

      <main className="flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        
        {/* Hero Section - Optimized for "Split Image" */}
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('split_image.hero.title')} <span className="text-blue-600">{t('split_image.hero.title_free')}</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            {t('split_image.hero.subtitle')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-600">{t('split_image.hero.feature_1')}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-600">{t('split_image.hero.feature_2')}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-600">{t('split_image.hero.feature_3')}</span>
            </div>
          </div>
          
          <Link href="/" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
            {t('split_image.hero.cta')}
          </Link>
          <p className="mt-4 text-base text-gray-500">
            {t('split_image.hero.secondary_note_before')}{" "}
            <Link href="/" className="text-blue-600 underline">
              {t('split_image.hero.secondary_note_link')}
            </Link>
            {t('split_image.hero.secondary_note_after')}
          </p>
        </div>

        {/* How to Split Image Section */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image.how_to.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['step1', 'step2', 'step3'].map((step, index) => (
              <div key={step} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t(`split_image.how_to.${step}_title`)}</h3>
                <p className="text-gray-600">{t(`split_image.how_to.${step}_desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Cortar Carrossel section (textual introduction) */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image.sizes.title')}</h2>
          <div className="bg-white p-8 rounded-2xl shadow-md text-lg text-gray-700 leading-relaxed">
            <p>{t('split_image.sizes.description')}</p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image.benefits.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.benefits.instant_title')}</h3>
              <p className="text-gray-600">{t('split_image.benefits.instant_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.benefits.private_title')}</h3>
              <p className="text-gray-600">{t('split_image.benefits.private_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.benefits.quality_title')}</h3>
              <p className="text-gray-600">{t('split_image.benefits.quality_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.benefits.devices_title')}</h3>
              <p className="text-gray-600">{t('split_image.benefits.devices_desc')}</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image.use_cases.title')}</h2>
          <div className="space-y-6">
            {['carousel', 'puzzle', 'education', 'creative'].map((key) => (
              <div key={key} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">{t(`split_image.use_cases.${key}_title`)}</h3>
                <p className="text-gray-600">{t(`split_image.use_cases.${key}_desc`)}</p>
              </div>
            ))}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.use_cases.igridmaker_title')}</h3>
              <p
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: t('split_image.use_cases.igridmaker_desc') }}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image.faq.title')}</h2>
          <div className="space-y-4">
            {['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].map((key) => (
              <div key={key} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">{t(`split_image.faq.${key}`)}</h3>
                <p className="text-gray-600">{t(`split_image.faq.a${key.slice(1)}`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">{t('split_image.final_cta.title')}</h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('split_image.final_cta.subtitle')}
          </p>
          <Link href="/" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
            {t('split_image.final_cta.button')}
          </Link>
        </section>
      </main>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "split-image"])),
    },
  };
}

export default SplitImage; 
