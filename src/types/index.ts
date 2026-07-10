export interface BlogPost {
  id: string;
  title: string;
  content: string;
  media: MediaItem[];
  createdAt: Date;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  media: MediaItem[];
}
