import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyCookie } from "@/lib/auth";
import Session from "@/models/session.model";

export async function POST() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const cookie = cookieStore.get("SessionId")?.value;

    if (!cookie) {
      return NextResponse.json(
        {
          message: "No session found",
          success: false,
        },
        { status: 400 }
      );
    }

    const sessionId = verifyCookie(cookie);

    if (!sessionId) {
      // Invalid cookie, clear it anyway
      cookieStore.delete("SessionId");
      return NextResponse.json(
        {
          message: "Invalid session",
          success: false,
        },
        { status: 400 }
      );
    }

    // Delete the session from database
    await Session.findByIdAndDelete(sessionId);

    // Clear the cookie
    cookieStore.delete("SessionId");

    return NextResponse.json(
      {
        message: "Logged out successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error → ", error);
    return NextResponse.json(
      { error: "Failed to logout", success: false },
      { status: 500 }
    );
  }
}
