import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { getGearPublicUrl } from "@/lib/gear/utils/urls";
import type { GearItem } from "@/lib/gear/types";

export const gearRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("gear")
      .select("id, name, file_name, created_at")
      .order("name", { ascending: true });

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch gear",
      });
    }

    return (data ?? []).map(
      (row): GearItem => ({
        ...row,
        image_url: getGearPublicUrl(ctx.supabase, row.file_name),
      }),
    );
  }),
});
