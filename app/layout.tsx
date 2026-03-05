import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Astro Coach — AI Astrology Companion",
    template: "%s | Astro Coach",
  },
  description: "Your personalized AI-powered astrology companion. Daily readings, birth charts, tarot, compatibility, mood tracking, and cosmic guidance.",
  keywords: ["astrology", "horoscope", "zodiac", "birth chart", "tarot", "AI", "daily reading", "compatibility"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Astro Coach",
  },
  openGraph: {
    type: "website",
    title: "Astro Coach — AI Astrology Companion",
    description: "Get personalized daily readings, birth charts, tarot pulls, and cosmic guidance powered by AI.",
    siteName: "Astro Coach",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astro Coach — AI Astrology Companion",
    description: "Get personalized daily readings, birth charts, tarot pulls, and cosmic guidance powered by AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#7c5cff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
