// components/TodoFilters.tsx
"use client";

import type { TodoFilter } from "@/types/todo";

interface TodoFiltersProps {
  activeFilter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}

const baseBtn =
  "rounded-md px-4 py-2 text-sm font-bold cursor-pointer transition-colors";
const activeClasses = "bg-[#4a5317e5] text-[#dee5b4]";
const inactiveClasses = "bg-[#d2da95ac] text-[#555f24] hover:bg-[#d2da95d3]";

export function TodoFilters({ activeFilter, onChange }: TodoFiltersProps) {
  return (
    <div className="mt-4 mb-4 flex gap-4 text-sm">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`${baseBtn} ${
          activeFilter === "all" ? activeClasses : inactiveClasses
        }`}
      >
        All
      </button>
      <button
        type="button"
        onClick={() => onChange("active")}
        className={`${baseBtn} ${
          activeFilter === "active" ? activeClasses : inactiveClasses
        }`}
      >
        Active
      </button>
      <button
        type="button"
        onClick={() => onChange("completed")}
        className={`${baseBtn} ${
          activeFilter === "completed" ? activeClasses : inactiveClasses
        }`}
      >
        Completed
      </button>
    </div>
  );
}
