'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProgress } from '@/lib/progress-utils'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'

function ProgressPageContent() {
  const { language } = useLanguage()
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    const prog = getProgress()
    setProgress(prog)
  }, [])

  if (!progress) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#f5f5f7', minHeight: '100vh' }}>
        <p>{t('loading', language)}</p>
      </div>
    )
  }

  const stats = progress.statistics || {}

  return (
    <div style={{ padding: '40px', background: '#f5f5f7', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', marginTop: '20px' }}>
        <h1 style={{ marginBottom: '10px' }}>📊 {t('learningProgress', language)}</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>{t('trackProgress', language)}</p>

        {/* 整體進度卡片 */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '30px' }}>📈 {t('overallProgress', language)}</h2>

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

        {/* 證書狀態 */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '40px',
          border: stats.certificateEarned ? '2px solid #10b981' : '2px solid #ddd'
        }}>
          <h2 style={{ marginBottom: '20px' }}>🏆 {t('certificateStatus', language)}</h2>

          {stats.certificateEarned ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', color: '#10b981', fontWeight: 600, marginBottom: '20px' }}>
                ✅ {t('certificateEarned', language)}
              </p>
              {stats.certificateGeneratedAt && (
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  {t('generatedAt', language)}{new Date(stats.certificateGeneratedAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'zh-TW')}{t('generatedAtSuffix', language)}
                </p>
              )}
              {stats.certificateNumber && (
                <p style={{ color: '#666', marginBottom: '20px', fontFamily: 'monospace' }}>
                  {t('certificateNumber', language)}{stats.certificateNumber}
                </p>
              )}
              <Link href="/dashboard/certificate">
                <button style={{
                  padding: '12px 30px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}>
                  {t('viewDownloadCertificate', language)}
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {t('completeCourseRequirements', language)}
              </p>
              <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  {t('stillNeedComplete', language)}
                </p>
                <ul style={{ margin: '10px 0 0 20px', fontSize: '14px', color: '#666' }}>
                  {stats.slidesCompletionRate < 100 && <li>{t('slidesProgress', language)}：{(100 - stats.slidesCompletionRate).toFixed(0)}%</li>}
                  {stats.cardsCompletionRate < 100 && <li>{t('cardLearning', language)}：{(100 - stats.cardsCompletionRate).toFixed(0)}%</li>}
                  {stats.quizCompletionRate < 100 && <li>{t('quizCompleted', language)}：{(100 - stats.quizCompletionRate).toFixed(0)}%</li>}
                  {stats.quizAccuracy < 80 && <li>{t('testScore', language)}：{language === 'ja' ? '80% 以上が必要' : '需達 80% 或以上'}</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 建議和提示 */}
        <div style={{
          background: '#f9f3ff',
          padding: '20px',
          borderRadius: '10px',
          borderLeft: '4px solid #9333ea'
        }}>
          <p style={{ marginBottom: '10px', fontWeight: 600 }}>{t('tips', language)}</p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
            <li>{t('slidesTip', language)}</li>
            <li>{t('cardsTip', language)}</li>
            <li>{t('quizTip', language)}</li>
            <li>{t('autoSaveTip', language)}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function ProgressPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <ProgressPageContent />
    </ProtectedRoute>
  )
}

function ProgressItem({
  icon,
  label,
  completed,
  percentage,
  required
}: {
  icon: string
  label: string
  completed: boolean
  percentage: number
  required?: string
}) {
  return (
    <div style={{ marginBottom: '25px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon} {label}
        </span>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: completed ? '#10b981' : '#666', fontWeight: 600, fontSize: '18px' }}>
            {percentage.toFixed(1)}%
          </span>
          {required && (
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
              {required}
            </p>
          )}
        </div>
      </div>

      <div style={{
        width: '100%',
        height: '12px',
        background: '#e5e7eb',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.min(percentage, 100)}%`,
          height: '100%',
          background: completed ? '#10b981' : '#0071e3',
          transition: 'width 0.3s ease',
          borderRadius: '6px'
        }} />
      </div>
    </div>
  )
}
