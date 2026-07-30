'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth-utils'
import { useLanguage } from '@/lib/language-context'
import { LanguageSelector } from '@/components/LanguageSelector'
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
        alert(t('authSignUpSuccess', language))
        setIsSignUp(false)
        setEmail('')
        setPassword('')
        setName('')
      } else {
        await signIn(email, password)
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || t('authError', language))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(20px, 6vw, 48px)',
      }}
    >
      {/* 登入頁無 Navbar，需自備語言切換器 */}
      <div style={{ position: 'absolute', top: '20px', right: '24px', zIndex: 2 }}>
        <LanguageSelector />
      </div>

      <div className="hero-content" style={{ maxWidth: '430px', width: '100%' }}>
        <span className="tf-eyebrow">{t('heroEyebrow', language)}</span>

        <h1 style={{ fontSize: 'clamp(26px, 5vw, 34px)', marginBottom: '4px' }}>
          {t('companyName', language)}
        </h1>
        <span className="hero-accent" style={{ fontSize: 'clamp(18px, 3.6vw, 24px)' }}>
          {t('programName', language)}
        </span>

        <p style={{ marginBottom: '26px' }}>
          {isSignUp ? t('authCreateAccount', language) : t('authLogin', language)}
        </p>

        {error && (
          <div className="tf-alert-error" role="alert">
            <span aria-hidden="true">!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="tf-field-group">
              <label className="tf-field-label" htmlFor="auth-name">
                {t('authNameLabel', language)}
              </label>
              <input
                id="auth-name"
                className="tf-field"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('authNamePlaceholder', language)}
                required
              />
            </div>
          )}

          <div className="tf-field-group">
            <label className="tf-field-label" htmlFor="auth-email">
              {t('authEmailLabel', language)}
            </label>
            <input
              id="auth-email"
              className="tf-field"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="tf-field-group" style={{ marginBottom: '26px' }}>
            <label className="tf-field-label" htmlFor="auth-password">
              {t('authPasswordLabel', language)}
            </label>
            <input
              id="auth-password"
              className="tf-field"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('authPasswordPlaceholder', language)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="tf-btn tf-btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading
              ? t('authProcessing', language)
              : isSignUp
                ? t('authCreateButton', language)
                : t('authLoginButton', language)}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--tf-line)',
          }}
        >
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            {isSignUp ? t('authHaveAccount', language) : t('authNoAccount', language)}
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
              color: 'var(--tf-blue-500)',
              fontSize: '14.5px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'var(--tf-sans)',
            }}
          >
            {isSignUp ? t('authSwitchToLogin', language) : t('authSwitchToSignUp', language)}
          </button>
        </div>
      </div>
    </div>
  )
}
