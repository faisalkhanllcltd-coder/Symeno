// src/utils/seo.ts

interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const DEFAULT_DESCRIPTION = "Operational efficiency applied to consumer electronics. Guaranteed Arbitrage Sourcing.";
const SITE_NAME = "Symeno";

export function generateSeoMeta(config: SeoConfig) {
  const title = `${config.title} | ${SITE_NAME}`;
  const description = config.description || DEFAULT_DESCRIPTION;
  const image = config.ogImage || '/og-image.jpg';

  return {
    title,
    description,
    openGraph: {
      basic: {
        title,
        type: "website",
        image,
      },
      optional: {
        description,
        siteName: SITE_NAME,
      }
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image,
    }
  };
}