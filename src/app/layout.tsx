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
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
        <Script
          id="remove-vercel-badge"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function removeVercelBadge() {
                var selectors = [
                  'a[href*="vercel.com"][target="_blank"]',
                  'a[href*="vercel.com/home"]',
                  '[data-testid="vercel-badge"]',
                  'a[aria-label*="Vercel"]'
                ];
                selectors.forEach(function(sel) {
                  document.querySelectorAll(sel).forEach(function(el) { el.remove(); });
                });
              }
              document.addEventListener('DOMContentLoaded', removeVercelBadge);
              setTimeout(removeVercelBadge, 1000);
            `,
          }}
        />
        {/* Tally Form Embed Script - with fallback for manual src setting */}
        <Script
          id="tally-embed"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var d=document,w="https://tally.so/widgets/embed.js",v=function(){
                "undefined"!=typeof Tally
                  ? Tally.loadEmbeds()
                  : d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(function(e){
                      e.src=e.dataset.tallySrc
                    })
              };
              if("undefined"!=typeof Tally) v();
              else if(d.querySelector('script[src="'+w+'"]')==null){
                var s=d.createElement("script");
                s.src=w;
                s.onload=v;
                s.onerror=v;
                d.body.appendChild(s);
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
