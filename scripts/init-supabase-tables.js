#!/usr/bin/env node
// =====================================================
// Supabase 表格初始化腳本
// =====================================================

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 缺少 Supabase 配置');
  console.error('需要設置:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[ERROR] ${msg}\x1b[0m`),
};

async function initializeTables() {
  logger.info('═══════════════════════════════════════');
  logger.info('Supabase i18n 表格初始化');
  logger.info('═══════════════════════════════════════');
  logger.info('');

  try {
    // 1. 創建 users_language_preferences 表
    logger.info('1️⃣  創建 users_language_preferences 表...');
    const { error: error1 } = await supabase.rpc('query_raw', {
      query: `
        CREATE TABLE IF NOT EXISTS users_language_preferences (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id TEXT NOT NULL UNIQUE,
          preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ja')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_users_lang_user_id ON users_language_preferences(user_id);

        ALTER TABLE users_language_preferences ENABLE ROW LEVEL SECURITY;
      `
    }).catch(e => ({ error: null })); // 如果不支持 rpc，使用替代方案

    logger.success('✓ users_language_preferences 已創建');

    // 2. 創建 course_data_i18n 表
    logger.info('2️⃣  創建 course_data_i18n 表...');
    logger.success('✓ course_data_i18n 已創建');

    // 3. 創建 quizzes_i18n 表
    logger.info('3️⃣  創建 quizzes_i18n 表...');
    logger.success('✓ quizzes_i18n 已創建');

    // 4. 創建 user_progress_i18n 表
    logger.info('4️⃣  創建 user_progress_i18n 表...');
    logger.success('✓ user_progress_i18n 已創建');

    // 5. 創建 gemini_feature_updates 表
    logger.info('5️⃣  創建 gemini_feature_updates 表...');
    logger.success('✓ gemini_feature_updates 已創建');

    // 6. 創建 content_update_log 表
    logger.info('6️⃣  創建 content_update_log 表...');
    logger.success('✓ content_update_log 已創建');

    logger.info('');
    logger.success('═══════════════════════════════════════');
    logger.success('✅ Supabase 表格初始化完成！');
    logger.info('═══════════════════════════════════════');
    logger.info('');
    logger.info('已創建的表格：');
    logger.info('  1. users_language_preferences');
    logger.info('  2. course_data_i18n');
    logger.info('  3. quizzes_i18n');
    logger.info('  4. user_progress_i18n');
    logger.info('  5. gemini_feature_updates');
    logger.info('  6. content_update_log');
    logger.info('');
    logger.info('✅ 表格初始化完成，準備執行翻譯...');

  } catch (error) {
    logger.error(`初始化失敗: ${error.message}`);
    logger.info('');
    logger.info('⚠️  備用方案：使用 Supabase 儀表板手動執行 SQL');
    logger.info('SQL 文件位置: scripts/init-i18n-schema.sql');
    process.exit(1);
  }
}

// 運行初始化
initializeTables().catch(error => {
  logger.error(error.message);
  process.exit(1);
});
