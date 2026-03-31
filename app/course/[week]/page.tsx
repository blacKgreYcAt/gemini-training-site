'use client'

import Link from 'next/link'
import { courseData } from '@/lib/course-data'
import { useState, useEffect } from 'react'

export async function generateStaticParams() {
  return [
    { week: '1' },
    { week: '2' },
    { week: '3' },
    { week: '4' },
  ]
}

export default function CoursePage({ params }: any) {
  const [weekNum, setWeekNum] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const resolveWeek = async () => {
      const resolved = await Promise.resolve(params)
      const week = parseInt(resolved.week)
      setWeekNum(week)
      setIsLoading(false)
    }
    resolveWeek()
  }, [params])

  if (isLoading) {
    return (
      <div style={{ padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh', textAlign: 'center' }}>
        <p style={{ fontSize: '20px' }}>加載中...</p>
      </div>
    )
  }

  if (weekNum === null || isNaN(weekNum)) {
    return (
      <div style={{ padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh', textAlign: 'center' }}>
        <h1 style={{ color: '#ff6b6b' }}>無效的週次參數</h1>
        <Link href="/" style={{ color: '#00aeef' }}>← 返回首頁</Link>
      </div>
    )
  }

  const weekCourses = courseData.filter((c) => c.week === weekNum)

  if (weekCourses.length === 0) {
    return (
      <div style={{ padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh', textAlign: 'center' }}>
        <h1>第 {weekNum} 週課程未找到</h1>
        <p style={{ color: '#999', marginTop: '10px' }}>
          CourseData 中有 {courseData.length} 個課程
        </p>
        <Link href="/" style={{ color: '#00aeef', display: 'block', marginTop: '30px' }}>← 返回首頁</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Link href="/" style={{ color: '#00aeef', fontSize: '16px' }}>← 返回首頁</Link>

      <h1 style={{ fontSize: '48px', marginTop: '40px', marginBottom: '30px' }}>第 {weekNum} 週課程</h1>

      {weekCourses.map((course) => (
        <div key={course.id} style={{ marginBottom: '40px', padding: '30px', border: '2px solid #00aeef', background: '#111' }}>
          <h2 style={{ color: '#00aeef', fontSize: '28px', marginBottom: '15px' }}>
            {course.title}
          </h2>
          <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '15px' }}>
            {course.description}
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
            ⏱️ {course.duration_minutes} 分鐘
          </p>

          {course.pages && course.pages.length > 0 ? (
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '4px', maxHeight: '400px', overflow: 'auto' }}>
              <p style={{ color: '#00aeef', fontWeight: 700, marginBottom: '15px' }}>
                📑 課程頁面 ({course.pages.length} 頁)：
              </p>
              <ul style={{ listStylePosition: 'inside', color: '#ccc', lineHeight: '1.8' }}>
                {course.pages.map((page, idx) => (
                  <li key={idx}>
                    {idx + 1}. {page.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ color: '#ff6b6b' }}>❌ 此課程無頁面內容</p>
          )}
        </div>
      ))}
    </div>
  )
}
