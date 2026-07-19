-- Enable UUID generation extension
create extension if not exists "uuid-ossp";

-- 1. Create custom types/enums (we will use check constraints for maximum compatibility with standard Postgres drivers)
-- Roles: admin, editor, contributor
-- Statuses: draft, scheduled, published
-- Ad positions: homepage_top, homepage_mid, article_inline, sidebar
-- Event types: impression, click

-- 2. Create tables

-- Users Profile table (linked to Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text not null check (role in ('admin', 'editor', 'contributor')) default 'contributor',
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  accent_color text not null, -- hex code
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Articles table
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text not null,
  body jsonb not null, -- block content: [{"type": "paragraph", "value": "text"}, ...]
  featured_image_url text not null,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.users(id) on delete set null,
  status text not null check (status in ('draft', 'scheduled', 'published')) default 'draft',
  published_at timestamptz,
  scheduled_for timestamptz,
  tags text[] default '{}'::text[] not null,
  view_count int default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Videos table
create table public.videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text not null,
  thumbnail_url text not null,
  video_source_type text not null check (video_source_type in ('youtube', 'vimeo', 'uploaded')) default 'youtube',
  video_url text not null,
  duration_seconds int default 0 not null,
  category_id uuid references public.categories(id) on delete set null,
  status text not null check (status in ('draft', 'published')) default 'draft',
  published_at timestamptz,
  view_count int default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Ads table
create table public.ads (
  id uuid default gen_random_uuid() primary key,
  client_name text not null,
  image_url text not null,
  target_link text not null,
  position text not null check (position in ('homepage_top', 'homepage_mid', 'article_inline', 'sidebar')),
  start_date date not null,
  end_date date not null,
  status text not null check (status in ('active', 'paused', 'expired')) default 'active',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Ad Analytics table
create table public.ad_analytics (
  id uuid default gen_random_uuid() primary key,
  ad_id uuid references public.ads(id) on delete cascade not null,
  event_type text not null check (event_type in ('impression', 'click')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references public.articles(id) on delete cascade not null,
  author_name text not null,
  body text not null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Newsletter Subscribers table
create table public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  subscribed_at timestamptz default timezone('utc'::text, now()) not null
);

-- Site General Traffic Analytics table
create table public.site_analytics (
  id uuid default gen_random_uuid() primary key,
  page_path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Indexes for queries optimization
create index idx_articles_slug on public.articles(slug);
create index idx_articles_status_published on public.articles(status, published_at);
create index idx_videos_slug on public.videos(slug);
create index idx_videos_status on public.videos(status);
create index idx_ads_status_dates on public.ads(status, start_date, end_date);
create index idx_ad_analytics_ad_id on public.ad_analytics(ad_id);
create index idx_comments_article_status on public.comments(article_id, status);

-- 4. Triggers and functions

-- Function to handle updated_at on articles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger trigger_articles_updated_at
  before update on public.articles
  for each row execute procedure public.handle_updated_at();

-- Trigger to create a user profile in public.users automatically when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_name text;
  default_role text;
begin
  default_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Contributor');
  default_role := coalesce(new.raw_user_meta_data->>'role', 'contributor');
  
  insert into public.users (id, full_name, role, avatar_url)
  values (new.id, default_name, default_role, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.videos enable row level security;
alter table public.ads enable row level security;
alter table public.ad_analytics enable row level security;
alter table public.comments enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_analytics enable row level security;

-- 6. Define helper security function to check current user's role
create or replace function public.current_user_role()
returns text as $$
declare
  r text;
begin
  select role into r from public.users where id = auth.uid();
  return coalesce(r, 'contributor');
end;
$$ language plpgsql security definer;

-- 7. RLS Policies

-- Public Users Policies
create policy "Allow public read profiles" on public.users
  for select using (true);

create policy "Allow user update self or Admin full access" on public.users
  for all using (auth.uid() = id or public.current_user_role() = 'admin');

-- Categories Policies
create policy "Allow public read categories" on public.categories
  for select using (true);

create policy "Allow Admin/Editor manage categories" on public.categories
  for all using (public.current_user_role() in ('admin', 'editor'));

-- Articles Policies
create policy "Allow public read published articles" on public.articles
  for select using (status = 'published' and (published_at is null or published_at <= now()));

create policy "Allow Admin/Editor full access to articles" on public.articles
  for all using (public.current_user_role() in ('admin', 'editor'));

create policy "Allow Contributor read all articles" on public.articles
  for select using (public.current_user_role() = 'contributor');

create policy "Allow Contributor create own articles" on public.articles
  for insert with check (public.current_user_role() = 'contributor' and author_id = auth.uid());

create policy "Allow Contributor update own draft articles" on public.articles
  for update using (public.current_user_role() = 'contributor' and author_id = auth.uid() and status = 'draft');

-- Videos Policies
create policy "Allow public read published videos" on public.videos
  for select using (status = 'published');

create policy "Allow Admin/Editor manage videos" on public.videos
  for all using (public.current_user_role() in ('admin', 'editor'));

create policy "Allow Contributor read videos" on public.videos
  for select using (public.current_user_role() = 'contributor');

create policy "Allow Contributor create videos" on public.videos
  for insert with check (public.current_user_role() = 'contributor');

-- Ads Policies
create policy "Allow public read active ads" on public.ads
  for select using (status = 'active' and start_date <= now()::date and end_date >= now()::date);

create policy "Allow Admin full access to ads" on public.ads
  for all using (public.current_user_role() = 'admin');

create policy "Allow Editor view ads" on public.ads
  for select using (public.current_user_role() = 'editor');

-- Ad Analytics Policies
create policy "Allow public tracking inserts" on public.ad_analytics
  for insert with check (true);

create policy "Allow Admin view analytics" on public.ad_analytics
  for select using (public.current_user_role() = 'admin');

-- Comments Policies
create policy "Allow public read approved comments" on public.comments
  for select using (status = 'approved');

create policy "Allow public insert pending comments" on public.comments
  for insert with check (status = 'pending');

create policy "Allow Admin/Editor manage comments" on public.comments
  for all using (public.current_user_role() in ('admin', 'editor'));

-- Newsletter Policies
create policy "Allow public sign up newsletter" on public.newsletter_subscribers
  for insert with check (true);

create policy "Allow Admin manage newsletter list" on public.newsletter_subscribers
  for all using (public.current_user_role() = 'admin');

-- Site Analytics Policies
create policy "Allow public insert traffic events" on public.site_analytics
  for insert with check (true);

create policy "Allow Admin view traffic events" on public.site_analytics
  for select using (public.current_user_role() = 'admin');

-- 8. Seed categories
insert into public.categories (name, slug, accent_color) values
  ('Politics', 'politics', '#B23A3A'),
  ('Business', 'business', '#3A7D44'),
  ('Sports', 'sports', '#2E5FA3'),
  ('County', 'county', '#8A5A9E'),
  ('Opinion', 'opinion', '#5E6E7A');
