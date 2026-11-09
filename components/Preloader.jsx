"use client";
import { useEffect, useState } from "react";
import { NameMark } from "./NameMarks";

/*
  First-visit intro:
  1. plain paper screen
  2. your lettered name springs up letter by letter, sparkles pop around it
  3. a circle opens from the centre of the screen until it covers everything
  4. the circle fades away into the site, which blurs in underneath
  Plays once per browser session. Add ?intro to the URL to see it again.
*/
export default function Preloader() {
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    const html = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (html.dataset.intro === "seen" || reduce) {
      html.dataset.revealed = "";
      html.dataset.intro = "seen";
      setStage("gone");
      return;
    }

    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    html.style.overflow = "hidden";

    at(250, () => setStage("write"));
    at(2900, () => setStage("circle")); // circle grows from the centre (1.6s)
    at(4800, () => {
      // after a short hold: site underneath, circle slowly fades out (1.3s)
      setStage("out");
      html.dataset.revealed = "";
      html.style.overflow = "";
    });
    at(6200, () => {
      setStage("gone");
      html.dataset.intro = "seen";
      try { sessionStorage.setItem("am:intro", "1"); } catch {}
    });
    return () => { timers.forEach(clearTimeout); html.style.overflow = ""; };
  }, []);

  if (stage === "gone") return null;

  return (
    <div className="preloader" data-stage={stage} aria-hidden="true">
      <div className="preloader-mark">{stage !== "idle" && <NameMark />}</div>
      <div className="preloader-circle" />
    </div>
  );
}
