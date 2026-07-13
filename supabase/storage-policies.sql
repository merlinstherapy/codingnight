-- Storage policies for the exercise-videos bucket (bucket already created).
-- Run in Supabase SQL Editor after schema.sql.

-- Anyone can view videos (bucket is public; this covers API reads too)
create policy "exercise videos public read"
  on storage.objects for select
  using (bucket_id = 'exercise-videos');

-- Signed-in users may upload only into their own folder: <user_id>/...
create policy "exercise videos own upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'exercise-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ...and replace/delete only their own files
create policy "exercise videos own update"
  on storage.objects for update to authenticated
  using (bucket_id = 'exercise-videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "exercise videos own delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'exercise-videos' and (storage.foldername(name))[1] = auth.uid()::text);
