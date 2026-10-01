insert into public.catalog_items(provider, provider_id, category, title, subtitle, release_year, image_url, description, metadata, provider_score)
values
  ('tmdb', '157336', 'movies', 'Interstellar', 'Christopher Nolan', 2014, 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&h=1100&q=85', 'Explorers travel through a wormhole to ensure humanity''s survival.', '{"genres":["Science Fiction"]}', 8.7),
  ('musicbrainz', 'ok-computer', 'music', 'OK Computer', 'Radiohead', 1997, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&h=1100&q=85', 'Radiohead''s landmark third album.', '{"genres":["Alternative Rock"]}', 9.0),
  ('igdb', '119171', 'games', 'Hades', 'Supergiant Games', 2020, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&h=1100&q=85', 'Defy the god of the dead and escape the Underworld.', '{"genres":["Roguelike"]}', 9.0)
on conflict (provider, provider_id) do nothing;
