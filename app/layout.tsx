import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import { HtmlLangSync } from "@/components/HtmlLangSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "大豐貿易集團AI協作課程",
  description: "四週完整課程，掌握 Gemini 六大神器",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ background: '#f5f5f7', color: '#000000', margin: 0, padding: 0 }}>
        <LanguageProvider>
          <HtmlLangSync />
          <AuthProvider>
            {/* Header 由各頁的 <Navbar> 提供；此處不再重複渲染 */}
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
