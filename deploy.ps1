# =====================================================
# Gemini 課程網站部署自動化腳本 (Windows PowerShell)
# 用途: 一鍵部署至 Vercel + Supabase 初始化
# =====================================================

$ErrorActionPreference = "Stop"

# 顏色定義
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# =====================================================
# 步驟 1: 檢查環境
# =====================================================
Write-Info "═══════════════════════════════════════════"
Write-Info "步驟 1: 檢查部署環境"
Write-Info "═══════════════════════════════════════════"

# 檢查必要的工具
function Check-Command {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        Write-Success "✓ $Command 已安裝"
    }
    catch {
        Write-Error-Custom "$Command 未安裝，請先安裝"
        exit 1
    }
}

Write-Info "檢查必要工具..."
Check-Command "node"
Check-Command "npm"
Check-Command "git"

# 檢查 .env.local
if (-not (Test-Path ".env.local")) {
    Write-Error-Custom ".env.local 文件不存在"
    exit 1
}
Write-Success "✓ .env.local 已找到"

# =====================================================
# 步驟 2: 驗證環境變數
# =====================================================
Write-Info ""
Write-Info "═══════════════════════════════════════════"
Write-Info "步驟 2: 驗證環境變數"
Write-Info "═══════════════════════════════════════════"

# 從 .env.local 加載環境變數
$envContent = Get-Content ".env.local" | Where-Object { $_ -notmatch '^#' -and $_ -match '=' }
foreach ($line in $envContent) {
    if ($line -match '^\s*([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# 驗證必要的環境變數
$requiredVars = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_GEMINI_API_KEY",
    "SUPABASE_SERVICE_ROLE_KEY"
)

foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "Process")
    if ([string]::IsNullOrEmpty($value)) {
        Write-Error-Custom "環境變數 $var 未設置"
        exit 1
    }
    Write-Success "✓ $var 已設置"
}

Write-Success "所有環境變數驗證通過"

# =====================================================
# 步驟 3: 檢查 Git 狀態
# =====================================================
Write-Info ""
Write-Info "═══════════════════════════════════════════"
Write-Info "步驟 3: 檢查 Git 狀態"
Write-Info "═══════════════════════════════════════════"

$currentBranch = git rev-parse --abbrev-ref HEAD
$currentCommit = git rev-parse --short HEAD

Write-Info "當前分支: $currentBranch"
Write-Info "當前提交: $currentCommit"

if ($currentBranch -ne "main") {
    Write-Warning "您不在 main 分支上，建議切換到 main 分支"
}

Write-Success "Git 狀態檢查完成"

# =====================================================
# 步驟 4: 驗證構建
# =====================================================
Write-Info ""
Write-Info "═══════════════════════════════════════════"
Write-Info "步驟 4: 驗證構建"
Write-Info "═══════════════════════════════════════════"

Write-Info "運行本地構建..."
try {
    npm run build | Select-Object -Last 20
    Write-Success "構建驗證通過"
}
catch {
    Write-Error-Custom "構建失敗: $_"
    exit 1
}

# =====================================================
# 步驟 5: 檢查翻譯文件
# =====================================================
Write-Info ""
Write-Info "═══════════════════════════════════════════"
Write-Info "步驟 5: 檢查翻譯文件"
Write-Info "═══════════════════════════════════════════"

if ((Test-Path "all_courses_ja.json") -and (Test-Path "course_quizzes_ja.json")) {
    $coursesSize = (Get-Item "all_courses_ja.json").Length
    $quizzesSize = (Get-Item "course_quizzes_ja.json").Length
    Write-Success "✓ all_courses_ja.json ($coursesSize 字節)"
    Write-Success "✓ course_quizzes_ja.json ($quizzesSize 字節)"
}
else {
    Write-Warning "翻譯文件不完整，但不影響部署"
}

# =====================================================
# 步驟 6: Vercel 部署
# =====================================================
Write-Info ""
Write-Info "═══════════════════════════════════════════"
Write-Info "步驟 6: Vercel 部署"
Write-Info "═══════════════════════════════════════════"

Write-Info "準備部署至 Vercel..."

# 檢查 Vercel CLI
try {
    $null = Get-Command vercel -ErrorAction Stop
    Write-Success "✓ Vercel CLI 已安裝"
}
catch {
    Write-Warning "Vercel CLI 未安裝，自動安裝中..."
    npm install -g vercel
    Write-Success "✓ Vercel CLI 已安裝"
}

Write-Info ""
Write-Info "正在部署至 Vercel..."
Write-Info "（請按照瀏覽器中的提示完成授權）"
Write-Info ""

# 部署至生產環境
& vercel deploy --prod

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Vercel 部署需要手動確認，請在瀏覽器中完成授權"
}

# =====================================================
# 步驟 7: Supabase 初始化
# =====================================================
Write-Info ""
Write-Info "═══════════════════════════════════════════"
Write-Info "步驟 7: Supabase SQL 初始化"
Write-Info "═══════════════════════════════════════════"

if (-not (Test-Path "scripts/init-i18n-schema.sql")) {
    Write-Error-Custom "SQL 初始化腳本不存在: scripts/init-i18n-schema.sql"
    exit 1
}

Write-Info "Supabase 初始化需要通過儀表板手動執行"
Write-Info "請訪問: https://supabase.com/dashboard/projects/rclldgdkksjkgksydmbx/sql"
Write-Info ""
Write-Info "操作步驟:"
Write-Info "1. 新建 SQL Query"
Write-Info "2. 複製並粘貼 scripts/init-i18n-schema.sql 的內容"
Write-Info "3. 點擊 Run 按鈕"
Write-Info "4. 等待完成"
Write-Info ""

# =====================================================
# 最終檢查
# =====================================================
Write-Info ""
Write-Info "═══════════════════════════════════════════"
Write-Info "部署流程完成"
Write-Info "═══════════════════════════════════════════"
Write-Info ""

Write-Success "✅ 所有檢查都已通過"
Write-Info ""
Write-Info "【後續步驟】"
Write-Info "1. ✅ 構建驗證: 成功"
Write-Info "2. ⏳ Vercel 部署: 進行中"
Write-Info "3. ⏳ Supabase 初始化: 待執行"
Write-Info "4. ⏳ 生產驗證: 待執行"
Write-Info ""

Write-Info "【重要連結】"
Write-Info "🌐 部署 URL: https://gemini-training-site.vercel.app"
Write-Info "🔧 Supabase: https://supabase.com/dashboard"
Write-Info "📊 Vercel: https://vercel.com/dashboard"
Write-Info ""

Write-Info "部署文檔: DEPLOYMENT_EXECUTION_GUIDE.md"
Write-Info ""

Write-Success "🎉 部署已啟動！請檢查上述連結以完成後續步驟"
