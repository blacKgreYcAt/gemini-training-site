'use client'

import Link from 'next/link'
import { courseData } from '@/lib/course-data'
import { useState, useEffect } from 'react'

export default function CoursePage({ params }: { params: Promise<{ week: string }> }) {
  const [week, setWeek] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pageIdx, setPageIdx] = useState(0)

  useEffect(() => {
    Promise.resolve(params).then((p) => setWeek(parseInt(p.week)))
  }, [params])

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

  if (!week) return <div style={{ padding: '40px', color: '#1d1d1f', background: '#f5f5f7' }}>加載中...</div>

  const courses = courseData.filter(c => c.week === week)
  const course = courses.find(c => c.id === selectedId)

  // 投影片視圖
  if (course?.pages) {
    const page = course.pages[pageIdx]
    const total = course.pages.length

    return (
      <div style={{ background: '#f5f5f7', color: '#1d1d1f', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ borderBottom: '2px solid #0071e3', padding: '20px 40px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '16px' }}>← 返回</button>
          <span style={{ color: '#999' }}>第 {week} 週 | {pageIdx + 1}/{total}</span>
        </div>

        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 40px' }}>
          <h1 style={{ fontSize: '48px', color: '#0071e3', marginBottom: '40px', textAlign: 'center' }}>{page.title}</h1>
          <div style={{ fontSize: '24px', color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap', maxWidth: '900px', textAlign: 'left' }}>
            {page.content}
          </div>
        </section>

        <div style={{ borderTop: '2px solid #0071e3', padding: '20px 40px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => setPageIdx(p => Math.max(0, p - 1))}
            disabled={pageIdx === 0}
            style={{ padding: '10px 20px', border: '2px solid #0071e3', background: 'transparent', color: '#0071e3', cursor: pageIdx === 0 ? 'not-allowed' : 'pointer', opacity: pageIdx === 0 ? 0.5 : 1 }}
          >
            ← 上一頁
          </button>
          <span>{pageIdx + 1}/{total}</span>
          <button
            onClick={() => setPageIdx(p => Math.min(total - 1, p + 1))}
            disabled={pageIdx === total - 1}
            style={{ padding: '10px 20px', background: pageIdx === total - 1 ? '#d0d0d0' : '#0071e3', color: pageIdx === total - 1 ? '#666' : '#ffffff', border: 'none', cursor: pageIdx === total - 1 ? 'not-allowed' : 'pointer', opacity: pageIdx === total - 1 ? 0.5 : 1 }}
          >
            下一頁 →
          </button>
        </div>
      </div>
    )
  }

  // 課程列表視圖
  return (
    <div style={{ padding: '40px', background: '#f5f5f7', color: '#1d1d1f', minHeight: '100vh' }}>
      <Link href="/">← 返回首頁</Link>
      <h1 style={{ fontSize: '44px', marginTop: '40px', marginBottom: '40px' }}>第 {week} 週 ({courses.length})</h1>

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
  )
}
