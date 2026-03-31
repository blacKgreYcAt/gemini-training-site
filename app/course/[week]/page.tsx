'use client'

import Link from 'next/link'
import { courseData } from '@/lib/course-data'

export default function CoursePage({ params }: { params: { week: string } }) {
  const week = parseInt(params.week)
  const weekCourses = courseData.filter(c => c.week === week)

  if (weekCourses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">課程未找到</h1>
          <Link href="/" className="text-[#00aeef] hover:underline">
            ← 返回首頁
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-clay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-[#00aeef] hover:underline text-sm font-semibold">
            ← 返回首頁
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 rounded-full bg-[#00aeef]/10 text-[#00aeef] font-semibold mb-6">
            第 {week} 週
          </div>
        </div>

        {weekCourses.map((course) => (
          <div key={course.id} className="mb-12 p-8 rounded-clay bg-white shadow-clay">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600">
                模組 {course.module} • {course.duration_minutes} 分鐘
              </p>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {course.content}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Navigation */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-4 justify-center">
          {week > 1 && (
            <Link
              href={`/course/${week - 1}`}
              className="px-6 py-3 rounded-clay border-2 border-[#00aeef] text-[#00aeef] font-semibold hover:bg-[#00aeef]/5 transition"
            >
              ← 上一週
            </Link>
          )}
          {week < 4 && (
            <Link
              href={`/course/${week + 1}`}
              className="px-6 py-3 rounded-clay bg-gradient-to-r from-[#00aeef] to-[#0088bb] text-white font-semibold shadow-clay hover:shadow-clay-lg transition-all"
            >
              下一週 →
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2026 大豐集團 Gemini 企業協作大師課</p>
        </div>
      </footer>
    </div>
  )
}
