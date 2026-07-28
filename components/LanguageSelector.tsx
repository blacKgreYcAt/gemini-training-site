// =====================================================
// 語言選擇器組件 - 支持中文/日文切換
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getSession } from '@/lib/auth-utils';

type Language = 'zh' | 'ja';

export function LanguageSelector() {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('zh');
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

    // 保存到 localStorage（總是會做）
    localStorage.setItem('preferred_language', newLanguage);

    // 如果用戶已登錄，保存到 Supabase
    if (user) {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // 獲取認證會話並添加到頭部
        try {
          const session = await getSession();
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
            console.log('✅ Auth token acquired for user:', user.id);
          }
        } catch (e) {
          console.warn('⚠️ Failed to get auth token:', e);
        }

        console.log('🔴 API CALL: /api/user-language-preference with userId:', user.id);
        const response = await fetch('/api/user-language-preference', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            userId: user.id,
            preferredLanguage: newLanguage,
          }),
        });

        if (!response.ok) {
          console.error('❌ API error:', response.status, response.statusText);
          const error = await response.json().catch(() => ({}));
          console.error('Error details:', error);
        } else {
          const data = await response.json();
          console.log('✅ Language preference saved to Supabase:', newLanguage, data);
        }
      } catch (error) {
        console.error('Failed to save language preference to Supabase:', error);
      }
    } else {
      console.log('ℹ️ User not logged in. Language preference saved to localStorage only.');
    }

    // 發送自定義事件以通知其他組件
    window.dispatchEvent(
      new CustomEvent('languagechange', { detail: { language: newLanguage } })
    );
  }

  return (
    <div className="language-selector">
      <div style={{ display: 'inline-flex', gap: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
        <button
          style={{
            minWidth: '96px',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.2s',
            backgroundColor: language === 'zh' ? '#2563eb' : 'transparent',
            color: language === 'zh' ? 'white' : '#374151',
            border: 'none',
            cursor: 'pointer',
            boxShadow: language === 'zh' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
          }}
          onClick={() => handleLanguageChange('zh')}
          disabled={loading}
          aria-label="中文"
        >
          中文
        </button>

        <button
          style={{
            minWidth: '96px',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.2s',
            backgroundColor: language === 'ja' ? '#2563eb' : 'transparent',
            color: language === 'ja' ? 'white' : '#374151',
            border: 'none',
            cursor: 'pointer',
            boxShadow: language === 'ja' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
          }}
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
