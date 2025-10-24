// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunctionArgs } from "@remix-run/node";

// import { prisma } from "~/db.server"; // Prisma disabled - using WordPress API

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    // Database is now handled by WordPress REST API
    // Just check if we can make a HEAD request to ourselves
    await fetch(url.toString(), { method: "HEAD" }).then((r) => {
      if (!r.ok) return Promise.reject(r);
    });
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};
