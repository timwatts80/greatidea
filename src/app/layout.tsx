import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Great Idea Creative Services - Fast, Affordable Web Design & Development",
  description: "We design and develop modern websites, web apps, and SEO systems that help small businesses grow. Simple process. Fair pricing. Launch-ready in weeks, not months.",
  keywords: "web design, web development, SEO, small business websites, Utah web design, web apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
