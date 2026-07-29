#!/usr/bin/env node

/**
 * 使用 Gemini API 翻譯課程內容為日文
 * 執行: node scripts/translate-with-gemini.mjs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ 錯誤：未設置 NEXT_PUBLIC_GEMINI_API_KEY');
  process.exit(1);
}

const client = new GoogleGenerativeAI(apiKey);
const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

// 導入課程數據
const courseDataPath = path.join(__dirname, '../lib/course-data.ts');
const courseDataContent = fs.readFileSync(courseDataPath, 'utf-8');

// 簡單的 TypeScript 解析 - 提取 courseData 數組
const match = courseDataContent.match(/export const courseData: Course\[\] = \[([\s\S]*?)\];/);
if (!match) {
  console.error('❌ 無法解析 courseData');
  process.exit(1);
}

// 轉換為 JSON 對象（簡單評估）
const courseDataStr = `[${match[1]}]`;

let courses;
try {
  // 使用正則表達式清理 TypeScript 特性
  const cleanedStr = courseDataStr
    .replace(/,\s*}/g, '}')  // 移除尾部逗號
    .replace(/'/g, '"')       // 單引號改雙引號
    .replace(/\n\s+}/g, '\n}') // 清理格式

  courses = eval('(' + cleanedStr + ')');
} catch (error) {
  console.error('❌ 無法評估課程數據:', error.message);
  process.exit(1);
}

console.log(`📚 讀取了 ${courses.length} 門課程`);

async function translateText(text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const message = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: `將以下繁體中文翻譯為日文，只返回翻譯結果，不包含任何其他文字或解釋：\n\n${text}`
          }]
        }]
      });

      const translation = message.response.text().trim();
      if (translation.length > 0) {
        return translation;
      }
    } catch (error) {
      if (i < retries - 1) {
        console.log(`  ⚠️ 重試 ${i + 1}/${retries - 1}...`);
        await new Promise(r => setTimeout(r, 2000));
      } else {
        throw error;
      }
    }
  }
  return text; // 失敗時返回原文
}

async function translateCourses() {
  const translatedCourses = [];

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    console.log(`\n🔄 [${i + 1}/${courses.length}] 翻譯: ${course.title}`);

    try {
      // 翻譯標題和描述
      const title = await translateText(course.title);
      console.log(`   ✅ 標題: ${title}`);

      const description = await translateText(course.description);
      console.log(`   ✅ 描述: ${description.substring(0, 50)}...`);

      // 翻譯頁面內容
      const pages = [];
      if (course.pages && course.pages.length > 0) {
        console.log(`   📖 翻譯 ${course.pages.length} 個頁面...`);

        for (let j = 0; j < course.pages.length; j++) {
          const page = course.pages[j];
          const pageTitle = await translateText(page.title);
          const pageContent = await translateText(page.content);
          pages.push({ title: pageTitle, content: pageContent });

          if ((j + 1) % 5 === 0) {
            console.log(`      ${j + 1}/${course.pages.length} 完成`);
          }
        }
      }

      translatedCourses.push({
        id: course.id,
        week: course.week,
        module: course.module,
        title,
        description,
        duration_minutes: course.duration_minutes,
        pages
      });

      // 速率限制
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error(`   ❌ 失敗: ${error.message}`);
    }
  }

  // 保存結果
  const outputPath = path.join(__dirname, '../all_courses_ja.json');
  fs.writeFileSync(outputPath, JSON.stringify(translatedCourses, null, 2), 'utf-8');

  console.log(`\n✅ 完成！已保存 ${translatedCourses.length} 門課程到 ${outputPath}`);
}

// 運行翻譯
console.log('🚀 開始翻譯課程內容為日文...\n');
translateCourses().catch(error => {
  console.error('❌ 致命錯誤:', error);
  process.exit(1);
});
