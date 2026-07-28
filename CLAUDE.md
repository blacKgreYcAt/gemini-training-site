# 🎓 Gemini 企業協作課程網站 - 開發完整指南

## 📋 項目概述

**GitHub**: https://github.com/blacKgreYcAt/gemini-training-site  
**Vercel**: Your Vercel URL  
**技術棧**: Next.js 14 + TypeScript + Tailwind CSS + Supabase

---

## 🔧 開發歷程 (完整記錄)

### Phase 1: 卡牌擴展 (Week 0-10)
- 原始: 37張卡牌
- 目標: 55張卡牌 (新增18張進階卡牌)
- 狀態: ✅ 完成

### Phase 2: 進度系統調試 (2024-07-08)

**根本問題**: 進度追踪的三個獨立點，其中兩個缺失

#### Bug #1: 卡牌翻開未追踪
```typescript
// app/cards/page.tsx line 215
onClick={() => {
  const newFlipped = !isFlipped
  setIsFlipped(newFlipped)
  if (newFlipped && currentCard) {
    updateCardsProgress(currentCard.id, true)  // ⭐ 修復
  }
}}
```

#### Bug #2: 卡牌完成按鈕未追踪
```typescript
// app/cards/page.tsx line 60
const toggleCompleted = (cardId: string) => {
  if (!newCompleted.has(cardId)) {
    updateCardsProgress(cardId, true)  // ⭐ 修復
  }
}
```

#### Bug #3: 幻燈片瀏覽未追踪
```typescript
// app/course/[week]/page.tsx line 54-65
useEffect(() => {
  if (course?.pages) {
    updateSlidesProgress(selectedId, pageIdx, course.pages.length)  // ⭐ 修復
  }
}, [week, selectedId, pageIdx])
```

#### Bug #4-5: 週次篩選不完整 + 內容溢出
```typescript
// 修復: [0,1,2,3,4] → [0,1,2,3,4,5,6,7,8,9,10]
// 修復: overflow: 'hidden' → overflow: 'auto'
```

### 部署信息

| 項目 | Commit | 日期 | 內容 |
|------|--------|------|------|
| 公司網站 | 43442cb | 2024-07-08 | 卡牌完成追踪 |
| 公司網站 | 20fb311 | 2024-07-08 | 進度系統修復 |
| BERK網站 | 8d39188 | 2024-07-08 | 卡牌完成追踪 |
| BERK網站 | 8f7b159 | 2024-07-08 | 進度系統修復 |

---

## 💾 進度數據結構

```javascript
localStorage.userProgress = {
  cardsProgress: {
    "card-id": {
      viewed: boolean,
      flipped: boolean,        // ⭐ 關鍵: 用於計算進度
      viewedAt: "ISO timestamp"
    }
  },
  slidesProgress: {
    "course-id": {
      totalPages: number,
      completedPages: [0, 1, 2],
      lastViewedPage: number,
      completedAt?: string
    }
  },
  quizProgress: {
    [questionId]: {
      answered: boolean,
      userAnswer: string,
      isCorrect: boolean,
      answeredAt: string
    }
  },
  statistics: {
    cardsCompletionRate: 0-100,  // = flipped卡牌數 / 55 × 100
    slidesCompletionRate: 0-100,
    quizCompletionRate: 0-100,
    quizAccuracy: 0-100,
    certificateEarned: boolean
  }
}
```

---

## 🚀 快速開始 (新電腦)

```bash
# 1. 克隆項目
git clone https://github.com/blacKgreYcAt/gemini-training-site.git
cd gemini-training-site

# 2. 安裝依賴
npm install

# 3. 創建 .env.local (從Supabase獲取)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# 4. 本地運行
npm run dev

# 5. 測試進度追踪
# - 打開卡牌 → 翻開 → 檢查進度
# - 進入課程 → 瀏覽 → 檢查進度
# - 完成題庫 → 檢查進度
```

---

## 🎯 進度追踪原理

### 三層結構
1. **UI層**: `isFlipped`, `completedCards` (React State)
2. **數據層**: `localStorage.userProgress` (持久化)
3. **計算層**: `calculateCompletionRates()` (統計百分比)

### 為什麼進度顯示0%?
進度 = 0% 意味著追踪函數未被調用

檢查:
```javascript
// 打開DevTools F12
// Application → Local Storage → 搜索 userProgress
const data = JSON.parse(localStorage.getItem('userProgress'))
console.log(data.cardsProgress)   // 應該有數據
console.log(data.slidesProgress)  // 應該有數據
console.log(data.quizProgress)    // 應該有數據
```

---

## 📋 部署檢查清單

- [ ] 追踪函數已調用 (updateCardsProgress, updateSlidesProgress, updateQuizProgress)
- [ ] localStorage保存正確
- [ ] 響應式設計通過
- [ ] 週5-10卡牌可見
- [ ] 進度頁面百分比正確
- [ ] GitHub commit清晰
- [ ] Vercel部署成功

---

## 🐛 常見問題

**Q: 進度為什麼一直是0%?**  
A: 檢查代碼是否調用了updateCardsProgress() / updateSlidesProgress() / updateQuizProgress()

**Q: 刷新後進度消失?**  
A: localStorage持久化存儲,不會因刷新而丟失。只有用戶手動清除瀏覽器數據才會消失。

**Q: 卡牌完成數顯示10/55,但進度0%?**  
A: UI標記(completedCards)和進度系統(cardsProgress.flipped)是分開的。需要同時翻開卡牌並調用updateCardsProgress()。

---

**最後更新**: 2024-07-08 | **狀態**: ✅ 生產就緒
