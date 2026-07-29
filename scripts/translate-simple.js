#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 讀取中文課程（原始數據）
const courseDataPath = path.join(__dirname, '../lib/course-data.ts');
const courseDataContent = fs.readFileSync(courseDataPath, 'utf-8');

// 解析 courseData
const startIdx = courseDataContent.indexOf('export const courseData: Course[] = [');
const courseDataStr = courseDataContent.substring(startIdx + 'export const courseData: Course[] = '.length);
const courseData = eval('(' + courseDataStr.substring(0, courseDataStr.lastIndexOf(']')) + ']' + ')');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ 未設定 GEMINI_API_KEY 環境變數');
  process.exit(1);
}

async function translateText(text) {
  if (!text || text.trim() === '') return text;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' + API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `將以下中文翻譯成日文。只返回翻譯結果，不要有其他說明：\n\n${text}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4000
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`❌ API 錯誤 (${response.status}):`, error.error?.message);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error(`翻譯失敗: ${error.message}`);
    throw error;
  }
}

async function main() {
  console.log('🚀 開始翻譯中文課程為日文...\n');
  console.log(`📚 總共 ${courseData.length} 個課程\n`);

  const japaneseCoursesData = [];

  for (let i = 0; i < courseData.length; i++) {
    const course = courseData[i];
    console.log(`\n📖 翻譯課程 ${i + 1}/${courseData.length}: ${course.id} - ${course.title}`);

    try {
      // 翻譯課程標題
      const translatedTitle = await translateText(course.title);
      console.log(`   ✓ 標題: ${translatedTitle}`);

      // 翻譯課程描述
      const translatedDescription = await translateText(course.description);
      console.log(`   ✓ 描述`);

      // 翻譯所有頁面
      const translatedPages = [];
      for (let j = 0; j < course.pages.length; j++) {
        const page = course.pages[j];

        const translatedPageTitle = await translateText(page.title);
        const translatedPageContent = await translateText(page.content);

        translatedPages.push({
          title: translatedPageTitle,
          content: translatedPageContent
        });

        console.log(`   ✓ 頁面 ${j + 1}/${course.pages.length}`);

        // 延遲避免 API 限流
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      japaneseCoursesData.push({
        id: course.id,
        week: course.week,
        module: course.module,
        title: translatedTitle,
        description: translatedDescription,
        pages: translatedPages,
        duration_minutes: course.duration_minutes
      });

      console.log(`   ✅ 課程完成`);
    } catch (error) {
      console.error(`   ❌ 課程失敗: ${course.id}`);
      throw error;
    }
  }

  // 保存翻譯結果
  const outputPath = path.join(__dirname, '../all_courses_ja.json');
  fs.writeFileSync(outputPath, JSON.stringify(japaneseCoursesData, null, 2), 'utf-8');

  console.log(`\n✅ 翻譯完成！`);
  console.log(`📁 結果已保存到: ${outputPath}`);
  console.log(`📊 已翻譯課程數: ${japaneseCoursesData.length}/${courseData.length}`);
}

main().catch(err => {
  console.error('\n❌ 翻譯失敗:', err.message);
  process.exit(1);
});
