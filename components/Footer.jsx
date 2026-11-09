"use client";
import { useEffect, useRef, useState } from "react";
import { site, socials } from "@/content/site";
import { NameMark } from "./NameMarks";

const circled = ["➀", "➁", "➂", "➃", "➄", "➅"];

/* Hidden easter egg: a tiny snake game.
   Keyboard: arrow keys (Esc closes). Phones: swipe on the board or tap the arrow buttons. */
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
function Snake({ onClose }) {
  const canvas = useRef(null);
  const turn = useRef(null); // set from keys, swipes or buttons; read on the next tick
  const close = useRef(onClose);
  close.current = onClose;
  const [score, setScore] = useState(0);
  const [touch, setTouch] = useState(false);

  // a new direction is accepted unless it reverses straight into the snake
  const steer = (name) => { turn.current = DIRS[name]; };

  useEffect(() => {
    setTouch(matchMedia("(pointer: coarse)").matches);
    const c = canvas.current, g = c.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--ink").trim(), red = css.getPropertyValue("--accent-red").trim();
    const N = 16, S = 16;
    let snake = [{ x: 8, y: 8 }], dir = { x: 1, y: 0 }, food = { x: 3, y: 4 }, pts = 0;
    const key = (e) => {
      if (e.key === "Escape") return close.current();
      const name = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }[e.key];
      if (name) { steer(name); e.preventDefault(); }
    };
    // swipe on the board
    let start = null;
    const down = (e) => { start = { x: e.clientX, y: e.clientY }; c.setPointerCapture?.(e.pointerId); };
    const up = (e) => {
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      start = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 14) return;
      steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    };
    const tick = () => {
      const t = turn.current;
      if (t && !(t[0] === -dir.x && t[1] === -dir.y)) dir = { x: t[0], y: t[1] };
      turn.current = null;
      const head = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
      if (snake.some((s) => s.x === head.x && s.y === head.y)) { snake = [{ x: 8, y: 8 }]; pts = 0; setScore(0); }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { pts++; setScore(pts); food = { x: Math.random() * N | 0, y: Math.random() * N | 0 }; }
      else snake.pop();
      g.clearRect(0, 0, N * S, N * S);
      g.fillStyle = red; g.fillRect(food.x * S + 3, food.y * S + 3, S - 6, S - 6);
      g.fillStyle = ink; snake.forEach((s) => g.fillRect(s.x * S + 1, s.y * S + 1, S - 2, S - 2));
    };
    const id = setInterval(tick, 120);
    window.addEventListener("keydown", key);
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointerup", up);
    // no page scrolling behind the game while it is open
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearInterval(id);
      window.removeEventListener("keydown", key);
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointerup", up);
      document.documentElement.style.overflow = prev;
    };
  }, []);

  const pad = (name, label, glyph) => (
    <button type="button" className={`egg-pad-${name}`} aria-label={label}
      onPointerDown={(e) => { e.preventDefault(); steer(name); }}>{glyph}</button>
  );
  return (
    <div className="egg" onClick={onClose}>
      <div className="egg-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Snake game" data-tone="normal">
        <button type="button" className="egg-close" onClick={onClose} aria-label="Close game">✕</button>
        <strong>You found it 🐍</strong> · score {score}
        <canvas ref={canvas} width={256} height={256} />
        {touch ? (
          <div className="egg-pad">
            {pad("up", "Up", "↑")}{pad("left", "Left", "←")}{pad("down", "Down", "↓")}{pad("right", "Right", "→")}
          </div>
        ) : null}
        {touch ? "Swipe on the board or use the arrows" : "Arrow keys to play · Esc to close"}
      </div>
    </div>
  );
}

