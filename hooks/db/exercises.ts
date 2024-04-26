import { useMutation, useQuery } from '@tanstack/react-query';
import { useDb } from '../../providers/DrizzleDb';
import { exercises } from '../../db/schema';
import { eq } from 'drizzle-orm';

export type ExerciseType = 'cardio' | 'weight';
export const ALL_EXERCISE_TYPES: ExerciseType[] = ['cardio', 'weight'];
export type ExerciseCategory =
  | 'machines'
  | 'free_weights'
  | 'track'
  | 'cardio_machines';
export const ALL_EXERCISE_CATEGORIES: string[] = [
  'machines',
  'free_weights',
  'track',
  'cardio_machines',
];

export type ExerciseGroups = {
  name: string;
  data: Omit<Exercise, 'category'>[];
}[];

export type Exercise = {
  id: number;
  name: string;
  category: ExerciseCategory;
};

export type InsertExercise = Omit<Exercise, 'id'> & { type: ExerciseType };

export const useExercises = (type: ExerciseType) => {
  const db = useDb();

  return useQuery<(typeof exercises.$inferSelect)[], unknown, ExerciseGroups>({
    queryKey: ['exercises', type],
    queryFn: () => db.select().from(exercises).where(eq(exercises.type, type)),
    select: (results) => {
      const groupByCategory = results.map(fromSelectEntity).reduce(
        (agg, next) => ({
          ...agg,
          [next.category]: agg[next.category]
            ? [...agg[next.category], next]
            : [next],
        }),
        {} as Record<string, Exercise[]>
      );

      return Object.entries(groupByCategory).map(([category, exercises]) => ({
        name: category,
        data: exercises,
      }));
    },
  });
};

export const useCreateExercises = () => {
  const db = useDb();
  return useMutation<unknown, unknown, InsertExercise[]>({
    mutationKey: ['create', 'exercises'],
    mutationFn: (newExercises) =>
      db.insert(exercises).values(newExercises.map(toInsertEntity)),
    onError: (e) => {
      console.error(e);
    },
  });
};

const fromSelectEntity = (
  exercise: typeof exercises.$inferSelect
): Exercise => {
  if (!isExerciseCategory(exercise.category)) {
    throw new Error(
      `Received an unexpected exercise category: ${exercise.category}`
    );
  }
  return { ...exercise, category: exercise.category as ExerciseCategory };
};

const isExerciseCategory = (category: string): category is ExerciseCategory =>
  ALL_EXERCISE_CATEGORIES.includes(category);

const toInsertEntity = (
  exercise: InsertExercise
): typeof exercises.$inferInsert => exercise;
