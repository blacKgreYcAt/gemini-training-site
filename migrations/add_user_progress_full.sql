-- 創建用戶完整進度表
CREATE TABLE IF NOT EXISTS user_progress_full (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_data JSONB NOT NULL DEFAULT '{
    "slidesProgress": {},
    "cardsProgress": {},
    "quizProgress": {},
    "statistics": {
      "slidesCompletionRate": 0,
      "cardsCompletionRate": 0,
      "quizCompletionRate": 0,
      "quizAccuracy": 0,
      "totalLearningHours": 0,
      "certificateEarned": false
    }
  }'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_user_progress_full_user_id ON user_progress_full(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_full_updated_at ON user_progress_full(updated_at);

-- 創建自動更新 updated_at 的觸發器
CREATE OR REPLACE FUNCTION update_user_progress_full_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_progress_full_timestamp ON user_progress_full;
CREATE TRIGGER update_user_progress_full_timestamp
BEFORE UPDATE ON user_progress_full
FOR EACH ROW
EXECUTE FUNCTION update_user_progress_full_timestamp();

-- 為認証用戶啟用 RLS（行級安全）
ALTER TABLE user_progress_full ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 政策：用戶只能讀取自己的數據
DROP POLICY IF EXISTS "users_can_read_own_progress" ON user_progress_full;
CREATE POLICY "users_can_read_own_progress"
  ON user_progress_full
  FOR SELECT
  USING (auth.uid() = user_id);

-- 創建 RLS 政策：用戶只能更新自己的數據
DROP POLICY IF EXISTS "users_can_update_own_progress" ON user_progress_full;
CREATE POLICY "users_can_update_own_progress"
  ON user_progress_full
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 創建 RLS 政策：用戶只能插入自己的數據
DROP POLICY IF EXISTS "users_can_insert_own_progress" ON user_progress_full;
CREATE POLICY "users_can_insert_own_progress"
  ON user_progress_full
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
