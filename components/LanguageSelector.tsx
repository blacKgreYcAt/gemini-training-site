'use client';

import { useLanguage } from '@/lib/language-context';

const LANGUAGES: { code: 'zh' | 'ja'; label: string }[] = [
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid var(--tf-blue-200)',
        borderRadius: '999px',
        padding: '5px 14px',
        fontSize: '13px',
      }}
    >
      {LANGUAGES.map(({ code, label }, i) => (
        <span key={code} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          {i > 0 && (
            <span aria-hidden="true" style={{ color: 'var(--tf-line)' }}>
              |
            </span>
          )}
          <button
            onClick={() => setLanguage(code)}
            aria-label={label}
            aria-current={language === code}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              fontFamily: 'var(--tf-sans)',
              fontSize: '13px',
              letterSpacing: '0.06em',
              fontWeight: language === code ? 700 : 400,
              color: language === code ? 'var(--tf-navy-700)' : 'var(--tf-muted)',
            }}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}

export default LanguageSelector;
