import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { createContext, useContext } from 'react';
import * as schema from '../db/schema';

const DrizzleDbContext = createContext<ExpoSQLiteDatabase<typeof schema>>(null);

export const DrizzleDbProvider = DrizzleDbContext.Provider;

export const useDb = () => useContext(DrizzleDbContext);
