'use client'

import { useState } from 'react'
import {
  generateCertificateNumber,
  generateCertificateCanvas,
  downloadCertificateAsPNG,
  downloadCertificateAsPDF,
  displayCertificatePreview,
  type CertificateData
} from '@/lib/certificate-utils'

export default function CertificateDemoPage() {
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [userName, setUserName] = useState('測試用戶')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleGenerateTestCertificate = async () => {
    setIsGenerating(true)
    setError('')

    try {
      const certData: CertificateData = {
        userName: userName || '測試用戶',
        completionDate: new Date(),
        certificateNumber: generateCertificateNumber(),
        quizAccuracy: 92.5,
        totalLearningHours: 12.5
      }

      const generatedCanvas = await generateCertificateCanvas(certData)

      setCertificateData(certData)
      setCanvas(generatedCanvas)
    } catch (error: any) {
      console.error('證書生成失敗:', error)
      setError(`證書生成失敗: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{ padding: '40px', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>
          🧪 証書生成演示
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
          用來測試証書佈局和文字位置
        </p>

        {!canvas ? (
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '15px',
            border: '2px solid #0071e3',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                輸入測試姓名：
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="例如：陳小明"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #0071e3',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: '#fee',
                borderRadius: '8px',
                color: '#c33',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleGenerateTestCertificate}
              disabled={isGenerating}
              style={{
                padding: '14px 40px',
                background: isGenerating ? '#ccc' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
            >
              {isGenerating ? '生成中...' : '生成測試証書'}
            </button>

            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: '#fff3cd',
              borderRadius: '8px',
              color: '#856404'
            }}>
              <strong>⚠️ 注意：</strong>
              <p style={{ margin: '10px 0 0 0' }}>
                請確保 <code>/public/certificate-template.png</code> 已上傳
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <h2 style={{ marginBottom: '20px' }}>証書預覽</h2>
              <img
                src={canvas.toDataURL()}
                alt="証書"
                style={{
                  maxWidth: '100%',
                  maxHeight: '600px',
                  borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <button
                onClick={() => displayCertificatePreview(canvas)}
                style={{
                  padding: '14px',
                  background: '#0071e3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                📋 全屏預覽
              </button>

              <button
                onClick={() => downloadCertificateAsPNG(canvas, userName)}
                style={{
                  padding: '14px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                🖼️ 下載 PNG
              </button>

              <button
                onClick={() => downloadCertificateAsPDF(canvas, userName)}
                style={{
                  padding: '14px',
                  background: '#d4af37',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                📄 下載 PDF
              </button>

              <button
                onClick={() => {
                  setCanvas(null)
                  setCertificateData(null)
                }}
                style={{
                  padding: '14px',
                  background: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                ↻ 重新生成
              </button>
            </div>

            {certificateData && (
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #ddd'
              }}>
                <h3>証書信息</h3>
                <p><strong>姓名：</strong> {certificateData.userName}</p>
                <p><strong>日期：</strong> {certificateData.completionDate.toLocaleDateString('zh-TW')}</p>
                <p><strong>編號：</strong> <code>{certificateData.certificateNumber}</code></p>
                <p><strong>成績：</strong> {certificateData.quizAccuracy.toFixed(1)}%</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
