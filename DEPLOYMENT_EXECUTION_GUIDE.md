# 🚀 部署執行指南 - 逐步操作

**開始時間**: 2026-07-28 15:35 UTC  
**預計完成**: 2026-07-28 15:55 UTC (20 分鐘)  
**狀態**: ✅ 開始執行

---

## 🎯 執行步驟

### 📍 步驟 1️⃣：Vercel 環境變數配置 (5 分鐘)

#### 1.1 打開 Vercel Dashboard

**URL**: https://vercel.com/dashboard/projects

**操作**:
```
1. 訪問上述 URL
2. 如未登錄，使用 GitHub 帳號登錄
3. 尋找項目名稱: "gemini-training-site"
4. 點擊進入專案
```

#### 1.2 進入 Settings

**操作**:
```
1. 在專案頁面，點擊頂部選單 "Settings"
2. 左側邊欄選擇 "Environment Variables"
3. 或直接訪問:
   https://vercel.com/dashboard/[project-id]/settings/environment-variables
```

#### 1.3 添加環境變數

**變數 1 - Supabase URL**

| 欄位 | 值 |
|------|-----|
| **Name** | `NEXT_PUBLIC_SUPABASE_URL` |
| **Value** | `https://rclldgdkksjkgksydmbx.supabase.co` |
| **Environment** | Production, Preview, Development (全選) |

**操作**:
```
1. 點擊 "Add New" 按鈕
2. 在 "Name" 欄填入: NEXT_PUBLIC_SUPABASE_URL
3. 在 "Value" 欄填入: https://rclldgdkksjkgksydmbx.supabase.co
4. 確保選擇所有環境 (Production, Preview, Development)
5. 點擊 "Save"
```

**變數 2 - Supabase 匿名密鑰**

| 欄位 | 值 |
|------|-----|
| **Name** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Value** | `[從 .env.local 複製]` |
| **Environment** | Production, Preview, Development (全選) |

**操作**:
```
1. 打開本地 .env.local 文件
2. 尋找行: NEXT_PUBLIC_SUPABASE_ANON_KEY=...
3. 複製 "=" 後面的全部內容
4. 在 Vercel 中點擊 "Add New"
5. Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
6. Value: [粘貼複製的內容]
7. 選擇所有環境
8. 點擊 "Save"
```

**變數 3 - Gemini API Key**

| 欄位 | 值 |
|------|-----|
| **Name** | `NEXT_PUBLIC_GEMINI_API_KEY` |
| **Value** | `[從 .env.local 複製]` |
| **Environment** | Production, Preview, Development (全選) |

**操作**:
```
1. 打開本地 .env.local 文件
2. 尋找行: NEXT_PUBLIC_GEMINI_API_KEY=...
3. 複製 "=" 後面的全部內容
4. 在 Vercel 中點擊 "Add New"
5. Name: NEXT_PUBLIC_GEMINI_API_KEY
6. Value: [粘貼複製的內容]
7. 選擇所有環境
8. 點擊 "Save"
```

**變數 4 - Supabase 服務角色密鑰**

| 欄位 | 值 |
|------|-----|
| **Name** | `SUPABASE_SERVICE_ROLE_KEY` |
| **Value** | `[從 .env.local 複製]` |
| **Environment** | Production, Preview, Development (全選) |

**操作**:
```
1. 打開本地 .env.local 文件
2. 尋找行: SUPABASE_SERVICE_ROLE_KEY=...
3. 複製 "=" 後面的全部內容
4. 在 Vercel 中點擊 "Add New"
5. Name: SUPABASE_SERVICE_ROLE_KEY
6. Value: [粘貼複製的內容]
7. 選擇所有環境
8. 點擊 "Save"
```

#### ✅ 檢查清單 (第 1 步完成)

- [ ] NEXT_PUBLIC_SUPABASE_URL 已添加
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY 已添加
- [ ] NEXT_PUBLIC_GEMINI_API_KEY 已添加
- [ ] SUPABASE_SERVICE_ROLE_KEY 已添加
- [ ] 所有 4 個變數都選擇了所有環境
- [ ] Vercel Dashboard 頁面顯示 4 個環境變數

**⏱️ 預計耗時**: 5 分鐘  
**✅ 完成後**: 進入步驟 2

---

### 📍 步驟 2️⃣：等待自動部署 (3-5 分鐘)

#### 2.1 觀察 Vercel 部署進度

**URL**: https://vercel.com/dashboard/projects/gemini-training-site/deployments

**預期流程**:

| 時間 | 狀態 | 說明 |
|------|------|------|
| T+0 | 🟡 Queued | 等待部署隊列 |
| T+1 | 🟡 Building | 構建進行中 |
| T+3 | 🟢 Ready | 部署完成 |

