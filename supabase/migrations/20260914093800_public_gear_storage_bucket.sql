update storage.buckets set public = true where id = 'gear';

create policy "Anyone can read gear images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gear');
