-- 使用者語言偏好，跨裝置同步
--
-- 這張表原本是在 Supabase 後台手動建立的，沒有版本控制也沒有明確的 RLS，
-- 因此 API 當初改用 service role key 硬繞過 RLS。本 migration 補上正式定義
-- 與 RLS 政策，讓前端可以帶著使用者自己的 JWT 直接讀寫，資料庫層即可保證
-- 「只能存取自己的那一列」，不再需要任何高權限密鑰。
--
-- 可安全地在既有資料庫上重複執行。

CREATE TABLE IF NOT EXISTS users_language_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language TEXT NOT NULL DEFAULT 'zh',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 只允許目前支援的語言，避免寫入任意字串
ALTER TABLE users_language_preferences
  DROP CONSTRAINT IF EXISTS users_language_preferences_language_check;
ALTER TABLE users_language_preferences
  ADD CONSTRAINT users_language_preferences_language_check
  CHECK (preferred_language IN ('zh', 'ja'));

ALTER TABLE users_language_preferences ENABLE ROW LEVEL SECURITY;

-- RLS：每位使用者只能讀寫自己的那一列
DROP POLICY IF EXISTS "Users can view their own language preference" ON users_language_preferences;
CREATE POLICY "Users can view their own language preference"
  ON users_language_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own language preference" ON users_language_preferences;
CREATE POLICY "Users can insert their own language preference"
  ON users_language_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own language preference" ON users_language_preferences;
CREATE POLICY "Users can update their own language preference"
  ON users_language_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at 自動維護
CREATE OR REPLACE FUNCTION update_language_preference_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_language_preferences_timestamp ON users_language_preferences;
CREATE TRIGGER update_users_language_preferences_timestamp
  BEFORE UPDATE ON users_language_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_language_preference_timestamp();
