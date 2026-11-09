"use client";
import { useEffect, useRef, useState } from "react";
import GooglyEyes from "./GooglyEyes";
import { hellos, photos, site } from "@/content/site";

/* ── Hello in many languages ── */
function HelloRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % hellos.length), 2200);
    return () => clearInterval(id);
  }, []);
  const { word, language } = hellos[i];
  return (
    <p className="hello">
      <span className="sr-only">Hello</span>
      <span className="hello-mask" aria-hidden="true">
        <span className="hello-word" key={word}>{word},</span>
      </span>
      <span className="hello-lang" key={language} aria-hidden="true">{language}</span>
    </p>
  );
}

/* ── Photo stack that shuffles ── */
const leans = ["-1.5deg", "1.5deg", "-1deg", "1deg"]; // top card sits almost straight
function PhotoStack() {
  const [order, setOrder] = useState(photos.map((_, i) => i));
  const [leaving, setLeaving] = useState(null);
  // the shuffle is silent (the swoosh was removed on request)
  const next = () => {
    if (leaving !== null) return;
    setLeaving(order[0]);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(null);
    }, 460);
  };
  useEffect(() => {
    const id = setInterval(next, 4200);
    return () => clearInterval(id);
  });
  return (
    <div className="photo-stack" onClick={next} data-cursor="Shuffle" role="button" aria-label="Next photo">
      {photos.map((src, i) => {
        const place = Math.min(order.indexOf(i), 3);
        return (
          <div
            key={src}
            className="photo-print"
            data-place={place}
            data-leaving={leaving === i ? "" : undefined}
            style={{ "--lean": leans[i % leans.length], zIndex: 10 - order.indexOf(i) }}
          >
            <img src={src} alt="" draggable="false" referrerPolicy="no-referrer" />
          </div>
        );
      })}
    </div>
  );
}

/* ── Little icons that come alive on hover ── */
const Doodle = ({ children, label }) => (
  <span className="doodle" aria-label={label} role="img">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </span>
);
const Pen = () => (
  <Doodle label="pen">
    <g className="d-lift"><path d="M4 20l1.5-5L16 4.5l3.5 3.5L9 18.5z" /><path d="M14 6.5l3.5 3.5" /></g>
  </Doodle>
);
const Code = () => (
  <Doodle label="code">
    <g className="d-code-l"><path d="M8 7l-5 5 5 5" /></g>
    <g className="d-code-r"><path d="M16 7l5 5-5 5" /></g>
    <path d="M13.5 5l-3 14" />
  </Doodle>
);
const Flag = () => (
  <Doodle label="chequered flag">
    <path d="M5 21V4" />
    <g className="d-wave">
      <path d="M5 4.5c3-1.6 5 1.4 8 0s4.5-1 6 0v8c-1.5-1-3-1.4-6 0s-5-1.6-8 0" />
      <path d="M9 4.2v8M13 4.6v8M17 4.1v8M5 8.5c3-1.6 5 1.4 8 0s4.5-1 6 0" strokeWidth="1.2" />
      <path d="M5 4.5h4v4H5zM13 4.6h4v3.9h-4zM9 8.5h4v4H9zM17 8.4h2v4h-2z" fill="currentColor" stroke="none" />
    </g>
  </Doodle>
);

/* ── Bio text (always full ink — no scroll fading) ── */
function ScrollInk({ children }) {
  return <div className="bio">{children}</div>;
}

export default function Hero() {
  return (
    <section id="intro" className="hero">
      <div className="col">
        <div className="hero-top reveal" style={{ "--i": 0 }}>
          <div className="hero-eyes"><GooglyEyes size={104} /></div>
          <PhotoStack />
        </div>

        <h1 className="sr-only">{site.fullName}, {site.role}</h1>
        <div className="reveal" style={{ "--i": 1 }}><HelloRotator /></div>

        <div className="reveal" style={{ "--i": 2 }}>
          <ScrollInk>
            <p>
              I’m Mohd Abdullah Meraj, and I design products that feel obvious, the kind where nobody notices the
              design because everything just works. I’ve spent the last few years obsessing over the small stuff: the
              spacing that makes a screen breathe, the flow that saves someone three taps, the detail you only miss when
              it’s gone.{" "}
              <a href="#work" className="link-underline">Some of my favourite work is just below.</a>
            </p>
            <p>
              Since 2020, I’ve designed for startups, agencies and enterprise teams at FourCore, DocuHub, Banao
              Technologies and Texium, and worked on brands like Zomato, boAt, Third Wave Coffee and Under 25. I also
              write code <Code />, so my designs don’t just look good in Figma. They actually survive being built.
            </p>
            <p>
              These days I design in code as much as in Figma <Pen />. When I’m not at my desk, you’ll probably find me
              watching F1 <Flag /> or deep in some new tool that’s caught my curiosity.
            </p>
          </ScrollInk>
        </div>

        <div className="hero-cta reveal" style={{ "--i": 3 }}>
          <div>
            <a href="#contact" className="chat-button">
              Let’s work together
              <span className="arrow" aria-hidden="true"><span>→</span><span>→</span></span>
            </a>
            <p className="status"><span className="status-dot" />{site.status}</p>
          </div>
          <div className="paper-note">
            <svg className="pin" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="6" fill="var(--accent-red)" />
              <circle cx="10" cy="6" r="2" fill="#fff" opacity=".5" />
              <path d="M12 14v8" stroke="#888" strokeWidth="1.5" />
            </svg>
            <small>{site.currently.label}</small>
            <strong>{site.currently.place}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
