import { SITE_URL } from "@/lib/site-url";

// /robots.txt: everything may be indexed; points crawlers at the sitemap
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
