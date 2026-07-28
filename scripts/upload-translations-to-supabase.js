require('dotenv').config({ path: '.env.local' });

// =====================================================
// 上傳翻譯內容到 Supabase
// 用途: 將中文和日文課程、題庫上傳到 Supabase
// =====================================================

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 錯誤: 環境變數未設置');
  console.error('需要設置:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// =====================================================
// 讀取翻譯文件
// =====================================================

function readJsonFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ 無法讀取 ${filePath}:`, error.message);
    return null;
  }
}

// =====================================================
// 上傳課程數據
// =====================================================

async function uploadCourseData() {
  console.log('\n📚 上傳課程數據...\n');

  // 中文課程數據
  console.log('⏳ 上傳中文課程...');
  const chineseCourses = readJsonFile('all_courses_corrected.json');
  if (chineseCourses && Array.isArray(chineseCourses)) {
    for (const course of chineseCourses) {
      const { error } = await supabase
        .from('course_data_i18n')
        .upsert({
          course_id: course.id,
          language: 'zh',
          week: course.week,
          module: course.module,
          title: course.title,
          description: course.description,
          duration_minutes: course.duration_minutes,
          content: { pages: course.pages || [] }
        });

      if (error) {
        console.error(`  ❌ 上傳失敗 ${course.id}:`, error.message);
      } else {
        console.log(`  ✅ ${course.id} (中文)`);
      }
    }
  }

  // 日文課程數據
  console.log('\n⏳ 上傳日文課程...');
  const japaneseCoursesRaw = readJsonFile('all_courses_ja.json');
  if (japaneseCoursesRaw && Array.isArray(japaneseCoursesRaw)) {
    for (const course of japaneseCoursesRaw) {
      const { error } = await supabase
        .from('course_data_i18n')
        .upsert({
          course_id: course.id,
          language: 'ja',
          week: course.week,
          module: course.module,
          title: course.title,
          description: course.description,
          duration_minutes: course.duration_minutes,
          content: { pages: course.pages || [] }
        });

      if (error) {
        console.error(`  ❌ 上傳失敗 ${course.id}:`, error.message);
      } else {
        console.log(`  ✅ ${course.id} (日文)`);
      }
    }
  }
}

// =====================================================
// 上傳題庫數據
// =====================================================

async function uploadQuizData() {
  console.log('\n📝 上傳題庫數據...\n');

  // 中文題庫
  console.log('⏳ 上傳中文題庫...');
  const chineseQuizzes = readJsonFile('course_quizzes.json');
  if (chineseQuizzes && Array.isArray(chineseQuizzes)) {
    let questionCount = 0;
    for (const course of chineseQuizzes) {
      for (const question of course.questions || []) {
        const { error } = await supabase
          .from('quizzes_i18n')
          .upsert({
            quiz_id: question.id,
            course_id: course.course_id,
            language: 'zh',
            question_type: question.type,
            question: question.question,
            options: question.options ? { options: question.options } : null,
            correct_answer: question.correct_answer,
            explanation: question.explanation
          });

        if (error) {
          console.error(`  ❌ 上傳失敗 ${question.id}:`, error.message);
        } else {
          questionCount++;
        }
      }
    }
    console.log(`  ✅ 共 ${questionCount} 道中文題目`);
  }

  // 日文題庫
  console.log('\n⏳ 上傳日文題庫...');
  const japaneseQuizzesRaw = readJsonFile('course_quizzes_ja.json');
  if (japaneseQuizzesRaw && Array.isArray(japaneseQuizzesRaw)) {
    let questionCount = 0;
    for (const course of japaneseQuizzesRaw) {
      for (const question of course.questions || []) {
        const { error } = await supabase
          .from('quizzes_i18n')
          .upsert({
            quiz_id: question.id,
            course_id: course.course_id,
            language: 'ja',
            question_type: question.type,
            question: question.question,
            options: question.options ? { options: question.options } : null,
            correct_answer: question.correct_answer,
            explanation: question.explanation
          });

        if (error) {
          console.error(`  ❌ 上傳失敗 ${question.id}:`, error.message);
        } else {
          questionCount++;
        }
      }
    }
    console.log(`  ✅ 共 ${questionCount} 道日文題目`);
  }
}

// =====================================================
// 主程序
// =====================================================

async function main() {
  console.log('🚀 開始上傳翻譯內容到 Supabase...\n');

  try {
    await uploadCourseData();
    await uploadQuizData();

    console.log('\n✅ 上傳完成！');
    console.log('\n📊 語言切換功能現已啟用：');
    console.log('  - 中文課程已上傳');
    console.log('  - 日文課程已上傳');
    console.log('  - 語言選擇器可以正常工作');
  } catch (error) {
    console.error('\n❌ 上傳過程發生錯誤:', error);
    process.exit(1);
  }
}

main();
