import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import CaseStudy from "@/components/CaseStudy";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} — Abdullah`, description: p.summary };
}

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];
  return (
    <>
      <main>
        <CaseStudy project={project} next={{ slug: next.slug, title: next.title, tags: next.tags, cover: next.cover }} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
