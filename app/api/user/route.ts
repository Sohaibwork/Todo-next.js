/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { GetLoggedInUser } from "@/lib/auth";

// Get current logged-in user
export async function GET() {
  try {
    await connectDB();

    const user = await GetLoggedInUser();

    if (!user || (user as any).success === false || !(user as any)._id) {
      return NextResponse.json(
        {
          message: (user as any).message || "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: (user as any)._id.toString(),
          name: (user as any).name,
          email: (user as any).email,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error → ", error);
    return NextResponse.json(
      { error: "Failed to get user", success: false },
      { status: 500 }
    );
  }
}
