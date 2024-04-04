import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useDb } from '../../providers/DrizzleDb';
import {
  exercises,
  sessionCardioExercises,
  sessions,
  sessionWeightExercises,
} from '../../db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { getDate, getDay, getDaysInMonth, set, setDate } from 'date-fns';
import { ActivityData } from '../../api/activity/types';

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
  createdAt: Date;
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
  createdAt: Date;
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
        (pData) => [
          ...data.map((d) => ({
            ...d,
            exercise: { name: variables.exercise },
            id: d.id,
            createdAt: d.createdAt,
          })),
          ...pData,
        ]
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
        .set({ endTime: new Date() })
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
      startTime: session.startTime,
      endTime: session.endTime,
    }),
  });
};

export const useCreateSession = () => {
  const db = useDb();
  const client = useQueryClient();

  return useMutation({
    mutationKey: ['create', 'session'],
    mutationFn: () =>
      db
        .insert(sessions)
        .values({})
        .returning({ createdId: sessions.id, startTime: sessions.startTime }),
    onSuccess: (d) => {
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
      createdAt: exercise.createdAt,
      action: exercise.exercise.name,
      weight: exercise.weight,
      reps: exercise.reps,
      sets: exercise.sets,
    })),
    ...cardio.map<CardioData>((exercise) => {
      return {
        type: 'cardio',
        createdAt: exercise.createdAt,
        action: exercise.exercise.name,
        distance: exercise.distance,
        timeMins: exercise.time,
        calories: exercise.calories,
      };
    }),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const useSessionCalendarDays = (
  date: Date
): UseQueryResult<number[]> => {
  const db = useDb();
  const firstDayOfMonth = set(date, {
    date: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  console.log(firstDayOfMonth);
  const lastDayOfMonth = setDate(firstDayOfMonth, getDaysInMonth(date));

  return useQuery({
    queryKey: ['sessions', firstDayOfMonth],
    queryFn: () =>
      db.query.sessions.findMany({
        where: and(
          gte(sessions.startTime, firstDayOfMonth),
          lte(sessions.endTime, lastDayOfMonth)
        ),
        columns: {
          startTime: true,
        },
      }),
    select: (dates) => [
      ...dates.reduce(
        (agg, next) => agg.add(getDate(next.startTime)),
        new Set<number>()
      ),
    ],
  });
};
export type SessionData = {
  data: ActivityData[];
  startTime: Date;
  endTime: Date;
};

export const useSessionsInDay = (date: Date): UseQueryResult<SessionData[]> => {
  const db = useDb();
  const startOfDay = set(date, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const endOfDay = set(date, {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  });

  return useQuery({
    queryKey: ['sessions', 'dates', startOfDay],
    queryFn: () =>
      db.query.sessions.findMany({
        where: and(
          gte(sessions.startTime, startOfDay),
          lte(sessions.endTime, endOfDay)
        ),
        with: {
          sessionWeightExercises: {
            columns: {
              createdAt: true,
              weight: true,
              sets: true,
              reps: true,
            },
            with: {
              exercise: {
                columns: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          sessionCardioExercises: {
            columns: {
              createdAt: true,
              time: true,
              distance: true,
              calories: true,
            },
            with: {
              exercise: {
                columns: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      }),
    select: (data) =>
      data.map((session) => ({
        data: [
          ...session.sessionCardioExercises.map(mapCardioToActivity),
          ...session.sessionWeightExercises.map(mapWeightToActivity),
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        startTime: session.startTime,
        endTime: session.endTime,
      })),
  });
};
type SessionCardioEntityData = {
  createdAt: Date;
  time: number;
  distance: number;
  calories: number;
  exercise: {
    id: number;
    name: string;
  };
};

type SessionWeightEntityData = {
  createdAt: Date;
  weight: number;
  sets: number;
  reps: number;
  exercise: {
    id: number;
    name: string;
  };
};

const mapCardioToActivity = (
  entity: SessionCardioEntityData
): ActivityData => ({
  type: 'cardio',
  action: entity.exercise.name,
  createdAt: entity.createdAt,
  distance: entity.distance,
  timeMins: entity.time,
  timeSecs: 0,
  calories: entity.calories,
});
const mapWeightToActivity = (
  entity: SessionWeightEntityData
): ActivityData => ({
  type: 'weight',
  action: entity.exercise.name,
  weight: entity.weight,
  reps: entity.reps,
  sets: entity.sets,
  createdAt: entity.createdAt,
  failed: false,
});
