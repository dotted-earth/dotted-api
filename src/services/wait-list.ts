import { supabaseClient } from "@utils/supabase";
import { Hono } from "hono";
import { z } from "zod";

export const waitListService = new Hono();
const email = z.string().email();

waitListService.post("join", async (c) => {
  c.header("content-type", "application/json");
  const data = await c.req.json();

  if (!("email" in data)) {
    return c.json(
      {
        error: "Bad Request",
        message: "Invalid body",
      },
      400
    );
  }

  const zodData = await email.safeParseAsync(data["email"]);
  if (zodData.success) {
    try {
      await supabaseClient
        .from("email_sign_ups")
        .insert({ email: zodData.data });
      return c.json({ message: "Success" }, 200);
    } catch (error) {
      if (error instanceof Error) {
        return c.json(
          {
            error: "Internal Server Error",
            message: error.message,
          },
          500
        );
      }

      return c.json(
        {
          message: "Internal Server Error",
        },
        500
      );
    }
  }

  return c.json(
    {
      error: "Bad Request",
      message: "Bad email",
    },
    400
  );
});
