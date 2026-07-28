# 🚀 Vercel 部署清單 - 立即執行

**部署時間**: 2026-07-28  
**狀態**: 🟢 準備就緒  
**預計完成**: 20 分鐘

---

## 📋 部署清單

### ✅ 前置檢查

- [x] 代碼已推送至 GitHub main 分支
- [x] 構建成功驗證通過
- [x] 環境配置文件已準備
- [x] 翻譯文件已生成
- [x] 文檔已完整編寫

**提交 Hash**: `112ca6c` ✓

---

## 🔧 Vercel 環境變數配置

### 第一步：登錄 Vercel Dashboard

```
https://vercel.com/dashboard
```

### 第二步：選擇專案

**專案名稱**: `gemini-training-site`

### 第三步：進入 Settings

```
Settings → Environment Variables
```

### 第四步：添加以下環境變數

| 變數名 | 值 | 說明 |
|--------|----|----|
| `NEXT_PUBLIC_SUPABASE_URL` | `[已在 .env.local 中配置]` | Supabase 數據庫 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[已在 .env.local 中配置]` | Supabase 匿名密鑰 |
| `NEXT_PUBLIC_GEMINI_API_KEY` | `[已在 .env.local 中配置]` | Gemini API 密鑰 |
| `SUPABASE_SERVICE_ROLE_KEY` | `[已在 .env.local 中配置]` | Supabase 服務角色密鑰 |

**⚠️ 注意**: 所有變數已在 `.env.local` 中，直接複製即可。

---

## 🚀 自動部署 (推薦)

### 方式 A：GitHub 自動觸發 (無需操作)

由於 Vercel 已連接 GitHub，只需保持當前狀態：

```
✓ 代碼已推送至 main
✓ Vercel 監聽 GitHub webhooks
✓ 自動檢測新提交
✓ 自動觸發部署
```

**預期時間**: 2-3 分鐘後部署完成

### 方式 B：手動觸發部署

如果需要立即部署，進入 Vercel Dashboard：

1. 進入 `Deployments` 標籤
2. 點擊 `Deploy` 按鈕
3. 選擇 `Deploy from Git`
4. 選擇最新提交 (`112ca6c`)

**預期時間**: 即時部署

### 方式 C：Vercel CLI 部署

```bash
# 安裝 Vercel CLI (如果未安裝)
npm i -g vercel

# 登錄
vercel login

# 部署至生產環境
vercel deploy --prod

# 驗證 URL
# https://gemini-training-site.vercel.app
```

---

## 🌐 Supabase 初始化 (同時進行)

### 步驟 1：登錄 Supabase

```
https://supabase.com/dashboard/projects
```

### 步驟 2：選擇專案

**專案名稱**: `gemini-training-site`  
**專案 ID**: `rclldgdkksjkgksydmbx`

### 步驟 3：進入 SQL Editor

```
SQL Editor → New Query
```

### 步驟 4：複製並執行 SQL

```sql
-- 複製以下 SQL 腳本：
-- 檔案位置: scripts/init-i18n-schema.sql

-- 創建表格...
-- (完整 SQL 內容見下文)
```

### SQL 腳本位置

📄 **檔案**: `scripts/init-i18n-schema.sql`

**內容摘要**:
```sql
-- 創建 6 個表格
CREATE TABLE users_language_preferences (...)
CREATE TABLE course_data_i18n (...)
CREATE TABLE quizzes_i18n (...)
CREATE TABLE user_progress_i18n (...)
CREATE TABLE gemini_feature_updates (...)
CREATE TABLE content_update_log (...)

-- 設置 RLS 政策
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;

