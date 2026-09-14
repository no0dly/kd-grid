"use client";

import { useEffect, useState } from "react";
import { useSurvivorStoreBase } from "@/lib/gear/store";

export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finish = () => setHydrated(true);
    const unsubscribe = useSurvivorStoreBase.persist.onFinishHydration(finish);
    if (useSurvivorStoreBase.persist.hasHydrated()) {
      finish();
    }
    return unsubscribe;
  }, []);

  return hydrated;
}
