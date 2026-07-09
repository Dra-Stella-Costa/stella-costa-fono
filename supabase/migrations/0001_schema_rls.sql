-- Fundação: schema + Row Level Security (spec .specs/features/fundacao)
-- ATENÇÃO antes de aplicar: substituir o e-mail placeholder abaixo pelo
-- e-mail real da Stella no Supabase Auth (RF-11 — restrição por e-mail).

-- E-mail autorizado a escrever (função única para facilitar troca futura)
create or replace function public.is_stella()
returns boolean
language sql
stable
as $$
  -- TODO: trocar pelo e-mail real da Stella antes de aplicar a migration
  select coalesce(auth.jwt() ->> 'email', '') = 'stella@example.com';
$$;

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_url text,
  meta_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null, -- nome abreviado, ex.: "Mariana S." (LGPD)
  city text,
  quote text not null,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.articles enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;

-- Leitura anônima: apenas conteúdo publicado
create policy "public read published articles"
  on public.articles for select
  using (status = 'published');

create policy "public read published testimonials"
  on public.testimonials for select
  using (published = true);

create policy "public read published faqs"
  on public.faqs for select
  using (published = true);

-- Stella lê tudo (inclusive rascunhos) e escreve
create policy "stella full access articles"
  on public.articles for all
  to authenticated
  using (public.is_stella())
  with check (public.is_stella());

create policy "stella full access testimonials"
  on public.testimonials for all
  to authenticated
  using (public.is_stella())
  with check (public.is_stella());

create policy "stella full access faqs"
  on public.faqs for all
  to authenticated
  using (public.is_stella())
  with check (public.is_stella());

-- ---------------------------------------------------------------------------
-- Storage: bucket de mídia do blog (leitura pública, escrita só da Stella)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "stella write media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_stella());

create policy "stella update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_stella());

create policy "stella delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_stella());
