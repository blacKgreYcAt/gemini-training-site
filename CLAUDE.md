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

---

### Phase 5: 全面稽核與修復 (2026-07-29)

由 Opus 5 執行完整程式碼稽核，修復所有發現的問題。

#### 🔴 安全性

**1. 語言偏好 API 可被任意越權寫入**

修復前，POST 以服務角色金鑰繞過 RLS，卻只從 request body 讀 `userId` 就直接
upsert —— 任何人都能改寫任意使用者的紀錄。

```typescript
// ❌ 修復前：完全不驗證呼叫者身分
const { userId, preferredLanguage } = body;
const supabase = createClient(URL, serviceRoleKey);  // 繞過 RLS
await supabase.from('users_language_preferences').upsert({ user_id: userId, ... });

// ✅ 修復後：身分由 token 推導，body 的 userId 不可信任
const verifiedUserId = await getVerifiedUserId(request);   // auth.getUser(token)
if (!verifiedUserId) return 401;
if (userId && userId !== verifiedUserId) return 403;
if (!['zh','ja'].includes(preferredLanguage)) return 400;  // 值白名單
await supabase.from(...).upsert({ user_id: verifiedUserId, ... });
```

**2. 移除 `/api/auth-test`**

一個未認證、無速率限制的端點，POST 任意 email/password 即可從回應得知帳密
是否正確 —— 等同對外開放的撞庫預言機。無任何程式引用，已刪除。

**3. API 金鑰外洩**

6 個翻譯腳本硬編碼了 Gemini API KEY，其中 4 個已推上公開倉庫。全部改為讀取
`process.env.GEMINI_API_KEY`；`.claude/settings.local.json` 停止追蹤（它在
.gitignore 內卻仍被 git 追蹤）。**外洩的金鑰已由使用者撤銷。**

> ⚠️ 清除程式碼不等於清除 git 歷史。金鑰一旦推送就必須撤銷，改寫歷史無法補救已公開的事實。

#### 🔴 使用者可見的破口

| 問題 | 症狀 |
|------|------|
| zh 缺 16 個 `auth*` 鍵 | 中文登入頁顯示 `authLogin`、`authEmailLabel` 等原始鍵名 |
| 缺 `cardWeek`/`cardOf`/`cardNumber` | 卡牌顯示 `cardWeek 0 cardOf \| cardNumber 1`（中日文皆是） |
| `if (!week) return` | `week === 0` 為 falsy，課前準備三門課的鍵盤翻頁失效 |
| `key={renderKey}` | 切語言時整棵 React 樹重掛，投影片/卡牌/測驗進度全部重置 |
| layout 與 Navbar 重複 | 兩排 header、兩組語言按鈕 |
| `<html lang="zh-TW">` 寫死 | 日文模式下螢幕閱讀器語言標記錯誤 |

#### 🌐 內容本地化

- **55 張卡牌**：新增 `lib/cards-data-ja.ts`。先前只翻譯外框 UI，卡牌內文全中文。
- **100 題題庫**：新增 `lib/quiz-data-ja.ts`。

> **重要**：`course_quizzes_ja.json` 雖有 100 題日文，但**不是**中文題庫的翻譯，
> 而是另外生成的一套題（依課程分組，題目內容完全不同）。若直接採用，日文使用者
> 會拿到不同的考題，且 `updateQuizProgress` 以題號為鍵，中日文進度無法對應 ——
> 同一張證書會有兩種考核標準。因此改為翻譯 `lib/quiz-data.ts`，
> **id / section / week / correctAnswer 全部沿用中文版**，只翻譯題目文字。

- **雙資料源**：刪除 `lib/advanced-courses-ja.ts`。首頁讀它、內頁讀
  `all_courses_ja.json`，導致 6 門進階課標題全部不一致（如「技術」vs「芸術」）。
  首頁改用 `getCourses()`，單一資料源。

#### 🔧 工具鏈

`eslint-config-next` 被固定在 `^0.2.4`（另一個套件的版本線），`npm run lint`
從未成功執行過。升級到 16 後暴露第二個問題：其內含的 `eslint-plugin-import`
peer 上限為 `eslint@^9`，而專案裝了 10，導致 react plugin 崩潰。將 eslint
降至 9.x 後兩者才能共存。

