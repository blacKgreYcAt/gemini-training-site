-- =====================================================
-- Gemini 課程網站 - 多語言 (i18n) 初始化腳本 (中文版本)
-- 建立日期: 2026-07-28
-- 用途: 支持中日雙語課程與題庫
-- =====================================================

BEGIN;

-- =====================================================
-- 1. 用戶語言偏好表
-- =====================================================
CREATE TABLE IF NOT EXISTS users_language_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language VARCHAR(10) NOT NULL CHECK (preferred_language IN ('zh', 'ja')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_language ON users_language_preferences(user_id);

-- 啟用 RLS
ALTER TABLE users_language_preferences ENABLE ROW LEVEL SECURITY;

-- RLS 政策
CREATE POLICY users_own_language_pref ON users_language_preferences
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 2. 多語言課程內容表
-- =====================================================
CREATE TABLE IF NOT EXISTS course_data_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL CHECK (language IN ('zh', 'ja')),
  week INT NOT NULL,
  module INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB,
  duration_minutes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course_id, language)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_course_language ON course_data_i18n(course_id, language);
CREATE INDEX IF NOT EXISTS idx_course_week ON course_data_i18n(week);

-- =====================================================
-- 3. 多語言題庫表
-- =====================================================
CREATE TABLE IF NOT EXISTS quizzes_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id VARCHAR(50) NOT NULL,
  course_id VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL CHECK (language IN ('zh', 'ja')),
  question_type VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(quiz_id, language)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_quiz_language ON quizzes_i18n(course_id, language);

-- =====================================================
-- 4. 多語言進度追蹤表
-- =====================================================
CREATE TABLE IF NOT EXISTS user_progress_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL CHECK (language IN ('zh', 'ja')),
  current_page INT DEFAULT 0,
  quiz_score DECIMAL(5, 2),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id, language)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_progress ON user_progress_i18n(user_id, language);

-- 啟用 RLS
ALTER TABLE user_progress_i18n ENABLE ROW LEVEL SECURITY;

-- RLS 政策
CREATE POLICY users_own_progress ON user_progress_i18n
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 5. 翻譯更新日誌表
-- =====================================================
CREATE TABLE IF NOT EXISTS content_update_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL,
  content_id VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL,
  action VARCHAR(50) NOT NULL,
  translator VARCHAR(255),
  translation_quality_score DECIMAL(3, 2),
  source_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_update_log_language ON content_update_log(language, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_update_log_content ON content_update_log(content_type, content_id);

-- =====================================================
-- 6. 自動更新表（用於跟蹤月度更新）
-- =====================================================
CREATE TABLE IF NOT EXISTS gemini_feature_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name VARCHAR(255) NOT NULL,
  feature_version VARCHAR(50) NOT NULL,
  feature_description TEXT,
  released_at TIMESTAMP NOT NULL,
  added_to_course_at TIMESTAMP,
  update_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_feature_status ON gemini_feature_updates(update_status);
CREATE INDEX IF NOT EXISTS idx_feature_version ON gemini_feature_updates(feature_version);

-- =====================================================
-- 7. 檢查約束（觸發器）
-- =====================================================

-- 自動更新 updated_at 時間戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 為課程表創建觸發器
CREATE TRIGGER update_course_data_i18n_updated_at
  BEFORE UPDATE ON course_data_i18n
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 為用戶偏好表創建觸發器
CREATE TRIGGER update_user_language_pref_updated_at
  BEFORE UPDATE ON users_language_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 為進度表創建觸發器
CREATE TRIGGER update_user_progress_i18n_updated_at
  BEFORE UPDATE ON user_progress_i18n
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- =====================================================
-- 驗證腳本
-- =====================================================
-- 運行以下命令以驗證表格已正確創建：
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name LIKE '%i18n%';
-- =====================================================
