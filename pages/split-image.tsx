import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const SplitImage: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t('split_image.page_title')}</title>
        <meta
          name="description"
          content={t('split_image.meta_description') as string}
        />
        <meta name="keywords" content={t('split_image.meta_keywords') as string} />
        <link rel="canonical" href="https://cortarcarrossel.com/split-image" />
        
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
        </div>

        {/* How to Split Image Section */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image.how_to.title')}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('split_image.how_to.step1_title')}</h3>
              <p className="text-gray-600">{t('split_image.how_to.step1_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('split_image.how_to.step2_title')}</h3>
              <p className="text-gray-600">{t('split_image.how_to.step2_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('split_image.how_to.step3_title')}</h3>
              <p className="text-gray-600">{t('split_image.how_to.step3_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('split_image.how_to.step4_title')}</h3>
              <p className="text-gray-600">{t('split_image.how_to.step4_desc')}</p>
            </div>
          </div>
        </section>

        {/* Popular Split Image Sizes */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image.sizes.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">{t('split_image.sizes.size_2x2')}</h3>
              <p className="text-gray-600 mb-4">{t('split_image.sizes.size_2x2_desc')}</p>
              <div className="grid grid-cols-2 gap-1 w-16 h-16 mx-auto">
                <div className="bg-blue-200 rounded"></div>
                <div className="bg-blue-300 rounded"></div>
                <div className="bg-blue-400 rounded"></div>
                <div className="bg-blue-500 rounded"></div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-green-600">{t('split_image.sizes.size_3x3')}</h3>
              <p className="text-gray-600 mb-4">{t('split_image.sizes.size_3x3_desc')}</p>
              <div className="grid grid-cols-3 gap-1 w-16 h-16 mx-auto">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-green-300 rounded" style={{backgroundColor: `hsl(120, 50%, ${60 + i * 3}%)`}}></div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-purple-600">{t('split_image.sizes.size_custom')}</h3>
              <p className="text-gray-600 mb-4">{t('split_image.sizes.size_custom_desc')}</p>
              <div className="grid grid-cols-4 gap-1 w-16 h-16 mx-auto">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-purple-300 rounded" style={{backgroundColor: `hsl(270, 50%, ${60 + i * 2}%)`}}></div>
                ))}
              </div>
            </div>
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
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.use_cases.carousel_title')}</h3>
              <p className="text-gray-600">{t('split_image.use_cases.carousel_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.use_cases.puzzle_title')}</h3>
              <p className="text-gray-600">{t('split_image.use_cases.puzzle_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.use_cases.education_title')}</h3>
              <p className="text-gray-600">{t('split_image.use_cases.education_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('split_image.use_cases.creative_title')}</h3>
              <p className="text-gray-600">{t('split_image.use_cases.creative_desc')}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image.faq.title')}</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{t('split_image.faq.q1')}</h3>
              <p className="text-gray-600">{t('split_image.faq.a1')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{t('split_image.faq.q2')}</h3>
              <p className="text-gray-600">{t('split_image.faq.a2')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{t('split_image.faq.q3')}</h3>
              <p className="text-gray-600">{t('split_image.faq.a3')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{t('split_image.faq.q4')}</h3>
              <p className="text-gray-600">{t('split_image.faq.a4')}</p>
            </div>
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
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default SplitImage; 