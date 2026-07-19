-- Site settings for brand copy and footer text
create table if not exists public.site_settings (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  site_name text not null,
  site_tagline text not null,
  footer_blurb text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  unique(tenant_id)
);

insert into public.site_settings (tenant_id, site_name, site_tagline, footer_blurb)
values (
  'd7e9b0cf-52fb-4d1a-8c88-75796c000000',
  'Khaemba News',
  'The Voice of Devolution & Authoritative County Journalism',
  'Independent, county-first investigative reporting. Authoritative stories and in-depth documentaries outlining structural governance, economic growth, and communities in East Africa.'
)
on conflict (tenant_id) do update
set site_name = excluded.site_name,
    site_tagline = excluded.site_tagline,
    footer_blurb = excluded.footer_blurb,
    updated_at = timezone('utc'::text, now());
