// Універсальний компонент
// керує заголовками, описами, канонічними URL (щоб фільтри та пагінація не плодили дублі сторінок) та мікророзміткою.

import { Helmet } from "react-helmet-async";

const SITE_URL = "https://tire-store-client.vercel.app"; //замінити на куплений домен, наприклад "https://shynystore.com.ua"
const SITE_NAME = "Tire Store";
const DEFAULT_IMAGE = `${SITE_URL}/img/og-default.jpg`;

export const Seo = ({
  title,
  description,
  canonicalPath = "",
  image,
  noindex = false,
  schema = null,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `Шини для спецтехніки, сільгосптехніки та легкових авто | ${SITE_NAME}`;

  const metaDescription =
    description ||
    "Оригінальні шини для сільськогосподарської, спеціальної техніки та легкових автомобілів. Офіційний дилер, прямі поставки від виробників. Доставка по Україні.";

  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={canonicalUrl} />
        </>
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

       {/* Мікророзмітка JSON-LD */}
         {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};
