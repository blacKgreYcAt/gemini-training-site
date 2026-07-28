#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 顏色配置 - 每周一個顏色主題
const colorSchemes = {
  0: { start: '#059669', end: '#10b981', name: 'Green' },      // Week 0 (已有)
  1: { start: '#2563eb', end: '#3b82f6', name: 'Blue' },        // Week 1 (已有)
  2: { start: '#7c3aed', end: '#8b5cf6', name: 'Purple' },      // Week 2 (已有)
  3: { start: '#dc2626', end: '#ef4444', name: 'Red' },         // Week 3 (已有)
  4: { start: '#ea580c', end: '#fb923c', name: 'Orange' },      // Week 4 (已有)
  5: { start: '#0891b2', end: '#06b6d4', name: 'Cyan' },        // Week 5 (缺)
  6: { start: '#d946ef', end: '#ec4899', name: 'Pink' },        // Week 6 (缺)
  7: { start: '#6366f1', end: '#8b5cf6', name: 'Indigo' },      // Week 7 (缺)
  8: { start: '#16a34a', end: '#22c55e', name: 'Lime' },        // Week 8 (缺)
  9: { start: '#0d9488', end: '#14b8a6', name: 'Teal' },        // Week 9 (缺)
  10: { start: '#ca8a04', end: '#eab308', name: 'Yellow' }      // Week 10 (缺)
};

// 卡片总数
const totalCards = 55;
const cardsPerWeek = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3];

// 生成 SVG
function generateSVG(cardId, weekNum, colorScheme) {
  const id = cardId.replace('-', '_');

  return `<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorScheme.start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorScheme.end};stop-opacity:0.8" />
    </linearGradient>
    <filter id="glow-${id}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="600" fill="url(#grad-${id})"/>

  <!-- Grid Pattern -->
  <g opacity="0.1" stroke="white" stroke-width="1">
    <line x1="0" y1="150" x2="600" y2="150"/>
    <line x1="0" y1="300" x2="600" y2="300"/>
    <line x1="0" y1="450" x2="600" y2="450"/>
    <line x1="150" y1="0" x2="150" y2="600"/>
    <line x1="300" y1="0" x2="300" y2="600"/>
    <line x1="450" y1="0" x2="450" y2="600"/>
  </g>

  <!-- Geometric Shapes -->
  <circle cx="150" cy="150" r="60" fill="white" opacity="0.3" filter="url(#glow-${id})"/>
  <circle cx="450" cy="450" r="80" fill="white" opacity="0.2" filter="url(#glow-${id})"/>

  <!-- Tech Lines -->
  <path d="M 100 300 Q 300 200 500 300" stroke="white" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
  <path d="M 100 350 Q 300 400 500 350" stroke="white" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round"/>

  <!-- Node Points -->
  <circle cx="100" cy="300" r="6" fill="white"/>
  <circle cx="300" cy="200" r="5" fill="white" opacity="0.7"/>
  <circle cx="500" cy="300" r="6" fill="white"/>

  <!-- Corner Elements -->
  <rect x="20" y="20" width="40" height="40" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>
  <rect x="540" y="540" width="40" height="40" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>

  <!-- Week Label -->
  <text x="300" y="570" font-size="16" fill="white" opacity="0.4" text-anchor="middle">Week ${weekNum}</text>
</svg>`;
}

// 检查哪些卡片已有 SVG
const cardsDir = path.join(__dirname, '..', 'public', 'cards');
const existingFiles = fs.readdirSync(cardsDir).filter(f => f.endsWith('.svg'));
const existingIds = new Set(existingFiles.map(f => f.replace('.svg', '')));

// 生成缺失的 SVG
let count = 0;
let idx = 0;

for (let week = 0; week < cardsPerWeek.length; week++) {
  for (let card = 1; card <= cardsPerWeek[week]; card++) {
    const cardId = `${week}-${card}`;

    if (!existingIds.has(cardId)) {
      const svgContent = generateSVG(cardId, week, colorSchemes[week]);
      const filePath = path.join(cardsDir, `${cardId}.svg`);

      fs.writeFileSync(filePath, svgContent, 'utf-8');
      console.log(`✅ Generated: ${cardId}.svg`);
      count++;
    }
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Generated: ${count} new SVG files`);
console.log(`   Existing: ${existingIds.size} SVG files`);
console.log(`   Total: ${count + existingIds.size} SVG files`);
