import { ExerciseCategory, ExerciseType } from '../../../hooks/db/exercises';

export type ExerciseDataset = Partial<
  Record<ExerciseType, Partial<Record<ExerciseCategory, string[]>>>
>;
