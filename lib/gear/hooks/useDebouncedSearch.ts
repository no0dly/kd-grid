"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import debounce from "debounce";
import { SEARCH_DEBOUNCE_MS } from "@/lib/gear/constants";

export function useDebouncedSearch(delayMs = SEARCH_DEBOUNCE_MS) {
  const [searchName, setSearchName] = useState("");

  const onInputChangeHandler = useMemo(
    () =>
      debounce((event: ChangeEvent<HTMLInputElement>) => {
        setSearchName(event.target.value);
      }, delayMs),
    [delayMs],
  );

  useEffect(() => {
    return () => {
      onInputChangeHandler.clear();
    };
  }, [onInputChangeHandler]);

  return { searchName, onInputChangeHandler };
}
