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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
