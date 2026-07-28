#!/usr/bin/env node
// =====================================================
// Gemini 課程翻譯腳本 - 日本語版本
// 將英文課程和題庫翻譯為標準日本語
// =====================================================

const fs = require('fs');
const path = require('path');
const { default: fetch } = require('node-fetch');

// 配置
const CONFIG = {
  GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
  BATCH_SIZE: 5,
  DELAY_MS: 2000,
};

// 系統提示詞 - 翻譯到標準日本語
const SYSTEM_PROMPT = `You are a professional Japanese technical translator specializing in AI/ML education.

REQUIREMENTS:
1. Translate to standard Japanese (常体 - non-honorific, educational tone)
2. Use official Gemini terminology from Japanese documentation
3. Keep technical terms in English where standard in Japan (e.g., "Gemini 3.6 Flash", "Token")
4. Maintain technical accuracy and clarity
5. Target audience: Japanese professionals (high school education level or above)
6. NO furigana (仮名注音) - target audience doesn't need it
7. Output MUST be valid JSON with UTF-8 encoding

OFFICIAL TERMINOLOGY MAPPING:
- Gemini 3.6 Flash → Gemini 3.6 Flash
- Managed Agents → Managed Agents（Google が管理するセキュアな Linux サンドボックス環境）
- Computer Use Tool → Computer Use Tool（デスクトップ、モバイル、ブラウザ環境にわたるコンピュータ操作の自動化）
- Deep Research → Deep Research（複雑なトピックの自動調査機能）
- Gemini Live → Gemini Live（リアルタイムで会話するスマートフォン向け音声機能）
- Canvas → Canvas（ドキュメントとコードの作成・編集スペース）
- Context Caching → Context Caching（トークンコストを 90% 削減）
- Veo → Veo（ビデオ生成機能）
- Imagen 3 → Imagen 3（画像生成機能）
- Token → Token（テキスト処理の基本単位）
- API Key → API キー
- Sandbox → サンドボックス
- Latency → レイテンシー
- Knowledge Cutoff → 知識カットオフ日`;

