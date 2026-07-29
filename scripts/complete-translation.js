#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const courseDataPath = path.join(__dirname, '../all_courses_ja.json');
const courseData = JSON.parse(fs.readFileSync(courseDataPath, 'utf-8'));

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ 未設定 GEMINI_API_KEY 環境變數');
  process.exit(1);
}

async function translateText(text) {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `将以下中文翻譯成日文。只返回翻譯結果，不要有其他說明：\n\n${text}`
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
      console.error('API 錯誤:', error);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('翻譯失敗:', error.message);
    throw error;
  }
}

async function translateCourse(course, courseIndex) {
  console.log(`\n翻譯課程 ${courseIndex + 1}/${courseData.length}: ${course.id} - ${course.title}`);

  const translatedCourse = {
    ...course,
    pages: []
  };

  if (course.pages && course.pages.length > 0) {
    for (let i = 0; i < course.pages.length; i++) {
      const page = course.pages[i];
      console.log(`  頁面 ${i + 1}/${course.pages.length}: ${page.title}`);

      try {
        // 檢查是否已是日文
        const hasChinese = /[一-鿿]/.test(page.title + page.content);

        if (!hasChinese) {
          // 已是日文，保持不變
          translatedCourse.pages.push(page);
          console.log(`    ✓ 已是日文，跳過`);
        } else {
          // 翻譯標題
          const translatedTitle = await translateText(page.title);
          console.log(`    翻譯標題...`);

          // 翻譯內容（分段處理大文本）
          console.log(`    翻譯內容...`);
          const translatedContent = await translateText(page.content);

          translatedCourse.pages.push({
            title: translatedTitle.trim(),
            content: translatedContent.trim()
          });

          // 延遲避免 API 限流
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      } catch (error) {
        console.error(`    ❌ 頁面翻譯失敗: ${page.title}`);
        // 失敗時保留原始內容
        translatedCourse.pages.push(page);
      }
    }
  }

  return translatedCourse;
}

async function main() {
  console.log('🚀 開始完整翻譯所有課程...');
  console.log(`總共 ${courseData.length} 個課程\n`);

  const translatedCourses = [];

  for (let i = 0; i < courseData.length; i++) {
    try {
      const translated = await translateCourse(courseData[i], i);
      translatedCourses.push(translated);
    } catch (error) {
      console.error(`❌ 課程 ${courseData[i].id} 翻譯失敗，保留原始內容`);
      translatedCourses.push(courseData[i]);
    }
  }

  // 保存翻譯結果
  const outputPath = path.join(__dirname, '../all_courses_ja.json');
  fs.writeFileSync(outputPath, JSON.stringify(translatedCourses, null, 2), 'utf-8');

  console.log(`\n✅ 翻譯完成！結果已保存到: ${outputPath}`);
  console.log(`📊 已翻譯課程數: ${translatedCourses.length}/${courseData.length}`);
}

main().catch(console.error);
