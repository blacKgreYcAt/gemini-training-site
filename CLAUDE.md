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

### Phase 3: 多語言系統 & 語言選擇修復 (2026-07-28)

**目標**: 添加日文支持 + 修復語言選擇按鈕

#### 問題 #1: 語言選擇按鈕返回 500 錯誤
```
症狀: 點擊語言按鈕時，POST /api/user-language-preference 返回 500
根本原因: Supabase RLS 政策阻止未認證用戶操作
```

#### 修復步驟:

**1. API 路由修復** (app/api/user-language-preference/route.ts)
```typescript
// ✅ 使用服務角色密鑰繞過 RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ⭐ 服務角色密鑰
);

// ✅ 改進的錯誤處理
if (error) {
  console.error('❌ Supabase error:', {
    code: error.code,
    message: error.message,
    details: error.details,
  });
  throw new Error(`Supabase error: ${error.message}`);
}
```

**2. 前端邏輯修復** (components/LanguageSelector.tsx)
```typescript
// ✅ 未登錄用戶: 只保存到 localStorage
if (!user) {
  console.log('ℹ️ User not logged in. Language preference saved to localStorage only.');
} else {
  // ✅ 已登錄用戶: 嘗試保存到 Supabase
  const session = await getSession();
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  // 發送 API 請求...
}
```

#### 部署信息

| 項目 | Commit | 日期 | 內容 |
|------|--------|------|------|
| 公司網站 | 82bf199 | 2026-07-28 | 修復語言選擇按鈕的 500 錯誤 |

#### 測試結果 ✅

**本地開發環境**:
- ✅ 語言按鈕點擊正常
- ✅ localStorage 正確保存語言偏好
- ✅ 未登錄用戶無 API 調用（預期行為）

**生產環境 (Vercel)**:
- ✅ 語言選擇功能完全運作
- ✅ localStorage 中成功保存語言偏好
- ✅ 沒有 500 錯誤

#### 待解決問題

1. **Card 背景圖片** - SVG 文件在生產環境中不顯示
   - 37 個 SVG 文件已提交到 Git
   - 需要調查 Vercel 的靜態文件服務配置

---

**最後更新**: 2026-07-28 | **狀態**: ✅ 語言選擇修復完成，生產環境驗證通過
