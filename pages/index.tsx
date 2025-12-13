import { useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useAnalytics } from '../hooks/business/useAnalytics';
import ImageSplitterTool from '../components/Tools/ImageSplitter/ImageSplitterTool';


const Home: NextPage = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const { t: tHome } = useTranslation('home');
  const { t: tSplit } = useTranslation('split-image');
  const analytics = useAnalytics();
  const commonUses = tHome('common_uses.items', { returnObjects: true }) as string[];

  // 用于记录已初始化的状态，确保翻译正确加载
  useEffect(() => {
    if (i18n.isInitialized) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`i18n initialized, current language: ${router.locale}`);
        console.log(`page_title translation: ${t('page_title')}`);
        console.log(`site_name translation: ${t('site_name')}`);
      }
    }
  }, [i18n.isInitialized, router.locale, t]);

  return (
    <>
      <Head>
        <title>{tHome('seo.meta_title')}</title>
        
        <meta name="description" content={tHome('seo.meta_description') as string} />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* 基本SEO元标签 */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Cortar Carrossel" />
        <meta name="keywords" content={tHome('seo.keywords') as string} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`} />
        <meta property="og:title" content={tHome('seo.meta_title') as string} />
        <meta property="og:description" content={tHome('seo.meta_description') as string} />
        <meta property="og:image" content="https://cortarcarrossel.com/cortar-carrossel-preview.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`} />
        <meta property="twitter:title" content={tHome('seo.meta_title') as string} />
        <meta property="twitter:description" content={tHome('seo.meta_description') as string} />
        <meta property="twitter:image" content="https://cortarcarrossel.com/cortar-carrossel-preview.png" />
        
        {/* 多语言支持 */}
        <link rel="alternate" hrefLang="pt" href="https://cortarcarrossel.com/" />
        <link rel="alternate" hrefLang="en" href="https://cortarcarrossel.com/en/" />
        <link rel="alternate" hrefLang="zh" href="https://cortarcarrossel.com/zh/" />
        <link rel="alternate" hrefLang="hi" href="https://cortarcarrossel.com/hi/" />
        <link rel="alternate" hrefLang="ru" href="https://cortarcarrossel.com/ru/" />
        <link rel="alternate" hrefLang="x-default" href="https://cortarcarrossel.com/" />
        
        {/* 规范链接 */}
        <link rel="canonical" href={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`} />
        
        {/* Favicon */}
        <link rel="icon" href="/logo/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo/apple-touch-icon.png" />
        
        {/* 结构化数据 - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Cortar Carrossel",
              "alternateName": "Cortar Imagem Carrossel",
              "url": `https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}`,
              "description": tHome('seo.schema_description'),
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "http://schema.org/InStock"
              },
              "screenshot": "/logo/android-chrome-192x192.png",
              "image": "/cortar-carrossel-preview.png",
              "featureList": tHome('seo.feature_list'),
              "softwareVersion": "1.0",
              "datePublished": "2023-01-01",
              "contentRating": "General",
              "inLanguage": ["en", "pt", "zh", "hi", "ru"],
              "author": {
                "@type": "Organization",
                "name": "Cortar Carrossel",
                "url": "https://cortarcarrossel.com/"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "156",
                "bestRating": "5"
              },
              "keywords": tHome('seo.keywords')
            })
          }}
        />
        
        {/* FAQ结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.which_platforms'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.which_platforms_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.best_dimensions'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.best_dimensions_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.puzzle_post'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.puzzle_post_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.marketing'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.marketing_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.safe_images'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.safe_images_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.file_formats'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.file_formats_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.size_limit'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.size_limit_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.registration'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.registration_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.watermarks'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.watermarks_answer')
                  }
                },
                {
                  "@type": "Question",
                  "name": tHome('seo.faq.mobile_use'),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": tHome('seo.faq.mobile_use_answer')
                  }
                }
              ]
            })
          }}
        />
      </Head>
      
      {/* 主要内容区域 */}
      <div className="flex-grow flex flex-col relative">
          {/* 主内容部分 */}
          <main className="flex-grow container mx-auto p-4 py-10 relative z-10 flex justify-center">
            <div className="mx-auto w-full max-w-[1020px] xl:max-w-[1060px] 2xl:max-w-[1160px]">
              {/* 添加工具界面标题 - 优化split image关键词 */}
              <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 whitespace-normal md:whitespace-nowrap">
                {tHome('app_title')}
              </h1>
              <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                {tHome('subtitle')}
              </p>
              
              {/* 图片分割工具主入口组件 */}
              <ImageSplitterTool />
            </div>
          </main>
          
          {/* SEO文案部分 */}
          <section className="container mx-auto px-4 py-6 relative z-10">
            <div style={{width: '90%', maxWidth: '1200px'}} className="mx-auto">
              
              <div className="prose prose-lg max-w-none text-gray-700 px-4 md:px-8" style={{ textAlign: 'justify' }}>
                <h2 className="text-2xl font-bold mt-0 mb-4 text-gray-800">{tHome('seo.faq.what_is')}</h2>
                <p className="mb-4">
                  {tHome('seo.faq.what_is_answer')}
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">{tHome('seo.how_works')}</h2>
                <p className="mb-4">
                  {tHome('seo.using_tool')} <strong>{tHome('seo.tool_name')}</strong> {tHome('seo.is_simple')}
                </p>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                  <li>{tHome('steps.step1')}</li>
                  <li>{tHome('steps.step2')}</li>
                  <li>{tHome('steps.step3')}</li>
                  <li>{tHome('steps.step4')}</li>
                </ol>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">{tHome('seo.why_choose')}</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>{tHome('seo.benefits.free')}</li>
                  <li>{tHome('seo.benefits.custom_grid')}</li>
                  <li>{tHome('seo.benefits.puzzle_mode')}</li>
                  <li>{tHome('seo.benefits.compatible')}</li>
                  <li>{tHome('seo.benefits.no_registration')}</li>
                </ul>

                {commonUses?.length ? (
                  <>
                    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">{tHome('common_uses.title')}</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                      {commonUses.map((item, index) => (
                        <li key={`common-use-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <h2 id="faq" className="text-2xl font-bold mt-8 mb-4 text-gray-800">{t('faq')}</h2>
                
                <div className="space-y-6 mt-4">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.safe_images')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.safe_images_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.file_formats')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.file_formats_answer')}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.size_limit')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.size_limit_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.registration')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.registration_answer')}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.watermarks')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.watermarks_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.mobile_use')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.mobile_use_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.which_platforms')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.which_platforms_answer')}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.best_dimensions')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.best_dimensions_answer')}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.puzzle_post')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.puzzle_post_answer')}</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tHome('seo.faq.marketing')}</h3>
                    <p className="text-gray-700">{tHome('seo.faq.marketing_answer')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 关键词链接区域 - 移到页脚上方，优化split image链接 */}
          <div className="w-full max-w-7xl mx-auto px-4 py-6 relative z-10">
          <div className="mx-auto" style={{width: '90%', maxWidth: '1200px'}}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{tHome('related_tools')}</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              
              {/* 主要Split Image工具 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">🔥 {tHome('tools.image_splitter')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Link href="/split-image" className="bg-blue-50 border border-blue-200 p-3 rounded-lg hover:bg-blue-100 transition-colors block">
                    <span className="text-blue-700 font-medium">
                      {tSplit('split_image.hero.title')} {tSplit('split_image.hero.title_free')}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{tHome('split_tool_desc_short')}</p>
                  </Link>
                  <Link href="/image-splitter-online" className="bg-green-50 border border-green-200 p-3 rounded-lg hover:bg-green-100 transition-colors block">
                    <span className="text-green-700 font-medium">{tHome('tools.image_splitter_online')}</span>
                    <p className="text-sm text-gray-600 mt-1">{tHome('advanced_features_desc')}</p>
                  </Link>
                </div>
              </div>

              {/* 其他相关工具 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">📸 {tHome('tools.carousel_and_image_tools')}</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <li>
                    <Link href="/cortar-carrossel-infinito" className="text-blue-600 hover:underline inline-flex items-center">
                      <span className="mr-2">🔄</span> {tHome('tools.carousel_infinite')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/cortar-imagem-carrossel" className="text-blue-600 hover:underline inline-flex items-center">
                      <span className="mr-2">✂️</span> {tHome('tools.carousel_image')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/dividir-imagem-carrossel" className="text-blue-600 hover:underline inline-flex items-center">
                      <span className="mr-2">📱</span> {tHome('tools.divide_carousel')}
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-500 inline-flex items-center">
                      <span className="mr-2">🧩</span> {tHome('image_grid_maker')} ({tHome('coming_soon')})
                    </span>
                  </li>
                </ul>
              </div>

              {/* SEO关键词文本 */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tHome('split_tools_description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt', ['common', 'home', 'split-image'])),
    },
  };
}
