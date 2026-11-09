import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import WorkWall from "@/components/WorkWall";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionProgress from "@/components/SectionProgress";
import { experience, clients } from "@/content/site";

// Lays the brands out on a 6-column grid: wordmarks take 2 columns (W), round/squarish logos 1 (S).
// Each row pattern adds up to 6, so every row is full; most rows hold 4 boxes. The "seat" card always comes last.
const ROWS = ["WSWS", "SWWS", "WWW", "SWSW"];
function brandCells() {
  const squares = clients.filter((c) => c.ratio < 1.8).map((c) => ({ ...c, square: true }));
  const wides = clients.filter((c) => !(c.ratio < 1.8));
  const out = [];
  for (let r = 0; squares.length || wides.length; r++) {
    for (const k of ROWS[r % ROWS.length]) {
      const next = (k === "S" ? squares : wides).shift() ?? (k === "S" ? wides : squares).shift();
      if (next) out.push(next);
    }
  }
  // spans on a 12-column grid: square 2, wordmark 4. In the last row each wordmark gives up
  // one column to the seat card, which takes everything that's left.
  for (const c of out) c.span = c.square ? 2 : 4;
  let used = 0, rowStart = 0;
  out.forEach((c, i) => { if (used % 12 === 0) rowStart = i; used += c.span; });
  const last = out.slice(rowStart);
  for (const c of last) if (!c.square) c.span = 3;
  out.push({ seat: true, square: true, span: 12 - last.reduce((s, c) => s + c.span, 0) });
  // phones (2 columns): the last round logo and the seat card pair up as the final row
  const lastSquare = out.findLast((c) => c.square && !c.seat);
  if (lastSquare) lastSquare.lastSquare = true;
  return out;
}

export default function Home() {
  return (
    <>
      <SectionProgress />
      <main>
        <Hero />
        <Projects />

        <section id="experience" className="section reveal" style={{ "--i": 5 }} aria-labelledby="experience-title">
          <div className="col">
            <h2 id="experience-title" className="section-title">Experience</h2>
            <ul className="exp">
              {experience.map((e) => (
                <li key={e.company + e.role}>
                  <span>{e.company}</span>
                  <span className="role">{e.role}</span>
                  <span className="dates">{e.dates}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="clients" className="section reveal" style={{ "--i": 6 }} aria-labelledby="clients-title">
          <div className="brands-head">
            <h2 id="clients-title" className="section-title">Companies &amp; brands I’ve worked with</h2>
          </div>
          {/* square box for round/squarish logos, 2-wide box for wordmarks */}
          <ul className="dgrid brands">
            {brandCells().map((c) =>
              c.seat ? (
                <li key="seat" className="seat is-square" style={{ "--span": c.span }}>
                  <div>
                    <strong>This seat’s saved for you.</strong>
                    <a href="#contact" className="link-underline">Let’s work together →</a>
                  </div>
                </li>
              ) : (
                <li key={c.name} className={`${c.square ? "is-square" : "is-wide"}${c.lastSquare ? " last-square" : ""}`} style={{ "--span": c.span }}>
                  {c.logo ? (
                    <span className="client-logo" role="img" aria-label={c.name}
                      style={{ "--logo": `url("${c.logo}")`, "--ratio": c.ratio, "--scale": c.scale ?? 1 }} />
                  ) : (
                    <span className="client">{c.name}</span>
                  )}
                </li>
              )
            )}
          </ul>
        </section>

        <WorkWall />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
