'use client';

import { useLanguage } from '@/lib/language-context';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

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
          onClick={() => setLanguage('zh')}
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
          onClick={() => setLanguage('ja')}
          aria-label="日本語"
        >
          日本語
        </button>
      </div>
    </div>
  );
}

export default LanguageSelector;
