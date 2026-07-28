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

#### 問題 #2: Card 背景圖片缺失
```
症狀: 有些卡片有背景，有些沒有
根本原因: 原始只有 37 個 SVG 文件，共 55 張卡片
解決方案: 生成缺失的 38 個 SVG 文件
```

**解決方案實施**:
1. 分析卡片數據 - 確認缺失的 18 週卡片
2. 創建生成腳本 - `scripts/generate-missing-svgs.js`
3. 生成 SVG 檔案 - 每周使用不同顏色主題
4. 驗證覆蓋 - 所有 55 張卡片現在都有背景

**顏色方案**:
- Week 0-1: Green / Blue (已有)
- Week 2-4: Purple / Red / Orange (已有)
- Week 5-10: Cyan / Pink / Indigo / Lime / Teal / Yellow (新增)

#### 測試結果 ✅

**所有 55 張卡片現在都有 SVG 背景**:
- ✅ 原始 37 個 SVG 保留
- ✅ 新增 38 個 SVG 文件
- ✅ 無缺失卡片
- ✅ 一致的科技風格設計

---

### Phase 4: 多語言國際化系統 (2026-07-29)

**目標**: 實現完整的中文/日文語言切換系統

#### 問題 #1: LanguageProvider 上下文錯誤
```
症狀: "useLanguage must be used within LanguageProvider" 錯誤
根本原因: LanguageProvider 在初始化時返回 children 而不包裝上下文
解決方案: 移除早期返回，始終提供上下文
```

**修復** (lib/language-context.tsx):
```typescript
// ❌ 之前: 初始化時不提供上下文
if (!isLoaded) {
  return <>{children}</>;  // 上下文缺失!
}

// ✅ 之後: 始終提供上下文
return (
  <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
    {children}
  </LanguageContext.Provider>
);
```

#### 系統架構

**核心組件**:
1. **LanguageContext** (lib/language-context.tsx)
   - 全局語言狀態管理
   - localStorage 持久化
   - 自定義事件分派

2. **Translations** (lib/translations.ts)
   - 30+ UI 文本條目
   - 中文 (zh) 和日文 (ja) 支持
   - t() 翻譯函數

3. **LanguageSelector** (components/LanguageSelector.tsx)
   - 中文/日本語 按鈕
   - 實時語言切換
   - 狀態視覺反饋

**導航流程**:
```
layout.tsx (LanguageProvider 包裹)
  ↓
app/page.tsx (useLanguage + t())
  ↓
app/cards/page.tsx (useLanguage + t())
  ↓
app/quiz/page.tsx (待更新)
  ↓
app/course/[week]/page.tsx (待更新)
```

#### 測試結果 ✅

**開發環境**:
- ✅ 語言按鈕功能正常
- ✅ localStorage 正確保存偏好
- ✅ 語言偏好在頁面刷新後保留
- ✅ 無上下文錯誤
- ✅ app/page.tsx 完全支持語言切換
- ✅ app/cards/page.tsx 部分更新（主要 UI 文本）

**Commits**:
| Commit | 內容 |
|--------|------|
| e0236f1 | 實現 i18n 基礎設施並修復 LanguageProvider 上下文 |
| c62e6c7 | 為卡牌頁面添加 i18n 支持 |

#### 待完成項目

1. **更新剩餘頁面** (優先級: 高)
   - [ ] app/quiz/page.tsx - 更新 100+ 題庫文本
   - [ ] app/course/[week]/page.tsx - 更新課程導航文本
   - [ ] app/dashboard/progress/page.tsx - 更新進度頁面
   - [ ] app/dashboard/certificate/page.tsx - 更新證書頁面

2. **部署和驗證** (優先級: 中)
   - [ ] 部署到 Vercel
   - [ ] 端到端測試 (登入 → 語言切換 → 查看內容)
   - [ ] 性能檢查

3. **擴展功能** (優先級: 低)
   - [ ] 添加更多語言支持
   - [ ] 日文課程內容翻譯
   - [ ] 本地化日期/時間格式

#### 完成的頁面翻譯

| 頁面 | 文件路徑 | 狀態 | 翻譯項目 |
|------|---------|------|---------|
| 首頁 | app/page.tsx | ✅ 完成 | 標題、副標題、課程卡片、按鈕 |
| 卡牌自學 | app/cards/page.tsx | ✅ 完成 | 搜尋、篩選、統計、按鈕 |
| 題庫 | app/quiz/page.tsx | ✅ 完成 | 標題、題目、答案反饋、得分 |
| 課程頁面 | app/course/[week]/page.tsx | ✅ 完成 | 導航、頁碼、前後按鈕 |
| 進度儀表板 | app/dashboard/progress/page.tsx | ✅ 完成 | 標題、進度項目、證書狀態 |
| 證書頁面 | app/dashboard/certificate/page.tsx | ✅ 完成 | 標題、要求、提示 |
| 認證頁面 | app/auth/page.tsx | ✅ 完成 | 登入、註冊、錯誤提示 |

#### 完整的 Commits 清單

```
51552ee - Add i18n support to auth page
a99a972 - Add i18n support to certificate page
7636bd3 - Add i18n support to progress dashboard
06de790 - Add i18n support to course page
35a3f51 - Complete i18n support for quiz page
d355941 - Add i18n support to quiz page (partial)
c62e6c7 - Add i18n support to cards page
d2847d9 - Document i18n implementation (Phase 4)
e0236f1 - Implement i18n infrastructure and fix LanguageProvider context
```

#### 測試檢查表 ✅

- ✅ 語言按鈕功能正常 (中文/日本語)
- ✅ localStorage 正確保存語言偏好
- ✅ 語言偏好在頁面刷新後保留
- ✅ 無上下文錯誤
- ✅ 所有主要頁面已翻譯
- ✅ 內聯日文翻譯完成
- ✅ 開發服務器運行正常 (200 狀態)

---

**最後更新**: 2026-07-29 17:28 | **狀態**: ✅ 完成 (i18n 系統全部實現)
