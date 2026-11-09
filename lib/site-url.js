// The site's public address, used for the sitemap, robots.txt and link previews.
// Set NEXT_PUBLIC_SITE_URL (e.g. https://abdullahmeraj.com) once a domain is connected;
// until then Vercel's production address is used automatically.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000"
).replace(/\/$/, "");
