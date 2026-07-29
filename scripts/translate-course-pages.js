#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 讀取已有日文課程（有頁面內容但頁面是中文）
const courseDataPath = path.join(__dirname, '../all_courses_ja.json');
const courseData = JSON.parse(fs.readFileSync(courseDataPath, 'utf-8'));

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ 錯誤: 未設定 GEMINI_API_KEY 環境變數');
  process.exit(1);
}

async function translateText(text) {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' + API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `將以下中文翻譯成日文。只返回翻譯結果，不要有其他說明:\n\n${text}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000
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

async function translateCourse(course) {
  console.log(`翻譯課程: ${course.id} - ${course.title}`);

  const translatedCourse = {
    ...course,
    pages: []
  };

  if (course.pages && course.pages.length > 0) {
    for (let i = 0; i < course.pages.length; i++) {
      const page = course.pages[i];
      console.log(`  翻譯頁面 ${i+1}/${course.pages.length}: ${page.title.substring(0, 30)}...`);
      try {
        // 檢查頁面內容是否已經是日文（含日文字符）
        const isJapanese = /[぀-ゟ゠-ヿ]/.test(page.content);

        if (isJapanese) {
          // 已經是日文，保持不變
          translatedCourse.pages.push(page);
        } else {
          // 翻譯中文內容
          const translatedContent = await translateText(page.content);
          translatedCourse.pages.push({
            title: page.title,  // 保持原標題（已有日文）
            content: translatedContent
          });
          // 延遲以避免超過 API 速率限制
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`  頁面翻譯失敗: ${page.title}`);
        // 翻譯失敗時，保留原始內容
        translatedCourse.pages.push(page);
      }
    }
  }

  return translatedCourse;
}

async function main() {
  console.log('開始翻譯所有課程頁面為日文...');
  console.log(`總共 ${courseData.length} 個課程`);

  const translatedCourses = [];

  for (const course of courseData) {
    try {
      const translated = await translateCourse(course);
      translatedCourses.push(translated);
    } catch (error) {
      console.error(`課程 ${course.id} 翻譯失敗，跳過`);
      translatedCourses.push(course);
    }
  }

  // 保存翻譯結果
  const outputPath = path.join(__dirname, '../all_courses_ja.json');
  fs.writeFileSync(outputPath, JSON.stringify(translatedCourses, null, 2), 'utf-8');
  console.log(`\n✅ 翻譯完成！結果已保存到: ${outputPath}`);
}

main().catch(console.error);
