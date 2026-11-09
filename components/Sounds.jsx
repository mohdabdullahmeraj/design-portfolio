"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { play, unlock } from "@/lib/sound";

// Site-wide sounds:
// - a soft click on every mouse press (touch: only on links/buttons)
// - a detent tick when a link scrolls you to a section on the same page
// - a page-flip when you move to another page
export default function Sounds() {
  const path = usePathname();
  const prev = useRef(path);

  useEffect(() => {
    if (prev.current !== path) { prev.current = path; play("page", 250); }
  }, [path]);

  useEffect(() => {
    let touch = false;
    const onDown = (e) => {
      touch = e.pointerType !== "mouse";
      unlock();
      if (!touch && e.button === 0) play("click", 35);
    };
    const onClick = (e) => {
      unlock();
      if (touch && e.target.closest?.("a, button, [role='button']")) play("click", 35);
      const a = e.target.closest?.("a[href*='#']");
      if (a) {
        const url = new URL(a.href, location.href);
        if (url.pathname === location.pathname && url.hash && document.getElementById(url.hash.slice(1))) {
          setTimeout(() => play("tick", 60), 90);
        }
      }
    };
    window.addEventListener("pointerdown", onDown, { capture: true, passive: true });
    window.addEventListener("click", onClick, { capture: true, passive: true });
    window.addEventListener("keydown", unlock, { capture: true, passive: true });
    window.addEventListener("touchend", unlock, { capture: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown, { capture: true });
      window.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
      window.removeEventListener("touchend", unlock, { capture: true });
    };
  }, []);
  return null;
}
