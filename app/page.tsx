'use client'

import { Header } from '@/components/Header'
import { CourseCard } from '@/components/CourseCard'
import Link from 'next/link'

const courseWeeks = [
  {
    week: 1,
    title: '見樹又見林 —— Gemini 六大神器總覽',
    description: '帶領主管巡禮左側工具列的所有功能，了解 AI 的能力邊界，建立多模態辦公的全新思維。',
    duration: 120,
    count: 3,
  },
  {
    week: 2,
    title: '把 AI 當作超級實習生 —— Prompt 溝通術',
    description: '打破「AI 是搜尋工具」的舊觀念，掌握商業實用的四段式交辦公式。',
    duration: 120,
    count: 3,
  },
  {
    week: 3,
    title: '超級大腦與私人圖書館 —— 深度研究與資料處理',
    description: '告別 Google 海洋迷航，讓 AI 幫你找資料、讀重點，將死板檔案變活字典。',
    duration: 120,
    count: 3,
  },
  {
    week: 4,
    title: '沉浸式協作與視覺點綴 —— Canvas 與多模態生成',
    description: '專攻長文修改與 SOP 撰寫，用 AI 為簡報做漂亮配圖，融會四週技能。',
    duration: 120,
    count: 3,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-block mb-8 px-6 py-3 rounded-full bg-gradient-to-r from-[#00aeef]/10 to-blue-100 border border-[#00aeef]/20 backdrop-blur-sm">
            <span className="text-[#00aeef] text-sm font-bold tracking-wide">
              ✨ Gemini 企業協作大師課
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl sm:text-7xl font-black text-gray-900 mb-8 leading-tight">
            讓 AI 成為你的<br />
            <span className="bg-gradient-to-r from-[#00aeef] via-blue-400 to-[#0088bb] bg-clip-text text-transparent animate-pulse">
              24 小時超級幕僚
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            四週課程，八小時精華教學。從零開始，讓主管掌握 Gemini 的六大神器，提升部門 AI 應用能力，產出企業 AI 導入計畫。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link
              href="/auth/signup"
              className="inline-block px-10 py-5 rounded-[25px] bg-gradient-to-r from-[#00aeef] to-[#0088bb] text-white font-bold text-lg shadow-[0_8px_16px_rgba(0,174,239,0.2),0_12px_24px_rgba(0,136,187,0.15)] hover:shadow-[0_12px_28px_rgba(0,174,239,0.3),0_16px_40px_rgba(0,136,187,0.2)] hover:-translate-y-2 transition-all duration-300 transform"
            >
              🚀 立即報名
            </Link>
            <Link
              href="#courses"
              className="inline-block px-10 py-5 rounded-[25px] border-2 border-[#00aeef] text-[#00aeef] font-bold text-lg hover:bg-[#00aeef]/5 transition-all duration-300 shadow-[0_4px_12px_rgba(0,174,239,0.1)]"
            >
              📚 查看課程
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-[#00aeef]">4</div>
              <p className="text-gray-600 text-sm mt-2">週完整課程</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00aeef]">8</div>
              <p className="text-gray-600 text-sm mt-2">小時精華教學</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00aeef]">6</div>
              <p className="text-gray-600 text-sm mt-2">大神器精通</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            完整課程架構
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            由淺入深，系統化學習 Gemini 在企業中的應用，每週專注一個核心主題。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {courseWeeks.map((course) => (
            <CourseCard
              key={course.week}
              week={course.week}
              title={course.title}
              description={course.description}
              duration={course.duration}
              count={course.count}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#00aeef] to-[#0088bb] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            準備好升級你的管理能力了嗎？
          </h2>
          <p className="text-white/90 text-xl mb-12">
            加入 20 位企業主管，一起探索 AI 如何改變工作方式
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-10 py-4 rounded-[25px] bg-white text-[#00aeef] font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            現在就報名，掌握未來！
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2026 大豐集團 Gemini 企業協作大師課. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
