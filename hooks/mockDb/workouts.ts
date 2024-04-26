import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';

type WorkoutSchedule = {
  repeatEvery: number;
  activeSchedule: boolean[];
};

type Workout = {
  name: string;
  schedule: WorkoutSchedule;
  active: boolean;
};

type WorkoutIndexed = Workout & { id: string };

export const useCreateWorkout = () => {
  return useMutation({
    mutationKey: ['createWorkout'],
    mutationFn: () => {},
  });
};

const WORKOUT_KEY = 'workouts';

const createWorkout = async (workout: Workout): Promise<WorkoutIndexed> => {
  const id = randomUUID();
  await updateWorkout(id, workout);
  return { ...workout, id };
};

const getWorkout = async (
  searchId: string
): Promise<WorkoutIndexed | undefined> => {
  const workouts = getWorkouts();
  return (await workouts).find(({ id }) => id === searchId);
};

const getWorkouts = async (): Promise<WorkoutIndexed[]> => {
  const workouts = await AsyncStorage.getItem(WORKOUT_KEY);
  return Object.entries(JSON.parse(workouts) as Record<string, Workout>).map(
    ([key, value]) => ({ ...value, id: key })
  );
};

const updateWorkout = (id: string, workout: Workout): Promise<void> => {
  return AsyncStorage.mergeItem(WORKOUT_KEY, JSON.stringify({ [id]: workout }));
};

const deleteWorkout = async (deleteId: string): Promise<void> => {
  const workouts = await AsyncStorage.getItem(WORKOUT_KEY);
  const kvWorkouts = Object.entries(
    JSON.parse(workouts) as Record<string, Workout>
  );
  delete kvWorkouts[deleteId];

  await AsyncStorage.setItem(WORKOUT_KEY, JSON.stringify(kvWorkouts));
};
