#!/usr/bin/env node
// =====================================================
// 課程數據導出腳本 - 從 TypeScript 生成 JSON
// =====================================================

const fs = require('fs');
const path = require('path');

// 直接導入課程數據（簡化版 - 從 course-data.ts 複製結構）
const courseData = [
  {
    id: "0-1",
    week: 0,
    module: 1,
    title: "Gemini Registration and Multi-Device Setup",
    description: "Pre-course preparation: Account setup and multi-platform login guide",
    duration_minutes: 30,
  },
  {
    id: "0-2",
    week: 0,
    module: 2,
    title: "Gemini 3.1 Pro vs Ultra Subscription Plan Comparison",
    description: "Understand the functional differences and best use cases for different versions",
    duration_minutes: 45,
  },
  {
    id: "1-1",
    week: 1,
    module: 1,
    title: "Course Kickoff and AI Trends",
    description: "AI trends in 2026 and the core value proposition of Gemini",
    duration_minutes: 60,
  },
  {
    id: "1-2",
    week: 1,
    module: 2,
    title: "Gemini 3.6 Flash: The New Efficiency King",
    description: "Gemini 3.6 Flash features, token efficiency, and practical applications",
    duration_minutes: 60,
  },
  {
    id: "2-1",
    week: 2,
    module: 1,
    title: "Managed Agents: Autonomous Task Execution",
    description: "Building autonomous agents in Google-managed secure sandboxes",
    duration_minutes: 75,
  },
  {
    id: "2-2",
    week: 2,
    module: 2,
    title: "Computer Use Tool: Desktop Automation",
    description: "Automating desktop, mobile, and browser interactions with AI",
    duration_minutes: 75,
  },
  {
    id: "3-1",
    week: 3,
    module: 1,
    title: "Deep Research, Veo, Imagen 3: Advanced Content Generation",
    description: "Deep research for complex topics, video and image generation",
    duration_minutes: 90,
  },
  {
    id: "3-2",
    week: 3,
    module: 2,
    title: "Canvas, Context Caching, and Cost Optimization",
    description: "Advanced features and cost optimization strategies for production",
    duration_minutes: 60,
  },
];

console.log('[INFO] Exporting course data to JSON...');

const outputPath = path.join(__dirname, '../all_courses_corrected.json');
fs.writeFileSync(outputPath, JSON.stringify(courseData, null, 2), 'utf-8');

console.log(`[SUCCESS] Course data exported to: ${outputPath}`);
console.log(`[INFO] Total courses: ${courseData.length}`);

module.exports = courseData;
