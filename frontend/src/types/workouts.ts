export interface WorkoutType {
  id: number;
  date: string;
  plan: ExerciseType[];
  completed: boolean;
}

export interface ExerciseType {
  name: string;
  sets: number;
  reps: number;
  description: string;
}
