import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

// import type { User } from "~/models/user.server"; // User types disabled

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

// User functions disabled for contractor directory
function isUser(user: unknown): user is any {
  return false; // Always return false since user auth is disabled
}

export function useOptionalUser(): any {
  return undefined; // No user authentication in contractor directory
}

export function useUser(): any {
  throw new Error("User authentication is disabled in contractor directory");
}

export function isEmpty(val: string): boolean {
  return val.trim().length == 0;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function validateURL(website: string): boolean {
  let url;
  try {
    url = new URL(website);
  } catch {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export function formatPhoneNumber(value: string): string {
  const phoneNumber = value.replace(/\D/g, "");
  let formattedPhoneNumber = "";
  if (phoneNumber.length <= 3) {
    formattedPhoneNumber = phoneNumber;
  } else if (phoneNumber.length <= 6) {
    formattedPhoneNumber = `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3, 6)}`;
  } else {
    formattedPhoneNumber = `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
  return formattedPhoneNumber;
};

export function formatZipCode(value: string): string {
  return value.replace(/\D/g, "");
}