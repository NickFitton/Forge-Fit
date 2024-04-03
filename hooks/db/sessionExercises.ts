import { useMutation, useQueries } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

import { useDb } from '../../providers/DrizzleDb';
import {
  sessionCardioExercises,
  sessionWeightExercises,
} from '../../db/schema';

export type WeightData = {
  id: number;
  createdAt: Date;
  action: string;
  weight: number;
  reps: number;
  sets: number;
};

export type CardioData = {
  createdAt: Date;
  action: string;
  distance: number;
  timeMins: number;
  timeSecs: number;
  calories?: number;
};

export type ActivityData =
  | ({
      type: 'weight';
    } & WeightData)
  | ({
      type: 'cardio';
    } & CardioData);

/*
export const useMutateSessionExercises = (sessionId: string) => {
  const db = useDb();
  return useMutation({
    mutationKey: ['sessions', sessionId, 'exercise'],
    mutationFn: (activityData: ActivityData) => {
      switch (activityData.type) {
        case 'weight':
          db.insert(sessionWeightExercises).values([
            { sessionId, ...activityData },
          ]);
        case 'cardio':
          db.insert(sessionCardioExercises).values([
            { sessionId, ...activityData },
          ]);
      }
    },
  });
};
*/
