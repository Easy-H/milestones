"use client";

import { ReactNode } from "react";

export function StatusDropdown({
  active,
  children,
  id,
  isOpen,
  onOpenChange,
  onSelect,
  options,
  value,
}: {
  active?: boolean;
  children?: ReactNode;
  id: string;
  isOpen: boolean;
  onOpenChange: (id: string | null) => void;
  onSelect: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <span className="status-cell">
      <button
        className={`status status-trigger ${active ? "blue" : ""}`}
        onClick={() => onOpenChange(isOpen ? null : id)}
        type="button"
      >
        {value}
      </button>
      {isOpen ? (
        <div className="status-menu">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                onOpenChange(null);
              }}
              type="button"
            >
              {option}
            </button>
          ))}
          {children}
        </div>
      ) : null}
    </span>
  );
}
