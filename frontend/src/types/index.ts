



export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  created_at: string;
}

export interface ProgressChart {
  id: number;
  weight: number;
  notes: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
}

export interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: string;
  goals: string[];
} 