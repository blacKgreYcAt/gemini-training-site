'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth-utils'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'

export default function AuthPage() {
  const { language } = useLanguage()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, name)
        alert(language === 'ja' ? '登録が完了しました。ログインしてください' : '註冊成功！請登入')
        setIsSignUp(false)
        setEmail('')
        setPassword('')
        setName('')
      } else {
        await signIn(email, password)
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || (language === 'ja' ? 'エラーが発生しました' : '發生錯誤'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0071e3 0%, #10b981 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '10px',
          color: '#333',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          🎓 Gemini 課程
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          {isSignUp ? (language === 'ja' ? '新しいアカウントを作成' : '建立新帳號') : (language === 'ja' ? 'アカウントにログイン' : '登入您的帳號')}
        </p>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          {isSignUp && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333',
                fontSize: '14px'
              }}>
                {language === 'ja' ? '名前' : '姓名'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ja' ? '例：山田太郎' : '例如：陳小明'}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              {language === 'ja' ? 'メールアドレス' : '電子郵件'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              {language === 'ja' ? 'パスワード' : '密碼'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'ja' ? '最低 6 文字' : '至少 6 個字符'}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#ccc' : '#0071e3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? (language === 'ja' ? '処理中...' : '處理中...') : isSignUp ? (language === 'ja' ? 'アカウント作成' : '建立帳號') : (language === 'ja' ? 'ログイン' : '登入')}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '2px solid #e5e7eb'
        }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
            {isSignUp ? (language === 'ja' ? 'アカウントをお持ちですか？' : '已有帳號？') : (language === 'ja' ? 'アカウントをお持ちでないですか？' : '還沒有帳號？')}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0071e3',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? (language === 'ja' ? 'ログイン' : '登入') : (language === 'ja' ? '登録' : '註冊')}
          </button>
        </div>
      </div>
    </div>
  )
}
