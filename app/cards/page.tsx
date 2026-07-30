'use client'

import Link from 'next/link'
import { updateCardsProgress } from '@/lib/progress-utils'
import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { useLanguage } from '@/lib/language-context'
import { getCards, t } from '@/lib/translations'

function CardsPageContent() {
  const { language } = useLanguage()
  const cardsData = getCards(language)
  const [currentCardIdx, setCurrentCardIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set())

  // 載入進度
  useEffect(() => {
    const saved = localStorage.getItem('completedCards')
    if (saved) {
      setCompletedCards(new Set(JSON.parse(saved)))
    }
  }, [])

  // 保存進度
  useEffect(() => {
    localStorage.setItem('completedCards', JSON.stringify(Array.from(completedCards)))
  }, [completedCards])


  // 取得篩選後的卡片
  const filteredCards = cardsData.filter(card => {
    const matchWeek = selectedWeek === null || card.week === selectedWeek
    const matchSearch = searchQuery === '' ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase())
    return matchWeek && matchSearch
  })

  // 鍵盤控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentCardIdx(i => Math.max(0, i - 1))
        setIsFlipped(false)
      } else if (e.key === 'ArrowRight') {
        setCurrentCardIdx(i => Math.min(filteredCards.length - 1, i + 1))
        setIsFlipped(false)
      } else if (e.key === ' ') {
        e.preventDefault()
        const newFlipped = !isFlipped
        setIsFlipped(newFlipped)
        // 滑鼠點擊路徑會記錄進度，鍵盤路徑先前遺漏，
        // 導致照著畫面提示用 Space 翻卡的人完全不被計入
        if (newFlipped && filteredCards[currentCardIdx]) {
          updateCardsProgress(filteredCards[currentCardIdx].id, true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFlipped, currentCardIdx, filteredCards])

  const currentCard = filteredCards[currentCardIdx]
  const progress = (currentCardIdx + 1) / filteredCards.length

  const toggleCompleted = (cardId: string) => {
    const newCompleted = new Set(completedCards)
    if (newCompleted.has(cardId)) {
      newCompleted.delete(cardId)
    } else {
      newCompleted.add(cardId)
      // 标记为完成时也追踪进度
      updateCardsProgress(cardId, true)
    }
    setCompletedCards(newCompleted)
  }

  const weekLabel = (week: number) =>
    week === 0
      ? t('coursePreparation', language)
      : `${t('week', language)} ${week} ${t('weekSuffix', language)}`

  return (
    <>
      <section className="tf-band-light" style={{ paddingBottom: 'clamp(40px, 7vw, 72px)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <Link href="/" style={{ fontSize: '15px', fontWeight: 600 }}>
            {t('backToHome', language)}
          </Link>

          <div style={{ marginTop: '24px' }}>
            <span className="tf-eyebrow">{t('cards', language)}</span>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)' }}>{t('cardSelfStudy', language)}</h1>
          </div>

          {/* 搜尋與篩選 */}
          <div className="tf-card" style={{ marginTop: '32px' }}>
            <input
              className="tf-field"
              type="text"
              placeholder={t('searchPlaceholder', language)}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setCurrentCardIdx(0)
                setIsFlipped(false)
              }}
            />

            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '18px',
                paddingTop: '18px',
                borderTop: '1px solid var(--tf-line)',
              }}
            >
              <button
                className="tf-chip"
                aria-pressed={selectedWeek === null}
                onClick={() => {
                  setSelectedWeek(null)
                  setCurrentCardIdx(0)
                  setIsFlipped(false)
                }}
              >
                {t('all', language)} ({cardsData.length})
              </button>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(week => {
                const weekCount = cardsData.filter(c => c.week === week).length
                if (weekCount === 0) return null
                return (
                  <button
                    key={week}
                    className="tf-chip"
                    aria-pressed={selectedWeek === week}
                    onClick={() => {
                      setSelectedWeek(week)
                      setCurrentCardIdx(0)
                      setIsFlipped(false)
                    }}
                  >
                    {weekLabel(week)} ({weekCount})
                  </button>
                )
              })}
            </div>

            <div
              className="tf-label tf-num"
              style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '16px' }}
            >
              <span>
                {t('completed', language)}: {completedCards.size} / {cardsData.length}
              </span>
              <span>
                {t('currentCard', language)}: {currentCardIdx + 1} / {filteredCards.length}
              </span>
            </div>
          </div>

          {/* 卡牌 */}
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {filteredCards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ marginBottom: '20px' }}>{t('noCardsFound', language)}</p>
                <button
                  className="tf-btn tf-btn-primary"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedWeek(null)
                    setCurrentCardIdx(0)
                    setIsFlipped(false)
                  }}
                >
                  {t('resetFilters', language)}
                </button>
              </div>
            ) : (
              <>
                <div style={{ width: '100%', maxWidth: '560px', marginBottom: '28px' }}>
                  <div className="tf-meter">
                    <span style={{ width: `${progress * 100}%` }} />
                  </div>
                  <div className="tf-label tf-num" style={{ marginTop: '8px', textAlign: 'center' }}>
                    {currentCardIdx + 1} / {filteredCards.length}
                  </div>
                </div>

                {/* 卡面：保留原有 SVG 底圖，外框改為品牌細線與柔和上浮 */}
                <div
                  onClick={() => {
                    const newFlipped = !isFlipped
                    setIsFlipped(newFlipped)
                    if (newFlipped && currentCard) {
                      updateCardsProgress(currentCard.id, true)
                    }
                  }}
                  style={{
                    width: '100%',
                    maxWidth: 'clamp(280px, 70vw, 520px)',
                    minHeight: 'clamp(350px, 58vh, 660px)',
                    background: 'var(--tf-white)',
                    border: '1px solid var(--tf-blue-200)',
                    borderRadius: 'var(--tf-radius-lg)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'var(--tf-shadow)',
                    transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translateY(-4px)'
                    el.style.boxShadow = 'var(--tf-shadow-lift)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = 'var(--tf-shadow)'
                  }}
                >
                  <img
                    src={`/cards/${currentCard.id}.svg`}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 0,
                    }}
                  />

                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: 'clamp(14px, 3.5vw, 28px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'clamp(10px, 2vw, 16px)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        className="tf-num"
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          color: '#ffffff',
                          textShadow: '0 1px 4px rgba(0,0,0,0.55)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {`${t('cardWeek', language)} ${currentCard.week} ${t('cardOf', language)} · ${t('cardNumber', language)} ${currentCard.number}`}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          toggleCompleted(currentCard.id)
                        }}
                        style={{
                          background: completedCards.has(currentCard.id)
                            ? 'var(--tf-navy-700)'
                            : 'rgba(255,255,255,0.92)',
                          border: '1px solid rgba(255,255,255,0.9)',
                          color: completedCards.has(currentCard.id) ? '#ffffff' : 'var(--tf-navy-700)',
                          padding: '5px 12px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '11.5px',
                          borderRadius: '3px',
                          fontFamily: 'var(--tf-sans)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {completedCards.has(currentCard.id)
                          ? t('cardCompleted', language)
                          : t('cardNotCompleted', language)}
                      </button>
                    </div>

                    <h2
                      style={{
                        fontSize: 'clamp(17px, 3.2vw, 26px)',
                        color: '#ffffff',
                        textShadow: '0 2px 6px rgba(0,0,0,0.55)',
                        textAlign: 'center',
                        margin: 0,
                      }}
                    >
                      {currentCard.title}
                    </h2>

                    <div
                      style={{
                        fontSize: 'clamp(13px, 2.4vw, 16px)',
                        lineHeight: 1.8,
                        color: '#ffffff',
                        background: 'rgba(11, 46, 92, 0.52)',
                        padding: 'clamp(12px, 2.5vw, 20px)',
                        borderRadius: 'var(--tf-radius)',
                        overflowY: 'auto',
                        minHeight: '150px',
                        maxHeight: '430px',
                      }}
                    >
                      <div
                        className="tf-label"
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          letterSpacing: '0.1em',
                          marginBottom: '8px',
                        }}
                      >
                        {isFlipped ? t('cardAnswer', language) : t('cardQuestion', language)}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {isFlipped ? currentCard.back : currentCard.front}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: '#ffffff',
                        textShadow: '0 1px 4px rgba(0,0,0,0.55)',
                        textAlign: 'center',
                      }}
                    >
                      {isFlipped ? t('cardFlipBack', language) : t('cardFlipFront', language)}
                    </div>
                  </div>
                </div>

                {/* 前後導覽 */}
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginTop: '32px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    className="tf-btn tf-btn-outline"
                    onClick={() => {
                      setCurrentCardIdx(i => Math.max(0, i - 1))
                      setIsFlipped(false)
                    }}
                    disabled={currentCardIdx === 0}
                  >
                    {t('cardPrevious', language)}
                  </button>
                  <span className="tf-label tf-num" style={{ minWidth: '70px', textAlign: 'center' }}>
                    {currentCardIdx + 1} / {filteredCards.length}
                  </span>
                  <button
                    className="tf-btn tf-btn-primary"
                    onClick={() => {
                      setCurrentCardIdx(i => Math.min(filteredCards.length - 1, i + 1))
                      setIsFlipped(false)
                    }}
                    disabled={currentCardIdx === filteredCards.length - 1}
                  >
                    {t('cardNext', language)}
                  </button>
                </div>

                <div className="tf-label" style={{ marginTop: '24px', textAlign: 'center', lineHeight: 1.9 }}>
                  <p style={{ fontSize: 'inherit', color: 'inherit' }}>{t('keyboardHint', language)}</p>
                  <p style={{ fontSize: 'inherit', color: 'inherit' }}>{t('clickHint', language)}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p style={{ color: 'inherit', fontSize: 'inherit', marginBottom: '8px' }}>
            {t('tipsHint', language)}
          </p>
          © 2026 {t('companyName', language)} · {t('programName', language)} ·{' '}
          <a href="mailto:benjaminchu@tfg.com.tw">{t('askQuestion', language)}</a>
        </div>
      </footer>
    </>
  )
}

export default function CardsPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <CardsPageContent />
    </ProtectedRoute>
  )
}
