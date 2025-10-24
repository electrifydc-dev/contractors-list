// Session functionality disabled - not needed for contractor directory
// This file is kept for compatibility but user sessions are not required

import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

// User types and functions disabled
// import type { User } from "~/models/user.server";
// import { getUserById } from "~/models/user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// All user-related functions disabled for contractor directory
export async function getUserId(request: Request): Promise<undefined> {
  return undefined;
}

export async function getUser(request: Request) {
  return null;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  return null;
}

export async function requireUser(request: Request) {
  return null;
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  return redirect(redirectTo);
}

export async function logout(request: Request) {
  return redirect("/");
}