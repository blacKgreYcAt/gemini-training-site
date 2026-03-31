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

export default function CoursePage({ params }: { params: { week: string } }) {
  const [weekNum, setWeekNum] = useState<number | null>(null)

  useEffect(() => {
    setWeekNum(parseInt(params.week))
  }, [params.week])

  if (weekNum === null) return <div>加載中...</div>

  const weekCourses = courseData.filter((c) => c.week === weekNum)

  if (weekCourses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1>課程未找到</h1>
        <Link href="/">← 返回首頁</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Link href="/" style={{ color: '#00aeef' }}>← 返回首頁</Link>

      <h1 style={{ fontSize: '48px', marginTop: '40px' }}>第 {weekNum} 週課程</h1>

      {weekCourses.map((course, idx) => (
        <div key={course.id} style={{ marginTop: '40px', padding: '30px', border: '2px solid #00aeef' }}>
          <h2 style={{ color: '#00aeef' }}>{course.title}</h2>
          <p>{course.description}</p>
          <p>⏱️ {course.duration_minutes} 分鐘</p>

          <div style={{ marginTop: '20px', maxHeight: '300px', overflow: 'auto', background: '#111', padding: '20px' }}>
            <h3>課程內容：</h3>
            {course.pages && course.pages.length > 0 ? (
              <ul>
                {course.pages.map((page, pageIdx) => (
                  <li key={pageIdx} style={{ marginBottom: '10px', color: '#ccc' }}>
                    {page.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p>無頁面內容</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
