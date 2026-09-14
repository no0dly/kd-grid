create table public.gear (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  file_name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.gear enable row level security;

create policy "Anyone can read gear"
on public.gear
for select
to anon, authenticated
using (true);

insert into public.gear (name, file_name)
select
  regexp_replace(name, '\.[^.]+$', ''),
  name
from storage.objects
where bucket_id = 'gear'
order by name;
