// =====================================================
// 語言選擇器組件 - 支持英文/日文切換
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

type Language = 'en' | 'ja';

export function LanguageSelector() {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  // 初始化 - 讀取用戶語言偏好
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    setLoading(false);

    // 如果用戶已登錄，從 Supabase 讀取偏好
    if (user) {
      fetchUserLanguagePreference(user.id);
    }
  }, [user]);

  // 從 Supabase 讀取用戶語言偏好
  async function fetchUserLanguagePreference(userId: string) {
    try {
      const response = await fetch(
        `/api/user-language-preference?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.preferred_language) {
          setLanguage(data.preferred_language as Language);
        }
      }
    } catch (error) {
      console.error('Failed to fetch language preference:', error);
    }
  }

  // 處理語言變更
  async function handleLanguageChange(newLanguage: Language) {
    setLanguage(newLanguage);

    // 保存到 localStorage
    localStorage.setItem('preferred_language', newLanguage);

    // 如果用戶已登錄，保存到 Supabase
    if (user) {
      try {
        await fetch('/api/user-language-preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            preferredLanguage: newLanguage,
          }),
        });
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }

    // 發送自定義事件以通知其他組件
    window.dispatchEvent(
      new CustomEvent('languagechange', { detail: { language: newLanguage } })
    );
  }

  return (
    <div className="language-selector">
      <div className="flex gap-2 bg-gray-100 rounded-lg p-1 inline-flex">
        <button
          className={`min-w-24 px-4 py-2 rounded-md font-medium text-sm transition-all ${
            language === 'en'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleLanguageChange('en')}
          disabled={loading}
          aria-label="English"
        >
          English
        </button>

        <button
          className={`min-w-24 px-4 py-2 rounded-md font-medium text-sm transition-all ${
            language === 'ja'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleLanguageChange('ja')}
          disabled={loading}
          aria-label="日本語"
        >
          日本語
        </button>
      </div>
    </div>
  );
}

export default LanguageSelector;
