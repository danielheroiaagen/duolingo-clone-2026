// ============================================
// SUPABASE DATABASE TYPES
// Generated from schema - keep in sync with Supabase
// ============================================

// ============================================
// TABLE: users
// ============================================

export interface User {
  id: number;
  supabase_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  streak: number;
  hearts: number;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  supabase_id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  xp?: number;
  streak?: number;
  hearts?: number;
}

export interface UserUpdate {
  display_name?: string | null;
  avatar_url?: string | null;
  xp?: number;
  streak?: number;
  hearts?: number;
  updated_at?: string;
}

// ============================================
// TABLE: modules
// ============================================

export interface Module {
  id: number;
  title: string;
  description: string | null;
  position: "left" | "center" | "right";
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface ModuleInsert {
  title: string;
  description?: string | null;
  position?: "left" | "center" | "right";
  order: number;
  is_active?: boolean;
}

// ============================================
// TABLE: lessons
// ============================================

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string | null;
  order: number;
  xp_reward: number;
  is_active: boolean;
  created_at: string;
}

export interface LessonInsert {
  module_id: number;
  title: string;
  description?: string | null;
  order: number;
  xp_reward?: number;
  is_active?: boolean;
}

// ============================================
// TABLE: exercises
// ============================================

export interface Exercise {
  id: number;
  lesson_id: number;
  type: "multiple_choice" | "translation" | "listening";
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  order: number;
  created_at: string;
}

export interface ExerciseInsert {
  lesson_id: number;
  type?: "multiple_choice" | "translation" | "listening";
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string | null;
  order: number;
}

// ============================================
// TABLE: user_progress
// ============================================

export interface UserProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  completed: boolean;
  score: number;
  attempts: number;
  last_accessed_at: string;
  completed_at: string | null;
}

export interface UserProgressInsert {
  user_id: number;
  lesson_id: number;
  completed?: boolean;
  score?: number;
  attempts?: number;
  completed_at?: string | null;
}

export interface UserProgressUpdate {
  completed?: boolean;
  score?: number;
  attempts?: number;
  last_accessed_at?: string;
  completed_at?: string | null;
}

// ============================================
// TABLE: module_progress
// ============================================

export interface ModuleProgress {
  id: number;
  user_id: number;
  module_id: number;
  lessons_completed: number;
  total_lessons: number;
  unlocked_at: string;
  completed_at: string | null;
}

// ============================================
// DATABASE SCHEMA TYPE
// ============================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      modules: {
        Row: Module;
        Insert: ModuleInsert;
        Update: Partial<ModuleInsert>;
      };
      lessons: {
        Row: Lesson;
        Insert: LessonInsert;
        Update: Partial<LessonInsert>;
      };
      exercises: {
        Row: Exercise;
        Insert: ExerciseInsert;
        Update: Partial<ExerciseInsert>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: UserProgressInsert;
        Update: UserProgressUpdate;
      };
      module_progress: {
        Row: ModuleProgress;
        Insert: Omit<ModuleProgress, "id" | "unlocked_at">;
        Update: Partial<ModuleProgress>;
      };
    };
  };
}
