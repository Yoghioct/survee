import Document, { Head, Main, NextScript, Html } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicons */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="shortcut icon" href="/favicon.png" />
          
          {/* Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#7c3aed" />
          
          {/* Meta tags for SEO and Social Media */}
          <meta name="application-name" content="Survee - Survey Platform" />
          <meta name="description" content="Create and manage surveys easily with our powerful survey platform. Collect responses, analyze data, and gain insights." />
          <meta name="keywords" content="survey, questionnaire, form, data collection, analytics, feedback" />
          <meta name="author" content="Otsuka Academy" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Survee" />
          <meta property="og:title" content="Survee - Survey Platform" />
          <meta property="og:description" content="Create and manage surveys easily with our powerful survey platform. Collect responses, analyze data, and gain insights." />
          <meta property="og:image" content="https://survey.otsuka.co.id/images/social-preview.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="https://survey.otsuka.co.id" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Survee - Survey Platform" />
          <meta name="twitter:description" content="Create and manage surveys easily with our powerful survey platform. Collect responses, analyze data, and gain insights." />
          <meta name="twitter:image" content="https://survey.otsuka.co.id/images/social-preview.png" />
          
          {/* Additional Meta */}
          <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
