import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  const robots = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin routes
Disallow: /admin/
Disallow: /login
Disallow: /logout
Disallow: /notes/
Disallow: /apply
Disallow: /applied`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
