'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { checkCertificateEligibility, getProgress } from '@/lib/progress-utils'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'

function ProgressItem({
  icon,
  label,
  completed,
  percentage,
  required,
}: {
  icon: string
  label: string
  completed: boolean
  percentage: number
  required?: string
}) {
  return (
    <div style={{ padding: '18px 0', borderBottom: '1px solid var(--tf-line)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '15.5px',
            fontWeight: 600,
            color: 'var(--tf-ink)',
          }}
        >
          <span aria-hidden="true">{icon}</span>
          {label}
        </span>
        <div style={{ textAlign: 'right', flex: 'none' }}>
          <span
            className="tf-num"
            style={{
              fontSize: '19px',
              fontWeight: 700,
              color: completed ? 'var(--tf-green)' : 'var(--tf-blue-500)',
            }}
          >
            {percentage.toFixed(1)}%
          </span>
          {required && (
            <p className="tf-label" style={{ margin: '2px 0 0' }}>
              {required}
            </p>
          )}
        </div>
      </div>

      <div className={`tf-meter${completed ? ' is-complete' : ''}`}>
        <span style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  )
}

function ProgressPageContent() {
  const { language } = useLanguage()
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    // getProgress() 是 async —— 少了 await 會把 Promise 本身存進 state，
    // progress.statistics 永遠是 undefined，導致每個百分比都顯示 0%。
    let cancelled = false
    getProgress().then(prog => {
      if (!cancelled) setProgress(prog)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!progress) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p>{t('loading', language)}</p>
        </div>
      </>
    )
  }

  const stats = progress.statistics || {}
  const earned = stats.certificateEarned
  // 三種狀態，而非兩種：全部達標但尚未生成證書時，先前會落到「未取得」分支，
  // 顯示一個空的「還需完成」清單，使用者符合資格卻沒有任何前進路徑。
  const eligible = checkCertificateEligibility(progress)

  return (
    <>
      <Navbar />

      <section className="tf-band-light">
        <div className="container" style={{ maxWidth: '860px' }}>
          <span className="tf-eyebrow">{t('progress', language)}</span>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)' }}>{t('learningProgress', language)}</h1>
          <p>{t('trackProgress', language)}</p>

          {/* 整體進度 */}
          <div className="tf-card" style={{ marginTop: '40px' }}>
            <h3 style={{ marginBottom: '6px' }}>{t('overallProgress', language)}</h3>

            <ProgressItem
              label={t('slidesProgress', language)}
              icon="📽️"
              completed={stats.slidesCompletionRate === 100}
              percentage={stats.slidesCompletionRate || 0}
            />
            <ProgressItem
              label={t('cardLearning', language)}
              icon="🎴"
              completed={stats.cardsCompletionRate === 100}
              percentage={stats.cardsCompletionRate || 0}
            />
            <ProgressItem
              label={t('quizCompleted', language)}
              icon="📝"
              completed={stats.quizCompletionRate === 100}
              percentage={stats.quizCompletionRate || 0}
            />
            <ProgressItem
              label={t('testScore', language)}
              icon="✅"
              completed={stats.quizAccuracy >= 80}
              percentage={stats.quizAccuracy || 0}
              required={t('requiredScore', language)}
            />
          </div>

          {/* 證書狀態 —— 取得後用深藍重點卡，未取得用一般卡 */}
          {earned ? (
            <div className="tf-card-navy" style={{ marginTop: '28px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '10px' }}>{t('certificateStatus', language)}</h3>
              <p style={{ fontSize: '17px', marginBottom: '18px' }}>
                {t('certificateEarned', language)}
              </p>
              {stats.certificateGeneratedAt && (
                <p style={{ fontSize: '14px' }}>
                  {t('generatedAt', language)}
                  {new Date(stats.certificateGeneratedAt).toLocaleDateString(
                    language === 'ja' ? 'ja-JP' : 'zh-TW'
                  )}
                  {t('generatedAtSuffix', language)}
                </p>
              )}
              {stats.certificateNumber && (
                <p
                  className="tf-num"
                  style={{ fontFamily: 'var(--tf-mono)', fontSize: '13.5px', marginTop: '4px' }}
                >
                  {t('certificateNumber', language)}
                  {stats.certificateNumber}
                </p>
              )}
              <Link
                href="/dashboard/certificate"
                className="tf-btn tf-btn-outline"
                style={{ marginTop: '22px', position: 'relative', zIndex: 1 }}
              >
                {t('viewDownloadCertificate', language)}
              </Link>
            </div>
          ) : eligible ? (
            /* 全部達標但尚未生成 —— 直接引導去領證書，不要顯示空的待辦清單 */
            <div className="tf-card-navy" style={{ marginTop: '28px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '10px' }}>{t('certificateStatus', language)}</h3>
              <p style={{ fontSize: '17px', position: 'relative', zIndex: 1 }}>
                {t('certificateCongratulations', language)}
              </p>
              <p style={{ fontSize: '14px', marginTop: '6px', position: 'relative', zIndex: 1 }}>
                {t('certificateGeneratePrompt', language)}
              </p>
              <Link
                href="/dashboard/certificate"
                className="tf-btn tf-btn-outline"
                style={{ marginTop: '22px', position: 'relative', zIndex: 1 }}
              >
                {t('certificateGenerateButton', language)}
              </Link>
            </div>
          ) : (
            <div className="tf-card" style={{ marginTop: '28px' }}>
              <h3 style={{ marginBottom: '10px' }}>{t('certificateStatus', language)}</h3>
              <p>{t('completeCourseRequirements', language)}</p>

              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '18px',
                  borderTop: '1px solid var(--tf-line)',
                }}
              >
                <p className="tf-field-label" style={{ marginBottom: '10px' }}>
                  {t('stillNeedComplete', language)}
                </p>
                <ul className="tf-rule-list" style={{ marginTop: 0 }}>
                  {stats.slidesCompletionRate < 100 && (
                    <li>
                      <span className="tf-rule-row tf-num">
                        {t('slidesProgress', language)}：
                        {(100 - stats.slidesCompletionRate).toFixed(0)}%
                      </span>
                    </li>
                  )}
                  {stats.cardsCompletionRate < 100 && (
                    <li>
                      <span className="tf-rule-row tf-num">
                        {t('cardLearning', language)}：
                        {(100 - stats.cardsCompletionRate).toFixed(0)}%
                      </span>
                    </li>
                  )}
                  {stats.quizCompletionRate < 100 && (
                    <li>
                      <span className="tf-rule-row tf-num">
                        {t('quizCompleted', language)}：
                        {(100 - stats.quizCompletionRate).toFixed(0)}%
                      </span>
                    </li>
                  )}
                  {stats.quizAccuracy < 80 && (
                    <li>
                      <span className="tf-rule-row">
                        {t('testScore', language)}：{t('requiredScoreProgress', language)}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 提示 —— 近白色帶 + 線稿圖示盒 */}
      <section className="tf-band-pale">
        <div className="container" style={{ maxWidth: '860px' }}>
          <span className="tf-eyebrow">{t('tips', language)}</span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '22px',
              marginTop: '10px',
            }}
          >
            {[
              { icon: '📽️', text: t('slidesTip', language) },
              { icon: '🎴', text: t('cardsTip', language) },
              { icon: '📝', text: t('quizTip', language) },
              { icon: '💾', text: t('autoSaveTip', language) },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div className="tf-icon-box" aria-hidden="true">
                  {item.icon}
                </div>
                <p style={{ fontSize: '14.5px' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default function ProgressPage() {
  return (
    <ProtectedRoute>
      <ProgressPageContent />
    </ProtectedRoute>
  )
}
