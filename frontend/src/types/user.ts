export interface UserType {
  id: string;
  username: string;
  email: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  height?: number;
  weight?: number;
  goal?: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';
}

export interface RegisterType {
  username: string;
  email: string;
  password: string;
}

export interface BioType {
  date_of_birth: string;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';
}