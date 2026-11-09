"use client";
import { useEffect, useState } from "react";
import { NameMark } from "./NameMarks";
import { site } from "@/content/site";
import { soundEnabled, setSoundEnabled, play } from "@/lib/sound";

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: site.timezone.iana, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="clock opt" suppressHydrationWarning>
      {site.timezone.label} — <b>{time}</b>
    </span>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);
  const flip = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("am:theme", next); } catch {}
    setDark(!dark);
    play("toggle");
  };
  return (
    <button className="toggle" onClick={flip} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
      )}
      <span className="opt">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

function SoundToggle() {
  const [on, setOn] = useState(true); // on by default
  useEffect(() => setOn(soundEnabled()), []);
  const flip = () => {
    setSoundEnabled(!on);
    setOn(!on);
    if (!on) setTimeout(() => play("toggle"), 30);
  };
  return (
    <button className="toggle opt" onClick={flip} aria-pressed={on} aria-label={on ? "Sound is on, turn it off" : "Sound is off, turn it on"}>
      {/* the icon shows the current state: speaker with waves = on, crossed speaker = off */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        {on ? <path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
      </svg>
      <span>Sound {on ? "on" : "off"}</span>
    </button>
  );
}

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a href="/" className="header-logo" aria-label="Abdullah — home" data-cursor="Home">
          <NameMark sparkles={false} animate={false} aria-hidden="true" />
        </a>
        <nav>
          <a href="/#work" className="link-underline">Work</a>
          <a href="/archive" className="link-underline">Archive</a>
          <a href="/#intro" className="link-underline">About</a>
        </nav>
      </div>
      <div className="header-right">
        <a href={site.bookCall} target="_blank" rel="noreferrer" className="opt link-underline">Book a call</a>
        <SoundToggle />
        <ThemeToggle />
        <Clock />
      </div>
    </header>
  );
}
