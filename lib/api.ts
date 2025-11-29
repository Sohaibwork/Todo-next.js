/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api.ts
import type { Todo } from "@/types/todo";

const apiUrl = "/api/todos";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init?.headers || {}),
    },
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  return data as T;
}

export const todoApi = {
  async list() {
    return api<{ todos: Todo[] }>(apiUrl);
  },
  async create(text: string) {
    return api<{ message: string; todo: Todo }>(apiUrl, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },
  async update(id: string, payload: Partial<Pick<Todo, "text" | "completed">>) {
    return api<{ todo: Todo }>(`${apiUrl}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async remove(id: string) {
    return api<{ message: string }>(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
  },
};

export const authApi = {
  async register(name: string, email: string, password: string) {
    return api<{
      message: string;
      user: { id: string; name: string; email: string } | null;
    }>("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email: string, password: string) {
    return api<{
      message: string;
      user: { id: string; name: string; email: string } | null;
      success: boolean;
    }>("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getCurrentUser() {
    return api<{
      user: { id: string; name: string; email: string };
      success: boolean;
    }>("/api/user");
  },
  async logout() {
    return api<{
      message: string;
      success: boolean;
    }>("/api/logout", {
      method: "POST",
    });
  },
};
