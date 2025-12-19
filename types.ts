
export type Category = 'AI' | 'Web' | 'Mobile' | 'Security' | 'Hardware' | 'Gaming' | 'Career';

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
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
