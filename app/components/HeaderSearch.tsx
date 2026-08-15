"use client";

import { useEffect, useRef, useState } from "react";

export function HeaderSearch({
  onChange,
  placeholder = "검색",
  value,
}: {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  const [expanded, setExpanded] = useState(Boolean(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  return (
    <div className={expanded || value ? "header-search expanded" : "header-search"}>
      <button aria-label="검색" onClick={() => setExpanded(true)} type="button">
        <span aria-hidden="true" className="search-glyph" />
      </button>
      {expanded || value ? (
        <input
          ref={inputRef}
          onBlur={() => {
            if (!value) setExpanded(false);
          }}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !value) setExpanded(false);
          }}
          placeholder={placeholder}
          value={value}
        />
      ) : null}
    </div>
  );
}
