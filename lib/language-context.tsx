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
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    // 从 localStorage 读取保存的语言偏好
    const savedLanguage = localStorage.getItem('preferred_language') as Language;
    if (savedLanguage === 'ja' || savedLanguage === 'zh') {
      setLanguage(savedLanguage);
    }
    setIsLoaded(true);

    // 监听存储变化事件（如果在其他标签页改变了语言）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferred_language') {
        const newLang = e.newValue as Language;
        if (newLang === 'ja' || newLang === 'zh') {
          setLanguage(newLang);
          setRenderKey(prev => prev + 1);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
    // 强制重新渲染以应用新语言
    setRenderKey(prev => prev + 1);
    // 触发自定义事件以通知其他组件
    window.dispatchEvent(
      new CustomEvent('languagechange', { detail: { language: lang } })
    );
  };

  return (
    <LanguageContext.Provider key={renderKey} value={{ language, setLanguage: handleSetLanguage }}>
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
