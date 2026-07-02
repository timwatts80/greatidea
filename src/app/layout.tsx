import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import ClarityAnalytics from "@/components/ClarityAnalytics";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const GA_IDS = ["G-HK9W7EMRCV", "G-670SMPG4DV"];

export const metadata: Metadata = {
  title: "Great Idea CS — Bring your vision to life",
  description:
    "Custom AI solutions powered by Claude for creative projects, business workflows, and digital innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${nunito.variable} antialiased`}>
        {children}
        <Analytics />
        <ClarityAnalytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_IDS[0]}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${GA_IDS.map(id => `gtag('config', '${id}', { linker: { domains: ['greatidea-cs.com', 'api.greatidea-cs.com'] } });`).join('\n            ')}
          `}
        </Script>
      </body>
    </html>
  );
}
