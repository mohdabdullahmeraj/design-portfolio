import { projects } from "@/content/projects";
import { SITE_URL } from "@/lib/site-url";

// /sitemap.xml: every public page, so search engines can find them all
export default function sitemap() {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/archive`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, lastModified: now, changeFrequency: "yearly", priority: 0.9 })),
  ];
}
