'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

/**
 * 將 <html lang> 與目前語言同步。
 *
 * 語言偏好存在 localStorage，伺服器端無從得知，因此 layout 只能先輸出一個
 * 預設值，再由這個 client component 於掛載後修正。這關係到螢幕閱讀器選用的
 * 語音，以及瀏覽器的翻譯提示。
 */
export function HtmlLangSync() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language === 'ja' ? 'ja' : 'zh-TW';
  }, [language]);

  return null;
}