**監控**:
```
1. 訪問上述 Deployments URL
2. 觀察最新部署 (應該在列表頂部)
3. 查看狀態顏色:
   🟡 黃色 = 進行中
   🟢 綠色 = 完成
   🔴 紅色 = 失敗
4. 等待狀態變為 🟢 綠色
```

#### 2.2 部署失敗排查

如果看到 🔴 紅色狀態:

**操作**:
```
1. 點擊部署行進入詳情
2. 查看 "Logs" 標籤
3. 尋找紅色錯誤信息
4. 常見問題:
   - 環境變數格式錯誤 → 檢查複製的值
   - 依賴安裝失敗 → 等待重試自動觸發
   - 代碼編譯失敗 → 檢查最新提交
```

#### ✅ 檢查清單 (第 2 步完成)

- [ ] Vercel Dashboard 顯示新部署
- [ ] 部署狀態變為 🟢 綠色
- [ ] 部署日誌無紅色錯誤
- [ ] 預覽 URL 可訪問

**⏱️ 預計耗時**: 3-5 分鐘  
**✅ 完成後**: 進入步驟 3

---

### 📍 步驟 3️⃣：Supabase 初始化 (2 分鐘)

**同時進行，無需等待 Vercel 完成**

#### 3.1 打開 Supabase SQL Editor

**URL**: https://supabase.com/dashboard/projects/rclldgdkksjkgksydmbx/sql

**操作**:
```
1. 訪問上述 URL
2. 如未登錄，使用 GitHub 帳號登錄
3. 進入專案: "gemini-training-site"
4. 選擇 "SQL Editor" 標籤
```

#### 3.2 新建查詢

**操作**:
```
1. 在 SQL Editor 頁面，點擊 "New Query"
2. 或點擊 "+" 按鈕創建新查詢
3. 系統會打開編輯框
```

#### 3.3 複製並執行 SQL

**SQL 腳本位置**: 

📁 本地: `scripts/init-i18n-schema.sql`

📄 GitHub: https://github.com/blacKgreYcAt/gemini-training-site/blob/main/scripts/init-i18n-schema.sql

**操作**:
```
1. 打開本地文件: scripts/init-i18n-schema.sql
2. 全選所有內容 (Ctrl+A)
3. 複製 (Ctrl+C)
4. 在 Supabase SQL 編輯框粘貼 (Ctrl+V)
5. 點擊 "Run" 按鈕 (綠色)
6. 等待完成 (應該顯示 "Success")
```

#### 3.4 驗證表格創建

**操作**:
```
1. 執行完成後，進入 "Table Editor" 標籤
2. 應該看到以下 6 個新表格:
   ✓ users_language_preferences
   ✓ course_data_i18n
   ✓ quizzes_i18n
   ✓ user_progress_i18n
   ✓ gemini_feature_updates
   ✓ content_update_log
3. 如果都看到了，說明初始化成功 ✅
```

#### ✅ 檢查清單 (第 3 步完成)

- [ ] SQL 查詢執行成功 (綠色 Success)
- [ ] Table Editor 顯示 6 個新表格
- [ ] 無錯誤信息

**⏱️ 預計耗時**: 2 分鐘  
**✅ 完成後**: 進入步驟 4

---

### 📍 步驟 4️⃣：生產驗證 (5-10 分鐘)

#### 4.1 訪問部署網站

**URL**: https://gemini-training-site.vercel.app

**操作**:
```
1. 打開瀏覽器
2. 訪問上述 URL
3. 等待頁面載入 (通常 2-5 秒)
```

#### 4.2 視覺檢查

| 檢查項目 | 預期結果 | 狀態 |
|---------|--------|------|
| 頁面加載 | 無錯誤，內容完整 | ✅ |
| 導航欄 | 顯示 "Gemini 課程" + 語言選擇器 | ✅ |
| 語言按鈕 | 英文 (English) 和日文 (日本語) | ✅ |
| 頁面樣式 | 正常排版，無斷裂 | ✅ |

**操作**:
```
1. 檢查頁面是否完整加載
2. 找到導航欄右側的語言選擇器
3. 應該看到兩個按鈕: "English" 和 "日本語"
```

#### 4.3 語言切換測試

**操作**:
```
1. 點擊 "日本語" 按鈕
2. 預期: 頁面刷新，按鈕狀態變化
3. 打開瀏覽器開發者工具 (F12)
4. 進入 "Application" 標籤
5. 展開 "Local Storage"
6. 查找 "preferred_language": "ja"
7. 再點擊 "English" 按鈕
8. 驗證 localStorage 變為 "en"
```

#### 4.4 API 連接測試

**操作**:
```
1. 打開瀏覽器開發者工具 (F12)
2. 進入 "Network" 標籤
3. 刷新頁面
4. 查看網絡請求:
   - /api/user-language-preference 應該返回 200
   - 響應時間應該 < 500ms
5. 進入 "Console" 標籤
6. 不應該看到紅色錯誤信息
```

