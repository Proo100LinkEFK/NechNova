
export type Category = 'AI' | 'Web' | 'Mobile' | 'Security' | 'Hardware' | 'Gaming' | 'Career';

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  likedByUserIds: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: Category;
  author: string;
  date: string;
  imageUrl: string;
  views: number;
  likes: number;
  likedByUserIds: string[];
  comments: Comment[];
  tags: string[];
  readTime: number;
  isHot?: boolean;
}

export interface Podcast {
  id: string;
  title: string;
  host: string;
  duration: string;
  imageUrl: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  likedNewsIds: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
