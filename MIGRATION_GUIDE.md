# 跨平台進度同步實現 - 遷移指南

## 📋 概覽

本次更新實現了用戶認證和雲端進度同步，支持用戶在多個設備上無縫繼續學習。

### 新增功能
- ✅ Supabase 用戶認證（Email/密碼）
- ✅ 雲端進度同步（所有設備同步）
- ✅ 離線支持（localStorage 作為本地緩存）
- ✅ 自動衝突解決（Supabase 為主）

---

## 🔧 實施步驟

### 1. **執行數據庫遷移**

在 Supabase 控制面板中運行以下 SQL：
```sql
-- 位置：Supabase > SQL Editor > New Query
-- 複製並執行：migrations/add_user_progress_full.sql 中的全部內容
```

或通過 Supabase CLI：
```bash
supabase migration add add_user_progress_full
# 複製 migrations/add_user_progress_full.sql 內容到生成的遷移文件
supabase db push
```

### 2. **啟用 Supabase Auth**

在 Supabase 控制面板中：
1. 進入 **Authentication > Settings**
2. 啟用 **Email/Password** 認證方式
3. 配置郵件發送（可選，用於密碼重置）

### 3. **更新代碼使用**

所有現有代碼已自動相容。但如需在組件中使用認證信息，添加以下代碼：

```tsx
'use client'
import { useAuth } from '@/lib/auth-context'

export default function MyComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>加載中...</div>
  if (!user) return <div>請登入</div>
  
  return <div>歡迎 {user.name}</div>
}
```

### 4. **使用受保護路由**

對於需要認證的頁面，使用 ProtectedRoute 包裝器：

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function CoursePage() {
  return (
    <ProtectedRoute>
      {/* 課程內容 */}
    </ProtectedRoute>
  )
}
```

### 5. **在布局中添加導航欄**

```tsx
import { Navbar } from '@/components/Navbar'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
```

---

## 📊 數據流架構

```
用戶操作 (答題/翻卡)
    ↓
updateQuizProgress() / updateCardsProgress()
    ↓
    ├→ localStorage (即時本地保存)
    └→ Supabase (異步雲端保存)
    ↓
讀取進度時：
    ├→ 優先讀取 Supabase（最新數據）
    └→ 備用 localStorage（離線時）
```

---

## 🔐 安全性

- **RLS 政策**：用戶只能存取自己的數據
- **認證檢查**：所有 API 調用都需要有效的 session
- **數據隔離**：每個用戶的進度完全獨立

---

## 🧪 測試場景

### 場景 1：跨設備同步
1. **設備 A（手機）**
   - 登入 user@example.com
   - 完成 5 張卡牌
   - 觀察 localStorage 和 Supabase 都已更新

2. **設備 B（電腦）**
   - 登入同一帳號
   - 進度自動顯示 5/55 卡牌完成
   - 繼續學習，新數據同步回去

### 場景 2：離線模式
1. 登入後進行學習
2. 關閉網路
3. 卡牌進度保存到 localStorage
4. 恢復網路後自動同步到 Supabase

### 場景 3：衝突解決
1. 在設備 A 完成題目 A
2. 在設備 B 完成題目 B（在 A 同步前）
3. 重新加載時，以 Supabase 為準（包含兩個答題）

---

## 🚨 已知限制

### 當前實現
- 新用戶首次登入時創建空白進度記錄
- 如需 OAuth（Google/GitHub），需另行配置

### 未來改進
- [ ] 邀請碼/班級管理
- [ ] 導師儀表板（查看學生進度）
- [ ] 進度導出（PDF/Excel）
- [ ] 離線 PWA 支持

---

## 🔄 回滾步驟（如需恢復）

如需恢復到舊版本（純 localStorage）：

```bash
# 1. 復原代碼
git checkout HEAD~N -- lib/progress-utils.ts

# 2. 移除認證相關文件
rm app/auth/page.tsx
rm lib/auth-utils.ts lib/auth-context.tsx

# 3. 更新布局（移除 AuthProvider）
# app/layout.tsx：移除 <AuthProvider> 包裝
```

---

## 📞 支持

如遇問題，檢查：
1. Supabase 連接 URL 和 API Key（.env.local）
2. 數據庫遷移是否完成
3. RLS 政策是否已啟用
4. 瀏覽器 localStorage 是否啟用
