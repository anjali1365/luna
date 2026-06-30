import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://novonixsoft.com"), // Update to actual domain later if needed
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  title: "Luna Sakha | Your Empathetic AI Mental Wellness Companion",
  description:
    "A safe, warm, and non-judgmental space to ease stress, track your emotional patterns, and practice mindfulness exercises guided by an interactive companion. Crafted and maintained by NovonixSoft.",
  keywords: [
    "mental wellness",
    "stress relief",
    "empathetic AI",
    "anxiety support",
    "mindfulness agent",
    "breathing companion",
    "NovonixSoft",
    "NovonixSoft Web Solutions",
    "AI Development"
  ],
  authors: [{ name: "NovonixSoft", url: "https://novonixsoft.com" }],
  creator: "NovonixSoft",
  publisher: "NovonixSoft",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Luna Sakha | AI Mental Wellness Companion",
    description: "Your safe space to ease stress and practice mindfulness. Expertly built by NovonixSoft.",
    url: "https://novonixsoft.com",
    siteName: "Luna Sakha",
    images: [
      {
        url: "/icon.svg",
        width: 800,
        height: 600,
        alt: "Luna Sakha Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna Sakha | Premium AI Companion by NovonixSoft",
    description: "Your safe space to ease stress and practice mindfulness.",
    creator: "@NovonixSoft",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-bg-base dark:bg-bg-dark text-slate-800 dark:text-slate-100 transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}
