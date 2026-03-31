'use client'

import Image from 'next/image'
import Link from 'next/link'
import { courseData } from '@/lib/course-data'

export default function Home() {
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
            <a href="#cases" style={{ color: '#00aeef', fontWeight: 700 }}>案例研究</a>
            <a href="#" style={{ color: '#ffffff' }}>聯絡</a>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', marginTop: '60px' }}>
            {courseData.map((course) => (
              <Link key={course.id} href={`/course/${course.week}`}>
                <div
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '30px',
                    background: '#111111',
                    border: '3px solid #00aeef',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
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
                    <div style={{ fontSize: '14px', textTransform: 'uppercase', color: '#00aeef', marginBottom: '15px', letterSpacing: '2px', fontWeight: 700 }}>
                      第 {course.week} 週 • 模組 {course.module}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '15px', color: '#00aeef', lineHeight: 1.2 }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '15px', lineHeight: 1.4 }}>
                      {course.description}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                      ⏱️ {course.duration_minutes} 分鐘
                    </p>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '10px 15px',
                        border: '2px solid #00aeef',
                        color: '#00aeef',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      查看詳情 →
                    </div>
                  </div>
                </div>
              </Link>
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
