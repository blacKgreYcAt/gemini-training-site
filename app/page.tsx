'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { courseData } from '@/lib/course-data'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('感謝提交！我們會盡快回覆。')
    setFormData({ name: '', email: '', message: '' })
  }

  const teamMembers = [
    { name: '王建文', role: '創意總監' },
    { name: '李佳穎', role: '策略規劃' },
    { name: '陳思妤', role: 'AI 專家' },
    { name: '黃俊傑', role: '技術主管' },
  ]

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
            <a href="#team" style={{ color: '#ffffff' }}>團隊</a>
            <a href="#contact" style={{ color: '#ffffff' }}>聯絡</a>
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
            <button
              className="submit-btn"
              style={{
                padding: '18px 50px',
                background: '#00aeef',
                color: '#0a0a0a',
                border: 'none',
                fontWeight: 900,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
              }}
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              立即報名
            </button>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="cases" id="cases">
        <div className="container">
          <h2>課程設計</h2>

          <div className="case-grid">
            {courseData.slice(0, 4).map((course) => (
              <div key={course.id} className="case-card">
                <div className="duration">
                  第 {course.week} 週 • 模組 {course.module}
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p style={{ color: '#666', fontSize: '14px', marginTop: '20px' }}>
                  ⏱️ {course.duration_minutes} 分鐘 → {Math.ceil(course.duration_minutes / 60)} 小時課程
                </p>
                <Link
                  href={`/course/${course.week}`}
                  style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    padding: '10px 20px',
                    border: '2px solid #00aeef',
                    color: '#00aeef',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  查看詳情 →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team" id="team">
        <div className="container">
          <h2>核心團隊</h2>
          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-member">
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    background: '#00aeef',
                    borderRadius: '4px',
                    margin: '0 auto 20px',
                  }}
                />
                <h4>{member.name}</h4>
                <p className="role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact" id="contact">
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ marginTop: 0 }}>立即開始</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>姓名</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                style={{
                  padding: '15px',
                  background: '#0a0a0a',
                  border: '2px solid #333',
                  color: '#ffffff',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '14px',
                }}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                style={{
                  padding: '15px',
                  background: '#0a0a0a',
                  border: '2px solid #333',
                  color: '#ffffff',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '14px',
                }}
              />
            </div>
            <div className="form-group">
              <label>訊息</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={5}
                required
                style={{
                  padding: '15px',
                  background: '#0a0a0a',
                  border: '2px solid #333',
                  color: '#ffffff',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '14px',
                }}
              />
            </div>
            <button
              type="submit"
              className="submit-btn"
              style={{
                width: '100%',
                padding: '18px',
                background: '#00aeef',
                color: '#0a0a0a',
                border: 'none',
                fontWeight: 900,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
              }}
            >
              提交表單
            </button>
          </form>
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
