import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { signCookie } from "@/lib/auth";
import Session from "@/models/session.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    const isValidPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isValidPassword) {
      return NextResponse.json(
        { message: "Email or password incorrect.", success: false },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const session = await Session.create({ user: user._id });
    cookieStore.set("SessionId", signCookie(session.id), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      {
        message: "User Login successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Login error → ", error);
    return NextResponse.json(
      { error: "Failed to Login", success: false },
      { status: 500 }
    );
  }
}
