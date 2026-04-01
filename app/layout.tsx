import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gemini 企業協作大師課",
  description: "四週完整課程，掌握 Gemini 六大神器",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ background: '#f5f5f7', color: '#000000', margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
