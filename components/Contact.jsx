"use client";
import { useEffect, useRef, useState } from "react";
import GooglyEyes from "./GooglyEyes";
import { site, socials } from "@/content/site";
import { play } from "@/lib/sound";

/*
  A chat card in the site's own language: crop marks in the corners (like the crosshair cursor),
  the 4-point sparkles from the ABDULLAH lettering, and the googly eyes as the avatar.
  Messages type themselves in once the card is on screen. Every message sits in one column;
  the eyes only show next to the last one in the group (like a real chat).
  Sending opens the visitor's email app with their message (no server needed).
*/
const script = ["hey", "email", "call", "note"];

// the 4-point sparkle from the lettering: |x|^n + |y|^n = 1, n = 0.64
const SPARK = (() => {
  const pts = [];
  for (let i = 0; i < 64; i++) {
    const t = (i / 64) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
    const k = 2 / 0.64; // parametric superellipse: x = cos^(2/n), y = sin^(2/n)
    pts.push(`${(Math.sign(c) * Math.abs(c) ** k * 10).toFixed(2)} ${(Math.sign(s) * Math.abs(s) ** k * 10).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();
const Spark = ({ className, color }) => (
  <svg className={`chat-spark ${className}`} viewBox="-10 -10 20 20" aria-hidden="true"><path d={SPARK} fill={color} /></svg>
);

// one message row: a fixed gutter on the left (so every bubble lines up), eyes only on the last one
function ChatRow({ eyes, wide, children }) {
  return (
    <li className={`chat-row ${wide ? "wide" : ""}`}>
      <span className="chat-gutter">
        {eyes && <span className="avatar"><GooglyEyes size={24} interactive={false} /></span>}
      </span>
      {children}
    </li>
  );
}

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };
  return (
    <button className="icon-btn" onClick={copy} aria-label={`Copy ${label}`} data-cursor={copied ? "Copied!" : "Copy"}>
      {copied ? "✓" : "⧉"}
    </button>
  );
}

export default function Contact() {
  const card = useRef(null);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [msg, setMsg] = useState("");
  const [from, setFrom] = useState("");
  const [email, setEmail] = useState("");
  // something@something.something, no spaces
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const [emailTouched, setEmailTouched] = useState(false);
  const emailBad = emailTouched && email.trim() && !emailOk;
  const [sent, setSent] = useState(null); // the visitor's message once sent
  const [reply, setReply] = useState(null); // "ok" | "fail" | "mailto"

  useEffect(() => {
    const el = card.current;
    let timers = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(script.length); return; }
      script.forEach((_, i) => {
        timers.push(setTimeout(() => setTyping(true), i * 1300));
        timers.push(setTimeout(() => { setTyping(false); setShown(i + 1); play("pop"); }, i * 1300 + 900));
      });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const text = msg.trim(), name = from.trim(), mail = email.trim();
    setSent({ text, from: name, status: site.formspree ? "Sending…" : "Sent ✓" });
    play("pop");
    setTimeout(() => setTyping(true), 600);

    if (!site.formspree) {
      // no form service yet: open the visitor's email app with the message ready
      setTimeout(() => { setTyping(false); setReply("mailto"); play("pop"); }, 1500);
      setTimeout(() => {
        const body = encodeURIComponent(`${text}\n\n— ${name || "a friend"}${mail ? ` (${mail})` : ""}`);
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("A note from your portfolio")}&body=${body}`;
      }, 2200);
      return;
    }

    // Formspree: the message goes straight to Abdullah's inbox; "email" becomes the reply-to address
    let ok = false;
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspree}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: name || "(no name)", email: mail, message: text, _subject: `Portfolio message from ${name || "someone"}` }),
      });
      ok = res.ok;
    } catch {}
    setSent({ text, from: name, status: ok ? "Delivered ✓" : "Not sent" });
    setTimeout(() => { setTyping(false); setReply(ok ? "ok" : "fail"); play("pop"); }, 900);
  };

  // eyes sit next to the last message Abdullah has sent so far
  const last = reply ? "reply" : [null, "hey", "phone", "call", "note"][shown];

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="col">
        <h2 id="contact-title" className="section-title">Talk to me</h2>

        <div className="chat-card" ref={card}>
          <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />
          <Spark className="s1" color="var(--accent-red)" />
          <Spark className="s2" color="var(--spark-yellow, #ffd400)" />
          <Spark className="s3" color="var(--accent-blue)" />

          <div className="chat-head">
            <span className="avatar"><GooglyEyes size={24} interactive={false} /></span>
            <span><b>Abdullah</b><small><i className="dot" /> usually replies within a day</small></span>
          </div>

          <ol className="thread" aria-live="polite">
            {shown >= 1 && <ChatRow eyes={last === "hey"}><span className="bubble">Hey! Hiring, or got something that needs designing? I’d love to hear about it.</span></ChatRow>}
            {shown >= 2 && (
              <ChatRow eyes={last === "email"}>
                <span className="bubble">Email me at <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a></span>
                <CopyBtn text={site.email} label="email" />
              </ChatRow>
            )}
            {shown >= 2 && (
              <ChatRow eyes={last === "phone"}>
                <span className="bubble">Or call / WhatsApp <a href={site.phone.href} className="link-underline">{site.phone.display}</a></span>
                <CopyBtn text={site.phone.display} label="phone number" />
              </ChatRow>
            )}
            {shown >= 3 && (
              <ChatRow eyes={last === "call"} wide>
                <span className="bubble">
                  Rather talk it through?
                  <a className="invite" href={site.bookCall} target="_blank" rel="noreferrer">
                    <span className="cal"><b>CALL</b><span>30</span></span>
                    <span>A 20-min intro call<small>Pick a time that suits you</small></span>
                    <span className="pill">Book a call ↗</span>
                  </a>
                </span>
              </ChatRow>
            )}
            {shown >= 4 && <ChatRow eyes={last === "note"}><span className="bubble">Or leave me a message right here. I read every one ↓</span></ChatRow>}

            {sent && (
              <li className="chat-row mine">
                <span className="bubble">{sent.text}{sent.from && <small>— {sent.from}</small>}</span>
                <span className="receipt">{sent.status}</span>
              </li>
            )}
            {typing && (
              <li className="chat-row"><span className="chat-gutter" /><span className="typing" aria-label="typing"><span /><span /><span /></span></li>
            )}
            {reply && (
              <ChatRow eyes={last === "reply"}>
                <span className="bubble">
                  {reply === "ok" && <>Got it, thank you! I’ll get back to you{email.trim() ? <> at <b>{email.trim()}</b></> : ""} soon.</>}
                  {reply === "mailto" && <>Got it, thank you! Your email app is opening so it lands straight in my inbox.</>}
                  {reply === "fail" && <>Hmm, that didn’t go through. Could you email me at <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a> instead?</>}
                </span>
              </ChatRow>
            )}

            {shown >= 4 && !sent && (
              <li className="chat-row mine">
                <form className="compose" onSubmit={send}>
                  <textarea rows={3} placeholder="Write your message…" value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Your message" />
                  <div className="compose-fields">
                    <input type="text" placeholder="Your name" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Your name" autoComplete="name" />
                    <input type="email" placeholder="Your email (so I can reply)" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailTouched(false)} onBlur={() => setEmailTouched(true)} aria-label="Your email" autoComplete="email" required={!!site.formspree} aria-invalid={emailBad || undefined} />
                    {emailBad && <span className="compose-error">That email doesn’t look right</span>}
                  </div>
                  <div className="compose-foot">
                    <button type="submit" disabled={!msg.trim() || (!!site.formspree && !emailOk)}>Send <span aria-hidden="true">↗</span></button>
                  </div>
                </form>
              </li>
            )}
          </ol>
        </div>

        <dl className="contact-list">
          <div><dt>Name</dt><dd>{site.fullName}</dd></div>
          <div><dt>Mail</dt><dd><a href={`mailto:${site.email}`} className="link-underline">{site.email}</a></dd></div>
          <div><dt>Phone</dt><dd><a href={site.phone.href} className="link-underline">{site.phone.display}</a></dd></div>
          <div><dt>Call</dt><dd><a href={site.bookCall} target="_blank" rel="noreferrer" className="social">Book a 20-min call <span>↗</span></a></dd></div>
          <div>
            <dt>Socials</dt>
            <dd>
              {socials.map((s, i) => (
                <span key={s.label}>{i > 0 && " · "}<a href={s.href} target="_blank" rel="noreferrer" className="social">{s.label} <span>↗</span></a></span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
