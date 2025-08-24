import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Image from "next/image";

const CortarCarrosselInfinito: NextPage = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("pages.infinite_carousel.title")}</title>
        <meta
          name="description"
          content={t("pages.infinite_carousel.meta_description") as string}
        />
        {/* Canonical: current language version */}
        <link rel="canonical" href={`https://cortarcarrossel.com/${i18n.language !== 'pt' ? i18n.language + '/' : ''}cortar-carrossel-infinito`} />
        
        {/* Hreflang for multilingual versions */}
        <link rel="alternate" hrefLang="pt" href="https://cortarcarrossel.com/cortar-carrossel-infinito" />
        <link rel="alternate" hrefLang="en" href="https://cortarcarrossel.com/en/cortar-carrossel-infinito" />
        <link rel="alternate" hrefLang="zh" href="https://cortarcarrossel.com/zh/cortar-carrossel-infinito" />
        <link rel="alternate" hrefLang="hi" href="https://cortarcarrossel.com/hi/cortar-carrossel-infinito" />
        <link rel="alternate" hrefLang="ru" href="https://cortarcarrossel.com/ru/cortar-carrossel-infinito" />
        <link rel="alternate" hrefLang="x-default" href="https://cortarcarrossel.com/cortar-carrossel-infinito" />
        
        {/* Estrutura de dados Schema.org para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": t("pages.infinite_carousel.h1"),
              "url": "https://cortarcarrossel.com/cortar-carrossel-infinito",
              "description": t("pages.infinite_carousel.meta_description"),
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
        <h1 className="text-4xl font-bold text-center mb-8">{t("pages.infinite_carousel.h1")}</h1>
        
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">{t("pages.infinite_carousel.what_is_title")}</h2>
          <p className="mb-4">
            {t("pages.infinite_carousel.what_is_text")}
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">{t("pages.infinite_carousel.how_to_title")}</h2>
          <ol className="list-decimal pl-5 mb-6 space-y-2">
            <li>{t("pages.infinite_carousel.how_to_steps.step1")}</li>
            <li>{t("pages.infinite_carousel.how_to_steps.step2")}</li>
            <li>{t("pages.infinite_carousel.how_to_steps.step3")}</li>
            <li>{t("pages.infinite_carousel.how_to_steps.step4")}</li>
          </ol>
          
          <div className="mt-6">
            <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              {t("pages.infinite_carousel.try_now")}
            </Link>
          </div>
        </div>
        
        <section className="max-w-3xl w-full">
          <h2 className="text-2xl font-semibold mb-6">{t("pages.infinite_carousel.advantages_title")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.infinite_carousel.advantages.engagement.title")}</h3>
              <p>{t("pages.infinite_carousel.advantages.engagement.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.infinite_carousel.advantages.professional.title")}</h3>
              <p>{t("pages.infinite_carousel.advantages.professional.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.infinite_carousel.advantages.continuous.title")}</h3>
              <p>{t("pages.infinite_carousel.advantages.continuous.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.infinite_carousel.advantages.control.title")}</h3>
              <p>{t("pages.infinite_carousel.advantages.control.text")}</p>
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

export default CortarCarrosselInfinito; 