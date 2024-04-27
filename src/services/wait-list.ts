import Elysia, { t } from "elysia";
import type { SupabaseClient } from "@supabase/supabase-js";

export const waitListServices = (supabaseClient: SupabaseClient) =>
  new Elysia({ prefix: "/wait-list" }).post(
    "/join",
    async ({ body, error, set }) => {
      try {
        const data = await supabaseClient
          .from("email_sign_ups")
          .insert({ email: body.email });
        console.log(data);

        set.headers["content-type"] = "application/json";

        if (data.error) {
          if (data.error.code === "23505") {
            return error(data.status, data.error);
          }

          return error(500, data.error);
        }

        set.status = "OK";

        return {
          message: "success",
        };
      } catch (err) {
        error(500, err);
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email", error: "Invalid email" }),
      }),
    }
  );
