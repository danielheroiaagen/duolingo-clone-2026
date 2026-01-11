// ============================================
// SERVICES BARREL EXPORT
// ============================================

export { modulesService, type ModuleData, type ModuleWithLessons } from "./modules.service";
export {
  lessonsService,
  type LessonData,
  type LessonWithExercises,
  type ExerciseData,
  type AnswerPayload,
  type AnswerResult,
} from "./lessons.service";
export {
  progressService,
  type UserProgress,
  type ModuleProgress,
  type LessonCompletion,
} from "./progress.service";
