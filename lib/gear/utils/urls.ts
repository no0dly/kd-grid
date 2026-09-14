import type { SupabaseClient } from "@supabase/supabase-js";
import { GEAR_BUCKET } from "@/lib/gear/constants";
import type { Database } from "@/types/database.types";

export function getGearPublicUrl(
  supabase: SupabaseClient<Database>,
  fileName: string,
) {
  return supabase.storage.from(GEAR_BUCKET).getPublicUrl(fileName).data
    .publicUrl;
}
