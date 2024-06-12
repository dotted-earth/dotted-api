alter table "public"."schedule_items" drop constraint "public_schedule_items_itinerary_id_fkey";

alter table "public"."schedule_items" add constraint "public_schedule_items_itinerary_id_fkey" FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE not valid;

alter table "public"."schedule_items" validate constraint "public_schedule_items_itinerary_id_fkey";


