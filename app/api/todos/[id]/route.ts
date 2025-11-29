import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "../../../../models/todo.model";
import { GetLoggedInUser } from "@/lib/auth";

// Update Todo Func
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await GetLoggedInUser();

    const { id } = await params;
    const { text, completed } = await req.json();

    const todo = await Todo.findOne({ _id: id, user: user._id });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const updatePayload: Record<string, unknown> = {};
    if (typeof text === "string") updatePayload.text = text;
    if (typeof completed === "boolean") updatePayload.completed = completed;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided" },
        { status: 400 }
      );
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user: user._id },
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Todo updated",
        todo: {
          id: updatedTodo._id.toString(),
          text: updatedTodo.text,
          completed: updatedTodo.completed,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/todos/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// Delete Todo Func
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await GetLoggedInUser();

    const { id } = await params;

    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Todo deleted",
        todo: {
          id: deletedTodo._id.toString(),
          text: deletedTodo.text,
          completed: deletedTodo.completed,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/todos/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
