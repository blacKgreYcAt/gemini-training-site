'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  generateCertificateNumber,
  generateCertificateCanvas,
  downloadCertificateAsPNG,
  downloadCertificateAsPDF,
  displayCertificatePreview,
  type CertificateData
} from '@/lib/certificate-utils'
import { getProgress, checkCertificateEligibility } from '@/lib/progress-utils'

export default function CertificatePage() {
  const [progress, setProgress] = useState<any>(null)
  const [userName, setUserName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [certificateGenerated, setCertificateGenerated] = useState(false)
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const prog = getProgress()
    setProgress(prog)
    setUserName(prog.userName || '')
  }, [])

  const isCertificateEligible = () => {
    if (!progress) return false
    return checkCertificateEligibility(progress)
  }

  const handleGenerateCertificate = async () => {
    if (!userName.trim()) {
      alert('請輸入你的姓名')
      return
    }

    setIsGenerating(true)

    try {
      const certNumber = generateCertificateNumber()
      const certData: CertificateData = {
        userName: userName.trim(),
        completionDate: new Date(),
        certificateNumber: certNumber,
        quizAccuracy: progress.statistics.quizAccuracy,
        totalLearningHours: progress.statistics.totalLearningHours
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

      localStorage.setItem('userProgress', JSON.stringify(updatedProgress))

      setCertificateData(certData)
      setCanvas(generatedCanvas)
      setCertificateGenerated(true)
    } catch (error) {
      console.error('證書生成失敗:', error)
      alert('證書生成失敗，請重試')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!progress) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#f5f5f7', minHeight: '100vh' }}>
        <p>加載中...</p>
      </div>
    )
  }

  if (!isCertificateEligible()) {
    const stats = progress.statistics || {}
    return (
      <div style={{ padding: '40px', background: '#f5f5f7', minHeight: '100vh' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          border: '2px solid #0071e3'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🎯 完成課程以獲得證書</h1>

          <p style={{ marginBottom: '30px', color: '#666' }}>
            您需要完成以下所有要求才能獲得結業證書：
          </p>

          <ProgressItem
            label="投影片進度"
            completed={stats.slidesCompletionRate === 100}
            percentage={stats.slidesCompletionRate || 0}
          />
          <ProgressItem
            label="卡牌自學"
            completed={stats.cardsCompletionRate === 100}
            percentage={stats.cardsCompletionRate || 0}
          />
          <ProgressItem
            label="題庫完成"
            completed={stats.quizCompletionRate === 100}
            percentage={stats.quizCompletionRate || 0}
          />
          <ProgressItem
            label="測驗成績"
            completed={stats.quizAccuracy >= 80}
            percentage={stats.quizAccuracy || 0}
            required="≥80%"
          />

          <Link href="/dashboard/progress">
            <button style={{
              width: '100%',
              padding: '12px',
              marginTop: '30px',
              background: '#0071e3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}>
              查看詳細進度 →
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (!certificateGenerated) {
    return (
      <div style={{ padding: '40px', background: '#f5f5f7', minHeight: '100vh' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          border: '3px solid #10b981',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.15)'
        }}>
          <h1 style={{ marginBottom: '20px', color: '#10b981' }}>🏆 恭喜完成課程！</h1>

          <div style={{
            background: '#f0fdf4',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px'
          }}>
            <p style={{ fontSize: '16px', color: '#047857', margin: 0, lineHeight: '1.6' }}>
              您已成功完成「Gemini 企業協作課程」的所有課程內容、卡牌自學和題庫測驗。
              <br />
              <br />
              現在就生成你的專屬證書吧！
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              fontWeight: 600,
              color: '#333',
              textAlign: 'left'
            }}>
              請輸入您的姓名（用於證書）：
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="例如：陳小明"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateCertificate()}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: '2px solid #0071e3',
                fontSize: '16px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              autoFocus
            />
          </div>

          <button
            onClick={handleGenerateCertificate}
            disabled={isGenerating || !userName.trim()}
            style={{
              width: '100%',
              padding: '14px',
              background: isGenerating || !userName.trim() ? '#ccc' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isGenerating || !userName.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {isGenerating ? '⏳ 生成中...' : '✨ 生成我的證書'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#10b981' }}>
          🏆 您的證書已準備好
        </h1>

        {canvas && (
          <div style={{
            marginBottom: '40px',
            textAlign: 'center',
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <img
              src={canvas.toDataURL()}
              alt="証書預覽"
              style={{
                maxWidth: '100%',
                maxHeight: '600px',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)'
              }}
            />
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '15px',
          marginBottom: '40px'
        }}>
          <ActionButton
            onClick={() => canvas && displayCertificatePreview(canvas)}
            icon="📋"
            label="預覽"
            color="#0071e3"
          />

          <ActionButton
            onClick={() => canvas && downloadCertificateAsPNG(canvas, userName)}
            icon="🖼️"
            label="下載 PNG"
            color="#10b981"
          />

          <ActionButton
            onClick={() => canvas && downloadCertificateAsPDF(canvas, userName)}
            icon="📄"
            label="下載 PDF"
            color="#d4af37"
          />

          <ActionButton
            onClick={() => {
              setCertificateGenerated(false)
              setUserName('')
            }}
            icon="↻"
            label="重新生成"
            color="#999"
          />
        </div>

        {certificateData && (
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            border: '2px solid #e5e7eb'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 證書信息</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <InfoItem label="姓名" value={certificateData.userName} />
              <InfoItem
                label="完成日期"
                value={certificateData.completionDate.toLocaleDateString('zh-TW')}
              />
              <InfoItem
                label="証書編號"
                value={certificateData.certificateNumber}
                monospace
              />
              <InfoItem
                label="測驗成績"
                value={`${certificateData.quizAccuracy.toFixed(1)}%`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProgressItem({
  label,
  completed,
  percentage,
  required
}: {
  label: string
  completed: boolean
  percentage: number
  required?: string
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: 600, color: '#333' }}>
          {completed ? '✅' : '⏳'} {label}
        </span>
        <span style={{ color: completed ? '#10b981' : '#999', fontWeight: 600 }}>
          {percentage.toFixed(1)}% {required ? `(${required})` : ''}
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '10px',
        background: '#e5e7eb',
        borderRadius: '5px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.min(percentage, 100)}%`,
          height: '100%',
          background: completed ? '#10b981' : '#0071e3',
          transition: 'width 0.3s ease',
          borderRadius: '5px'
        }} />
      </div>
    </div>
  )
}

function ActionButton({
  onClick,
  icon,
  label,
  color
}: {
  onClick: () => void
  icon: string
  label: string
  color: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '18px 16px',
        background: color,
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: `0 4px 12px ${color}40`
      }}
    >
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      {label}
    </button>
  )
}

function InfoItem({
  label,
  value,
  monospace
}: {
  label: string
  value: string
  monospace?: boolean
}) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{
        fontSize: '16px',
        color: '#333',
        fontWeight: 500,
        fontFamily: monospace ? '"Courier New", monospace' : 'inherit'
      }}>
        {value}
      </div>
    </div>
  )
}