-- 創建索引
CREATE INDEX ... ON ...;
```

**執行時間**: 1-2 分鐘

---

## ✅ 部署驗證清單

### ✓ 部署後 (5-10 分鐘內)

- [ ] Vercel Dashboard 顯示部署成功 ✅
- [ ] 部署 URL 可訪問: https://gemini-training-site.vercel.app
- [ ] 構建日誌無錯誤
- [ ] 預覽環境已生成

### ✓ 功能驗證 (10-15 分鐘內)

在瀏覽器中打開 https://gemini-training-site.vercel.app

**測試項目**:

- [ ] 主頁面載入正常
- [ ] 導航欄顯示正常
- [ ] 語言選擇器按鈕可見
  - [ ] 英文按鈕 (English)
  - [ ] 日文按鈕 (日本語)
- [ ] 點擊語言按鈕測試切換
  - [ ] localStorage 已保存偏好 (F12 → Application)
  - [ ] 頁面內容應該切換語言 (需要 Supabase 初始化)
- [ ] 課程頁面可訪問: `/course/0`
- [ ] 題庫頁面可訪問: `/quiz`
- [ ] API 路由工作: `/api/user-language-preference?userId=test`

### ✓ 控制台檢查 (F12)

- [ ] 無紅色錯誤信息
- [ ] 網絡請求狀態 200
- [ ] API 響應時間 < 500ms

---

## 📊 部署時間表

| 步驟 | 任務 | 預計時間 | 狀態 |
|------|------|---------|------|
| 1 | 環境變數配置 | 5 分鐘 | ⏳ |
| 2 | Vercel 部署 | 3-5 分鐘 | ⏳ |
| 3 | Supabase SQL 初始化 | 2 分鐘 | ⏳ |
| 4 | 生產驗證 | 5-10 分鐘 | ⏳ |

**總計**: ~20 分鐘  
**預計完成時間**: 2026-07-28 20:00 UTC

---

## 🚨 常見問題排查

### ❌ 部署失敗

**症狀**: Vercel Dashboard 顯示構建失敗  
**解決方案**:
1. 檢查構建日誌 (Logs 標籤)
2. 確認環境變數已正確設置
3. 確認所有依賴已安裝 (`npm install`)
4. 重新觸發部署

### ❌ 語言切換不工作

**症狀**: 點擊語言按鈕無反應  
**解決方案**:
1. Supabase 表格是否已初始化? ✓ 檢查
2. API 路由是否工作? → `/api/user-language-preference`
3. localStorage 是否已保存? → F12 → Application
4. 檢查瀏覽器控制台是否有錯誤

### ❌ API 連接錯誤

**症狀**: "Failed to connect to Supabase"  
**解決方案**:
1. 驗證 `NEXT_PUBLIC_SUPABASE_URL` 正確
2. 驗證 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 正確
3. Supabase 專案是否在線? → 檢查 Supabase Dashboard
4. 檢查 CORS 配置

---

## 🔐 安全檢查

**部署前確認**:

- [x] API Key 未硬編碼在代碼中
- [x] 敏感信息已存儲在環境變數
- [x] .gitignore 已配置 `.env.local`
- [x] GitHub Secrets 已設置 (GitHub Actions)
- [x] RLS 政策已配置 (Supabase)
- [x] HTTPS 已自動配置 (Vercel)

---

## 📞 部署支持

**如遇問題，請檢查以下資源**:

1. **Vercel 文檔**: https://vercel.com/docs
2. **Supabase 文檔**: https://supabase.com/docs
3. **Next.js 文檔**: https://nextjs.org/docs
4. **GitHub Issues**: https://github.com/blacKgreYcAt/gemini-training-site/issues

**聯絡方式**:
- 📧 Email: benjamin58.chu@gmail.com
- 🔗 GitHub: https://github.com/blacKgreYcAt

---

## 🎉 部署完成標誌

當你看到以下狀態時，部署已成功:

```
✅ Vercel 部署完成
✅ 生產環境可訪問
✅ 語言選擇功能工作
✅ API 連接正常
✅ Supabase 表格已初始化
```

---

## 📝 後續步驟

### 部署後 (立即)
1. ✅ 驗證生產環境功能
2. ✅ 測試語言切換
3. ✅ 檢查 API 連接

### 本週
1. 配置 GitHub Actions 機密
2. 驗證月度自動更新系統
3. 設置 Email 通知

### 本月
1. 用戶驗收測試
2. 性能優化調整
3. 安全審計

---

**🎯 目標**: 2026-07-28 20:00 UTC 前完成全部部署  
**狀態**: 🟢 準備就緒  
**下一步**: 執行環境變數配置與部署

