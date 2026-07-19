export type UserRole = 'admin' | 'editor' | 'contributor';

export interface User {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  accent_color: string;
}

export type BlockType = 'paragraph' | 'heading' | 'image' | 'quote' | 'embed' | 'video';

export interface ArticleBlock {
  id: string;
  type: BlockType;
  value: string;
  meta?: {
    caption?: string;
    level?: 1 | 2 | 3;
    provider?: string;
    aspectRatio?: string;
  };
}

export type ArticleStatus = 'draft' | 'scheduled' | 'published';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: ArticleBlock[];
  featured_image_url: string;
  category_id: string;
  category?: Category;
  author_id: string;
  author?: User;
  status: ArticleStatus;
  published_at?: string;
  scheduled_for?: string;
  tags: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type VideoSourceType = 'youtube' | 'vimeo' | 'uploaded';
export type VideoStatus = 'draft' | 'published';

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  video_source_type: VideoSourceType;
  video_url: string;
  duration_seconds: number;
  category_id?: string;
  category?: Category;
  status: VideoStatus;
  published_at?: string;
  view_count: number;
  created_at: string;
}

export type AdPosition = 'homepage_top' | 'homepage_mid' | 'article_inline' | 'sidebar';
export type AdStatus = 'active' | 'paused' | 'expired';

export interface Ad {
  id: string;
  client_name: string;
  image_url: string;
  target_link: string;
  position: AdPosition;
  start_date: string;
  end_date: string;
  status: AdStatus;
  created_at: string;
  impressions?: number;
  clicks?: number;
}

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  body: string;
  status: CommentStatus;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface SiteSettings {
  id: string;
  tenant_id: string;
  site_name: string;
  site_tagline: string;
  footer_blurb: string;
  created_at: string;
  updated_at: string;
}
