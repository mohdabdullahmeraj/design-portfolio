import { playground } from "@/content/site";

// Home-page teaser for /archive: every piece in slowly scrolling columns
// (alternate columns go up / down), faded at the top and bottom, plus a link to the full page.
const COLS = 5;

export default function WorkWall() {
  const cols = Array.from({ length: COLS }, () => []);
  playground.forEach((it, i) => cols[i % COLS].push({ ...it, i }));

  return (
    <section id="archive" className="section reveal" style={{ "--i": 8 }} aria-labelledby="archive-title">
      <div className="wall-head">
        <h2 id="archive-title" className="section-title">Archive</h2>
        <a href="/archive" className="link-underline wall-link">See all {playground.length} pieces →</a>
      </div>
      <div className="wall" data-cursor="View">
        {cols.map((col, c) => {
          // same speed for every column: duration follows the column's total height
          const height = col.reduce((s, it) => s + it.h / it.w, 0);
          return (
            <div key={c} className={`wall-col ${c % 2 ? "down" : "up"}`} style={{ "--dur": `${Math.round(height * 7)}s` }}>
              {/* the list twice, so the loop is seamless */}
              <div className="wall-track">
                {[0, 1].map((copy) =>
                  col.map((it) => (
                    <a key={`${copy}-${it.src}`} href={`/archive#view-${it.i + 1}`} className="wall-tile" tabIndex={copy ? -1 : undefined} aria-hidden={copy ? true : undefined}>
                      <img src={it.src} alt={copy ? "" : it.alt} width={it.w} height={it.h} loading="lazy" decoding="async" draggable="false" />
                    </a>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="wall-foot">
        <a href="/archive" className="chat-button">
          See all my work
          <span className="arrow" aria-hidden="true"><span>→</span><span>→</span></span>
        </a>
      </div>
    </section>
  );
}
