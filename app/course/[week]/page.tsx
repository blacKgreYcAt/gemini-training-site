'use client'

import Link from 'next/link'
import { courseData } from '@/lib/course-data'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function CoursePage() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [week, setWeek] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pageIdx, setPageIdx] = useState(0)

  useEffect(() => {
    // 從路徑提取 week 參數，例如 /course/0 -> 0
    const match = pathname.match(/\/course\/(\d+)/)
    if (match && match[1]) {
      const weekNum = parseInt(match[1], 10)
      if (!isNaN(weekNum)) {
        setWeek(weekNum)
      }
    }

    // 從查詢參數提取 id，例如 ?id=1-1
    const id = searchParams.get('id')
    if (id) {
      setSelectedId(id)
      setPageIdx(0)
    }
  }, [pathname, searchParams])

  // 鍵盤控制事件 - 使用 selectedId 作為依賴，因為它決定了課程
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedId || !week) return

      const courses = courseData.filter(c => c.week === week)
      const course = courses.find(c => c.id === selectedId)
      if (!course?.pages) return

      if (e.key === 'ArrowLeft') {
        setPageIdx(p => Math.max(0, p - 1))
      } else if (e.key === 'ArrowRight') {
        setPageIdx(p => Math.min(course.pages.length - 1, p + 1))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedId, week])

  if (week === null) {
    return (
      <div style={{ padding: '40px', color: '#000000', background: '#f5f5f7', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>加載中...</p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>路徑: {pathname}</p>
          <p style={{ fontSize: '12px', color: '#999' }}>如果一直停留在此，請重新整理頁面或回到首頁重試</p>
          <Link href="/" style={{ marginTop: '20px', color: '#0071e3', textDecoration: 'underline', display: 'inline-block' }}>← 返回首頁</Link>
        </div>
      </div>
    )
  }

  const courses = courseData.filter(c => c.week === week)
  const course = courses.find(c => c.id === selectedId)

  // 投影片視圖
  if (course?.pages) {
    const page = course.pages[pageIdx]
    const total = course.pages.length

    return (
      <div style={{ background: '#f5f5f7', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{
        borderBottom: '2px solid #0071e3',
        padding: 'clamp(12px, 4vw, 20px) clamp(16px, 8vw, 40px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
          <button onClick={() => setSelectedId(null)} style={{
            background: 'none',
            border: 'none',
            color: '#0071e3',
            cursor: 'pointer',
            fontSize: 'clamp(14px, 4vw, 18px)',
            fontWeight: 600,
          }}>← 返回</button>
          <span style={{
            color: '#333',
            fontSize: 'clamp(12px, 4vw, 18px)',
            fontWeight: 500,
          }}>{week === 0 ? '課前準備' : `第 ${week} 週`} | {pageIdx + 1}/{total}</span>
        </div>

        <section style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'clamp(30px, 8vw, 60px) clamp(16px, 8vw, 40px)',
        }}>
          <div style={{
            display: 'flex',
            gap: 'clamp(30px, 8vw, 60px)',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flexDirection: 'column',
          }}>
            <div style={{ flex: 1, width: '100%' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 8vw, 56px)',
                color: '#000000',
                marginBottom: 'clamp(20px, 5vw, 40px)',
                textAlign: 'center',
                fontWeight: 900,
              }}>{page.title}</h1>
              <div style={{
                fontSize: 'clamp(16px, 4vw, 28px)',
                color: '#000000',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                maxWidth: '100%',
                textAlign: 'left',
                fontWeight: 500,
              }}>
                {page.content}
              </div>
            </div>
            {selectedId === '1-2' && (
              <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
                <img
                  src="/images/gemini-features.png"
                  alt="Gemini Features"
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        </section>

        <div style={{
          borderTop: '2px solid #0071e3',
          padding: 'clamp(12px, 4vw, 20px) clamp(16px, 8vw, 40px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'clamp(12px, 3vw, 20px)',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setPageIdx(p => Math.max(0, p - 1))}
            disabled={pageIdx === 0}
            style={{
              padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)',
              border: '2px solid #0071e3',
              background: 'transparent',
              color: '#0071e3',
              cursor: pageIdx === 0 ? 'not-allowed' : 'pointer',
              opacity: pageIdx === 0 ? 0.5 : 1,
              fontSize: 'clamp(14px, 4vw, 18px)',
              fontWeight: 600,
            }}
          >
            ← 上一頁
          </button>
          <span style={{
            fontSize: 'clamp(14px, 3vw, 18px)',
            fontWeight: 500,
            color: '#333',
          }}>{pageIdx + 1}/{total}</span>
          <button
            onClick={() => setPageIdx(p => Math.min(total - 1, p + 1))}
            disabled={pageIdx === total - 1}
            style={{
              padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)',
              background: pageIdx === total - 1 ? '#d0d0d0' : '#0071e3',
              color: pageIdx === total - 1 ? '#666' : '#ffffff',
              border: 'none',
              cursor: pageIdx === total - 1 ? 'not-allowed' : 'pointer',
              opacity: pageIdx === total - 1 ? 0.5 : 1,
              fontSize: 'clamp(14px, 4vw, 18px)',
              fontWeight: 600,
            }}
          >
            下一頁 →
          </button>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '2px solid #0071e3',
          padding: 'clamp(16px, 5vw, 20px) clamp(16px, 8vw, 40px)',
          textAlign: 'center',
          color: '#666',
          fontSize: 'clamp(12px, 3vw, 14px)',
          marginTop: '40px',
        }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            © 2026 大豐貿易集團 • AI 企業協作課程 • 課程與網站規劃：大豐資訊Benjamin •{' '}
            <a href="mailto:benjaminchu@tfg.com.tw" style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 600 }}>
              我要提問
            </a>
          </p>
        </div>
      </div>
    )
  }

  // 課程列表視圖
  return (
    <div style={{ padding: '40px', background: '#f5f5f7', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Link href="/">← 返回首頁</Link>
      <h1 style={{ fontSize: 'clamp(32px, 8vw, 44px)', marginTop: '40px', marginBottom: '40px' }}>{week === 0 ? '課前準備' : `第 ${week} 週`} ({courses.length})</h1>

      <div style={{ flex: 1 }}>
        {courses.map(c => (
          <div
            key={c.id}
            onClick={() => { setSelectedId(c.id); setPageIdx(0); }}
            style={{ marginBottom: '30px', padding: '25px', border: '2px solid #0071e3', background: '#ffffff', cursor: 'pointer' }}
          >
            <h2 style={{ color: '#0071e3', marginBottom: '10px' }}>{c.title}</h2>
            <p>{c.description}</p>
            <p style={{ color: '#999', marginTop: '10px' }}>⏱️ {c.duration_minutes} 分鐘 | 📑 {c.pages?.length || 0} 頁</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '2px solid #0071e3',
        padding: 'clamp(16px, 5vw, 20px) clamp(16px, 8vw, 40px)',
        textAlign: 'center',
        color: '#666',
        fontSize: 'clamp(12px, 3vw, 14px)',
        marginTop: '40px',
      }}>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          © 2026 大豐貿易集團 • AI 企業協作課程 • 課程與網站規劃：大豐資訊Benjamin •{' '}
          <a href="mailto:benjaminchu@tfg.com.tw" style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 600 }}>
            我要提問
          </a>
        </p>
      </div>
    </div>
  )
}
