'use client'

import Link from 'next/link'
import { cardsData } from '@/lib/cards-data'
import { useState, useEffect } from 'react'

export default function CardsPage() {
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
        setIsFlipped(!isFlipped)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFlipped])

  // 取得篩選後的卡片
  const filteredCards = cardsData.filter(card => {
    const matchWeek = selectedWeek === null || card.week === selectedWeek
    const matchSearch = searchQuery === '' ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase())
    return matchWeek && matchSearch
  })

  const currentCard = filteredCards[currentCardIdx]
  const progress = (currentCardIdx + 1) / filteredCards.length

  const toggleCompleted = (cardId: string) => {
    const newCompleted = new Set(completedCards)
    if (newCompleted.has(cardId)) {
      newCompleted.delete(cardId)
    } else {
      newCompleted.add(cardId)
    }
    setCompletedCards(newCompleted)
  }

  return (
    <div style={{ background: '#f5f5f7', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        borderBottom: '2px solid #0071e3',
        padding: 'clamp(12px, 5vw, 20px) clamp(16px, 8vw, 40px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <Link href="/" style={{ background: 'none', border: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '18px', fontWeight: 600, textDecoration: 'none' }}>
          ← 返回首頁
        </Link>
        <h1 style={{ fontSize: 'clamp(20px, 6vw, 28px)', fontWeight: 700, margin: 0 }}>卡牌自學</h1>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Controls */}
      <div style={{
        padding: 'clamp(20px, 5vw, 30px) clamp(16px, 8vw, 40px)',
        background: '#ffffff',
        borderBottom: '2px solid #0071e3',
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="搜尋卡片..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentCardIdx(0)
            setIsFlipped(false)
          }}
          style={{
            width: '100%',
            padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
            fontSize: 'clamp(14px, 4vw, 16px)',
            border: '2px solid #0071e3',
            borderRadius: '8px',
            marginBottom: '20px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />

        {/* Week Filter */}
        <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setSelectedWeek(null); setCurrentCardIdx(0); setIsFlipped(false) }}
            style={{
              padding: '10px 20px',
              background: selectedWeek === null ? '#0071e3' : '#ffffff',
              color: selectedWeek === null ? '#ffffff' : '#0071e3',
              border: '2px solid #0071e3',
              cursor: 'pointer',
              fontWeight: 600,
              borderRadius: '6px',
            }}
          >
            全部 ({cardsData.length})
          </button>
          {[1, 2, 3, 4].map(week => {
            const weekCount = cardsData.filter(c => c.week === week).length
            return (
              <button
                key={week}
                onClick={() => { setSelectedWeek(week); setCurrentCardIdx(0); setIsFlipped(false) }}
                style={{
                  padding: '10px 20px',
                  background: selectedWeek === week ? '#0071e3' : '#ffffff',
                  color: selectedWeek === week ? '#ffffff' : '#0071e3',
                  border: '2px solid #0071e3',
                  cursor: 'pointer',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              >
                第 {week} 週 ({weekCount})
              </button>
            )
          })}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '30px', fontSize: '14px', color: '#666' }}>
          <span>已完成: {completedCards.size} / {cardsData.length}</span>
          <span>目前卡片: {currentCardIdx + 1} / {filteredCards.length}</span>
        </div>
      </div>

      {/* Card Display */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(30px, 8vw, 60px) clamp(16px, 8vw, 40px)',
      }}>
        {filteredCards.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <p style={{ fontSize: '20px', marginBottom: '20px' }}>找不到相符的卡片</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedWeek(null)
                setCurrentCardIdx(0)
                setIsFlipped(false)
              }}
              style={{
                padding: '10px 20px',
                background: '#0071e3',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '6px',
              }}
            >
              重置篩選
            </button>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
              <div style={{ height: '8px', background: '#d0d0d0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#0071e3',
                    width: `${progress * 100}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                {currentCardIdx + 1} / {filteredCards.length}
              </div>
            </div>

            {/* Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                width: '100%',
                maxWidth: 'clamp(300px, 90vw, 600px)',
                aspectRatio: '1',
                background: '#ffffff',
                border: '3px solid #0071e3',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 174, 239, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translate(-5px, -5px)'
                el.style.boxShadow = '5px 5px 0 #0071e3'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translate(0, 0)'
                el.style.boxShadow = '0 4px 6px rgba(0, 174, 239, 0.1)'
              }}
            >
              {/* Card Image Background */}
              <img
                src={`/cards/${currentCard.id}.svg`}
                alt="card background"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0,
                }}
              />
              {/* Card Content Overlay */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                padding: 'clamp(20px, 5vw, 40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 'clamp(12px, 3vw, 20px)',
                overflow: 'visible',
              }}>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    第 {currentCard.week} 週 | 卡牌 {currentCard.number}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCompleted(currentCard.id)
                    }}
                    style={{
                      background: completedCards.has(currentCard.id) ? '#ffffff' : 'rgba(255,255,255,0.9)',
                      border: '2px solid #ffffff',
                      color: completedCards.has(currentCard.id) ? '#0071e3' : '#0071e3',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {completedCards.has(currentCard.id) ? '✓ 已完成' : '未完成'}
                  </button>
                </div>

                {/* Card Title */}
                <h2 style={{
                  fontSize: 'clamp(16px, 4vw, 28px)',
                  fontWeight: 700,
                  marginBottom: 'clamp(8px, 2vw, 20px)',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}>
                  {currentCard.title}
                </h2>

                {/* Card Content */}
                <div style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  lineHeight: 1.6,
                  color: '#ffffff',
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: 'clamp(12px, 3vw, 20px)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch',
                  width: '100%',
                }}>
                  {isFlipped ? (
                    <div>
                      <div style={{ fontSize: '12px', color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 700 }}>
                        解答
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {currentCard.back}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '12px', color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 700 }}>
                        問題
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {currentCard.front}
                      </div>
                    </div>
                  )}
                </div>

                {/* Flip Indicator */}
                <div style={{
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  marginTop: 'auto',
                  paddingTop: 'clamp(8px, 2vw, 12px)',
                }}>
                  {isFlipped ? '點擊翻回' : '點擊翻開'}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '40px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setCurrentCardIdx(i => Math.max(0, i - 1))
                  setIsFlipped(false)
                }}
                disabled={currentCardIdx === 0}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #0071e3',
                  background: currentCardIdx === 0 ? '#d0d0d0' : 'transparent',
                  color: currentCardIdx === 0 ? '#666' : '#0071e3',
                  cursor: currentCardIdx === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentCardIdx === 0 ? 0.5 : 1,
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              >
                ← 上一張
              </button>

              <span style={{ fontSize: '16px', fontWeight: 500, color: '#333', minWidth: '80px', textAlign: 'center' }}>
                {currentCardIdx + 1}/{filteredCards.length}
              </span>

              <button
                onClick={() => {
                  setCurrentCardIdx(i => Math.min(filteredCards.length - 1, i + 1))
                  setIsFlipped(false)
                }}
                disabled={currentCardIdx === filteredCards.length - 1}
                style={{
                  padding: '12px 24px',
                  background: currentCardIdx === filteredCards.length - 1 ? '#d0d0d0' : '#0071e3',
                  color: currentCardIdx === filteredCards.length - 1 ? '#666' : '#ffffff',
                  border: 'none',
                  cursor: currentCardIdx === filteredCards.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentCardIdx === filteredCards.length - 1 ? 0.5 : 1,
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              >
                下一張 →
              </button>
            </div>

            {/* Help Text */}
            <div style={{ marginTop: '30px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
              <p style={{ margin: '4px 0' }}>⌨️ 使用鍵盤：← → 導覽 | Space 翻卡</p>
              <p style={{ margin: '4px 0' }}>🖱️ 點擊卡片可翻開解答</p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '2px solid #0071e3', padding: 'clamp(16px, 5vw, 20px) clamp(16px, 8vw, 40px)', textAlign: 'center', color: '#666', fontSize: 'clamp(12px, 3vw, 14px)' }}>
        <p style={{ margin: '0 0 12px 0' }}>💡 提示：點擊卡片翻開、使用 ← → 箭頭導覽或搜尋特定內容</p>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          © 2026 大豐貿易集團 • AI 企業協作課程 • 課程與網站規劃：大豐資訊Benjamin •{' '}
          <a href="mailto:benjaminchu@tfg.com.tw" style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 600 }}>
            我要提問
          </a>
        </p>
      </div>
    </div>
  )
}
