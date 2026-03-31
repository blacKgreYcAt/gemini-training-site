'use client'

import Link from 'next/link'
import { courseData } from '@/lib/course-data'
import { useEffect, useState } from 'react'

export default function CoursePage({ params }: any) {
  const [week, setWeek] = useState<number | null>(null)

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
          <div key={course.id} style={{ marginBottom: '40px', padding: '30px', border: '2px solid #00aeef', background: '#111' }}>
            <h2 style={{ color: '#00aeef', marginBottom: '10px' }}>{course.title}</h2>
            <p style={{ color: '#ccc', marginBottom: '10px' }}>{course.description}</p>
            <p style={{ color: '#999' }}>⏱️ {course.duration_minutes} 分鐘</p>
            {course.pages && course.pages.length > 0 && (
              <p style={{ color: '#00aeef', marginTop: '15px', fontWeight: 700 }}>
                📑 共 {course.pages.length} 頁講義
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
