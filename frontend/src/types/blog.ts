export interface PostType {
  id: number;
  title: string;
  content: string;
  image: string;
  is_approved: boolean;
}

export interface CommentType {
  id: number;
  content: string;
}

export interface LikeType {
  id: number;
}