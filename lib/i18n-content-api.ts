// =====================================================
// 多語言內容 API - 獲取課程和題庫
// =====================================================

import { createClient } from '@supabase/supabase-js';

type Language = 'en' | 'ja';

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// =====================================================
// 課程內容 API
// =====================================================

export interface CourseContent {
  id: string;
  course_id: string;
  language: Language;
  week: number;
  module: number;
  title: string;
  description: string;
  content: Record<string, any>;
  duration_minutes: number;
  pages?: Array<{ title: string; content: string }>;
}

/**
 * 獲取特定課程的多語言內容
 */
export async function getCourseContent(
  courseId: string,
  language: Language = 'en'
): Promise<CourseContent | null> {
  try {
    const { data, error } = await supabase
      .from('course_data_i18n')
      .select('*')
      .eq('course_id', courseId)
      .eq('language', language)
      .single();

    if (error) {
      console.error(`Error fetching course ${courseId}:`, error);
      return null;
    }

    return data as CourseContent;
  } catch (error) {
    console.error('Error in getCourseContent:', error);
    return null;
  }
}

/**
 * 獲取特定周的所有課程
 */
export async function getCoursesByWeek(
  week: number,
  language: Language = 'en'
): Promise<CourseContent[]> {
  try {
    const { data, error } = await supabase
      .from('course_data_i18n')
      .select('*')
      .eq('week', week)
      .eq('language', language)
      .order('module', { ascending: true });

    if (error) {
      console.error(`Error fetching courses for week ${week}:`, error);
      return [];
    }

    return data as CourseContent[];
  } catch (error) {
    console.error('Error in getCoursesByWeek:', error);
    return [];
  }
}

/**
 * 獲取所有課程（用於課程列表）
 */
export async function getAllCourses(
  language: Language = 'en'
): Promise<CourseContent[]> {
  try {
    const { data, error } = await supabase
      .from('course_data_i18n')
      .select('*')
      .eq('language', language)
      .order('week', { ascending: true })
      .order('module', { ascending: true });

    if (error) {
      console.error('Error fetching all courses:', error);
      return [];
    }

    return data as CourseContent[];
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    return [];
  }
}

// =====================================================
// 題庫 API
// =====================================================

export interface Quiz {
  id: string;
  quiz_id: string;
  course_id: string;
  language: Language;
  question_type: 'multiple_choice' | 'scenario' | 'true_false';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
}

/**
 * 獲取特定課程的題庫
 */
export async function getCourseQuizzes(
  courseId: string,
  language: Language = 'en'
): Promise<Quiz[]> {
  try {
    const { data, error } = await supabase
      .from('quizzes_i18n')
      .select('*')
      .eq('course_id', courseId)
      .eq('language', language);

    if (error) {
      console.error(`Error fetching quizzes for course ${courseId}:`, error);
      return [];
    }

    return data as Quiz[];
  } catch (error) {
    console.error('Error in getCourseQuizzes:', error);
    return [];
  }
}

/**
 * 獲取所有題庫
 */
export async function getAllQuizzes(
  language: Language = 'en'
): Promise<Quiz[]> {
  try {
    const { data, error } = await supabase
      .from('quizzes_i18n')
      .select('*')
      .eq('language', language);

    if (error) {
      console.error('Error fetching all quizzes:', error);
      return [];
    }

    return data as Quiz[];
  } catch (error) {
    console.error('Error in getAllQuizzes:', error);
    return [];
  }
}

// =====================================================
// 用戶進度 API
// =====================================================

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  language: Language;
  current_page: number;
  quiz_score?: number;
  completed: boolean;
}

/**
 * 獲取用戶進度
 */
export async function getUserProgress(
  userId: string,
  courseId: string,
  language: Language = 'en'
): Promise<UserProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress_i18n')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('language', language)
      .single();

    if (error) {
      // 不存在時返回 null（正常）
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user progress:', error);
      return null;
    }

    return data as UserProgress;
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    return null;
  }
}

/**
 * 更新用戶進度
 */
export async function updateUserProgress(
  userId: string,
  courseId: string,
  language: Language,
  updates: Partial<Omit<UserProgress, 'id' | 'user_id'>>
): Promise<UserProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress_i18n')
      .upsert({
        user_id: userId,
        course_id: courseId,
        language,
        ...updates,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user progress:', error);
      return null;
    }

    return data as UserProgress;
  } catch (error) {
    console.error('Error in updateUserProgress:', error);
    return null;
  }
}

// =====================================================
// 語言偏好 API
// =====================================================

/**
 * 獲取用戶語言偏好
 */
export async function getUserLanguagePreference(
  userId: string
): Promise<Language> {
  try {
    const { data, error } = await supabase
      .from('users_language_preferences')
      .select('preferred_language')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.warn('Could not fetch language preference, using default:', error);
      return 'en';
    }

    return (data?.preferred_language || 'en') as Language;
  } catch (error) {
    console.error('Error in getUserLanguagePreference:', error);
    return 'en';
  }
}

/**
 * 設置用戶語言偏好
 */
export async function setUserLanguagePreference(
  userId: string,
  language: Language
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users_language_preferences')
      .upsert({
        user_id: userId,
        preferred_language: language,
      });

    if (error) {
      console.error('Error setting language preference:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setUserLanguagePreference:', error);
    return false;
  }
}

// =====================================================
// 緩存幫手（可選，用於性能優化）
// =====================================================

const cache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分鐘

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache(): void {
  cache.clear();
}
