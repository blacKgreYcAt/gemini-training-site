'use client'

import Link from 'next/link'
import { courseData } from '@/lib/course-data'
import { useEffect, useState } from 'react'

export default function CoursePage({ params }: any) {
  const [week, setWeek] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  useEffect(() => {
    Promise.resolve(params).then((p) => {
      setWeek(parseInt(p.week))
    })
  }, [params])

  if (week === null) {
    return (
      <div style={{ padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
        <Link href="/" style={{ color: '#00aeef' }}>← 返回首頁</Link>
        <p style={{ marginTop: '40px' }}>加載中...</p>
      </div>
    )
  }

  const weekCourses = courseData.filter((c) => c.week === week)
  const selectedCourse = selectedCourseId ? weekCourses.find(c => c.id === selectedCourseId) : null

  // 投影片模式
  if (selectedCourse && selectedCourse.pages) {
    const totalPages = selectedCourse.pages.length
    const currentPage = selectedCourse.pages[currentPageIndex]

    const handlePrevious = () => {
      if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1)
    }

    const handleNext = () => {
      if (currentPageIndex < totalPages - 1) setCurrentPageIndex(currentPageIndex + 1)
    }

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handlePrevious()
        if (e.key === 'ArrowRight') handleNext()
        if (e.key === 'Escape') setSelectedCourseId(null)
      }
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }, [currentPageIndex, totalPages])

    return (
      <div style={{ background: '#0a0a0a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ borderBottom: '2px solid #00aeef', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedCourseId(null)}
            style={{ background: 'none', border: 'none', color: '#00aeef', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
          >
            ← 返回課程列表
          </button>
          <div style={{ fontSize: '14px', color: '#999' }}>
            第 {week} 週 • 頁碼：{currentPageIndex + 1} / {totalPages}
          </div>
        </header>

        {/* Main Content */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 60px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '40px', color: '#00aeef', textAlign: 'center', lineHeight: 1.2 }}>
            {currentPage.title}
          </h1>

          <div style={{ fontSize: '28px', color: '#ccc', lineHeight: 1.8, textAlign: 'left', whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '900px' }}>
            {currentPage.content}
          </div>

          <div style={{ marginTop: '60px', fontSize: '16px', color: '#999', textAlign: 'center' }}>
            {selectedCourse.title} • {selectedCourse.duration_minutes} 分鐘
          </div>
        </section>

        {/* Navigation */}
        <section style={{ borderTop: '2px solid #00aeef', padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrevious}
            disabled={currentPageIndex === 0}
            style={{
              padding: '12px 30px',
              border: '2px solid #00aeef',
              color: currentPageIndex === 0 ? '#666' : '#00aeef',
              background: 'transparent',
              fontWeight: 900,
              fontSize: '14px',
              cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentPageIndex === 0 ? 0.5 : 1,
            }}
          >
            ← 上一頁
          </button>

          <div style={{ fontSize: '14px', color: '#00aeef', fontWeight: 700 }}>
            {currentPageIndex + 1} / {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPageIndex === totalPages - 1}
            style={{
              padding: '12px 30px',
              background: currentPageIndex === totalPages - 1 ? '#333' : '#00aeef',
              color: currentPageIndex === totalPages - 1 ? '#666' : '#0a0a0a',
              border: 'none',
              fontWeight: 900,
              fontSize: '14px',
              cursor: currentPageIndex === totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: currentPageIndex === totalPages - 1 ? 0.5 : 1,
            }}
          >
            下一頁 →
          </button>
        </section>

        <footer style={{ borderTop: '1px solid #333', padding: '15px 40px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
          ⌨️ ← → 翻頁 • ESC 返回
        </footer>
      </div>
    )
  }

  // 課程列表模式
  return (
    <div style={{ padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Link href="/" style={{ color: '#00aeef' }}>← 返回首頁</Link>

      <h1 style={{ fontSize: '48px', marginTop: '40px', marginBottom: '30px' }}>
        第 {week} 週課程 ({weekCourses.length} 個)
      </h1>

      {weekCourses.length === 0 ? (
        <p>課程未找到</p>
      ) : (
        weekCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourseId(course.id)}
            style={{
              marginBottom: '40px',
              padding: '30px',
              border: '2px solid #00aeef',
              background: '#111',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'translate(0, 0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-5px, -5px)'
              e.currentTarget.style.boxShadow = '5px 5px 0 #00aeef'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <h2 style={{ color: '#00aeef', marginBottom: '10px' }}>{course.title}</h2>
            <p style={{ color: '#ccc', marginBottom: '10px' }}>{course.description}</p>
            <p style={{ color: '#999' }}>⏱️ {course.duration_minutes} 分鐘</p>
            {course.pages && course.pages.length > 0 && (
              <p style={{ color: '#00aeef', marginTop: '15px', fontWeight: 700 }}>
                📑 {course.pages.length} 頁講義 → 點擊進入投影片模式
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
