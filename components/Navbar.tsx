'use client'

import { useAuth } from '@/lib/auth-context'
import { signOut } from '@/lib/auth-utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const { user } = useAuth()
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
      height: '60px'
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#0071e3',
          cursor: 'pointer'
        }}>
          🎓 Gemini 課程
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>
            首頁
          </Link>
          <Link href="/cards" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>
            卡牌
          </Link>
          <Link href="/quiz" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>
            題庫
          </Link>
          <Link href="/dashboard/progress" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>
            進度
          </Link>
        </nav>

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
                fontWeight: '500'
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
                  登出
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