// 日誌記錄
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[ERROR] ${msg}\x1b[0m`),
  warn: (msg) => console.log(`\x1b[33m[WARN] ${msg}\x1b[0m`),
};

// 延遲函數
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 調用 Gemini API 進行翻譯
async function translateWithGemini(content, contentType = 'course') {
  if (!CONFIG.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  const prompt = `Translate the following ${contentType} content to Japanese:

${JSON.stringify(content, null, 2)}

Provide the response in the SAME JSON structure with translated fields.
Only respond with valid JSON, no markdown formatting.
Ensure all text fields are translated to standard Japanese.`;

  try {
    const response = await fetch(CONFIG.GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': CONFIG.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        systemInstruction: {
          parts: [{
            text: SYSTEM_PROMPT
          }]
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const translatedText = data.candidates[0].content.parts[0].text;

    // 清理 Markdown 格式（如果有）
    let cleanedText = translatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }

    return JSON.parse(cleanedText);
  } catch (error) {
    logger.error(`Translation failed: ${error.message}`);
    throw error;
  }
}

// 翻譯課程內容
async function translateCourses() {
  logger.info('開始翻譯課程內容...');

  try {
    const coursesPath = path.join(__dirname, '../all_courses_corrected.json');
    if (!fs.existsSync(coursesPath)) {
      throw new Error(`Courses file not found: ${coursesPath}`);
    }

    const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));
    const translatedCourses = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      logger.info(`翻譯課程 ${i + 1}/${courses.length}: ${course.id} - ${course.title}`);

      try {
        // 翻譯課程結構（保留 pages 內容，另外翻譯）
        const courseForTranslation = {
          id: course.id,
          week: course.week,
          module: course.module,
          title: course.title,
          description: course.description,
          duration_minutes: course.duration_minutes,
        };

        const translated = await translateWithGemini(courseForTranslation, 'course');

        // 翻譯每個頁面
        const translatedPages = [];
        if (course.pages && Array.isArray(course.pages)) {
          for (const page of course.pages) {
            const pageForTranslation = {
              title: page.title,
              content: page.content,
            };
            const translatedPage = await translateWithGemini(pageForTranslation, 'page');
            translatedPages.push(translatedPage);
            await delay(CONFIG.DELAY_MS); // 避免 API 限制
          }
        }

        translatedCourses.push({
          ...translated,
          pages: translatedPages,
        });

        logger.success(`✓ 已翻譯: ${course.id}`);
        successCount++;
      } catch (error) {
        logger.error(`✗ 翻譯失敗: ${course.id} - ${error.message}`);
        failureCount++;
      }

      // 批量延遲
      if ((i + 1) % CONFIG.BATCH_SIZE === 0) {
        logger.info(`已處理 ${i + 1} 門課程，等待...`);
        await delay(CONFIG.DELAY_MS * 2);
      }
    }

    // 保存翻譯結果
    const outputPath = path.join(__dirname, '../all_courses_ja.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedCourses, null, 2), 'utf-8');

    logger.success(`課程翻譯完成！成功: ${successCount}, 失敗: ${failureCount}`);
    logger.info(`結果已保存到: ${outputPath}`);

    return { successCount, failureCount, courses: translatedCourses };
  } catch (error) {
    logger.error(`課程翻譯失敗: ${error.message}`);
    throw error;
  }
}

// 翻譯題庫
async function translateQuizzes() {
  logger.info('開始翻譯題庫...');

  try {
    const quizzesPath = path.join(__dirname, '../course_quizzes.json');
    if (!fs.existsSync(quizzesPath)) {
      throw new Error(`Quizzes file not found: ${quizzesPath}`);
    }

    const quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));
    const translatedQuizzes = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < quizzes.length; i++) {
      const quiz = quizzes[i];
      logger.info(`翻譯題庫 ${i + 1}/${quizzes.length}: ${quiz.course_id}`);

      try {
        const quizForTranslation = {
          course_id: quiz.course_id,
          course_title: quiz.course_title,
          questions: quiz.questions.map(q => ({
            id: q.id,
            type: q.type,
            question: q.question,
            options: q.options || [],
            correct_answer: q.correct_answer,
            explanation: q.explanation,
          })),
        };

        const translated = await translateWithGemini(quizForTranslation, 'quiz');
        translatedQuizzes.push(translated);

        logger.success(`✓ 已翻譯: ${quiz.course_id}`);
        successCount++;
      } catch (error) {
        logger.error(`✗ 翻譯失敗: ${quiz.course_id} - ${error.message}`);
        failureCount++;
      }

      // 延遲
      await delay(CONFIG.DELAY_MS);
    }

    // 保存翻譯結果
    const outputPath = path.join(__dirname, '../course_quizzes_ja.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedQuizzes, null, 2), 'utf-8');

    logger.success(`題庫翻譯完成！成功: ${successCount}, 失敗: ${failureCount}`);
    logger.info(`結果已保存到: ${outputPath}`);

    return { successCount, failureCount, quizzes: translatedQuizzes };
  } catch (error) {
    logger.error(`題庫翻譯失敗: ${error.message}`);
    throw error;
  }
}

// 主函數
async function main() {
  logger.info('═══════════════════════════════════════');
  logger.info('Gemini 課程翻譯 - 日本語版本');
  logger.info('═══════════════════════════════════════');
  logger.info('');

  try {
    // 檢查 API Key
    if (!CONFIG.GEMINI_API_KEY) {
      throw new Error('NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set');
    }
    logger.success('API Key 已確認');

    // 翻譯課程
    logger.info('');
    const coursesResult = await translateCourses();

    // 翻譯題庫
    logger.info('');
    const quizzesResult = await translateQuizzes();

    // 最終報告
    logger.info('');
    logger.info('═══════════════════════════════════════');
    logger.success('翻譯工作完成！');
    logger.info('═══════════════════════════════════════');
    logger.info(`課程: ${coursesResult.successCount} 成功, ${coursesResult.failureCount} 失敗`);
    logger.info(`題庫: ${quizzesResult.successCount} 成功, ${quizzesResult.failureCount} 失敗`);
    logger.info('');
    logger.info('生成檔案:');
    logger.info('  - all_courses_ja.json (日文課程)');
    logger.info('  - course_quizzes_ja.json (日文題庫)');
    logger.info('');
    logger.info('下一步: 將檔案導入 Supabase');

  } catch (error) {
    logger.error(`翻譯過程失敗: ${error.message}`);
    process.exit(1);
  }
}

// 運行
if (require.main === module) {
  main().catch(error => {
    logger.error(error.message);
    process.exit(1);
  });
}

module.exports = { translateWithGemini, translateCourses, translateQuizzes };
