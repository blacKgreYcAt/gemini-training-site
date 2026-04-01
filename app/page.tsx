'use client'

import Image from 'next/image'
import Link from 'next/link'
import { courseData } from '@/lib/course-data'

export default function Home() {
  // 強制 Vercel 重新部署 - v3
  // 按週次組織課程
  const coursesByWeek = [1, 2, 3, 4].map(week => ({
    week,
    courses: courseData.filter(c => c.week === week)
  }))

  return (
    <div style={{ background: '#f5f5f7', color: '#000000' }}>
      {/* Header */}
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="logo">
            <Image
              src="/logo_banner.png"
              alt="大豐集團"
              width={200}
              height={50}
              style={{ height: '50px', width: 'auto' }}
            />
          </div>
          <nav style={{ display: 'flex', gap: '40px' }}>
            <a href="#cases" style={{ color: '#0071e3', fontWeight: 700 }}>課程</a>
            <Link href="/quiz" style={{ color: '#0071e3', fontWeight: 700, textDecoration: 'none' }}>題庫</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 style={{ fontSize: '96px', lineHeight: 1.2, color: '#000000' }}>
              大豐貿易集團<br />
              <span className="hero-accent">AI 企業協作課程</span>
            </h1>
            <p>
              四週密集課程，掌握 Gemini 六大神器。
              <br />
              從傳統辦公流程到 AI 驅動決策，完整蛻變。
            </p>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="cases" id="cases">
        <div className="container">
          <h2>課程設計</h2>

          {/* 4 列佈局 - 每週一列 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginTop: '60px' }}>
            {coursesByWeek.map(({ week, courses }) => (
              <div key={week} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* 週表頭 */}
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '3px solid #0071e3' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0071e3', margin: '0', textTransform: 'uppercase' }}>
                    第 {week} 週
                  </h3>
                  <p style={{ fontSize: '14px', color: '#999', margin: '8px 0 0 0' }}>
                    {courses.length} 個課程
                  </p>
                </div>

                {/* 該週的課程卡片 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {courses.map((course) => (
                    <Link key={course.id} href={`/course/${course.week}`}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '25px',
                          background: '#ffffff',
                          border: '2px solid #0071e3',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          minHeight: '200px',
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'translate(-5px, -5px)';
                          el.style.boxShadow = '5px 5px 0 #0071e3';
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'translate(0, 0)';
                          el.style.boxShadow = 'none';
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', textTransform: 'uppercase', color: '#0071e3', marginBottom: '12px', letterSpacing: '1px', fontWeight: 700 }}>
                            模組 {course.module}
                          </div>
                          <h4 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '12px', color: '#000000', lineHeight: 1.3 }}>
                            {course.title}
                          </h4>
                          <p style={{ fontSize: '16px', color: '#333', marginBottom: '0', lineHeight: 1.4 }}>
                            {course.description}
                          </p>
                        </div>
                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #d0d0d0' }}>
                          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
                            ⏱️ {course.duration_minutes} 分鐘
                          </p>
                          <p style={{ fontSize: '14px', color: '#0071e3', fontWeight: 700, margin: '0' }}>
                            📑 查看詳情 →
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>© 2026 大豐貿易集團 • AI 企業協作課程</p>
        </div>
      </footer>
    </div>
  )
}
