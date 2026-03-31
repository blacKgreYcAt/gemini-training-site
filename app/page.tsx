'use client'

import Link from 'next/link'
import { useState } from 'react'
import { courseData } from '@/lib/course-data'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<typeof courseData>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (term.trim() === '') {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results = courseData.filter(
      (course) =>
        course.title.toLowerCase().includes(term.toLowerCase()) ||
        course.description.toLowerCase().includes(term.toLowerCase()) ||
        course.content.toLowerCase().includes(term.toLowerCase())
    )
    setSearchResults(results)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(to bottom right, #00aeef, #0088bb)',
              }}
            >
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <h1 className="font-bold text-xl text-gray-900">大豐 Gemini 學院</h1>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            讓 AI 成為你的
            <br />
            <span className="gradient-text text-5xl sm:text-6xl">24 小時超級幕僚</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            四週課程，八小時精華教學。掌握 Gemini 的六大神器，提升部門 AI 應用能力。
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜尋課程內容... 例如：Prompt、會議記錄、數據分析"
              className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-lg shadow-sm"
            />
            <span className="absolute right-4 top-4 text-2xl">🔍</span>
          </div>
        </div>

        {/* Search Results */}
        {isSearching && searchResults.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-gray-600 mb-6">
              搜尋結果：找到 {searchResults.length} 個相關課程
            </p>
            <div className="grid gap-6">
              {searchResults.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.week}`}
                  className="clay-card p-6 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3" style={{ backgroundColor: 'rgba(0, 174, 239, 0.1)', color: '#00aeef' }}>
                        第 {course.week} 週 • 模組 {course.module}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600">{course.description}</p>
                      <p className="text-sm text-gray-500 mt-3">⏱️ {course.duration_minutes} 分鐘</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {isSearching && searchResults.length === 0 && searchTerm !== '' && (
          <div className="text-center text-gray-500 mb-12">
            <p className="text-lg">沒有找到相關課程，試試其他關鍵字吧 😊</p>
          </div>
        )}
      </section>

      {/* Courses Grid */}
      {!isSearching && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">完整課程架構</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[1, 2, 3, 4].map((week) => {
              const weekCourses = courseData.filter((c) => c.week === week)
              return (
                <Link key={week} href={`/course/${week}`}>
                  <div className="clay-card p-8 h-full">
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: 'rgba(0, 174, 239, 0.1)', color: '#00aeef' }}>
                      第 {week} 週
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {weekCourses[0]?.title || `第 ${week} 週課程`}
                    </h3>
                    <p className="text-gray-600 mb-6">{weekCourses[0]?.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {weekCourses.length} 個模組 • {weekCourses.reduce((sum, c) => sum + c.duration_minutes, 0)} 分鐘
                      </span>
                      <span className="font-semibold" style={{ color: '#00aeef' }}>
                        查看 →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>© 2026 大豐集團 Gemini 企業協作大師課</p>
        </div>
      </footer>
    </div>
  )
}
