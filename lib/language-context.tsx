'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChange } from './auth-utils';
import {
  Language,
  LANGUAGE_STORAGE_KEY,
  fetchRemoteLanguage,
  isLanguage,
  readLocalLanguage,
  saveRemoteLanguage,
  writeLocalLanguage,
} from './language-preference';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  // 先套用本地值，避免載入時語言閃動；隨後再向帳號對齊
  useEffect(() => {
    const saved = readLocalLanguage();
    if (saved) setLanguage(saved);

    // 其他分頁改了語言時同步過來
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && isLanguage(e.newValue)) {
        setLanguage(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 登入後以帳號上的偏好為準 —— 這是「換手機／換平板也跟著走」的關鍵。
  // 登出時保留當下語言，不必把使用者踢回預設值。
  useEffect(() => {
    let cancelled = false;

    const adoptAccountLanguage = async () => {
      const remote = await fetchRemoteLanguage();
      if (cancelled || !remote) return;

      setLanguage(remote);
      writeLocalLanguage(remote);
      window.dispatchEvent(
        new CustomEvent('languagechange', { detail: { language: remote } })
      );
    };

    void adoptAccountLanguage();

    // 登入／登出狀態改變時重新對齊
    const subscription = onAuthStateChange((user) => {
      if (user) void adoptAccountLanguage();
    });

    return () => {
      cancelled = true;
      subscription?.unsubscribe?.();
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    // 本地立即生效，遠端在背景寫入；同步失敗不影響使用者當下的操作
    setLanguage(lang);
    writeLocalLanguage(lang);
    void saveRemoteLanguage(lang);

    window.dispatchEvent(
      new CustomEvent('languagechange', { detail: { language: lang } })
    );
  };

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
