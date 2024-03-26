export type WeightData = {
  action: string;
  weight: number;
  reps: number;
  sets: number;
  failed: boolean;
};
export type CardioData = {
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
