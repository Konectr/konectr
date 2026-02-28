// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Centralized SEO utilities for structured data generation

const BASE_URL = "https://konectr.app";

type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * Generates a BreadcrumbList JSON-LD schema.
 * Pass items in order from root to current page.
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

type HowToStep = {
  name: string;
  text: string;
};

/**
 * Generates a HowTo JSON-LD schema for step-by-step guides.
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * SoftwareApplication structured data for the Konectr mobile app.
 * Signals to Google/AI engines that this is a mobile app, enabling app rich results.
 */
export const APP_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Konectr",
  operatingSystem: "iOS",
  applicationCategory: "SocialNetworkingApplication",
  description:
    "Meet real people for real activities in Kuala Lumpur. Konectr matches you with nearby people who share your vibe for spontaneous meetups.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Konectr",
  },
};
