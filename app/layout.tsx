import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Khaas Food",
  description: "Pure and natural food products delivered to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