#### 4.5 功能導航測試

**操作**:
```
1. 嘗試訪問不同頁面:
   - 課程: /course/0
   - 題庫: /quiz
   - 儀表板: /dashboard/progress
2. 每個頁面應該正常加載
3. 語言按鈕應該在所有頁面顯示
4. 切換語言應該在所有頁面工作
```

#### ✅ 檢查清單 (第 4 步完成)

- [ ] 網站可訪問: https://gemini-training-site.vercel.app
- [ ] 頁面完整加載
- [ ] 導航欄顯示正常
- [ ] 語言選擇器可見且可點擊
- [ ] 語言切換工作正常
- [ ] localStorage 正確保存偏好
- [ ] API 響應 200 狀態碼
- [ ] 控制台無紅色錯誤
- [ ] 所有頁面可訪問

**⏱️ 預計耗時**: 5-10 分鐘  
**✅ 完成後**: 部署完成！

---

## ✨ 最終確認

### 🎉 部署成功標誌

當以下所有條件都符合時，部署成功：

```
✅ Vercel Dashboard 顯示 🟢 部署成功
✅ 網站 URL 可訪問
✅ 頁面內容完整加載
✅ 語言選擇器按鈕可見
✅ 語言切換功能工作
✅ localStorage 已保存偏好
✅ API 連接正常
✅ 控制台無錯誤信息
✅ Supabase 6 個表格已創建
✅ 所有頁面可訪問
```

### 📊 部署完成時間表

```
15:35 - 開始環境變數配置
15:40 - 環境變數配置完成 ✅
15:40 - Vercel 自動部署開始
15:45 - Vercel 部署完成 ✅
15:45 - Supabase SQL 初始化開始
15:47 - Supabase 初始化完成 ✅
15:47 - 生產環境驗證開始
15:55 - 生產環境驗證完成 ✅

總耗時: 20 分鐘
```

---

## 🆘 常見問題排查

### ❌ Vercel 部署失敗 (紅色狀態)

**症狀**: Deployments 頁面顯示 🔴 紅色

**解決方案**:
1. 點擊部署進入詳情頁
2. 查看 "Logs" 標籤中的錯誤信息
3. 常見錯誤:
   - `Error: Environment variable not found` → 檢查環境變數名稱是否正確
   - `Build failed` → 可能是依賴問題，等待重新觸發
   - `Cannot find module` → 檢查代碼是否正確推送

**重試**:
```
1. 回到 Deployments 頁面
2. 找到失敗的部署
3. 點擊 "Redeploy" 按鈕
4. 等待重新部署
```

### ❌ 語言切換不工作

**症狀**: 點擊語言按鈕無反應

**解決方案**:
1. 檢查 localStorage (F12 → Application)
   - 應該有 "preferred_language" 鍵
   - 如果沒有，localStorage 可能被禁用
2. 檢查控制台 (F12 → Console)
   - 是否有 JavaScript 錯誤信息
3. Supabase 初始化是否完成
   - 檢查 SQL 是否執行成功
4. 清除瀏覽器快取
   - F12 → Network → 勾選 "Disable cache"
   - 刷新頁面

### ❌ API 連接失敗

**症狀**: 控制台顯示 "Failed to connect to Supabase"

**解決方案**:
1. 驗證環境變數:
   - NEXT_PUBLIC_SUPABASE_URL 是否正確
   - NEXT_PUBLIC_SUPABASE_ANON_KEY 是否正確
2. 檢查 Supabase 專案是否在線
   - 訪問 https://supabase.com/dashboard
   - 確認專案狀態
3. 檢查網絡連接
   - 確認瀏覽器有網絡連接
   - 嘗試訪問其他網站

### ❌ Supabase SQL 執行失敗

**症狀**: SQL 執行後顯示錯誤

**解決方案**:
1. 複製整個 SQL 文件內容
   - 確保沒有遺漏任何行
2. 清空編輯框，重新粘貼
3. 檢查是否有語法錯誤 (查看錯誤信息)
4. 如果有權限錯誤，確認:
   - 使用的是主帳號 (不是受限帳號)
   - 專案沒有被鎖定

---

## ✅ 完成確認

當你看到以下消息時，說明部署成功：

```
🎊 部署完成！

✅ Vercel 部署: https://gemini-training-site.vercel.app
✅ 語言切換: 英文/日文
✅ Supabase: 6 個表格已創建
✅ 自動化: GitHub Actions 已配置
✅ 監控: 已就緒

祝賀！日本語版本已上線！🎉
```

---

**下一步**: 按照上述 4 個步驟逐個執行，預計 20 分鐘完成部署！

🚀 **立即開始**：打開 Vercel Dashboard 配置環境變數

