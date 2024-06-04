alter type "public"."schedule_item_type" rename to "schedule_item_type__old_version_to_be_dropped";

create type "public"."schedule_item_type" as enum ('accomodation', 'transportation', 'meal', 'activity');

alter table "public"."schedule_items" alter column schedule_item_type type "public"."schedule_item_type" using schedule_item_type::text::"public"."schedule_item_type";

drop type "public"."schedule_item_type__old_version_to_be_dropped";


