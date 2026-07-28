'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProgress } from '@/lib/progress-utils'

export default function ProgressPage() {
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    const prog = getProgress()
    setProgress(prog)
  }, [])

  if (!progress) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#f5f5f7', minHeight: '100vh' }}>
        <p>加載中...</p>
      </div>
    )
  }

  const stats = progress.statistics || {}

  return (
    <div style={{ padding: '40px', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '10px' }}>📊 我的學習進度</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>追踪你的課程完成進度</p>

        {/* 整體進度卡片 */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '30px' }}>📈 整體進度</h2>

          <ProgressItem
            label="投影片進度"
            icon="📽️"
            completed={stats.slidesCompletionRate === 100}
            percentage={stats.slidesCompletionRate || 0}
          />

          <ProgressItem
            label="卡牌自學"
            icon="🎴"
            completed={stats.cardsCompletionRate === 100}
            percentage={stats.cardsCompletionRate || 0}
          />

          <ProgressItem
            label="題庫完成"
            icon="📝"
            completed={stats.quizCompletionRate === 100}
            percentage={stats.quizCompletionRate || 0}
          />

          <ProgressItem
            label="測驗成績"
            icon="✅"
            completed={stats.quizAccuracy >= 80}
            percentage={stats.quizAccuracy || 0}
            required="≥80% 可領證書"
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
          <h2 style={{ marginBottom: '20px' }}>🏆 證書狀態</h2>

          {stats.certificateEarned ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', color: '#10b981', fontWeight: 600, marginBottom: '20px' }}>
                ✅ 已獲得結業證書！
              </p>
              {stats.certificateGeneratedAt && (
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  於 {new Date(stats.certificateGeneratedAt).toLocaleDateString('zh-TW')} 生成
                </p>
              )}
              {stats.certificateNumber && (
                <p style={{ color: '#666', marginBottom: '20px', fontFamily: 'monospace' }}>
                  編號：{stats.certificateNumber}
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
                  查看 / 重新下載證書
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                完成所有課程要求後，即可獲得証書。
              </p>
              <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  還需完成：
                </p>
                <ul style={{ margin: '10px 0 0 20px', fontSize: '14px', color: '#666' }}>
                  {stats.slidesCompletionRate < 100 && <li>投影片進度：{(100 - stats.slidesCompletionRate).toFixed(0)}%</li>}
                  {stats.cardsCompletionRate < 100 && <li>卡牌自學：{(100 - stats.cardsCompletionRate).toFixed(0)}%</li>}
                  {stats.quizCompletionRate < 100 && <li>題庫完成：{(100 - stats.quizCompletionRate).toFixed(0)}%</li>}
                  {stats.quizAccuracy < 80 && <li>測驗成績：需達 80% 或以上</li>}
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
          <p style={{ marginBottom: '10px', fontWeight: 600 }}>💡 提示：</p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
            <li>投影片：點擊課程後，逐頁瀏覽所有內容</li>
            <li>卡牌：點擊卡牌翻開解答，系統會自動記錄</li>
            <li>題庫：完整作答所有題目，系統自動計算成績</li>
            <li>進度會自動保存，可随時返回查看</li>
          </ul>
        </div>
      </div>
    </div>
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
