export interface PostType {
  id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
  comments: CommentType[];
  likes_count: number;
  is_liked: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CommentType {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
}

export interface LikeType {
  id: number;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
  created_at: string;
}