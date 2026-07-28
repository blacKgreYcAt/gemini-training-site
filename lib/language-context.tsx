'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'zh' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取保存的语言偏好
    const savedLanguage = localStorage.getItem('preferred_language') as Language;
    if (savedLanguage === 'ja' || savedLanguage === 'zh') {
      setLanguage(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
    // 触发自定义事件以通知其他组件
    window.dispatchEvent(
      new CustomEvent('languagechange', { detail: { language: lang } })
    );
  };

  if (!isLoaded) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
