#!/bin/bash

# =====================================================
# Gemini 課程網站部署自動化腳本
# 用途: 一鍵部署至 Vercel + Supabase 初始化
# =====================================================

set -e  # 如有任何命令失敗，停止執行

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 工具函數
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# =====================================================
# 步驟 1: 檢查環境
# =====================================================
log_info "═══════════════════════════════════════════"
log_info "步驟 1: 檢查部署環境"
log_info "═══════════════════════════════════════════"

# 檢查必要的工具
check_command() {
  if ! command -v $1 &> /dev/null; then
    log_error "$1 未安裝，請先安裝"
    exit 1
  fi
  log_success "✓ $1 已安裝"
}

log_info "檢查必要工具..."
check_command "node"
check_command "npm"
check_command "git"

# 檢查 .env.local
if [ ! -f ".env.local" ]; then
  log_error ".env.local 文件不存在"
  exit 1
fi
log_success "✓ .env.local 已找到"

# =====================================================
# 步驟 2: 驗證環境變數
# =====================================================
log_info ""
log_info "═══════════════════════════════════════════"
log_info "步驟 2: 驗證環境變數"
log_info "═══════════════════════════════════════════"

# 從 .env.local 加載環境變數
export $(cat .env.local | grep -v '^#' | xargs)

# 驗證必要的環境變數
REQUIRED_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "NEXT_PUBLIC_GEMINI_API_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    log_error "環境變數 $var 未設置"
    exit 1
  fi
  log_success "✓ $var 已設置"
done

log_success "所有環境變數驗證通過"

# =====================================================
# 步驟 3: 檢查 Git 狀態
# =====================================================
log_info ""
log_info "═══════════════════════════════════════════"
log_info "步驟 3: 檢查 Git 狀態"
log_info "═══════════════════════════════════════════"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_COMMIT=$(git rev-parse --short HEAD)

log_info "當前分支: $CURRENT_BRANCH"
log_info "當前提交: $CURRENT_COMMIT"

if [ "$CURRENT_BRANCH" != "main" ]; then
  log_warning "您不在 main 分支上，建議切換到 main 分支"
fi

log_success "Git 狀態檢查完成"

# =====================================================
# 步驟 4: 驗證構建
# =====================================================
log_info ""
log_info "═══════════════════════════════════════════"
log_info "步驟 4: 驗證構建"
log_info "═══════════════════════════════════════════"

log_info "運行本地構建..."
npm run build 2>&1 | tail -20

if [ ${PIPESTATUS[0]} -ne 0 ]; then
  log_error "構建失敗"
  exit 1
fi

log_success "構建驗證通過"

# =====================================================
# 步驟 5: 檢查翻譯文件
# =====================================================
log_info ""
log_info "═══════════════════════════════════════════"
log_info "步驟 5: 檢查翻譯文件"
log_info "═══════════════════════════════════════════"

if [ -f "all_courses_ja.json" ] && [ -f "course_quizzes_ja.json" ]; then
  COURSES_SIZE=$(wc -c < all_courses_ja.json)
  QUIZZES_SIZE=$(wc -c < course_quizzes_ja.json)
  log_success "✓ all_courses_ja.json ($COURSES_SIZE 字節)"
  log_success "✓ course_quizzes_ja.json ($QUIZZES_SIZE 字節)"
else
  log_warning "翻譯文件不完整，但不影響部署"
fi

# =====================================================
# 步驟 6: Vercel 部署
# =====================================================
log_info ""
log_info "═══════════════════════════════════════════"
log_info "步驟 6: Vercel 部署"
log_info "═══════════════════════════════════════════"

log_info "準備部署至 Vercel..."

# 檢查 Vercel CLI
if ! command -v vercel &> /dev/null; then
  log_warning "Vercel CLI 未安裝，自動安裝中..."
  npm install -g vercel
fi

log_success "✓ Vercel CLI 已準備"

log_info ""
log_info "正在部署至 Vercel..."
log_info "（這將在您的瀏覽器中打開 Vercel 界面）"
log_info ""

# 部署至生產環境
vercel deploy --prod --env NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
                       --env NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
                       --env NEXT_PUBLIC_GEMINI_API_KEY="$NEXT_PUBLIC_GEMINI_API_KEY" \
                       --env SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

if [ $? -ne 0 ]; then
  log_warning "Vercel 部署需要手動確認，請在瀏覽器中完成授權"
fi

# =====================================================
# 步驟 7: Supabase 初始化
# =====================================================
log_info ""
log_info "═══════════════════════════════════════════"
log_info "步驟 7: Supabase SQL 初始化"
log_info "═══════════════════════════════════════════"

if [ ! -f "scripts/init-i18n-schema.sql" ]; then
  log_error "SQL 初始化腳本不存在: scripts/init-i18n-schema.sql"
  exit 1
fi

log_info "Supabase 初始化需要通過儀表板手動執行"
log_info "請訪問: https://supabase.com/dashboard/projects/rclldgdkksjkgksydmbx/sql"
log_info ""
log_info "操作步驟:"
log_info "1. 新建 SQL Query"
log_info "2. 複製並粘貼 scripts/init-i18n-schema.sql 的內容"
log_info "3. 點擊 Run 按鈕"
log_info "4. 等待完成"
log_info ""

# =====================================================
# 最終檢查
# =====================================================
log_info ""
log_info "═══════════════════════════════════════════"
log_info "部署流程完成"
log_info "═══════════════════════════════════════════"
log_info ""

log_success "✅ 所有檢查都已通過"
log_info ""
log_info "【後續步驟】"
log_info "1. ✅ 構建驗證: 成功"
log_info "2. ⏳ Vercel 部署: 進行中"
log_info "3. ⏳ Supabase 初始化: 待執行"
log_info "4. ⏳ 生產驗證: 待執行"
log_info ""

log_info "【重要連結】"
log_info "🌐 部署 URL: https://gemini-training-site.vercel.app"
log_info "🔧 Supabase: https://supabase.com/dashboard"
log_info "📊 Vercel: https://vercel.com/dashboard"
log_info ""

log_info "部署文檔: DEPLOYMENT_EXECUTION_GUIDE.md"
log_info ""

log_success "🎉 部署已啟動！請檢查上述連結以完成後續步驟"

