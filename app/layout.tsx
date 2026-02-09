import type { Metadata } from "next";
import Script from "next/script";
import { Josefin_Sans, Assistant } from "next/font/google";
import { CurrencyProvider } from "@/lib/contexts/currency-context";
import { NavBar } from "@/components/nav/nav-bar";
import { Footer } from "@/components/nav/footer";
import { SharedFooter } from "@/components/shared-footer";
import "./globals.css";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-josefin",
  display: "optional",
});

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-assistant",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fairsharecalculator.com"),
  title:
    "Income-Based Bill Split Calculator - Fair Share Calculator for Bills, Rent & Expenses",
  description:
    "Split bills, rent, and expenses fairly based on income. Free calculator for couples — calculate your proportional share of rent, utilities, mortgage, and household costs instantly.",
  keywords:
    "bill split calculator, split bills based on income, income based bill splitting, rent split calculator, splitting bills based on income calculator, fair share calculator, bill split calculator based on income, how to split bills based on income, split bills calculator, fair bill split calculator, rent split based on income, salary split calculator, bills split calculator, split bills by income calculator, fair split calculator, income based percentage split, proportional expense splitting, shared expense calculator, mortgage split calculator, couples bill split calculator",
  openGraph: {
    title: "Income-Based Bill Split Calculator - Fair Share Calculator",
    description:
      "Split bills, rent, and expenses fairly based on income. Free calculator for couples — calculate your proportional share of rent, utilities, mortgage, and household costs instantly.",
    url: "https://www.fairsharecalculator.com",
    images: ["/images/Metadata-Image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/images/lotus.png",
  },
  alternates: {
    canonical: "https://www.fairsharecalculator.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          "--font-family-heading": josefinSans.style.fontFamily,
          "--font-family-body": assistant.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={`${josefinSans.variable} ${assistant.variable}`}>
        <CurrencyProvider>
          <NavBar />
          {children}
          <Footer />
          <SharedFooter />
        </CurrencyProvider>
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TQZ0HGB3MT"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TQZ0HGB3MT');
          `}
        </Script>
        {/* Hotjar (hjid: 4934822) */}
        <Script id="hotjar-init" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:4934822,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
        {/* Microsoft Clarity (kyx62gpbw4) */}
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","kyx62gpbw4");
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4075743460011014"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
