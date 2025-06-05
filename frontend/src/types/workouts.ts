export interface Workout {
  id: number;
  date: string;
  plan: Exercise[];
  completed: boolean;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  description: string;
}