// scalloped badge outline: a circle with 12 soft bumps
const BADGE = (() => {
  const pts = [];
  for (let i = 0; i <= 240; i++) {
    const t = (i / 240) * Math.PI * 2, r = 92 + 7 * Math.cos(12 * t);
    pts.push(`${(111 + r * Math.cos(t)).toFixed(2)} ${(111 + r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();

/* Round mail badge between the words; the "REACH OUT" ring spins */
function Badge() {
  return (
    <span className="fbadge">
      <svg viewBox="0 0 222 222" className="fbadge-shape">
        <path d={BADGE} />
        <g className="fbadge-mail" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="93" y="96" width="36" height="28" rx="3.5" />
          <path d="M94 99l17 12.5L128 99" />
        </g>
      </svg>
      <svg viewBox="0 0 222 222" className="fbadge-ring">
        <defs><path id="fbadge-circle" d="M111 111m-62 0a62 62 0 1 1 124 0a62 62 0 1 1-124 0" /></defs>
        <text><textPath href="#fbadge-circle" textLength="389">REACH OUT · · · REACH OUT · · · REACH OUT · · ·</textPath></text>
      </svg>
    </span>
  );
}

function Word({ script }) {
  return (
    <span className="fword">
      Send an email<span className="fword-script">{script}</span>
    </span>
  );
}

function Run() {
  return (
    <span className="frun">
      <Word script="i’m eager to" /><Badge />
      <Word script="hear from you" /><Badge />
    </span>
  );
}

export default function Footer() {
  const [egg, setEgg] = useState(false);
  const box = useRef(null);

  // the footer slides up from behind the page as you scroll into it (-50% → 0)
  useEffect(() => {
    const el = box.current, footer = el?.parentElement;
    if (!el) return;
    let cur = -50, target = -50, raf = 0;
    const measure = () => {
      const r = footer.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / r.height));
      target = -50 * (1 - p);
      if (!raf) raf = requestAnimationFrame(step);
    };
    const step = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.05) cur = target;
      el.style.transform = `translateY(${cur.toFixed(2)}%)`;
      raf = cur === target ? 0 : requestAnimationFrame(step);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.transform = "none"; return; }
    measure();
    addEventListener("scroll", measure, { passive: true });
    addEventListener("resize", measure);
    return () => { removeEventListener("scroll", measure); removeEventListener("resize", measure); cancelAnimationFrame(raf); };
  }, []);

  const links = [
    ...socials,
    { label: "Email", href: `mailto:${site.email}` },
    { label: "Phone", href: site.phone.href },
    { label: "Book a call", href: site.bookCall },
  ].slice(0, 6);
  const cols = [links.slice(0, 3), links.slice(3, 6)];
  const ext = (h) => (h.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {});

  return (
    <footer className="footer" aria-label="Footer" data-tone="inverse">
      <div className="footer-box" ref={box}>
        <a href={`mailto:${site.email}`} className="fcta" data-cursor="Say hi" aria-label={`Send an email to ${site.email}`}>
          <span className="fcta-track" aria-hidden="true"><Run /><Run /></span>
        </a>

        <div className="flinks">
          <div className="fsocials">
            {cols.map((col, c) => (
              <div key={c}>
                {col.map((s, i) => (
                  <span key={s.label}>
                    {circled[c * 3 + i]} <a href={s.href} {...ext(s.href)}>{s.label}</a>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="factions">
            <a className="fpill" href={`mailto:${site.email}?subject=${encodeURIComponent("Project inquiry")}`}>Send a project inquiry</a>
            <a className="ftop" href="#intro" onClick={(e) => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); }}>
              <span className="fpill">Scroll back to top</span>
              <span className="ftop-arrow" aria-hidden="true"><span>↑</span><span>↑</span></span>
            </a>
          </div>
        </div>

        <div className="fcopy">
          <p>
            © {new Date().getFullYear()} {site.fullName}, all rights reserved ·{" "}
            <a href="https://www.behance.net/gallery/234016403/Portfolio" target="_blank" rel="noreferrer">Old folio</a>
          </p>
          <div className="fsig">
            <svg viewBox="0 0 200 40" className="fsig-arc" aria-hidden="true">
              <defs><path id="fsig-arc" d="M30 38 Q100 -6 170 38" /></defs>
              <text><textPath href="#fsig-arc" startOffset="50%" textAnchor="middle">DESIGNED AND CODED BY</textPath></text>
            </svg>
            <NameMark sparkles={false} animate={false} aria-label={site.fullName} />
            <svg viewBox="0 0 200 12" className="fsig-line" aria-hidden="true">
              <path d="M8 6H86M114 6H192" /><path d="M100 1l2 5-2 5-2-5z" className="fsig-star" />
            </svg>
          </div>
          <p>
            Purely hand-coded, with chai &amp; care ·{" "}
            <button onClick={() => setEgg(true)} data-cursor="Psst">Play snake</button>
          </p>
        </div>
      </div>
      {egg && <Snake onClose={() => setEgg(false)} />}
    </footer>
  );
}
