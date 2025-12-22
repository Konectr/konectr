import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import {
  Noto_Sans_SC,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_Thai,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

// CJK and special script fonts
const notoSansTC = Noto_Sans_SC({
  variable: "--font-noto-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Konectr - Real adventures with real people, right now",
  description:
    "Stop scrolling. Start living. Connect with people who share your vibe for spontaneous real-world adventures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Satoshi font from Fontshare */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,800,900&display=swap"
          rel="stylesheet"
        />
        {/* Contentsquare (Hotjar) Analytics */}
        <Script
          src="https://t.contentsquare.net/uxa/10ec7463f1940.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${inter.variable} ${notoSansTC.variable} ${notoSansJP.variable} ${notoSansKR.variable} ${notoSansThai.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
