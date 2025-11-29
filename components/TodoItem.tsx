// components/TodoItem.tsx
"use client";

import { CircleCheck, Pencil, Trash2 } from "lucide-react";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  editText: string;
  onEditTextChange: (value: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => Promise<void> | void;
  onToggle: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  isMutating?: boolean;
}

export function TodoItem({
  todo,
  isEditing,
  editText,
  onEditTextChange,
  onStartEdit,
  onSaveEdit,
  onToggle,
  onDelete,
  isMutating,
}: TodoItemProps) {
  return (
    <li className="flex items-center justify-between rounded-lg bg-[#dce3b18c] p-3">
      {isEditing ? (
        <input
          className="w-full rounded-md bg-[#eef4c6] p-2 text-[#59641a] outline-none"
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
        />
      ) : (
        <span
          onClick={() => onToggle()}
          className={`cursor-pointer font-bold text-[#59641a] ${todo.completed ? "line-through text-[#e36862]" : ""
            }`}
        >
          {todo.text}
        </span>
      )}

      <div className="ml-4 flex gap-2">
        {isEditing ? (
          <button
            type="button"
            onClick={() => onSaveEdit()}
            disabled={isMutating}
            className="rounded-md bg-[#555f24] px-2 py-1 text-white/90 disabled:cursor-not-allowed  cursor-pointer disabled:opacity-70"
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            title="Edit"
            aria-label={`Edit todo: ${todo.text}`}
            onClick={onStartEdit}
            disabled={isMutating}
            className="rounded-md px-1 py-1 text-[#44922cc9] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            <Pencil className="size-5" />
          </button>
        )}

        <button
          type="button"
          title="Toggle complete"
          aria-label={`Mark todo as ${todo.completed ? "active" : "completed"}`}
          onClick={() => onToggle()}
          disabled={isEditing}
          className="rounded-md px-1 py-1 text-[#3d4126] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          <CircleCheck className="size-5" />
        </button>

        <button
          type="button"
          title="Delete"
          aria-label={`Delete todo: ${todo.text}`}
          onClick={() => onDelete()}
          disabled={isEditing}
          className="rounded-md px-1 py-1 text-[#e2284dd0] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          <Trash2 className="size-5" />
        </button>
      </div>
    </li>
  );
}
