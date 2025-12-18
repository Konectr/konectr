import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Konectr - Real adventures with real people, right now",
  description:
    "Stop scrolling. Start living. Connect with people who share your vibe for spontaneous real-world adventures.",
  keywords: [
    "social",
    "meetup",
    "friends",
    "activities",
    "adventures",
    "real connections",
  ],
  authors: [{ name: "Konectr" }],
  openGraph: {
    title: "Konectr - Real adventures with real people, right now",
    description:
      "Stop scrolling. Start living. Connect with people who share your vibe.",
    type: "website",
    locale: "en_US",
    siteName: "Konectr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Konectr - Real adventures with real people, right now",
    description:
      "Stop scrolling. Start living. Connect with people who share your vibe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Satoshi font from Fontshare */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,800,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
