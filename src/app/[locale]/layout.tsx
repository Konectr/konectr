import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const baseUrl = "https://konectr.app";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = {
    default: "Konectr - Real Adventures with Real People",
    template: "%s | Konectr",
  };

  const description =
    "Stop scrolling. Start living. Connect with people who share your interests and meet up for real adventures.";

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${baseUrl}/${loc}`])
      ),
    },
    openGraph: {
      title: "Konectr - Real Adventures with Real People",
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "Konectr",
      locale: locale,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Konectr - Real Adventures with Real People",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Konectr - Real Adventures with Real People",
      description,
      images: ["/og-image.jpg"],
      site: "@konectrapp",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Konectr",
      url: "https://konectr.app",
      logo: "https://konectr.app/logos/konectr-icon-orange.svg",
      sameAs: [
        "https://www.facebook.com/konectrapp",
        "https://www.instagram.com/konectrapp",
        "https://twitter.com/konectrapp",
        "https://www.linkedin.com/company/konectr",
        "https://www.tiktok.com/@konectrapp",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Konectr",
      url: "https://konectr.app",
    },
  ];

  return (
    <div lang={locale}>
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  );
}
