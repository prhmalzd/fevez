create extension if not exists pgcrypto;

create type public.content_category as enum ('movies', 'music', 'games');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (username ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null check (char_length(display_name) between 1 and 60),
  bio text not null default '' check (char_length(bio) <= 160),
  avatar_url text,
  header_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index profiles_username_lower_key on public.profiles(lower(username));

create table public.profile_categories (
  user_id uuid not null references public.profiles(id) on delete cascade,
  category public.content_category not null,
  visible boolean not null default true,
  display_order smallint not null check (display_order between 1 and 3),
  primary key (user_id, category),
  unique (user_id, display_order)
);

create table public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('tmdb', 'musicbrainz', 'igdb')),
  provider_id text not null,
  category public.content_category not null,
  title text not null,
  subtitle text not null default '',
  release_year smallint,
  image_url text,
  backdrop_url text,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  provider_score numeric(3,1),
  refreshed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (provider, provider_id),
  check (provider_score is null or provider_score between 0 and 10)
);
create index catalog_items_category_idx on public.catalog_items(category);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.catalog_items(id) on delete cascade,
  score numeric(3,1) not null check (score between 1 and 10 and mod(score * 2, 1) = 0),
  note text not null default '' check (char_length(note) <= 280),
  rank smallint not null check (rank between 1 and 25),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, item_id)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  rating_id uuid not null unique references public.ratings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index activities_user_created_idx on public.activities(user_id, created_at desc);

create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followed_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);
create index follows_followed_idx on public.follows(followed_id);

create table public.activity_likes (
  activity_id uuid not null references public.activities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (activity_id, user_id)
);

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger ratings_updated_at before update on public.ratings for each row execute function public.set_updated_at();

create or replace function public.enforce_rating_rank() returns trigger language plpgsql set search_path = '' as $$
declare item_category public.content_category;
begin
  select category into item_category from public.catalog_items where id = new.item_id;
  if exists (
    select 1 from public.ratings r join public.catalog_items i on i.id = r.item_id
    where r.user_id = new.user_id and i.category = item_category and r.rank = new.rank and r.id <> new.id
  ) then raise exception 'rank_taken'; end if;
  if (select count(*) from public.ratings r join public.catalog_items i on i.id = r.item_id
      where r.user_id = new.user_id and i.category = item_category and r.id <> new.id) >= 25 then
    raise exception 'collection_full';
  end if;
  return new;
end;
$$;
create trigger enforce_rating_rank before insert or update of rank, item_id on public.ratings for each row execute function public.enforce_rating_rank();

create or replace function public.create_rating_activity() returns trigger language plpgsql set search_path = '' as $$
begin insert into public.activities(rating_id, user_id) values (new.id, new.user_id); return new; end;
$$;
create trigger rating_activity after insert on public.ratings for each row execute function public.create_rating_activity();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
declare base_username text;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'member'), '[^a-z0-9_]', '', 'g'));
  if char_length(base_username) < 3 then base_username := 'member'; end if;
  insert into public.profiles(id, username, display_name)
  values (new.id, left(base_username, 18) || '_' || substr(new.id::text, 1, 5), coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'New member'));
  insert into public.profile_categories(user_id, category, display_order) values
    (new.id, 'movies', 1), (new.id, 'music', 2), (new.id, 'games', 3);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.reorder_collection(category_input public.content_category, ordered_rating_ids uuid[])
returns void language plpgsql security invoker set search_path = '' as $$
declare current_user_id uuid := auth.uid(); supplied_count int; owned_count int;
begin
  supplied_count := coalesce(array_length(ordered_rating_ids, 1), 0);
  if supplied_count > 25 then raise exception 'collection_full'; end if;
  select count(*) into owned_count from public.ratings r join public.catalog_items i on i.id = r.item_id
  where r.user_id = current_user_id and i.category = category_input and r.id = any(ordered_rating_ids);
  if owned_count <> supplied_count then raise exception 'invalid_rating_ids'; end if;
  update public.ratings set rank = rank + 100 where user_id = current_user_id and id = any(ordered_rating_ids);
  update public.ratings r set rank = x.position
  from unnest(ordered_rating_ids) with ordinality as x(id, position)
  where r.id = x.id and r.user_id = current_user_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.profile_categories enable row level security;
alter table public.catalog_items enable row level security;
alter table public.ratings enable row level security;
alter table public.activities enable row level security;
alter table public.follows enable row level security;
alter table public.activity_likes enable row level security;

create policy "profiles are public" on public.profiles for select using (true);
create policy "owners update profiles" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "category settings are public" on public.profile_categories for select using (true);
create policy "owners manage category settings" on public.profile_categories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "catalog is public" on public.catalog_items for select using (true);
create policy "authenticated users cache catalog" on public.catalog_items for insert to authenticated with check (true);
create policy "ratings visible for public categories" on public.ratings for select using (
  exists (select 1 from public.catalog_items i join public.profile_categories pc on pc.user_id = ratings.user_id and pc.category = i.category where i.id = ratings.item_id and pc.visible)
  or auth.uid() = user_id
);
create policy "owners create ratings" on public.ratings for insert to authenticated with check (auth.uid() = user_id);
create policy "owners update ratings" on public.ratings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners delete ratings" on public.ratings for delete using (auth.uid() = user_id);
create policy "activities follow rating visibility" on public.activities for select using (exists (select 1 from public.ratings where ratings.id = activities.rating_id));
create policy "follows are public" on public.follows for select using (true);
create policy "users create own follows" on public.follows for insert to authenticated with check (auth.uid() = follower_id);
create policy "users delete own follows" on public.follows for delete using (auth.uid() = follower_id);
create policy "likes are public" on public.activity_likes for select using (true);
create policy "users create own likes" on public.activity_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "users delete own likes" on public.activity_likes for delete using (auth.uid() = user_id);

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('profile-media', 'profile-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy "profile media is public" on storage.objects for select using (bucket_id = 'profile-media');
create policy "users upload own profile media" on storage.objects for insert to authenticated with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "users update own profile media" on storage.objects for update to authenticated using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "users delete own profile media" on storage.objects for delete to authenticated using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);
