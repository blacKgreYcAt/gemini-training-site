import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import { LanguageSelector } from "@/components/LanguageSelector";
import { UserMenu } from "@/components/UserMenu";

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
          <AuthProvider>
          <header style={{
            background: 'white',
            borderBottom: '1px solid #e5e5e7',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Gemini 課程</h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <LanguageSelector />
              <UserMenu />
            </div>
          </header>
          {children}
        </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
