#!/usr/bin/env node
// 第二輪價格/額度資訊修正後的日文同步。
// 只重譯今天確切改過的段落（以 id + 頁面索引 / 卡牌 id / 題號精準定位），
// 不用關鍵字掃描猜測，避免誤判或漏判。

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
        contents: [{ parts: [{ text: `將以下繁體中文翻譯成日文。保留原本的換行、符號（✓ ✗ → ＊ 等）、Markdown 表格結構與金額數字（NT$ 開頭的金額請原樣保留數字與貨幣符號）。只返回翻譯結果，不要有其他說明：\n\n${text}` }] }],
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

function parseTs(file, decl) {
  const src = fs.readFileSync(path.join(__dirname, '..', file), 'utf-8');
  const s = src.indexOf(decl) + decl.length;
  const e = src.indexOf('\n];', s) + 2;
  return eval('(' + src.substring(s, e) + ')');
}

async function main() {
  let touched = 0;

  // ---- 1. 課程頁面 ----
  const coursePath = path.join(__dirname, '../all_courses_ja.json');
  const zhCourses = parseTs('lib/course-data.ts', 'export const courseData: Course[] = ');
  const jaCourses = JSON.parse(fs.readFileSync(coursePath, 'utf-8'));

  const coursePageTargets = [
    { id: '0-2', pages: [1, 2, 3, 4] },
    { id: 'adv-5-1', pages: [0, 3, 7] },
    { id: '1-2', pages: [4] },
  ];

  for (const target of coursePageTargets) {
    const zc = zhCourses.find((c) => c.id === target.id);
    const jc = jaCourses.find((c) => c.id === target.id);
    if (!zc || !jc) {
      console.warn(`⚠️ 找不到課程 ${target.id}，略過`);
      continue;
    }
    for (const idx of target.pages) {
      const zhPage = zc.pages[idx];
      if (!zhPage) continue;
      console.log(`課程 ${target.id} 第 ${idx + 1} 頁：${zhPage.title}`);
      jc.pages[idx].content = await translate(zhPage.content);
      touched++;
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  fs.writeFileSync(coursePath, JSON.stringify(jaCourses, null, 2), 'utf-8');

  // ---- 2. 卡牌 ----
  const zhCards = parseTs('lib/cards-data.ts', 'export const cardsData: Card[] = ');
  const jaCardsMod = fs.readFileSync(path.join(__dirname, '../lib/cards-data-ja.ts'), 'utf-8');
  const jaDecl = 'export const cardsDataJa: Card[] = ';
  const jaCards = eval(
    '(' + jaCardsMod.substring(jaCardsMod.indexOf(jaDecl) + jaDecl.length, jaCardsMod.lastIndexOf('];') + 1) + ')'
  );

  for (const cardId of ['9-1']) {
    const zc = zhCards.find((c) => c.id === cardId);
    const jc = jaCards.find((c) => c.id === cardId);
    if (!zc || !jc) {
      console.warn(`⚠️ 找不到卡牌 ${cardId}，略過`);
      continue;
    }
    console.log(`卡牌 ${cardId}：${zc.title}`);
    jc.back = await translate(zc.back);
    touched++;
    await new Promise((r) => setTimeout(r, 400));
  }
  fs.writeFileSync(
    path.join(__dirname, '../lib/cards-data-ja.ts'),
    `import { Card } from './cards-data';\n\n// 日文卡牌資料 — 由 scripts/translate-cards.js 透過 Gemini API 產生\n// imagePrompt 保留中文（僅供圖片生成，不面向使用者）\nexport const cardsDataJa: Card[] = ${JSON.stringify(jaCards, null, 2)};\n`,
    'utf-8'
  );

  // ---- 3. 題庫 ----
  const zhQuiz = parseTs('lib/quiz-data.ts', 'export const quizData: QuizQuestion[] = ');
  const jaQuizMod = fs.readFileSync(path.join(__dirname, '../lib/quiz-data-ja.ts'), 'utf-8');
  const jaQuizDecl = 'export const quizDataJa: QuizQuestion[] = ';
  const jaQuiz = eval(
    '(' + jaQuizMod.substring(jaQuizMod.indexOf(jaQuizDecl) + jaQuizDecl.length, jaQuizMod.lastIndexOf('];') + 1) + ')'
  );

  for (const qid of [3, 7, 94, 96]) {
    const zq = zhQuiz.find((q) => q.id === qid);
    const jq = jaQuiz.find((q) => q.id === qid);
    if (!zq || !jq) {
      console.warn(`⚠️ 找不到題目 ${qid}，略過`);
      continue;
    }
    console.log(`題目 ${qid}：${zq.question.slice(0, 30)}...`);
    jq.question = await translate(zq.question);
    for (let k = 0; k < jq.options.length; k++) {
      jq.options[k].text = await translate(zq.options[k].text);
      await new Promise((r) => setTimeout(r, 250));
    }
    jq.explanation = await translate(zq.explanation);
    jq.correctAnswer = zq.correctAnswer;
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
