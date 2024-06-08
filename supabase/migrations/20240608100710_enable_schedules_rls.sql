create policy "Enable read access for all users"
on "public"."schedule_items"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."schedules"
as permissive
for select
to public
using (true);



