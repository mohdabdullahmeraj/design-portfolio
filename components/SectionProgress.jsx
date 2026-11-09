"use client";
import { useEffect, useState } from "react";
import { sections } from "@/content/site";
import { play } from "@/lib/sound";

// Tick marks on the right edge (desktop): read, current, upcoming.
export default function SectionProgress() {
  const [current, setCurrent] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let raf = 0, lastIdx = -1;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.45;
      let idx = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) idx = i;
      });
      // a detent tick each time you scroll into the next/previous section
      if (lastIdx !== -1 && Math.abs(idx - lastIdx) === 1) play("tick", 60);
      lastIdx = idx;
      setCurrent(idx);
      // tuck the rail away once the footer reaches it
      const foot = document.querySelector(".footer");
      setHidden(!!foot && foot.getBoundingClientRect().top < window.innerHeight * 0.5 + 80);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <nav className={`progress${hidden ? " is-hidden" : ""}`} aria-label="Sections" aria-hidden={hidden || undefined}>
      <ol>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-label={s.label}
              aria-current={i === current ? "true" : undefined}
              data-state={i < current ? "read" : i === current ? "current" : ""}
            >
              <i />
            </a>
          </li>
        ))}
      </ol>
      <span className="progress-label" style={{ top: `${current * 16 + 8}px` }} key={current}>
        <b>{String(current + 1).padStart(2, "0")}</b> {sections[current].label}
      </span>
    </nav>
  );
}
