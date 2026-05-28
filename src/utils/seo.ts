// src/utils/seo.ts

interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const DEFAULT_DESCRIPTION =
  'Symeno is an independent online retailer offering premium lifestyle, tech, and home goods at competitive prices. Sourced from established distributors.';
const SITE_NAME = 'Symeno';

export function generateSeoMeta(config: SeoConfig) {
  const title = `${config.title} | ${SITE_NAME}`;
  const description = config.description || DEFAULT_DESCRIPTION;
  const image = config.ogImage || '/og-image.webp';

  return {
    title,
    description,
    openGraph: {
      basic: {
        title,
        type: 'website',
        image,
      },
      optional: {
        description,
        siteName: SITE_NAME,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image,
    },
  };
}
