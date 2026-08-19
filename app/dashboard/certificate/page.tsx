'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  generateCertificateNumber,
  generateCertificateCanvas,
  downloadCertificateAsPNG,
  downloadCertificateAsPDF,
  displayCertificatePreview,
  type CertificateData
} from '@/lib/certificate-utils'
import { getProgress, saveProgress, checkCertificateEligibility, type UserProgress } from '@/lib/progress-utils'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'

function CertificatePageContent() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [userName, setUserName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [certificateGenerated, setCertificateGenerated] = useState(false)
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const rehydratedRef = useRef(false)

  useEffect(() => {
    const loadProgress = async () => {
      const prog = await getProgress()
      setProgress(prog)
      setUserName(prog.userName || '')
    }
    loadProgress()
  }, [])

  // 已經拿過證書的人回到這頁時，用當初存下的編號/日期重建畫面，
  // 而不是落到「尚未生成」表單——不然每次重新整理都會被當成第一次
  // 生成，產生日期是今天、編號遞增的新證書。用 ref 只做一次，這樣
  // 使用者按「重新生成」把 certificateGenerated 設回 false 時才會
  // 真的看到空白表單，而不是立刻被這裡的邏輯蓋回去。
  useEffect(() => {
    if (!progress || rehydratedRef.current) return
    rehydratedRef.current = true

    if (!progress.statistics.certificateEarned || !progress.statistics.certificateNumber) return

    const certData: CertificateData = {
      userName: progress.userName || '',
      completionDate: progress.statistics.certificateGeneratedAt
        ? new Date(progress.statistics.certificateGeneratedAt)
        : new Date(),
      certificateNumber: progress.statistics.certificateNumber,
      quizAccuracy: progress.statistics.quizAccuracy,
      totalLearningHours: progress.statistics.totalLearningHours,
      language: language as 'zh' | 'ja'
    }

    generateCertificateCanvas(certData).then(generatedCanvas => {
      setCertificateData(certData)
      setCanvas(generatedCanvas)
      setCertificateGenerated(true)
    })
  }, [progress, language])

  const isCertificateEligible = () => {
    if (!progress) return false
    return checkCertificateEligibility(progress)
  }

  const handleGenerateCertificate = async () => {
    // 檢查資格
    if (!isCertificateEligible()) {
      alert(t('certificateEligibilityAlert', language))
      return
    }

    if (!userName.trim()) {
      alert(t('certificateNameInputPrompt', language))
      return
    }

    // 編號取自帳號 ID，沒有 user 就生不出唯一編號。這頁包在 ProtectedRoute
    // 裡，正常情況不會走到這裡。
    if (!user) return

    setIsGenerating(true)

    try {
      const certNumber = generateCertificateNumber(user.id)
      const certData: CertificateData = {
        userName: userName.trim(),
        completionDate: new Date(),
        certificateNumber: certNumber,
        quizAccuracy: progress.statistics.quizAccuracy,
        totalLearningHours: progress.statistics.totalLearningHours,
        language: language as 'zh' | 'ja'
      }

      const generatedCanvas = await generateCertificateCanvas(certData)

      const updatedProgress = {
        ...progress,
        userName: userName.trim(),
        statistics: {
          ...progress.statistics,
          certificateGenerated: true,
          certificateGeneratedAt: new Date().toISOString(),
          certificateNumber: certNumber,
          certificateEarned: true
        }
      }

      await saveProgress(updatedProgress)
      setProgress(updatedProgress)

      setCertificateData(certData)
      setCanvas(generatedCanvas)
      setCertificateGenerated(true)
    } catch (error) {
      console.error(t('certificateGenerationError', language), error)
      alert(t('certificateGenerationError', language))
    } finally {
      setIsGenerating(false)
    }
  }

  if (!progress) {
    return (
      <section className="tf-band-light" style={{ minHeight: '60vh' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p>{t('certificateLoadingMessage', language)}</p>
        </div>
      </section>
    )
  }

  // 尚未達成資格
  if (!isCertificateEligible()) {
    const stats = progress.statistics
    return (
      <section className="tf-band-light">
        <div className="container" style={{ maxWidth: '680px' }}>
          <span className="tf-eyebrow">{t('certificate', language)}</span>
          <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 40px)' }}>
            {t('certificateIncompleteTitle', language)}
          </h1>

          <div className="tf-card" style={{ marginTop: '32px' }}>
            <p style={{ marginBottom: '10px' }}>{t('certificateRequirements', language)}</p>

            <ProgressItem
              label={t('certificateSlidesLabel', language)}
              completed={stats.slidesCompletionRate === 100}
              percentage={stats.slidesCompletionRate || 0}
            />
            <ProgressItem
              label={t('certificateCardsLabel', language)}
              completed={stats.cardsCompletionRate === 100}
              percentage={stats.cardsCompletionRate || 0}
            />
            <ProgressItem
              label={t('certificateQuizLabel', language)}
              completed={stats.quizCompletionRate === 100}
              percentage={stats.quizCompletionRate || 0}
            />
            <ProgressItem
              label={t('certificateScoreLabel', language)}
              completed={stats.quizAccuracy >= 80}
              percentage={stats.quizAccuracy || 0}
              required="≥80%"
            />

            <Link
              href="/dashboard/progress"
              className="tf-btn tf-btn-primary"
              style={{ width: '100%', marginTop: '26px' }}
            >
              {t('certificateViewProgressButton', language)}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // 已達資格，尚未生成
  if (!certificateGenerated) {
    return (
      <section className="tf-band-light">
        <div className="container" style={{ maxWidth: '620px' }}>
          <div className="tf-card-navy" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '14px' }}>
              {t('certificateCongratulationsTitle', language)}
            </h2>
            <p style={{ position: 'relative', zIndex: 1 }}>
              {t('certificateCompletionMessage', language)}
              <br />
              <br />
              {t('certificateGeneratePrompt', language)}
            </p>
          </div>

          <div className="tf-card" style={{ marginTop: '28px' }}>
            <div className="tf-field-group">
              <label className="tf-field-label" htmlFor="cert-name">
                {t('certificateNameLabel', language)}
              </label>
              <input
                id="cert-name"
                className="tf-field"
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder={t('authNamePlaceholder', language)}
                onKeyDown={e => e.key === 'Enter' && handleGenerateCertificate()}
                autoFocus
              />
            </div>

            <button
              onClick={handleGenerateCertificate}
              disabled={isGenerating || !userName.trim()}
              className="tf-btn tf-btn-primary"
              style={{ width: '100%' }}
            >
              {isGenerating
                ? t('certificateGenerating', language)
                : t('certificateGenerateButton', language)}
            </button>
          </div>
        </div>
      </section>
    )
  }

  // 證書已生成
  return (
    <section className="tf-band-light">
      <div className="container" style={{ maxWidth: '960px' }}>
        <span className="tf-eyebrow">{t('certificate', language)}</span>
        <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 40px)' }}>
          {t('certificateReadyTitle', language)}
        </h1>

        {canvas && (
          <div className="tf-card" style={{ marginTop: '32px', textAlign: 'center' }}>
            <img
              src={canvas.toDataURL()}
              alt={t('certificatePreviewAlt', language)}
              style={{
                maxWidth: '100%',
                maxHeight: '560px',
                borderRadius: 'var(--tf-radius)',
                border: '1px solid var(--tf-line)',
              }}
            />
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginTop: '28px',
          }}
        >
          <ActionButton
            onClick={() => canvas && displayCertificatePreview(canvas)}
            icon="📋"
            label={t('certificatePreviewLabel', language)}
            variant="outline"
          />
          <ActionButton
            onClick={() =>
              canvas && downloadCertificateAsPNG(canvas, userName, language as 'zh' | 'ja')
            }
            icon="🖼️"
            label={t('certificatePNGButton', language)}
            variant="primary"
          />
          <ActionButton
            onClick={() =>
              canvas && downloadCertificateAsPDF(canvas, userName, language as 'zh' | 'ja')
            }
            icon="📄"
            label={t('certificatePDFButton', language)}
            variant="primary"
          />
          <ActionButton
            onClick={() => {
              setCertificateGenerated(false)
              setUserName('')
            }}
            icon="↻"
            label={t('certificateRegenerate', language)}
            variant="outline"
          />
        </div>

        {certificateData && (
          <div className="tf-card" style={{ marginTop: '28px' }}>
            <h3 style={{ marginBottom: '4px' }}>
              {t('certificateCertificateInfoTitle', language)}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '20px',
                marginTop: '18px',
                paddingTop: '18px',
                borderTop: '1px solid var(--tf-line)',
              }}
            >
              <InfoItem label={t('certificateName', language)} value={certificateData.userName} />
              <InfoItem
                label={t('certificateCompletionDate', language)}
                value={certificateData.completionDate.toLocaleDateString(
                  language === 'ja' ? 'ja-JP' : 'zh-TW'
                )}
              />
              <InfoItem
                label={t('certificateCertificateNumber', language)}
                value={certificateData.certificateNumber}
                monospace
              />
              <InfoItem
                label={t('certificateTestScore', language)}
                value={`${certificateData.quizAccuracy.toFixed(1)}%`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function ProgressItem({
  label,
  completed,
  percentage,
  required,
}: {
  label: string
  completed: boolean
  percentage: number
  required?: string
}) {
  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--tf-line)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '14px',
          marginBottom: '10px',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--tf-ink)', fontSize: '15px' }}>
          <span aria-hidden="true">{completed ? '✅' : '⏳'}</span> {label}
        </span>
        <span
          className="tf-num"
          style={{
            fontWeight: 700,
            fontSize: '15px',
            flex: 'none',
            color: completed ? 'var(--tf-green)' : 'var(--tf-muted)',
          }}
        >
          {percentage.toFixed(1)}% {required ? `(${required})` : ''}
        </span>
      </div>
      <div className={`tf-meter${completed ? ' is-complete' : ''}`}>
        <span style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  )
}

export default function CertificatePage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <CertificatePageContent />
    </ProtectedRoute>
  )
}

function ActionButton({
  onClick,
  icon,
  label,
  variant,
}: {
  onClick: () => void
  icon: string
  label: string
  variant: 'primary' | 'outline'
}) {
  return (
    <button
      onClick={onClick}
      className={`tf-btn tf-btn-${variant}`}
      style={{ flexDirection: 'column', gap: '6px', padding: '16px 12px', fontSize: '13.5px' }}
    >
      <span aria-hidden="true" style={{ fontSize: '19px' }}>
        {icon}
      </span>
      {label}
    </button>
  )
}

function InfoItem({
  label,
  value,
  monospace,
}: {
  label: string
  value: string
  monospace?: boolean
}) {
  return (
    <div>
      <div className="tf-label" style={{ marginBottom: '4px' }}>
        {label}
      </div>
      <div
        className={monospace ? 'tf-num' : undefined}
        style={{
          fontSize: '15.5px',
          color: 'var(--tf-ink)',
          fontWeight: 500,
          fontFamily: monospace ? 'var(--tf-mono)' : 'inherit',
        }}
      >
        {value}
      </div>
    </div>
  )
}
