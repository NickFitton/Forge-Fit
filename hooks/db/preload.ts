import { exerciseDatasetVersions, exercises } from '../../db/schema';
import { useMutation } from '@tanstack/react-query';
import { EXERCISE_DATASETS } from '../../db/seed/exercises/exerciseDataset';
import { ExerciseCategory, ExerciseType, InsertExercise } from './exercises';
import { useDb } from '../../providers/DrizzleDb';
import { ExerciseDataset } from '../../db/seed/exercises/types';

export const usePreloadExercises = () => {
  const db = useDb();

  return useMutation({
    mutationKey: ['exercises', 'dataset'],
    mutationFn: () => {
      return db.transaction(async (tx1) => {
        const existingVersions = await tx1
          .select()
          .from(exerciseDatasetVersions);
        const applicableVersions = Object.entries(EXERCISE_DATASETS);
        console.log(existingVersions, applicableVersions);

        const datasetsToApply = applicableVersions.filter(([appVersion]) =>
          existingVersions.every(({ version }) => appVersion !== version)
        );
        console.log(datasetsToApply);
        const exerciseEntities = datasetsToApply.flatMap(([_, dataset]) =>
          convertDatasetToEntities(dataset)
        );
        const versionEntities = datasetsToApply.map(
          ([version]) =>
            ({ version } satisfies typeof exerciseDatasetVersions.$inferInsert)
        );
        console.log(
          `Applying dataset versions [ ${datasetsToApply
            .map(([version]) => version)
            .join(', ')} ]`
        );
        if (exerciseEntities.length !== 0) {
          await tx1.insert(exercises).values(exerciseEntities);
        }
        if (versionEntities.length !== 0) {
          await tx1.insert(exerciseDatasetVersions).values(versionEntities);
        }
        return;
      });
    },
  });
};

const convertDatasetToEntities = (dataset: ExerciseDataset): InsertExercise[] =>
  Object.entries(dataset).flatMap(
    ([type, categories]: [
      ExerciseType,
      Partial<Record<ExerciseCategory, string[]>>
    ]) =>
      Object.entries(categories).flatMap(
        ([category, exercises]: [ExerciseCategory, string[]]) =>
          exercises.map(
            (name) =>
              ({
                type,
                category,
                name,
              } satisfies InsertExercise)
          )
      )
  );
