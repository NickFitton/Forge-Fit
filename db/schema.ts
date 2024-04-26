import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const exercises = sqliteTable(
  'exercises',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    category: text('category').notNull(),
  },
  (exercise) => ({
    typeIdx: index('type').on(exercise.type),
  })
);

export const exerciseDatasetVersions = sqliteTable('exerciseDatasets', {
  id: integer('id').primaryKey(),
  version: text('version').notNull().unique(),
});

export const sessions = sqliteTable(
  'sessions',
  {
    id: integer('id').primaryKey(),
    startTime: integer('startTime', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    endTime: integer('endTime', { mode: 'timestamp' }),
  },
  (session) => ({
    timeIdx: index('timeIdx').on(session.startTime, session.endTime),
  })
);

export const sessionWeightExercises = sqliteTable(
  'sessionWeightExercises',
  {
    id: integer('id').primaryKey(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    sessionId: integer('sessionId')
      .references(() => sessions.id)
      .notNull(),
    exerciseId: integer('exerciseId')
      .references(() => exercises.id)
      .notNull(),
    weight: real('weight').notNull(),
    sets: integer('sets').notNull(),
    reps: integer('reps').notNull(),
  },
  (exercise) => ({
    sessionIdx: index('weightSessionIdx').on(exercise.sessionId),
    exerciseIdx: index('weightExerciseIdx').on(exercise.exerciseId),
  })
);

export const sessionCardioExercises = sqliteTable(
  'sessionCardioExercises',
  {
    id: integer('id').primaryKey(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    sessionId: integer('sessionId')
      .references(() => sessions.id)
      .notNull(),
    exerciseId: integer('exerciseId')
      .references(() => exercises.id)
      .notNull(),
    time: real('time').notNull(),
    distance: real('distance').notNull(),
    calories: integer('calories'),
  },
  (exercise) => ({
    sessionIdx: index('cardioSessionIdx').on(exercise.sessionId),
    exerciseIdx: index('cardioExerciseIdx').on(exercise.exerciseId),
  })
);

export const sessionRelations = relations(sessions, ({ many }) => ({
  sessionWeightExercises: many(sessionWeightExercises),
  sessionCardioExercises: many(sessionCardioExercises),
}));

export const sessionWeightRelations = relations(
  sessionWeightExercises,
  ({ one }) => ({
    session: one(sessions, {
      fields: [sessionWeightExercises.sessionId],
      references: [sessions.id],
    }),
    exercise: one(exercises, {
      fields: [sessionWeightExercises.exerciseId],
      references: [exercises.id],
    }),
  })
);

export const sessionCardioRelations = relations(
  sessionCardioExercises,
  ({ one }) => ({
    session: one(sessions, {
      fields: [sessionCardioExercises.sessionId],
      references: [sessions.id],
    }),
    exercise: one(exercises, {
      fields: [sessionCardioExercises.exerciseId],
      references: [exercises.id],
    }),
  })
);

export const exerciseRelateions = relations(exercises, ({ many }) => ({
  sessionWeightExercises: many(exercises),
  sessionCardioExercises: many(exercises),
}));
