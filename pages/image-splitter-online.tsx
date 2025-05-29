import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const ImageSplitterOnline: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("pages.image_splitter.title")}</title>
        <meta
          name="description"
          content={t("pages.image_splitter.meta_description")}
        />
        <link rel="canonical" href="https://cortarcarrossel.com/image-splitter-online" />
        
        {/* Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": t("pages.image_splitter.h1"),
              "url": "https://cortarcarrossel.com/image-splitter-online",
              "description": t("pages.image_splitter.meta_description"),
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

      <main className="flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#eef0ff] to-[#ecebfc] min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8">{t("pages.image_splitter.h1")}</h1>
        
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">{t("pages.image_splitter.tool_title")}</h2>
          <p className="mb-4">
            {t("pages.image_splitter.tool_description")}
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">{t("pages.image_splitter.how_to_title")}</h2>
          <ol className="list-decimal pl-5 mb-6 space-y-2">
            <li>{t("pages.image_splitter.how_to_steps.step1")}</li>
            <li>{t("pages.image_splitter.how_to_steps.step2")}</li>
            <li>{t("pages.image_splitter.how_to_steps.step3")}</li>
            <li>{t("pages.image_splitter.how_to_steps.step4")}</li>
          </ol>
          
          <div className="mt-6">
            <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              {t("pages.image_splitter.try_now")}
            </Link>
          </div>
        </div>
        
        <section className="max-w-3xl w-full mb-10">
          <h2 className="text-2xl font-semibold mb-6">{t("pages.image_splitter.features_title")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.image_splitter.features.grid.title")}</h3>
              <p>{t("pages.image_splitter.features.grid.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.image_splitter.features.quality.title")}</h3>
              <p>{t("pages.image_splitter.features.quality.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.image_splitter.features.preview.title")}</h3>
              <p>{t("pages.image_splitter.features.preview.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.image_splitter.features.puzzle.title")}</h3>
              <p>{t("pages.image_splitter.features.puzzle.text")}</p>
            </div>
          </div>
        </section>
        
        <section className="max-w-3xl w-full">
          <h2 className="text-2xl font-semibold mb-6">{t("pages.image_splitter.why_use_title")}</h2>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.image_splitter.benefits.no_install.title")}</h3>
              <p>{t("pages.image_splitter.benefits.no_install.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.image_splitter.benefits.privacy.title")}</h3>
              <p>{t("pages.image_splitter.benefits.privacy.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.image_splitter.benefits.free.title")}</h3>
              <p>{t("pages.image_splitter.benefits.free.text")}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">{t("pages.image_splitter.benefits.compatible.title")}</h3>
              <p>{t("pages.image_splitter.benefits.compatible.text")}</p>
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

export default ImageSplitterOnline; 