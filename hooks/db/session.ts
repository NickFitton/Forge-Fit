import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useDb } from '../../providers/DrizzleDb';
import {
  exercises,
  sessionCardioExercises,
  sessions,
  sessionWeightExercises,
} from '../../db/schema';
import { eq } from 'drizzle-orm';

export type WeightData = {
  type: 'weight';
  createdAt: Date;
  action: string;
  weight: number;
  reps: number;
  sets: number;
};

export type CardioData = {
  type: 'cardio';
  createdAt: Date;
  action: string;
  distance: number;
  timeMins: number;
  timeSecs: number;
  calories?: number;
};
export type ExerciseData = (CardioData | WeightData)[];

export type Session = {
  id: number;
  startTime: Date;
  endTime?: Date;
};

export type SessionWeightExercisesQueryData = {
  weight: number;
  id: number;
  createdAt: string;
  sessionId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  exercise: {
    name: string;
  };
}[];

export type InsertSessionWeightExercise =
  typeof sessionWeightExercises.$inferInsert & { exerciseId: number };
export type SelectSessionWeightExercise =
  typeof sessionWeightExercises.$inferSelect;

export const useSessionExercises = (id: number) => {
  const db = useDb();

  return useQueries({
    queries: [
      {
        queryKey: ['sessions', id, 'sessionCardioExercises'],
        queryFn: () =>
          db.query.sessionCardioExercises.findMany({
            where: eq(sessionCardioExercises.sessionId, id),
            with: {
              exercise: {
                columns: {
                  name: true,
                },
              },
            },
          }),
      },
      {
        queryKey: ['sessions', id, 'sessionWeightExercises'],
        queryFn: () =>
          db.query.sessionWeightExercises.findMany({
            where: eq(sessionWeightExercises.sessionId, id),
            with: {
              exercise: {
                columns: {
                  name: true,
                },
              },
            },
          }),
      },
    ],
    combine: ([cardio, weight]) => {
      return {
        data: mergeExercises(weight.data, cardio.data),
        isLoading: [cardio, weight].some((result) => result.isLoading),
        isError: [cardio, weight].some((result) => result.isError),
        error: [cardio, weight].find((error) => error),
      };
    },
  });
};

export const useCreateSessionWeightExercise = (sessionId: number) => {
  const db = useDb();
  const client = useQueryClient();

  return useMutation<
    InsertSessionWeightExercise[],
    unknown,
    Omit<InsertSessionWeightExercise, 'sessionId'> & { exercise: string }
  >({
    mutationKey: ['create', 'sessions', sessionId, 'sessionWeightExercises'],
    mutationFn: (exercise) =>
      db
        .insert(sessionWeightExercises)
        .values({ ...exercise, sessionId })
        .returning(),
    onSuccess: (data, variables) => {
      client.setQueryData<SessionWeightExercisesQueryData>(
        ['sessions', sessionId, 'sessionWeightExercises'],
        (pData) => {
          return [
            ...data.map((d) => ({
              ...d,
              exercise: { name: variables.exercise },
              id: d.id!,
              createdAt: d.createdAt!,
            })),
            ...pData,
          ];
        }
      );
      data;
    },
    onError: (e) => {
      console.error(e);
    },
  });
};

export type SessionCardioExercisesQueryData = {
  id: number;
  createdAt: string;
  sessionId: number;
  exerciseId: number;
  time: number;
  distance: number;
  calories?: number;
  exercise: {
    name: string;
  };
}[];

export type InsertSessionCardioExercise =
  typeof sessionCardioExercises.$inferInsert & { exerciseId: number };
export type SelectSessionCardioExercise =
  typeof sessionCardioExercises.$inferSelect;

export const useCreateSessionCardioExercise = (sessionId: number) => {
  const db = useDb();
  const client = useQueryClient();

  return useMutation<
    InsertSessionCardioExercise[],
    unknown,
    Omit<InsertSessionCardioExercise, 'sessionId'> & { exercise: string }
  >({
    mutationKey: ['create', 'sessions', sessionId, 'sessionCardioExercises'],
    mutationFn: (exercise) =>
      db
        .insert(sessionCardioExercises)
        .values({ ...exercise, sessionId })
        .returning(),
    onSuccess: (data, variables) => {
      client.setQueryData<SessionCardioExercisesQueryData>(
        ['sessions', sessionId, 'sessionCardioExercises'],
        (pData) => {
          return [
            ...data.map((d) => ({
              ...d,
              exercise: { name: variables.exercise },
              id: d.id!,
              createdAt: d.createdAt!,
            })),
            ...pData,
          ];
        }
      );
      data;
    },
    onError: (e) => {
      console.error(e);
    },
  });
};

export const useEndSession = (id: number) => {
  const db = useDb();

  return useMutation({
    mutationFn: () =>
      db
        .update(sessions)
        .set({ endTime: new Date().toISOString() })
        .where(eq(sessions.id, id)),
  });
};

export const useSession = (id: number) => {
  const db = useDb();

  return useQuery({
    queryKey: ['sessions', id],
    queryFn: async () => {
      try {
        return db.query.sessions.findFirst({
          where: eq(sessions.id, id),
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    select: (session) => ({
      id: session.id,
      startTime: new Date(session.startTime + '+00:00'),
      endTime: session.endTime ? new Date(session.endTime + '+00:00') : null,
    }),
  });
};

export const useCreateSession = () => {
  const db = useDb();
  const client = useQueryClient();

  return useMutation({
    mutationKey: ['create', 'session'],
    mutationFn: () =>
      db.insert(sessions).values({}).returning({ createdId: sessions.id }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

const mergeExercises = (
  weight: (typeof sessionWeightExercises.$inferSelect & {
    exercise: Pick<typeof exercises.$inferSelect, 'name'>;
  })[] = [],
  cardio: (typeof sessionCardioExercises.$inferSelect & {
    exercise: Pick<typeof exercises.$inferSelect, 'name'>;
  })[] = []
): (CardioData | WeightData)[] => {
  return [
    ...weight.map<WeightData>((exercise) => ({
      type: 'weight',
      createdAt: new Date(exercise.createdAt),
      action: exercise.exercise.name,
      weight: exercise.weight,
      reps: exercise.reps,
      sets: exercise.sets,
    })),
    ...cardio.map<CardioData>((exercise) => {
      const mins = Math.floor(exercise.time / 60);
      const secs = exercise.time % 60;
      return {
        type: 'cardio',
        createdAt: new Date(exercise.createdAt),
        action: exercise.exercise.name,
        distance: exercise.distance,
        timeMins: mins,
        timeSecs: secs,
        calories: exercise.calories,
      };
    }),
  ];
};
