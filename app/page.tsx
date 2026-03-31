'use client'

import Link from 'next/link'

const courses = [
  {
    week: 1,
    title: '見樹又見林 —— Gemini 六大神器總覽',
    description: '帶領主管巡禮左側工具列的所有功能，了解 AI 的能力邊界，建立多模態辦公的全新思維。',
    duration: 120,
  },
  {
    week: 2,
    title: '把 AI 當作超級實習生 —— Prompt 溝通術',
    description: '打破「AI 是搜尋工具」的舊觀念，掌握商業實用的四段式交辦公式。',
    duration: 120,
  },
  {
    week: 3,
    title: '超級大腦與私人圖書館 —— 深度研究與資料處理',
    description: '告別 Google 海洋迷航，讓 AI 幫你找資料、讀重點，將死板檔案變活字典。',
    duration: 120,
  },
  {
    week: 4,
    title: '沉浸式協作與視覺點綴 —— Canvas 與多模態生成',
    description: '專攻長文修改與 SOP 撰寫，用 AI 為簡報做漂亮配圖，融會四週技能。',
    duration: 120,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100" style={{boxShadow: '0 2px 4px rgba(0, 174, 239, 0.08), 0 4px 8px rgba(0, 0, 0, 0.05)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-clay flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #00aeef, #0088bb)'}}>
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <h1 className="font-bold text-gray-900">大豐 Gemini 學院</h1>
          </div>
          <p className="text-sm text-gray-600">四週完整課程</p>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-black text-gray-900 mb-6">
            讓 AI 成為你的<br />
            <span style={{
              background: 'linear-gradient(to right, #00aeef, #0088bb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              24 小時超級幕僚
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            四週課程，八小時精華教學。掌握 Gemini 的六大神器，提升部門 AI 應用能力。
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          完整課程架構
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Link key={course.week} href={`/course/${course.week}`}>
              <div className="h-full p-8 clay-card cursor-pointer" style={{backgroundColor: '#ffffff'}}>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4" style={{backgroundColor: 'rgba(0, 174, 239, 0.1)', color: '#00aeef'}}>
                  第 {course.week} 週
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {course.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">⏱️ {course.duration} 分鐘</span>
                  <span className="font-semibold" style={{color: '#00aeef'}}>查看 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>© 2026 大豐集團 Gemini 企業協作大師課</p>
        </div>
      </footer>
    </div>
  )
}
