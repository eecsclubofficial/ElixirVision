create table images (
  id uuid default gen_random_uuid() primary key,
  filename text,
  phash text,
  ahash text,
  dhash text,
  embedding vector(512),
  created_at timestamp default now()
);
