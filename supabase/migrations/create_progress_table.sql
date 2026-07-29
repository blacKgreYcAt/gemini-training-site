-- Create user_progress_full table for complete progress tracking
-- This table stores comprehensive user progress including cards, slides, quiz, and statistics

CREATE TABLE IF NOT EXISTS user_progress_full (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Progress data stored as JSONB for flexibility
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
  }'::jsonb,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_full_user_id ON user_progress_full(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_progress_full ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their own progress
CREATE POLICY "Users can view their own progress"
  ON user_progress_full FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: users can update their own progress
CREATE POLICY "Users can update their own progress"
  ON user_progress_full FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: users can insert their own progress
CREATE POLICY "Users can insert their own progress"
  ON user_progress_full FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF NOT EXISTS update_user_progress_full_timestamp ON user_progress_full;
CREATE TRIGGER update_user_progress_full_timestamp
  BEFORE UPDATE ON user_progress_full
  FOR EACH ROW
  EXECUTE FUNCTION update_progress_timestamp();

-- Verify the table creation
SELECT COUNT(*) as table_exists FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'user_progress_full';
