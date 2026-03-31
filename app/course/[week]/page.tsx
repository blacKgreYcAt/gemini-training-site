'use client'

import Link from 'next/link'
import { courseData } from '@/lib/course-data'

export default function CoursePage({ params }: any) {
  const week = parseInt(params.week)
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
          <div key={course.id} style={{ marginBottom: '40px', padding: '30px', border: '2px solid #00aeef' }}>
            <h2 style={{ color: '#00aeef', marginBottom: '10px' }}>{course.title}</h2>
            <p>{course.description}</p>
            <p>⏱️ {course.duration_minutes} 分鐘</p>
            {course.pages && (
              <p style={{ color: '#999', marginTop: '15px' }}>
                📑 共 {course.pages.length} 頁
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
