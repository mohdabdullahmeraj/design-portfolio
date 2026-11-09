"use client";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { play } from "@/lib/sound";

/*
  Pinned sideways scroll:
  the section is (100vh + travel) tall, the inner part is sticky,
  and page scroll progress moves the rail's scrollLeft. It can also be dragged.
*/
export default function Projects() {
  const section = useRef(null);
  const rail = useRef(null);

  useEffect(() => {
    const sec = section.current;
    const r = rail.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let travel = 0, raf = 0, lastIndex = -1, cardW = 1;

    const measure = () => {
      const cards = r.querySelectorAll("[data-card]");
      cardW = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
      // no page-scroll pinning with reduced motion or on phones (there it is a plain swipe carousel)
      travel = reduce || matchMedia("(max-width: 767px)").matches ? 0 : Math.max(0, r.scrollWidth - r.clientWidth);
      sec.style.setProperty("--travel", `${travel}px`);
      sync();
    };
    const sync = () => {
      raf = 0;
      if (!travel) return;
      const top = sec.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / travel));
      r.scrollLeft = p * travel;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(sync); };
    // detent tick when the mouse moves from one card onto another
    let hovered = null;
    const onOver = (e) => {
      if (e.pointerType !== "mouse") return;
      const card = e.target.closest?.("[data-card]");
      if (card && card !== hovered) { if (hovered) play("tick", 60); hovered = card; }
    };
    const onLeave = () => { hovered = null; };
    r.addEventListener("pointerover", onOver);
    r.addEventListener("pointerleave", onLeave);
    const onRail = () => {
      const i = Math.round(r.scrollLeft / cardW);
      if (lastIndex !== -1 && i !== lastIndex) play("tick");
      lastIndex = i;
    };

    // Mouse drag
    let drag = null, moved = false;
    const down = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: r.scrollLeft, startY: window.scrollY };
      moved = false;
    };
    const dragMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) moved = true;
      if (travel) {
        // keep page scroll and rail in step while dragging
        window.scrollTo({ top: drag.startY - dx, behavior: "instant" });
      } else {
        r.scrollLeft = drag.left - dx;
      }
    };
    const dragEnd = () => { drag = null; };
    const blockClick = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    r.addEventListener("scroll", onRail, { passive: true });
    r.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", dragMove);
    window.addEventListener("pointerup", dragEnd);
    r.addEventListener("click", blockClick, true);
    const imgs = r.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", measure, { once: true }));
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      r.removeEventListener("scroll", onRail);
      r.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", dragMove);
      window.removeEventListener("pointerup", dragEnd);
      r.removeEventListener("click", blockClick, true);
      r.removeEventListener("pointerover", onOver);
      r.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="work" className="projects" ref={section} aria-labelledby="work-title">
      <h2 id="work-title" className="sr-only">Featured projects</h2>
      <div className="projects-sticky reveal" style={{ "--i": 4 }}>
        <div className="projects-rail" ref={rail} data-cursor="Drag" tabIndex={0} aria-label="Projects, scroll sideways">
          {projects.map((p) => (
            <article className="projects-card" data-card key={p.slug}>
              {/* Like Dave's: one cover image; clicking opens the case study */}
              <a className="projects-link" href={`/work/${p.slug}`} data-cursor="View project" draggable="false">
                <div className="projects-thumb">
                  <img src={p.cover} alt={p.title} data-on="" draggable="false" loading="lazy" style={p.coverPosition ? { "--pos": p.coverPosition } : undefined} />
                </div>
                <div className="projects-meta">
                  <h3>{p.title}</h3>
                  <p>{p.tags}</p>
                </div>
              </a>
            </article>
          ))}
          {/* Last card: a plain invitation to see the rest of the work */}
          <article className="projects-card" data-card>
            <a className="projects-link" href="/archive" data-cursor="See all" draggable="false">
              <div className="projects-thumb projects-more">
                <span className="projects-more-kicker">Posters, social, brand bits & experiments</span>
                <span className="projects-more-title">
                  View more work
                  <span className="arrow" aria-hidden="true"><span>→</span><span>→</span></span>
                </span>
              </div>
              <div className="projects-meta">
                <h3>Archive</h3>
                <p>Everything else I’ve made</p>
              </div>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
