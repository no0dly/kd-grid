import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type TRPCContext = {
  headers: Headers;
  supabase: SupabaseClient<Database>;
};

export async function createTRPCContext(opts: {
  headers: Headers;
}): Promise<TRPCContext> {
  const supabase = await createClient();

  return {
    headers: opts.headers,
    supabase,
  };
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
