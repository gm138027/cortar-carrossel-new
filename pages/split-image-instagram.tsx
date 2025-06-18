import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const SplitImageInstagram: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t('split_image_instagram.page_title')}</title>
        <meta
          name="description"
          content={t('split_image_instagram.meta_description')}
        />
        <meta name="keywords" content={t('split_image_instagram.meta_keywords')} />
        <link rel="canonical" href="https://cortarcarrossel.com/split-image-instagram" />
        
        {/* Schema for Instagram-specific tool */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": t('split_image_instagram.hero.title') + ' ' + t('split_image_instagram.hero.title_instagram'),
              "url": "https://cortarcarrossel.com/split-image-instagram",
              "description": t('split_image_instagram.meta_description'),
              "applicationCategory": "SocialNetworkingApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                t('split_image_instagram.hero.feature_1'),
                t('split_image_instagram.hero.feature_2'),
                t('split_image_instagram.hero.feature_3')
              ]
            })
          }}
        />
      </Head>

      <main className="flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#eef0ff] to-[#ecebfc] min-h-screen">
        
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('split_image_instagram.hero.title')} <span className="text-pink-600">{t('split_image_instagram.hero.title_instagram')}</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            {t('split_image_instagram.hero.subtitle')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-pink-200">
              <span className="text-sm font-medium text-gray-600">{t('split_image_instagram.hero.feature_1')}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-pink-200">
              <span className="text-sm font-medium text-gray-600">{t('split_image_instagram.hero.feature_2')}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-pink-200">
              <span className="text-sm font-medium text-gray-600">{t('split_image_instagram.hero.feature_3')}</span>
            </div>
          </div>
          
          <Link href="/" className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors shadow-lg">
            {t('split_image_instagram.hero.cta')}
          </Link>
        </div>

        {/* Instagram-specific features */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image_instagram.features.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-3 text-pink-600">{t('split_image_instagram.features.carousel_title')}</h3>
              <p className="text-gray-600">{t('split_image_instagram.features.carousel_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-semibold mb-3 text-purple-600">{t('split_image_instagram.features.puzzle_title')}</h3>
              <p className="text-gray-600">{t('split_image_instagram.features.puzzle_desc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
              <div className="text-4xl mb-4">📐</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">{t('split_image_instagram.features.sizing_title')}</h3>
              <p className="text-gray-600">{t('split_image_instagram.features.sizing_desc')}</p>
            </div>
          </div>
        </section>

        {/* Instagram Carousel Guide */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image_instagram.guide.title')}</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('split_image_instagram.guide.step1_title')}</h3>
                  <p className="text-gray-600">{t('split_image_instagram.guide.step1_desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('split_image_instagram.guide.step2_title')}</h3>
                  <p className="text-gray-600">{t('split_image_instagram.guide.step2_desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('split_image_instagram.guide.step3_title')}</h3>
                  <p className="text-gray-600">{t('split_image_instagram.guide.step3_desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">4</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('split_image_instagram.guide.step4_title')}</h3>
                  <p className="text-gray-600">{t('split_image_instagram.guide.step4_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram-specific tips */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image_instagram.tips.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
              <h3 className="text-xl font-semibold mb-3 text-pink-700">{t('split_image_instagram.tips.engagement_title')}</h3>
              <p className="text-gray-700">{t('split_image_instagram.tips.engagement_desc')}</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">{t('split_image_instagram.tips.reach_title')}</h3>
              <p className="text-gray-700">{t('split_image_instagram.tips.reach_desc')}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold mb-3 text-green-700">{t('split_image_instagram.tips.storytelling_title')}</h3>
              <p className="text-gray-700">{t('split_image_instagram.tips.storytelling_desc')}</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-semibold mb-3 text-orange-700">{t('split_image_instagram.tips.puzzle_title')}</h3>
              <p className="text-gray-700">{t('split_image_instagram.tips.puzzle_desc')}</p>
            </div>
          </div>
        </section>

        {/* Instagram best practices */}
        <section className="max-w-4xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t('split_image_instagram.best_practices.title')}</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700"><strong>{t('split_image_instagram.best_practices.quality')}</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700"><strong>{t('split_image_instagram.best_practices.impact')}</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700"><strong>{t('split_image_instagram.best_practices.cta')}</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700"><strong>{t('split_image_instagram.best_practices.consistency')}</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700"><strong>{t('split_image_instagram.best_practices.hashtags')}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">{t('split_image_instagram.final_cta.title')}</h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('split_image_instagram.final_cta.subtitle')}
          </p>
          <Link href="/" className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 transition-all shadow-lg">
            {t('split_image_instagram.final_cta.button')}
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

export default SplitImageInstagram; 