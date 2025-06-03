export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  images: string[];
  shortDescription: string;
  links: string[];
  createdAt: string;
}

export interface SearchResults {
  posts: BlogPost[];
  totalPosts: number;
}