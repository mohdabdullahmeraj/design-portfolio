"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { play } from "@/lib/sound";

/*
  "Send a project inquiry" form (opens from the footer).
  Sends through the same Formspree form as the contact chat, with the subject
  "Project inquiry from NAME", so it lands in Gmail without opening an email app.
  No form ID set → falls back to opening the visitor's email app with everything filled in.
*/
// questions follow the user's reference form (nuraform): name, email, type, description, budget required; timeline + links optional
// options researched from real designer/studio inquiry forms, matched to the work on this site
const NEEDS = ["App / product design (UI/UX)", "Website design", "Web development", "Branding & logo", "Packaging", "Social media & posters", "Design audit / consultation", "Something else"];
const BUDGETS = ["₹1k – 10k", "₹10k – 50k", "₹50k – 1L", "₹1L+"];
const TIMELINES = ["ASAP", "This month", "1–3 months", "Flexible"];

// `writeIn` (optional) = { option, value, setValue, placeholder }: when that option is picked,
// its pill turns into a text field of the same shape, so the visitor can type what they mean.
function Chips({ options, value, onChange, multi, writeIn }) {
  const on = (o) => (multi ? value.includes(o) : value === o);
  // functional update, so quick taps in a row never overwrite each other
  const toggle = (o) => onChange((cur) => (multi ? (cur.includes(o) ? cur.filter((v) => v !== o) : [...cur, o]) : cur === o ? "" : o));
  return (
    <div className="inq-chips">
      {options.map((o) =>
        writeIn && o === writeIn.option && on(o) ? (
          <span key={o} className="inq-chip-input">
            <input
              value={writeIn.value}
              onChange={(e) => writeIn.setValue(e.target.value)}
              placeholder={writeIn.placeholder}
              aria-label={o}
              size={Math.max(writeIn.placeholder.length, writeIn.value.length) + 1}
              autoFocus
            />
            <button type="button" aria-label={`Remove ${o}`} onClick={() => toggle(o)}>✕</button>
          </span>
        ) : (
          <button key={o} type="button" className={on(o) ? "on" : ""} aria-pressed={on(o)} onClick={() => toggle(o)}>{o}</button>
        )
      )}
    </div>
  );
}

export default function Inquiry({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [needs, setNeeds] = useState([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const [links, setLinks] = useState("");
  const [other, setOther] = useState(""); // typed when "Something else" is picked
  const [state, setState] = useState("form"); // form | sending | sent | failed
  const first = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    first.current?.focus();
    document.documentElement.dataset.popup = "";
    const key = (e) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", key);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden"; // no page scrolling behind the form
    return () => { window.removeEventListener("keydown", key); document.documentElement.style.overflow = prev; delete document.documentElement.dataset.popup; };
  }, []);

  // something@something.something, no spaces
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const [emailTouched, setEmailTouched] = useState(false);
  const emailBad = emailTouched && email.trim() && !emailOk;
  const ready = name.trim() && emailOk && needs.length && budget && details.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!ready || state === "sending") return;
    const fields = {
      name: name.trim(),
      email: email.trim(),
      // "Something else" is replaced by what they typed, if anything
      "what they need": needs.map((n) => (n === "Something else" && other.trim() ? `Something else: ${other.trim()}` : n)).join(", ") || "—",
      budget: budget || "—",
      timeline: timeline || "—",
      message: details.trim(),
      links: links.trim() || "—",
    };
    if (!site.formspree) {
      const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project inquiry from ${fields.name}`)}&body=${encodeURIComponent(body)}`;
      return;
    }
    setState("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspree}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, _subject: `Project inquiry from ${fields.name}` }),
      });
      setState(res.ok ? "sent" : "failed");
      if (res.ok) play("pop");
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="inq" onClick={onClose} data-tone="inverse">
      <div className="inq-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="inq-title" data-tone="normal">
        <button type="button" className="inq-close" onClick={onClose} aria-label="Close">✕</button>

        {state === "sent" ? (
          <div className="inq-done">
            <span className="inq-done-mark" aria-hidden="true">✓</span>
            <h2 id="inq-title">Thanks, {name.trim().split(" ")[0]}!</h2>
            <p>Your inquiry is in my inbox. I’ll reply to <b>{email.trim()}</b> within a day or two.</p>
            <button type="button" className="inq-send" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 id="inq-title">Start a project</h2>
            <p className="inq-sub">A few quick details and I’ll get back to you within a day or two.</p>

            {/* wide screens: two columns so the whole form fits without scrolling; phones: one column */}
            <div className="inq-cols">
              <div className="inq-col">
                <div className="inq-row">
                  <label>Your name<input ref={first} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required /></label>
                  <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailTouched(false)} onBlur={() => setEmailTouched(true)} autoComplete="email" required aria-invalid={emailBad || undefined} />
                    {emailBad && <span className="inq-field-error">That email doesn’t look right</span>}
                  </label>
                </div>
                <fieldset><legend>What do you need? <small>(pick any)</small></legend><Chips options={NEEDS} value={needs} onChange={setNeeds} multi
                  writeIn={{ option: "Something else", value: other, setValue: setOther, placeholder: "Type it, e.g. a pitch deck" }} />
                </fieldset>
                <fieldset><legend>Budget</legend><Chips options={BUDGETS} value={budget} onChange={setBudget} /></fieldset>
                <fieldset><legend>Timeline <small>(optional)</small></legend><Chips options={TIMELINES} value={timeline} onChange={setTimeline} /></fieldset>
              </div>
              <div className="inq-col">
                <label className="inq-about">Tell me about the project
                  <textarea rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="What are you building, who is it for, and where are you stuck?" required />
                </label>
                <label><span>Links <small>(optional)</small></span>
                  <input value={links} onChange={(e) => setLinks(e.target.value)} placeholder="Your website, socials, or references you like" />
                </label>
              </div>
            </div>

            {state === "failed" && (
              <p className="inq-error">That didn’t go through. Try again, or email me at <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>.</p>
            )}
            <div className="inq-foot">
              <span>{ready ? "Goes straight to my inbox." : "Fill in everything that isn’t marked optional."}</span>
              <button type="submit" className="inq-send" disabled={!ready || state === "sending"}>
                {state === "sending" ? "Sending…" : "Send inquiry ↗"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
