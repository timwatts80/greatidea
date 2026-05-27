import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ClarityAnalytics from "@/components/ClarityAnalytics";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HK9W7EMRCV"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-HK9W7EMRCV');`,
          }}
        />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        {children}
        <Analytics />
        <ClarityAnalytics />
      </body>
    </html>
  );
}
