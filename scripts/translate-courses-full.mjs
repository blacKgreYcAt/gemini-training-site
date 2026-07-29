#!/usr/bin/env node

/**
 * 使用 Gemini API REST 完整翻譯課程內容為日文
 * 執行: node scripts/translate-courses-full.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// 翻譯映射（手動映射以加快速度 - 每個課程標題和描述）
const courseTranslations = {
  "0-1": {
    title: "Geminiの登録とマルチデバイス設定",
    description: "受講前準備：アカウント設定とマルチプラットフォームログインガイド"
  },
  "0-2": {
    title: "Gemini 3.1 Pro と Ultra のサブスクリプションプラン比較",
    description: "異なるバージョンにおける機能の違いと最適なユースケースを理解する"
  },
  "1-1": {
    title: "コースキックオフとAIトレンド",
    description: "2026年のAIトレンドとGeminiの核となる価値提案"
  },
  "1-2": {
    title: "Gemini 3.6 Flash：効率性の新たな王者",
    description: "Gemini 3.6 Flashの特徴、Token効率、および実用的なアプリケーション"
  },
  "2-1": {
    title: "Managed Agents：自律的なタスク実行",
    description: "Google が管理するセキュアなサンドボックス環境における自律型エージェントの構築"
  },
  "2-2": {
    title: "Computer Use Tool：デスクトップ自動化",
    description: "AIによるデスクトップ、モバイル、ブラウザ操作の自動化"
  },
  "3-1": {
    title: "Deep Research、Veo、Imagen 3：高度なコンテンツ生成",
    description: "複雑なトピックに対する Deep Research、およびビデオと画像の生成について学ぶ"
  },
  "3-2": {
    title: "Canvas、Context Caching、およびコスト最適化",
    description: "本番環境における高度な機能とコスト最適化戦略"
  }
};

// 頁面標題翻譯映射
const pageTitleTranslations = {
  "課程單元：Gemini 註冊與跨裝置上手指南": "コース単元：Gemini登録とマルチデバイスセットアップガイド",
  "課程前置作業：帳號準備與多平台登入指南": "事前準備：アカウント設定とマルチプラットフォームログインガイド",
  "電腦網頁版：深度辦公與創作首選": "コンピュータウェブ版：深層な業務と創作に最適",
  "行動裝置：隨身攜帶的 AI 助理": "モバイルデバイス：いつでも一緒のAIアシスタント",
  "跨平台共通功能概覽": "クロスプラットフォーム共有機能の概要",
  "常見問題 (FAQ) - Part 1": "よくある質問 (FAQ) - パート1",
  "準備開始學習": "準備完了"
};

async function translateText(text, retries = 3) {
  if (!text || text.trim() === '') return '';

  // 限制文本長度
  let textToTranslate = text;
  if (textToTranslate.length > 3000) {
    textToTranslate = textToTranslate.substring(0, 3000) + "...";
  }

  for (let i = 0; i < retries; i++) {
    try {
      const prompt = `將以下繁體中文翻譯為日文，只返回翻譯結果，不包含任何其他文字或解釋：\n\n${textToTranslate}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const translation = data.candidates[0].content?.parts[0]?.text;
        if (translation) {
          return translation.trim();
        }
      }

      console.warn('⚠️ 無法提取翻譯結果');
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`  ⚠️ 重試 ${i + 1}/${retries - 1}... (${error.message})`);
        await new Promise(r => setTimeout(r, 2000));
      } else {
        console.error(`  ❌ 翻譯失敗: ${error.message}`);
      }
    }
  }

  // 失敗時嘗試使用靜態映射或返回原文
  return pageTitleTranslations[text] || text;
}

// 讀取課程文件
console.log('🚀 開始翻譯課程內容為日文...\n');

const courseDataPath = path.join(__dirname, '../lib/course-data.ts');
const courseDataContent = fs.readFileSync(courseDataPath, 'utf-8');

// 提取 courseData
const match = courseDataContent.match(/export const courseData: Course\[\] = \[([\s\S]*?)\];/);
if (!match) {
  console.error('❌ 無法解析 courseData');
  process.exit(1);
}

console.log('📖 解析課程數據...');

// 嘗試評估課程數據（簡化版）
let courses;
try {
  const courseDataStr = `[${match[1]}]`;
  const cleanedStr = courseDataStr
    .replace(/,\s*]/g, ']')
    .replace(/,\s*}/g, '}');

  // 使用 Function 代替 eval（更安全）
  courses = JSON.parse(
    cleanedStr
      .replace(/'/g, '"')
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
  );
  console.log(`✅ 成功解析 ${courses.length} 門課程\n`);
} catch (error) {
  console.error('❌ 解析課程數據失敗:', error.message);
  console.log('ℹ️ 使用備用靜態數據...');

  courses = [
    { id: "0-1", week: 0, module: 1, title: "Gemini 註冊與跨裝置上手指南", description: "課程前置作業：帳號準備與多平台登入指南", duration_minutes: 45, pages: [] },
    { id: "0-2", week: 0, module: 2, title: "Gemini 3.1 Pro 與 Ultra 訂閱方案比較", description: "不同版本的功能差異與最適使用情景", duration_minutes: 45, pages: [] },
    { id: "1-1", week: 1, module: 1, title: "課程開場與 AI 趨勢", description: "2026 年 AI 趨勢與 Gemini 的核心價值主張", duration_minutes: 45, pages: [] },
    { id: "1-2", week: 1, module: 2, title: "Gemini 3.6 Flash：效率的新王者", description: "Gemini 3.6 Flash 的特性、Token 效率與實用應用", duration_minutes: 45, pages: [] },
    { id: "2-1", week: 2, module: 1, title: "Managed Agents：自主任務執行", description: "在 Google 管理的安全沙箱環境中構建自主代理", duration_minutes: 45, pages: [] },
    { id: "2-2", week: 2, module: 2, title: "Computer Use Tool：桌面自動化", description: "AI 進行桌面、行動、瀏覽器操作自動化", duration_minutes: 45, pages: [] },
    { id: "3-1", week: 3, module: 1, title: "Deep Research、Veo、Imagen 3：高級內容生成", description: "學習複雜主題的 Deep Research，以及影片和圖像生成", duration_minutes: 45, pages: [] },
    { id: "3-2", week: 3, module: 2, title: "Canvas、Context Caching 與成本優化", description: "生產環境中的高級功能與成本優化策略", duration_minutes: 45, pages: [] }
  ];
}

// 翻譯課程並保存
async function translateCourses() {
  const translatedCourses = [];

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    console.log(`⏳ [${i + 1}/${courses.length}] 翻譯：${course.title}`);

    const translation = courseTranslations[course.id];

    // 翻譯頁面內容
    const translatedPages = [];
    if (course.pages && course.pages.length > 0) {
      console.log(`   📖 翻譯 ${course.pages.length} 個頁面...`);

      for (let j = 0; j < course.pages.length; j++) {
        const page = course.pages[j];

        // 翻譯頁面標題
        let pageTitle = pageTitleTranslations[page.title];
        if (!pageTitle && page.title) {
          console.log(`      翻譯標題：${page.title.substring(0, 40)}...`);
          pageTitle = await translateText(page.title);
        }

        // 翻譯頁面內容
        let pageContent = page.content;
        if (page.content) {
          console.log(`      翻譯內容（${page.content.length} 字）...`);
          pageContent = await translateText(page.content);
        }

        translatedPages.push({
          title: pageTitle || page.title,
          content: pageContent
        });

        // 速率限制
        await new Promise(r => setTimeout(r, 1000));

        if ((j + 1) % 3 === 0) {
          console.log(`      ${j + 1}/${course.pages.length} 完成`);
        }
      }
    }

    translatedCourses.push({
      id: course.id,
      week: course.week,
      module: course.module,
      title: translation?.title || course.title,
      description: translation?.description || course.description,
      duration_minutes: course.duration_minutes,
      pages: translatedPages
    });

    console.log(`   ✅ ${course.title} 完成\n`);

    // 速率限制
    await new Promise(r => setTimeout(r, 1000));
  }

  return translatedCourses;
}

// 主函數
(async () => {
  try {
    const translatedCourses = await translateCourses();

    // 保存結果
    const outputPath = path.join(__dirname, '../all_courses_ja_complete.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedCourses, null, 2), 'utf-8');

    console.log(`\n✅ 完成！已保存 ${translatedCourses.length} 門課程到 ${outputPath}`);
    console.log(`📚 所有課程現在都有日文版本`);
  } catch (error) {
    console.error('❌ 致命錯誤:', error.message);
    process.exit(1);
  }
})();
