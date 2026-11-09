"use client";
import { useEffect, useState } from "react";

/* ==text== → <mark>text</mark> */
function Rich({ text }) {
  return text.split(/(==[^=]+==)/g).map((part, i) =>
    part.startsWith("==") && part.endsWith("==") ? <mark key={i}>{part.slice(2, -2)}</mark> : part
  );
}

function Figure({ f }) {
  if (f.kind === "screens") {
    return (
      <figure className="cs-figure">
        <div className="cs-screens" data-n={f.items.length} style={{ "--n": f.items.length }}>
          {f.items.map((s) => (
            <div key={s.src} className={`cs-screen ${/before/i.test(s.label) ? "is-before" : ""}`}>
              <img src={s.src} alt={s.label} loading="lazy" />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        {/* captions hidden on all work pages (user preference) */}
      </figure>
    );
  }
  if (f.kind === "logos") {
    // transparent logo files sitting directly on the page — no box, no labels
    return (
      <figure className="cs-figure">
        <div className="cs-logos">
          {f.items.map((s) => <img key={s.src} src={s.src} alt={s.alt || ""} style={{ height: s.h }} loading="lazy" />)}
        </div>
        {/* captions hidden on all work pages (user preference) */}
      </figure>
    );
  }
  if (f.kind === "pair") {
    // two images side by side in a grid, same height
    return (
      <figure className="cs-figure">
        <div className="cs-pair">
          {f.items.map((s) => <img key={s.src} src={s.src} alt={s.alt || ""} loading="lazy" />)}
        </div>
        {/* captions hidden on all work pages (user preference) */}
      </figure>
    );
  }
  if (f.kind === "tall") {
    return (
      <figure className="cs-figure">
        <div className="cs-tall" data-cursor="Scroll" tabIndex={0}>
          <img src={f.src} alt={f.caption || ""} loading="lazy" />
        </div>
        {/* captions hidden on all work pages (user preference) */}
      </figure>
    );
  }
  return (
    <figure className="cs-figure">
      <img className="cs-wide" src={f.src} alt={f.caption || ""} loading="lazy" />
      {/* captions hidden on all work pages (user preference) */}
    </figure>
  );
}

export default function CaseStudy({ project: p, next }) {
  const toc = [{ id: "overview", title: "Overview" }, ...p.sections.map((s) => ({ id: s.id, title: s.title }))];
  const [current, setCurrent] = useState("overview");

  // scroll-spy: the last heading above 35% of the screen is "current"
  useEffect(() => {
    const ids = toc.map((t) => t.id);
    let raf = 0;
    const update = () => {
      raf = 0;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) cur = id;
      }
      setCurrent(cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, [p.slug]);

  return (
    <article className="cs">
      <aside className="cs-toc" aria-label="Contents">
        <p className="cs-toc-title">Contents</p>
        <ol>
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} data-state={t.id === current ? "current" : undefined}>{t.title}</a>
            </li>
          ))}
        </ol>
      </aside>

      <div className="cs-main">
        <header id="overview" className="cs-head reveal" style={{ "--i": 0 }}>
          <a href="/#work" className="cs-back link-underline">← Featured projects</a>
          <h1>{p.title}</h1>
          <p className="cs-summary">{p.summary}</p>
          <dl className="cs-meta">
            {p.meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>
                  {Array.isArray(v)
                    ? v.map((l, i) => (
                        <span key={l.href}>
                          {i > 0 && " · "}
                          <a href={l.href} target="_blank" rel="noreferrer" className="social">{l.label} <span>↗</span></a>
                        </span>
                      ))
                    : k === "Results" ? <mark>{v}</mark> : v}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <img className="cs-cover reveal" style={{ "--i": 1 }} src={p.cover} alt={`${p.title} cover`} />

        {p.sections.map((s) => (
          <section key={s.id} id={s.id} className="cs-section">
            <h2>{s.title}</h2>
            {s.body?.map((para, i) => <p key={i}><Rich text={para} /></p>)}
            {s.figures?.map((f, i) => <Figure key={i} f={f} />)}
          </section>
        ))}

        <a className="cs-next" href={`/work/${next.slug}`} data-cursor="Next project">
          <span className="cs-next-label">Next project</span>
          <span className="cs-next-row">
            <img src={next.cover} alt="" />
            <span>
              <strong>{next.title}</strong>
              <small>{next.tags}</small>
            </span>
            <span className="arrow" aria-hidden="true"><span>→</span><span>→</span></span>
          </span>
        </a>
      </div>
    </article>
  );
}
