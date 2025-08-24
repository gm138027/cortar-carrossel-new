import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const CortarImagemCarrossel: NextPage = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("pages.carousel_image.title")}</title>
        <meta
          name="description"
          content={t("pages.carousel_image.meta_description") as string}
        />
        {/* Canonical: current language version */}
        <link rel="canonical" href={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}cortar-imagem-carrossel`} />
        
        {/* Hreflang for multilingual versions */}
        <link rel="alternate" hrefLang="pt" href="https://cortarcarrossel.com/cortar-imagem-carrossel" />
        <link rel="alternate" hrefLang="en" href="https://cortarcarrossel.com/en/cortar-imagem-carrossel" />
        <link rel="alternate" hrefLang="zh" href="https://cortarcarrossel.com/zh/cortar-imagem-carrossel" />
        <link rel="alternate" hrefLang="hi" href="https://cortarcarrossel.com/hi/cortar-imagem-carrossel" />
        <link rel="alternate" hrefLang="ru" href="https://cortarcarrossel.com/ru/cortar-imagem-carrossel" />
        <link rel="alternate" hrefLang="x-default" href="https://cortarcarrossel.com/cortar-imagem-carrossel" />
        
        {/* Estrutura de dados Schema.org para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": t("pages.carousel_image.h1"),
              "url": "https://cortarcarrossel.com/cortar-imagem-carrossel",
              "description": t("pages.carousel_image.meta_description"),
              "applicationCategory": "DesignApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>

      <main className="flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8">{t("pages.carousel_image.h1")}</h1>
        
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">{t("pages.carousel_image.tool_title")}</h2>
          <p className="mb-4">
            {t("pages.carousel_image.tool_description")}
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">{t("pages.carousel_image.how_to_title")}</h2>
          <ol className="list-decimal pl-5 mb-6 space-y-2">
            <li>{t("pages.carousel_image.how_to_steps.step1")}</li>
            <li>{t("pages.carousel_image.how_to_steps.step2")}</li>
            <li>{t("pages.carousel_image.how_to_steps.step3")}</li>
            <li>{t("pages.carousel_image.how_to_steps.step4")}</li>
          </ol>
          
          <div className="mt-6">
            <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              {t("pages.carousel_image.try_now")}
            </Link>
          </div>
        </div>
        
        <section className="max-w-3xl w-full mb-10">
          <h2 className="text-2xl font-semibold mb-6">{t("pages.carousel_image.applications_title")}</h2>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.carousel_image.applications.websites.title")}</h3>
              <p>{t("pages.carousel_image.applications.websites.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.carousel_image.applications.social_media.title")}</h3>
              <p>{t("pages.carousel_image.applications.social_media.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.carousel_image.applications.presentations.title")}</h3>
              <p>{t("pages.carousel_image.applications.presentations.text")}</p>
            </div>
          </div>
        </section>
        
        <section className="max-w-3xl w-full">
          <h2 className="text-2xl font-semibold mb-6">{t("pages.carousel_image.why_use_title")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.carousel_image.benefits.easy.title")}</h3>
              <p>{t("pages.carousel_image.benefits.easy.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.carousel_image.benefits.professional.title")}</h3>
              <p>{t("pages.carousel_image.benefits.professional.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.carousel_image.benefits.online.title")}</h3>
              <p>{t("pages.carousel_image.benefits.online.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.carousel_image.benefits.free.title")}</h3>
              <p>{t("pages.carousel_image.benefits.free.text")}</p>
            </div>
          </div>
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

export default CortarImagemCarrossel; 