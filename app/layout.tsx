import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { ThemeInitScript } from "@/components/providers/ThemeInitScript";
import { Providers } from "./providers";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Khaas Food — Pure & Natural Products",
    template: "%s | Khaas Food",
  },
  description: "Pure and natural food products delivered to your doorstep.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  manifest: "/site.webmanifest",
  themeColor: "#1a4d2e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Khaas Food",
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
