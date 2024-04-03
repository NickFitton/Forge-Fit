import { sessions } from './schema';

export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;
