'use client'

import Link from 'next/link'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { useLanguage } from '@/lib/language-context'
import { getCourses, t } from '@/lib/translations'

function CourseCard({
  course,
  language,
  prefixKey,
  ctaKey,
}: {
  course: any
  language: 'zh' | 'ja'
  prefixKey: string
  ctaKey: string
}) {
  return (
    <Link
      href={`/course/${course.week}?id=${course.id}`}
      className="tf-card"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      <span className="tf-label" style={{ color: 'var(--tf-blue-500)', letterSpacing: '0.08em' }}>
        {t(prefixKey, language)} {course.module}
      </span>
      <h4 style={{ margin: 0 }}>{course.title}</h4>
      <p style={{ fontSize: '15px', flex: 1 }}>{course.description}</p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          paddingTop: '14px',
          borderTop: '1px solid var(--tf-line)',
        }}
      >
        <span className="tf-label tf-num">
          {course.duration_minutes} {t('minutes', language)}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tf-blue-500)' }}>
          {t(ctaKey, language)} →
        </span>
      </div>
    </Link>
  )
}

function HomeContent() {
  const { language } = useLanguage()
  const courses = getCourses(language)

  const coursesByWeek = [0, 1, 2, 3, 4].map(week => ({
    week,
    courses: courses.filter((c: any) => c.week === week),
  }))

  // 進階課程與課程內頁共用同一份資料源，避免標題漂移
  const advancedCourses = courses.filter((c: any) => c.week >= 5 && c.week <= 10)

  return (
    <>
      <Navbar />

      {/* Hero — 淺藍漸層 + 超大 logo 底圖 + 霧面玻璃卡 */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="tf-eyebrow">{t('heroEyebrow', language)}</span>
            <h1>{t('companyName', language)}</h1>
            <span className="hero-accent">{t('programName', language)}</span>
            <p>
              {t('subtitle1', language)}
              {t('subtitle2', language)}
            </p>
            <p style={{ marginTop: '12px' }}>{t('subtitle3', language)}</p>
            <div className="hero-actions">
              <Link href="/cards" className="tf-btn tf-btn-primary">
                {t('startLearning', language)}
              </Link>
              <Link href="/dashboard/progress" className="tf-btn tf-btn-outline">
                {t('progress', language)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 實體課程 — 淺藍色帶 */}
      <section className="tf-band-light" id="courses">
        <div className="container">
          <span className="tf-eyebrow">{t('courses', language)}</span>
          <h2>{t('courseDesign', language)}</h2>

          {coursesByWeek.map(
            ({ week, courses: weekCourses }) =>
              weekCourses.length > 0 && (
                <div key={week} style={{ marginTop: '52px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '14px',
                      paddingBottom: '14px',
                      borderBottom: '1px solid var(--tf-line)',
                    }}
                  >
                    <h3 style={{ margin: 0, color: 'var(--tf-navy-700)' }}>
                      {week === 0
                        ? t('coursePreparation', language)
                        : `${t('week', language)} ${week} ${t('weekSuffix', language)}`}
                    </h3>
                    <span className="tf-label tf-num">
                      {weekCourses.length} {t('coursesCount', language)}
                    </span>
                  </div>

                  <div className="case-grid">
                    {weekCourses.map((course: any) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        language={language}
                        prefixKey="module"
                        ctaKey="viewDetails"
                      />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </section>

      {/* 進階應用 — 近白色帶 + 深藍重點卡 */}
      {advancedCourses.length > 0 && (
        <section className="tf-band-pale">
          <div className="container">
            <div className="tf-card-navy">
              <span className="tf-eyebrow-bare" style={{ color: 'var(--tf-blue-200)' }}>
                {t('advancedPrefix', language)}
              </span>
              <h2 style={{ marginBottom: '14px' }}>{t('advancedTips', language)}</h2>
              <p>
                {t('advancedDesc', language)}
                <br />
                {t('advancedDesc2', language)}
              </p>
            </div>

            <div className="case-grid">
              {advancedCourses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  language={language}
                  prefixKey="advancedPrefix"
                  ctaKey="advancedApply"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer>
        <div className="container">
          © 2026 {t('companyName', language)} · {t('title', language)} ·{' '}
          <a href="mailto:benjaminchu@tfg.com.tw">{t('askQuestion', language)}</a>
        </div>
      </footer>
    </>
  )
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  )
}
