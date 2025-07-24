import Head from 'next/head';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

export default function SeoHead({
  title = 'Survee - Survey Platform',
  description = 'Create and manage surveys easily with our powerful survey platform. Collect responses, analyze data, and gain insights.',
  image = 'https://survey.otsuka.co.id/images/social-preview.png',
  url = 'https://survey.otsuka.co.id',
  type = 'website',
  noIndex = false,
}: SeoHeadProps) {
  const fullTitle = title.includes('Survee') ? title : `${title} | Survee`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Head>
  );
}
