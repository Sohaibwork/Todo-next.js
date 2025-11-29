/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "@/models/user.model";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import Session from "@/models/session.model";

export async function GetLoggedInUser() {
  const cookieStore = await cookies();

  const errorResponse = {
    message: "Please Login",
    success: false,
    user: null,
  };
  const cookie = cookieStore.get("SessionId")?.value;
  if (!cookie) {
    return errorResponse;
  }

  const sessionId = verifyCookie(cookie);

  if (!sessionId) {
    return errorResponse;
  }

  const session = await Session.findById(sessionId);

  if (!session) {
    return errorResponse;
  }

  const user = await User.findById(session.user).select("-password");

  if (!user) {
    return {
      message: "User not found",
      success: false,
      user: null,
    };
  }

  return user;
}

export function signCookie(cookie: any) {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    throw new Error("COOKIE_SECRET environment variable is not set");
  }
  const signature = createHmac("sha256", secret).update(cookie).digest("hex");

  return `${cookie}.${signature}`;
}

export function verifyCookie(signedCookie: any) {
  const [cookie, cookieSignature] = signedCookie.split(".");
  const signature = signCookie(cookie).split(".")[1];

  if (signature === cookieSignature) {
    return cookie;
  }

  return false;
}
