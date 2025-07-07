import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/contexts/supabase-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "AutoPost AI - Generate LinkedIn Posts with AI | Free LinkedIn Automation",
  description: "Create engaging LinkedIn content in seconds with AI. Schedule posts, track performance, and grow your professional network - 100% free forever. No credit card required.",
  keywords: "LinkedIn automation, AI content creation, LinkedIn posts, social media automation, LinkedIn marketing, AI writing, content generation, professional networking",
  authors: [{ name: "AutoPost AI" }],
  creator: "AutoPost AI",
  publisher: "AutoPost AI",
  openGraph: {
    title: "AutoPost AI - Generate LinkedIn Posts with AI",
    description: "Create engaging LinkedIn content in seconds with AI. 100% free forever.",
    url: "https://autopost-orpin.vercel.app/",
    siteName: "AutoPost AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoPost AI - Generate LinkedIn Posts with AI",
    description: "Create engaging LinkedIn content in seconds with AI. 100% free forever.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
