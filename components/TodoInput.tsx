// components/TodoInput.tsx
"use client";

import { FormEvent } from "react";

interface TodoInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export function TodoInput({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: TodoInputProps) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex items-center gap-2"
      aria-label="Add todo"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add a todo..."
        className="md:w-[400px] rounded-lg border-2 border-[#555f24cf] bg-[#eef4c6] p-3 font-bold text-[#59641a] outline-none"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-[#4a5317e5] px-6 py-3 font-bold text-[#dee5b4] cursor-pointer hover:bg-[#4a5317] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
