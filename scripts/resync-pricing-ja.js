#!/usr/bin/env node
// 價格內容更正後，重新翻譯受影響的日文段落。
//
// 只針對包含錯誤價格說法的欄位重譯，其餘內容原封不動 —— 避免整批重跑
// 造成不必要的 token 消耗，也避免已審過的譯文被無謂改寫。

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ 未設定 GEMINI_API_KEY 環境變數');
  process.exit(1);
}
const MODEL = 'gemini-3.5-flash';

async function translate(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `將以下繁體中文翻譯成日文。保留原本的換行、符號（✓ ✗ → 等）與排版結構，金額數字與幣別（NT$）務必原樣保留。只返回翻譯結果，不要有其他說明：\n\n${text}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 3000 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`API ${res.status}: ${err.error?.message || 'unknown'}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

// 判斷一段文字是否仍帶有舊的錯誤價格說法
const STALE = /20\s*USD|600 TWD|同等|同じ|価格が同じ/;

function parseTs(file, decl) {
  const src = fs.readFileSync(path.join(__dirname, '..', file), 'utf-8');
  const s = src.indexOf(decl) + decl.length;
  const e = src.indexOf('\n];', s) + 2;
  return { data: eval('(' + src.substring(s, e) + ')'), src };
}

async function main() {
  let touched = 0;

  // ---- 1. 課程頁面 all_courses_ja.json ----
  const coursePath = path.join(__dirname, '../all_courses_ja.json');
  const zhCourses = parseTs('lib/course-data.ts', 'export const courseData: Course[] = ').data;
  const jaCourses = JSON.parse(fs.readFileSync(coursePath, 'utf-8'));

  for (const jc of jaCourses) {
    const zc = zhCourses.find((c) => c.id === jc.id);
    if (!zc) continue;
    for (let i = 0; i < jc.pages.length; i++) {
      if (!STALE.test(jc.pages[i].content)) continue;
      const zhPage = zc.pages[i];
      if (!zhPage) continue;
      console.log(`課程 ${jc.id} 第 ${i + 1} 頁：${jc.pages[i].title}`);
      jc.pages[i].content = await translate(zhPage.content);
      touched++;
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  fs.writeFileSync(coursePath, JSON.stringify(jaCourses, null, 2), 'utf-8');

  // ---- 2. 卡牌 lib/cards-data-ja.ts ----
  const zhCards = parseTs('lib/cards-data.ts', 'export const cardsData: Card[] = ').data;
  const jaCardsMod = parseTs('lib/cards-data-ja.ts', 'export const cardsDataJa: Card[] = ');
  const jaCards = jaCardsMod.data;

  for (const jc of jaCards) {
    if (!STALE.test(jc.back)) continue;
    const zc = zhCards.find((c) => c.id === jc.id);
    if (!zc) continue;
    console.log(`卡牌 ${jc.id}：${jc.title}`);
    jc.back = await translate(zc.back);
    touched++;
    await new Promise((r) => setTimeout(r, 400));
  }
  fs.writeFileSync(
    path.join(__dirname, '../lib/cards-data-ja.ts'),
    `import { Card } from './cards-data';\n\n// 日文卡牌資料 — 由 scripts/translate-cards.js 透過 Gemini API 產生\n// imagePrompt 保留中文（僅供圖片生成，不面向使用者）\nexport const cardsDataJa: Card[] = ${JSON.stringify(jaCards, null, 2)};\n`,
    'utf-8'
  );

  // ---- 3. 題庫 lib/quiz-data-ja.ts（第 6 題已改寫，須整題重譯）----
  const zhQuiz = parseTs('lib/quiz-data.ts', 'export const quizData: QuizQuestion[] = ').data;
  const jaQuiz = parseTs('lib/quiz-data-ja.ts', 'export const quizDataJa: QuizQuestion[] = ').data;

  for (let i = 0; i < jaQuiz.length; i++) {
    const jq = jaQuiz[i];
    const zq = zhQuiz[i];
    const blob = jq.question + jq.options.map((o) => o.text).join('') + jq.explanation;
    if (!STALE.test(blob)) continue;
    console.log(`題目 ${jq.id}：${zq.question.slice(0, 30)}...`);
    jq.question = await translate(zq.question);
    for (let k = 0; k < jq.options.length; k++) {
      jq.options[k].text = await translate(zq.options[k].text);
      await new Promise((r) => setTimeout(r, 250));
    }
    jq.explanation = await translate(zq.explanation);
    jq.correctAnswer = zq.correctAnswer; // 正解可能已變更
    touched++;
    await new Promise((r) => setTimeout(r, 400));
  }
  fs.writeFileSync(
    path.join(__dirname, '../lib/quiz-data-ja.ts'),
    `import { QuizQuestion } from './quiz-data';\n\n// 日文題庫 — 由 scripts/translate-quiz.js 透過 Gemini API 產生。\n// id / section / week / correctAnswer 與中文版完全對應，以確保\n// 進度追蹤與證書門檻在兩種語言間一致。\nexport const quizDataJa: QuizQuestion[] = ${JSON.stringify(jaQuiz, null, 2)};\n`,
    'utf-8'
  );

  console.log(`\n✅ 完成，共重譯 ${touched} 個段落`);
}

main().catch((e) => {
  console.error('\n❌ 失敗:', e.message);
  process.exit(1);
});
