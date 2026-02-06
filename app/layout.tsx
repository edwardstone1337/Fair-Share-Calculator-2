import type { Metadata } from "next";
import { Josefin_Sans, Assistant } from "next/font/google";
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
  title:
    "Income-Based Bill Split Calculator - Fair Share Calculator for Bills, Rent & Expenses",
  description:
    "Split bills based on income with our Fair Share Calculator. Calculate proportional rent, utilities, and expense splitting for roommates, couples, or any shared living situation. Free income-based bill splitting tool with instant results.",
  keywords:
    "bill split calculator, split bills based on income, income based bill splitting, rent split calculator, splitting bills based on income calculator, fair share calculator, bill split calculator based on income, how to split bills based on income, split bills calculator, fair bill split calculator, rent split based on income, salary split calculator, bills split calculator, split bills by income calculator, fair split calculator, income based percentage split, proportional expense splitting, roommates bill splitting, shared expense calculator",
  openGraph: {
    title: "Income-Based Bill Split Calculator - Fair Share Calculator",
    description:
      "Split bills based on income with our free calculator. Perfect for roommates, couples, or any shared living situation. Calculate proportional rent, utilities, and expense splitting instantly.",
    url: "https://www.fairsharecalculator.com",
    images: ["/images/Metadata-Image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/lotus.png",
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
        {children}
      </body>
    </html>
  );
}
