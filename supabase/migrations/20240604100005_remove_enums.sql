alter table "public"."schedules" drop column "schedule_intensity";

alter table "public"."schedules" drop column "schedule_length";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_preferences(user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
begin
  return json_build_object(
      'cuisinePreferences', (select array(select cuisine_id from user_cuisines)),
      'dietPreferences', (select array(select diet_id from user_diets)),
      'allergyPreferences', (select array(select food_allergy_id from user_food_allergies)),
      'recreationPreferences', (select array(select recreation_id from user_recreations))
  );
end;
$function$
;


