#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 課程翻譯映射
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

// ページ内容翻譯映射（簡化版 - 只翻譯關鍵部分）
const pageTranslations = {
  "課程單元：Gemini 註冊與跨裝置上手指南": "コース単元：Gemini登録とマルチデバイスセットアップガイド",
  "課程前置作業：帳號準備與多平台登入指南": "事前準備：アカウント設定とマルチプラットフォームログインガイド",
  "本單元將引導你完成 Gemini 的註冊與設置，確保你能在各種裝置上順利使用。": "このユニットでは、Geminiの登録とセットアップを完了し、各デバイスでスムーズに使用できることを確認します。",
  "Gemini 是 Google 開發的生成式 AI，使用前提是你必須擁有一個 Google 帳號 (@gmail.com)。": "GeminiはGoogleが開発した生成型AIであり、使用するには@gmail.comのGoogleアカウントが必要です。"
};

// 讀取課程數據
const courseDataPath = path.join(__dirname, '../lib/course-data.ts');
const courseDataContent = fs.readFileSync(courseDataPath, 'utf-8');

// 提取 courseData
const match = courseDataContent.match(/export const courseData: Course\[\] = \[([\s\S]*?)\];/);
if (!match) {
  console.error('❌ 無法解析 courseData');
  process.exit(1);
}

// 簡單評估 - 提取課程對象
const coursesCode = `[${match[1]}]`;

// 使用正則表達式和字符串操作提取課程
let courses;
try {
  // 這是一個簡化的方法 - 直接讀取 JSON 格式的課程
  eval(`courses = ${coursesCode}`);
} catch (e) {
  // 如果評估失敗，使用退而求其次的方法
  console.log('⚠️ 動態解析失敗，使用靜態映射');

  courses = Object.keys(courseTranslations).map(id => ({
    id,
    week: parseInt(id.split('-')[0]),
    module: parseInt(id.split('-')[1]),
    title: courseTranslations[id].title,
    description: courseTranslations[id].description,
    duration_minutes: 45,
    pages: []
  }));
}

// 生成日文課程
const japaneseCoures = courses.map(course => {
  const translation = courseTranslations[course.id];

  return {
    id: course.id,
    week: course.week,
    module: course.module,
    title: translation?.title || course.title,
    description: translation?.description || course.description,
    duration_minutes: course.duration_minutes,
    pages: course.pages?.map(page => ({
      title: pageTranslations[page.title] || page.title,
      content: page.content // 暫時保持原文，稍後完整翻譯
    })) || []
  };
});

// 保存結果
const outputPath = path.join(__dirname, '../all_courses_ja.json');
fs.writeFileSync(outputPath, JSON.stringify(japaneseCoures, null, 2), 'utf-8');

console.log(`✅ 完成！已生成日文課程到 ${outputPath}`);
console.log(`📚 共 ${japaneseCoures.length} 門課程`);
