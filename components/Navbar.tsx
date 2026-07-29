'use client'

import { useAuth } from '@/lib/auth-context'
import { signOut } from '@/lib/auth-utils'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (error) {
      console.error('登出失敗:', error)
    }
  }

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px',
      flexWrap: 'wrap'
    }}>
      {/* Logo - Clickable to return home */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#0071e3',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🎓 {language === 'ja' ? 'Gemini コース' : 'Gemini 課程'}
        </div>
      </Link>

      {/* Navigation Items & Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        {/* Navigation Menu */}
        <nav style={{ display: 'flex', gap: '25px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#666', fontWeight: '500', fontSize: '14px' }}>
            {t('home', language)}
          </Link>
          <Link href="/cards" style={{ textDecoration: 'none', color: '#666', fontWeight: '500', fontSize: '14px' }}>
            {t('cards', language)}
          </Link>
          <Link href="/quiz" style={{ textDecoration: 'none', color: '#666', fontWeight: '500', fontSize: '14px' }}>
            {t('quiz', language)}
          </Link>
          <Link href="/dashboard/progress" style={{ textDecoration: 'none', color: '#666', fontWeight: '500', fontSize: '14px' }}>
            {t('progress', language)}
          </Link>
        </nav>

        {/* Language Selector */}
        <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid #e5e7eb', paddingLeft: '20px' }}>
          <button
            onClick={() => setLanguage('zh')}
            style={{
              padding: '6px 12px',
              background: language === 'zh' ? '#0071e3' : '#f0f0f0',
              color: language === 'zh' ? 'white' : '#666',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '12px',
              transition: 'all 0.2s'
            }}
          >
            中文
          </button>
          <button
            onClick={() => setLanguage('ja')}
            style={{
              padding: '6px 12px',
              background: language === 'ja' ? '#0071e3' : '#f0f0f0',
              color: language === 'ja' ? 'white' : '#666',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '12px',
              transition: 'all 0.2s'
            }}
          >
            日本語
          </button>
        </div>

        {/* User Menu */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: '#0071e3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              👤 {user.name || user.email.split('@')[0]}
            </button>

            {showMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '40px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '150px',
                zIndex: 100
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#d32f2f',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  {t('logout', language)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
