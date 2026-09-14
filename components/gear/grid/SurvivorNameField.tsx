"use client";

import { useState } from "react";
import { useSurvivorActions, useSurvivors } from "@/lib/gear/store";
import { duplicateNameError } from "@/lib/gear/utils";

type SurvivorNameFieldProps = {
  id: string;
  name: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
};

export function SurvivorNameField({
  id,
  name,
  className,
  labelClassName,
  errorClassName,
}: SurvivorNameFieldProps) {
  const survivors = useSurvivors();
  const { renameSurvivor } = useSurvivorActions();
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState<string | null>(null);

  function commit() {
    const nextError = duplicateNameError(draft, survivors, id);
    if (nextError) {
      setError(nextError);
      return;
    }

    if (renameSurvivor(id, draft)) {
      setError(null);
    }
  }

  return (
    <div>
      <label className={labelClassName} htmlFor={`survivor-name-${id}`}>
        Name
      </label>
      <input
        id={`survivor-name-${id}`}
        className={className}
        value={draft}
        placeholder="Survivor name"
        aria-invalid={error ? true : undefined}
        onChange={(event) => {
          const value = event.target.value;
          setDraft(value);
          setError(duplicateNameError(value, survivors, id));
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
      />
      {error ? <p className={errorClassName}>{error}</p> : null}
    </div>
  );
}
