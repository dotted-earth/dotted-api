alter table "public"."schedule_items" add column "location_id" bigint;

alter table "public"."schedule_items" add constraint "schedule_items_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) not valid;

alter table "public"."schedule_items" validate constraint "schedule_items_location_id_fkey";


