export interface UserType {
  id: number;
  username: string;
  email: string;
  profile: ProfileType;
}

export interface ProfileType {
  date_of_birth: string;
  gender?: 'male' | 'female';
  height: number;
  weight: number;
  goal?: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  has_equipment: boolean;
  avatar?: string;
}

export interface RegisterType {
  username: string;
  email: string;
  password: string;
  password2: string;
}