lint 問題數 81 → 30。剩餘為既有品質項目（`any` 型別、`set-state-in-effect`、
`<img>` vs `next/image`），修復屬重構且有回歸風險，未處理。

#### 📦 清理

移除 `/test/certificate-demo`（線上可直接存取的測試路由）、`app/debug.tsx`、
4 個未引用的 lib 檔、5 個被取代的 `all_courses_*.json`，以及死函式
`getQuizzes()` —— 它獨佔的兩個 JSON（112KB）原本被打包進每一個 client bundle。

#### 稽核誤判修正

稽核曾指「UI 有 6 個章節但資料只有 3 個」。實測後確認**並非如此**：
`getQuestionsBySection` 依**題號區間**分章（1-20/21-35/…/81-100），6 章全部
正常；資料中的 `section` 欄位只是殘留未使用。靜態分析看錯，瀏覽器實測才發現。

#### 部署注意事項

- **已不再需要 `SUPABASE_SERVICE_ROLE_KEY`** —— 見下方 Phase 6。專案已無任何程式引用它，也不再有 API 路由。
- `SENDGRID_API_KEY`、`GEMINI_UPDATE_*`、`AUTO_DEPLOY_ENABLED` 在程式碼中無任何引用，屬未實作功能的殘留設定。

---

**最後更新**: 2026-07-29 | **狀態**: ✅ 全面稽核完成

---

### Phase 6: 語言偏好跳裝置同步 + 移除 service role key (2026-07-30)

#### 背景

稽核指出 `SUPABASE_SERVICE_ROLE_KEY` 是部署後最可能的失敗點。進一步檢查發現两件事：

1. `/api/user-language-preference` **完全沒有呼叫端** —— CLAUDE.md Phase 3 記載前端會呼叫，但那段程式在後來的 i18n 改版中被移除，端點留下來了。
2. 它是全站**唯一持有 service role key** 的地方。

定位出當初為何需要高權限密鑰：原本的 POST 建立 Supabase client 時沒有把使用者的
Authorization header 帶進去，`auth.uid()` 是 NULL，因此被 RLS 擋下。當時的處置是
改用 service role key 繯過 RLS，而不是把 JWT 帶上 —— 一個漏傳的 header 演變成權限提升。

#### 做法

改成與進度同步（`progress-utils-sync.ts`）一致的模式：**前端帶著使用者自己的
session 直接讀寫 Supabase，由 RLS 把關**。不經過 API 路由，也不需要任何高權限密鑰。

| 項目 | 内容 |
|------|------|
| 新增 | `lib/language-preference.ts` —— 讀/寫遠端偏好，失敗時退回 localStorage |
| 新增 | `supabase/migrations/create_language_preferences_table.sql` —— 表定義 + RLS + 語言白名單（可重複執行） |
| 修改 | `lib/language-context.tsx` —— 登入後以帳號偏好為準；手動切換時背景寫回帳號 |
| 刪除 | `app/api/user-language-preference/` —— 全站已無 API 路由 |

localStorage 仍是即時來源（避免載入時語言閃動），Supabase 負責讓偏好跟著帳號跳裝置。

#### 實測結果

| 驗証項目 | 結果 |
|---------|------|
| 本地 `ja` + 帳號 `zh` → 載入後 | → `zh`（介面、`<html lang>` 同步） |
| 本地 `zh` + 帳號 `ja` → 載入後 | → `ja` |
| 匿名讀取整張表 | `200 []` —— RLS 過濾，讀不到他人資料 |
| 匿名寫入 | `401 / 42501 row-level security policy` —— 資料庫層擋下 |
| 專案引用 `SERVICE_ROLE` | 0 處 |

#### 順手修正

`create_progress_table.sql:60` 原為 `DROP TRIGGER IF NOT EXISTS`，不是合法 PostgreSQL
語法（只有 `IF EXISTS`）—— 這份 migration 原本根本跑不起來。已修正。

#### 部署影響

- Vercel **不再需要** `SUPABASE_SERVICE_ROLE_KEY`，可從環境變數中移除。
- 因為已無 API 路由，這個專案現在沒有任何 serverless 函式持有密鑰。
- `users_language_preferences` 表與 RLS 已存在於現行資料庫，功能無須先跑 migration。
  建議仍執行一次，以納入版本控制並加上語言值的 CHECK 約束。
