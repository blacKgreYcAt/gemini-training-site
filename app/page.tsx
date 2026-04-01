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
    <div style={{ background: '#0a0a0a', color: '#ffffff' }}>
      {/* Header */}
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Image
              src="/logo_TF-04.png"
              alt="大豐集團"
              width={50}
              height={50}
              style={{ height: '50px', width: 'auto' }}
            />
            <h1 style={{ fontSize: '24px', margin: '0', marginTop: '0' }}>大豐集團</h1>
          </div>
          <nav style={{ display: 'flex', gap: '40px' }}>
            <a href="#cases" style={{ color: '#00aeef', fontWeight: 700 }}>課程</a>
            <Link href="/quiz" style={{ color: '#00aeef', fontWeight: 700, textDecoration: 'none' }}>題庫</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              大豐集團<br />
              <span className="hero-accent">AI 企業協作大師課</span>
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
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '3px solid #00aeef' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#00aeef', margin: '0', textTransform: 'uppercase' }}>
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
                          background: '#111111',
                          border: '2px solid #00aeef',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          minHeight: '200px',
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'translate(-5px, -5px)';
                          el.style.boxShadow = '5px 5px 0 #00aeef';
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'translate(0, 0)';
                          el.style.boxShadow = 'none';
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#00aeef', marginBottom: '12px', letterSpacing: '1px', fontWeight: 700 }}>
                            模組 {course.module}
                          </div>
                          <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '12px', color: '#00aeef', lineHeight: 1.3 }}>
                            {course.title}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '0', lineHeight: 1.4 }}>
                            {course.description}
                          </p>
                        </div>
                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>
                            ⏱️ {course.duration_minutes} 分鐘
                          </p>
                          <p style={{ fontSize: '12px', color: '#00aeef', fontWeight: 700, margin: '0' }}>
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
          <p>© 2026 大豐集團 • AI 企業協作大師課</p>
          <p style={{ fontSize: '12px', color: '#444', marginTop: '20px' }}>
            大膽設計 • 創意驅動 • 專注成果
          </p>
        </div>
      </footer>
    </div>
  )
}
