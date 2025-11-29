/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "../../../models/todo.model";
import { GetLoggedInUser } from "@/lib/auth";

// Create Todo Func
export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await GetLoggedInUser();

    const { text } = await req.json();

    const todo = new Todo({ text, user: user._id });
    await todo.save();

    return NextResponse.json(
      {
        message: "Todo added",
        todo: {
          id: todo._id.toString(),
          text: todo.text,
          completed: todo.completed,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}

// Get All Todos Func
export async function GET() {
  try {
    await connectDB();
    const user = await GetLoggedInUser();
    console.log(user);
    const todos = await Todo.find({ user: user._id });

    return NextResponse.json(
      {
        todos: todos.map((todo) => ({
          id: todo._id.toString(),
          text: todo.text,
          completed: todo.completed,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load todos" },
      { status: 500 }
    );
  }
}
