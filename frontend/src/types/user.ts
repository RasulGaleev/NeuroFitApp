export interface User {
  id: string;
  username: string;
  email: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  height?: number;
  weight?: number;
  goal?: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface BioData {
  date_of_birth: string;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';
}