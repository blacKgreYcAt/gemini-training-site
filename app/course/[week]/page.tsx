'use client'

import Link from 'next/link'
import { courseData, type Course } from '@/lib/course-data'
import { getCourses } from '@/lib/translations'
import { updateSlidesProgress } from '@/lib/progress-utils'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'

function CoursePageContent() {
  const { language } = useLanguage()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [week, setWeek] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pageIdx, setPageIdx] = useState(0)

  useEffect(() => {
    // 從路徑提取 week 參數，例如 /course/0 -> 0
    const match = pathname.match(/\/course\/(\d+)/)
    if (match && match[1]) {
      const weekNum = parseInt(match[1], 10)
      if (!isNaN(weekNum)) {
        setWeek(weekNum)
      }
    }

    // 從查詢參數提取 id，例如 ?id=1-1
    const id = searchParams.get('id')
    if (id) {
      setSelectedId(id)
      setPageIdx(0)
    }
  }, [pathname, searchParams])

  // 根據語言選擇課程數據 - 如果日文版本缺少 pages，使用英文版本的 pages
  const getCoursesWithFallback = (): Course[] => {
    if (language === 'ja') {
      const jaCourses = getCourses('ja')
      const enCourses = courseData
      return jaCourses.map((jaCourse) => {
        const enCourse = enCourses.find(c => c.id === jaCourse.id)
        return {
          ...jaCourse,
          pages: jaCourse.pages && jaCourse.pages.length > 0 ? jaCourse.pages : enCourse?.pages || []
        }
      })
    }
    return courseData
  }
  const allCourses = getCoursesWithFallback()

  // 鍵盤控制事件 - 使用 selectedId 作為依賴，因為它決定了課程
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedId || week === null) return

      const courses = allCourses.filter((c) => c.week === week)
      const course = courses.find((c) => c.id === selectedId)
      if (!course?.pages) return

      if (e.key === 'ArrowLeft') {
        setPageIdx(p => Math.max(0, p - 1))
      } else if (e.key === 'ArrowRight') {
        setPageIdx(p => Math.min(course.pages.length - 1, p + 1))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedId, week])

  // 追踪幻燈片進度
  useEffect(() => {
    if (week !== null && selectedId) {
      const courses = allCourses.filter((c) => c.week === week)
      const course = courses.find((c) => c.id === selectedId)
      if (course?.pages) {
        updateSlidesProgress(selectedId, pageIdx, course.pages.length)
      }
    }
  }, [week, selectedId, pageIdx, allCourses])

  if (week === null) {
    return (
      <section
        className="tf-band-light"
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
          <h3 style={{ marginBottom: '10px' }}>{t('loading', language)}</h3>
          <p className="tf-label">{t('loadingHint', language)}</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '20px', fontWeight: 600 }}>
            ← {t('backToHome', language)}
          </Link>
        </div>
      </section>
    )
  }

  const courses = allCourses.filter((c) => c.week === week)
  const course = courses.find((c) => c.id === selectedId)

  // 投影片視圖
  if (course?.pages) {
    const page = course.pages[pageIdx]
    const total = course.pages.length

    const weekLabel =
      week === 0
        ? t('coursePreparation', language)
        : `${t('week', language)} ${week} ${t('weekSuffix', language)}`

    return (
      <>
        {/* 投影片頂欄 */}
        <div
          style={{
            background: 'var(--tf-white)',
            borderBottom: '1px solid var(--tf-line)',
            padding: '14px 0',
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setSelectedId(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--tf-blue-500)',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'var(--tf-sans)',
              }}
            >
              ← {t('backToHome', language)}
            </button>
            <span className="tf-label tf-num">
              {weekLabel} · {pageIdx + 1}/{total}
            </span>
          </div>
        </div>

        {/* 投影片本體 */}
        <section className="tf-band-light" style={{ minHeight: '62vh' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="tf-card" style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
              <span className="tf-eyebrow-bare">{course.title}</span>
              <h2 style={{ marginBottom: '24px' }}>{page.title}</h2>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: 'clamp(15px, 2vw, 17px)',
                  lineHeight: 1.9,
                  color: 'var(--tf-body)',
                }}
              >
                {page.content}
              </div>

              {selectedId === '1-2' && (
                <img
                  src="/images/gemini-features.png"
                  alt="Gemini Features"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    margin: '32px auto 0',
                    borderRadius: 'var(--tf-radius)',
                    border: '1px solid var(--tf-line)',
                  }}
                />
              )}
            </div>

            {/* 翻頁控制 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '14px',
                marginTop: '28px',
                flexWrap: 'wrap',
              }}
            >
              <button
                className="tf-btn tf-btn-outline"
                onClick={() => setPageIdx(p => Math.max(0, p - 1))}
                disabled={pageIdx === 0}
              >
                ← {t('previousPage', language)}
              </button>
              <span className="tf-label tf-num">
                {pageIdx + 1} / {total}
              </span>
              <button
                className="tf-btn tf-btn-primary"
                onClick={() => setPageIdx(p => Math.min(total - 1, p + 1))}
                disabled={pageIdx === total - 1}
              >
                {t('nextPage', language)} →
              </button>
            </div>
          </div>
        </section>

        <footer>
          <div className="container">
            © 2026 {t('companyName', language)} · {t('programName', language)} ·{' '}
            <a href="mailto:benjaminchu@tfg.com.tw">{t('askQuestion', language)}</a>
          </div>
        </footer>
      </>
    )
  }

  // 課程列表視圖
  return (
    <>
      <section className="tf-band-light">
        <div className="container" style={{ maxWidth: '900px' }}>
          <Link href="/" style={{ fontSize: '15px', fontWeight: 600 }}>
            ← {t('backToHome', language)}
          </Link>

          <div style={{ marginTop: '26px' }}>
            <span className="tf-eyebrow">{t('courses', language)}</span>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', marginBottom: '4px' }}>
              {week === 0
                ? t('coursePreparation', language)
                : `${t('week', language)} ${week} ${t('weekSuffix', language)}`}
            </h1>
            <p className="tf-num">
              {courses.length} {t('coursesCount', language)}
            </p>
          </div>

          <ul className="tf-rule-list">
            {courses.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setSelectedId(c.id)
                    setPageIdx(0)
                  }}
                  className="tf-rule-row"
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--tf-sans)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ display: 'block', flex: 1 }}>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--tf-serif)',
                        fontSize: '19px',
                        color: 'var(--tf-ink)',
                        marginBottom: '4px',
                      }}
                    >
                      {c.title}
                    </span>
                    <span style={{ display: 'block', fontSize: '14.5px', color: 'var(--tf-body)' }}>
                      {c.description}
                    </span>
                    <span
                      className="tf-label tf-num"
                      style={{ display: 'block', marginTop: '8px' }}
                    >
                      {c.duration_minutes} {t('minutes', language)} · {c.pages?.length || 0}{' '}
                      {t('pages', language)}
                    </span>
                  </span>
                  <span style={{ flex: 'none', fontWeight: 600 }}>→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer>
        <div className="container">
          © 2026 {t('companyName', language)} · {t('programName', language)} ·{' '}
          <a href="mailto:benjaminchu@tfg.com.tw">{t('askQuestion', language)}</a>
        </div>
      </footer>
    </>
  )
}

export default function CoursePage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <CoursePageContent />
    </ProtectedRoute>
  )
}
