#!/usr/bin/env node

/**
 * 使用 Gemini API 將課程內容翻譯為日文
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 獲取 API key
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ 錯誤：未設置 NEXT_PUBLIC_GEMINI_API_KEY 環境變數');
  process.exit(1);
}

const client = new GoogleGenerativeAI(apiKey);
const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

// 讀取課程數據
const courseDataPath = path.join(__dirname, '../lib/course-data.ts');
let courseDataContent = fs.readFileSync(courseDataPath, 'utf-8');

// 提取 courseData 對象（簡單解析）
const courseDataMatch = courseDataContent.match(/export const courseData: Course\[\] = \[([\s\S]*?)\];/);
if (!courseDataMatch) {
  console.error('❌ 無法解析 courseData');
  process.exit(1);
}

// 執行翻譯
async function translateCourses() {
  try {
    const coursesJson = require('../lib/course-data.ts');
    const courses = coursesJson.courseData || [];

    console.log(`🚀 開始翻譯 ${courses.length} 門課程內容...`);

    const translatedCourses = [];

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      console.log(`⏳ 翻譯第 ${i + 1}/${courses.length} 門課程: ${course.title}`);

      // 翻譯標題和描述
      const titleTranslation = await translateText(course.title);
      const descriptionTranslation = await translateText(course.description);

      // 翻譯所有頁面內容
      const translatedPages = [];
      if (course.pages && course.pages.length > 0) {
        for (const page of course.pages) {
          const pageTitle = await translateText(page.title);
          const pageContent = await translateText(page.content);
          translatedPages.push({
            title: pageTitle,
            content: pageContent
          });
        }
      }

      translatedCourses.push({
        id: course.id,
        week: course.week,
        module: course.module,
        title: titleTranslation,
        description: descriptionTranslation,
        duration_minutes: course.duration_minutes,
        pages: translatedPages
      });

      // 避免 API 限流
      await delay(1000);
    }

    // 保存翻譯結果
    const outputPath = path.join(__dirname, '../all_courses_ja.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedCourses, null, 2), 'utf-8');

    console.log(`✅ 翻譯完成！已保存到 ${outputPath}`);
  } catch (error) {
    console.error('❌ 翻譯失敗:', error.message);
    process.exit(1);
  }
}

async function translateText(text) {
  try {
    const message = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `將以下繁體中文翻譯為日文，只返回翻譯結果，不包含其他文字：\n\n${text}`
        }]
      }]
    });

    const translatedText = message.response.text().trim();
    return translatedText;
  } catch (error) {
    console.error(`翻譯失敗 (${text.substring(0, 50)}...):`, error.message);
    throw error;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 運行翻譯
translateCourses().catch(error => {
  console.error('❌ 致命錯誤:', error);
  process.exit(1);
});
