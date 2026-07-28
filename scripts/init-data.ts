import { createClient } from '@supabase/supabase-js'
import { courseData } from '../lib/course-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initializeData() {
  try {
    console.log('🚀 開始初始化課程數據...')

    // 1. 清空現有課程數據（可選）
    console.log('清空現有課程數據...')
    await supabase.from('courses').delete().neq('id', '')

    // 2. 插入課程數據
    console.log('插入課程數據...')
    const { data: insertedCourses, error: courseError } = await supabase
      .from('courses')
      .insert(courseData)
      .select()

    if (courseError) {
      console.error('❌ 課程數據插入失敗:', courseError)
      return
    }

    console.log(`✅ 成功插入 ${insertedCourses?.length || 0} 門課程`)

    // 3. 建立搜索索引
    console.log('建立搜索索引...')
    const searchIndexData: any[] = []

    insertedCourses?.forEach((course) => {
      // 索引標題
      searchIndexData.push({
        course_id: course.id,
        week: course.week,
        category: 'title',
        search_text: course.title,
        ts_vector: `'${course.title}'::tsvector`,
      })

      // 索引描述
      searchIndexData.push({
        course_id: course.id,
        week: course.week,
        category: 'description',
        search_text: course.description,
        ts_vector: `'${course.description}'::tsvector`,
      })

      // 索引內容（摘要前 500 字）
      const contentSummary = course.content.substring(0, 500)
      searchIndexData.push({
        course_id: course.id,
        week: course.week,
        category: 'content',
        search_text: contentSummary,
        ts_vector: `'${contentSummary}'::tsvector`,
      })
    })

    const { error: indexError } = await supabase
      .from('search_index')
      .insert(searchIndexData)

    if (indexError) {
      console.error('❌ 搜索索引建立失敗:', indexError)
    } else {
      console.log(`✅ 搜索索引已建立`)
    }

    // 4. 創建管理員用戶
    console.log('創建管理員用戶...')
    const adminEmail = 'benjaminchu0508@gmail.com'

    // 先查詢是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single()

    if (!existingUser) {
      const { error: adminError } = await supabase
        .from('users')
        .insert({
          email: adminEmail,
          name: 'Admin - Benjamin Chu',
          department: 'Administration',
        })

      if (adminError) {
        console.error('❌ 管理員用戶創建失敗:', adminError)
      } else {
        console.log(`✅ 管理員用戶已創建: ${adminEmail}`)
      }
    } else {
      console.log(`✅ 管理員用戶已存在: ${adminEmail}`)
    }

    console.log('✨ 初始化完成！')
  } catch (error) {
    console.error('❌ 初始化失敗:', error)
    process.exit(1)
  }
}

// 運行初始化
initializeData()
