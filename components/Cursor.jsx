"use client";
import { useEffect, useRef } from "react";

// Crosshair cursor: full-screen thin lines meeting at a "+".
// Any element with data-cursor="Label" shows that label next to the cursor.
export default function Cursor() {
  const root = useRef(null);
  const v = useRef(null);
  const h = useRef(null);
  const plus = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    let x = -100, y = -100, raf = 0;

    const draw = () => {
      raf = 0;
      v.current.style.transform = `translateX(${x}px)`;
      h.current.style.transform = `translateY(${y}px)`;
      plus.current.style.left = `${x}px`;
      plus.current.style.top = `${y}px`;
      label.current.style.left = `${x}px`;
      label.current.style.top = `${y}px`;
    };
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      html.dataset.cursorVisible = "";
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const over = (e) => {
      const t = e.target.closest?.("a, button, [role='button'], label, summary, input, textarea, [data-cursor]");
      const text = t?.getAttribute("data-cursor") ?? "";
      root.current.dataset.state = text ? "label" : t ? "link" : "";
      label.current.textContent = text;
    };
    const down = () => (root.current.dataset.pressed = "");
    const up = () => delete root.current.dataset.pressed;
    const leave = () => delete html.dataset.cursorVisible;

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    html.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      html.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="cursor-line v" ref={v} />
      <div className="cursor-line h" ref={h} />
      <div className="cursor-plus" ref={plus} />
      <div className="cursor-label" ref={label} />
    </div>
  );
}
