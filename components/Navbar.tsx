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

  const navItems = [
    { href: '/', key: 'home' },
    { href: '/cards', key: 'cards' },
    { href: '/quiz', key: 'quiz' },
    { href: '/dashboard/progress', key: 'progress' },
  ]

  return (
    <>
      {/* 深藍工具列：語言切換與帳號，比照公司網站的頂欄 */}
      <div style={{ background: 'var(--tf-navy-900)', color: 'rgba(255,255,255,0.9)' }}>
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '18px',
            minHeight: '42px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <button
              onClick={() => setLanguage('zh')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 2px',
                letterSpacing: '0.08em',
                fontWeight: language === 'zh' ? 700 : 400,
                color: language === 'zh' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              }}
            >
              中文
            </button>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.35)' }}>
              |
            </span>
            <button
              onClick={() => setLanguage('ja')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 2px',
                letterSpacing: '0.08em',
                fontWeight: language === 'ja' ? 700 : 400,
                color: language === 'ja' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              }}
            >
              日本語
            </button>
          </div>

          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.9)',
                  padding: '4px 2px',
                }}
              >
                {user.name || user.email.split('@')[0]} ▾
              </button>

              {showMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '30px',
                    background: 'var(--tf-white)',
                    border: '1px solid var(--tf-line)',
                    borderRadius: 'var(--tf-radius)',
                    boxShadow: 'var(--tf-shadow-lift)',
                    minWidth: '188px',
                    zIndex: 200,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="tf-label"
                    style={{ padding: '12px 16px', borderBottom: '1px solid var(--tf-line)' }}
                  >
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
                      color: 'var(--tf-red)',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    {t('logout', language)}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 主導覽：白底、細線分隔 */}
      <nav
        style={{
          background: 'var(--tf-white)',
          borderBottom: '1px solid var(--tf-line)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            minHeight: '64px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'var(--tf-serif)',
              fontSize: '19px',
              color: 'var(--tf-ink)',
              letterSpacing: '0.02em',
            }}
          >
            {t('companyName', language)}
          </Link>

          <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 32px)', flexWrap: 'wrap' }}>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{ color: 'var(--tf-body)', fontSize: '15px' }}
              >
                {t(item.key, language)}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
