import Head from 'next/head';

const SEOMetadata = () => (
  <Head>
    {/* Primary Meta Tags */}
    <title>Country Explorer | Discover and Compare Countries Worldwide</title>
    <meta name="title" content="Country Explorer | Discover and Compare Countries Worldwide" />
    <meta name="description" content="Explore countries around the globe, compare demographics, and learn fascinating facts with our interactive Country Explorer tool. Perfect for travelers, students, and curious minds." />
    <meta name="keywords" content="country explorer, world map, country comparison, global demographics, travel information, international data" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    <meta name="author" content="René DeAnda" />
    <link rel="canonical" href="https://yourwebsite.com/country-explorer" />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yourwebsite.com/country-explorer" />
    <meta property="og:title" content="Country Explorer | Discover and Compare Countries Worldwide" />
    <meta property="og:description" content="Explore countries around the globe, compare demographics, and learn fascinating facts with our interactive Country Explorer tool." />
    <meta property="og:image" content="https://yourwebsite.com/country-explorer-og-image.jpg" />

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://yourwebsite.com/country-explorer" />
    <meta property="twitter:title" content="Country Explorer | Discover and Compare Countries Worldwide" />
    <meta property="twitter:description" content="Explore countries around the globe, compare demographics, and learn fascinating facts with our interactive Country Explorer tool." />
    <meta property="twitter:image" content="https://yourwebsite.com/country-explorer-twitter-image.jpg" />

    {/* Favicon */}
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />

    {/* Additional Meta Tags */}
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="theme-color" content="#4A90E2" />
  </Head>
);

export default SEOMetadata;