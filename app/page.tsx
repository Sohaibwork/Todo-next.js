/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { Todo, TodoFilter } from "@/types/todo";
import { todoApi, authApi } from "@/lib/api";
import { TodoInput } from "@/components/TodoInput";
import { TodoFilters } from "@/components/TodoFilters";
import { TodoItem } from "@/components/TodoItem";
import { UserProfile } from "@/components/UserProfile";
import { useRouter } from "next/navigation";


export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const router = useRouter();


  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);


  useEffect(() => {

    let isMounted = true;

    const loadInitialData = async () => {

      try {
        // Fetch current user
        const userData = await authApi.getCurrentUser();
        if (isMounted && userData.success) {
          setUser({
            name: userData.user.name,
            email: userData.user.email,
          });
        } else if (isMounted) {
          router.push("/login");
          setUser(null);
        }

        // Fetch todos
        const todoData = await todoApi.list();
        if (isMounted) {
          setTodos(todoData.todos);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to load data");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);


  // FILTERED TODOS
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
  }, [todos, filter]);

  // ADD TODO
  const handleAddTodo = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      toast.error("Input can't be empty");
      return;
    }

    setIsAdding(true);
    try {
      const data = await todoApi.create(trimmed);
      setTodos((prev) => [...prev, data.todo]);
      setInput("");
      toast.success(data.message || "Todo added");
    } catch (error: any) {
      toast.error(error.message || "Failed to add todo");
    } finally {
      setIsAdding(false);
    }
  };

  // START EDIT
  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // SAVE EDIT
  const handleSaveEdit = async (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      toast.error("Todo text can't be empty");
      return;
    }

    setMutatingId(id);
    const previousTodos = [...todos];

    try {
      // optimistic update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
      );

      const { todo: updatedTodo } = await todoApi.update(id, {
        text: trimmed,
      });

      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
      toast.success("Todo updated");
      setEditingId(null);
      setEditText("");
    } catch (error: any) {
      // rollback
      setTodos(previousTodos);
      toast.error(error.message || "Failed to update todo");
    } finally {
      setMutatingId(null);
    }
  };

  // TOGGLE TODO (optimistic)
  const handleToggleTodo = async (id: string) => {
    const current = todos.find((t) => t.id === id);
    if (!current) return;

    const newStatus = !current.completed;
    const previousTodos = [...todos];

    setMutatingId(id);

    // optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newStatus } : t))
    );

    try {
      await todoApi.update(id, { completed: newStatus });
    } catch (error: any) {
      // rollback
      setTodos(previousTodos);
      toast.error(error.message || "Failed to toggle todo");
    } finally {
      setMutatingId(null);
    }
  };

  // DELETE TODO (optimistic)
  const handleDeleteTodo = async (id: string) => {
    const previousTodos = [...todos];
    setMutatingId(id);

    // optimistic remove
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoApi.remove(id);
      toast.success("Todo deleted successfully");
    } catch (error: any) {
      // rollback
      setTodos(previousTodos);
      toast.error(error.message || "Failed to delete todo");
    } finally {
      setMutatingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");


    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  return (
    <div className="Source min-h-screen w-full bg-[#bac095] p-10">
      {/* Header with Profile */}
      <div className="mb-12 md:mb-6  relative">
        {user && (
          <div className="absolute top-0 right-0 ">
            <UserProfile user={user} onLogout={handleLogout} />
          </div>
        )}
        <h1 className="md:text-center  text-5xl font-bold text-[#59641a]">
          Todo App
        </h1>
      </div>


      <div className="flex flex-col items-center justify-center">
        <TodoInput
          value={input}
          onChange={setInput}
          onSubmit={handleAddTodo}
          isSubmitting={isAdding}
        />

        <TodoFilters activeFilter={filter} onChange={setFilter} />

        <div className="mt-5 md:w-[500px]">
          {isLoading ? (
            <div className="mt-10 text-center text-xl text-[#dee5b4]">
              Loading todos...
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="mt-10 text-center text-xl text-[#dee5b4]">
              No todos
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isEditing={editingId === todo.id}
                  editText={editingId === todo.id ? editText : todo.text}
                  onEditTextChange={setEditText}
                  onStartEdit={() => handleStartEdit(todo)}
                  onSaveEdit={() => handleSaveEdit(todo.id)}
                  onToggle={() => handleToggleTodo(todo.id)}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  isMutating={mutatingId === todo.id}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
