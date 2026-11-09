import GooglyEyes from "@/components/GooglyEyes";

export const metadata = { title: "Page not found — Abdullah" };

// 404: the googly eyes stand in for the "0" and keep looking around for the page
export default function NotFound() {
  return (
    <main className="nf">
      <h1 className="nf-code" aria-label="404">
        <span aria-hidden="true">4</span>
        <span className="nf-eyes" aria-hidden="true"><GooglyEyes size={220} /></span>
        <span aria-hidden="true">4</span>
      </h1>
      <p className="nf-title">This page wandered off.</p>
      <p className="nf-sub">Even these eyes can’t find it. Maybe the link is old, or there’s a typo.</p>
      <div className="nf-links">
        <a href="/" className="chat-button">
          Back to home
          <span className="arrow" aria-hidden="true"><span>→</span><span>→</span></span>
        </a>
        <a href="/archive" className="link-underline">Browse the archive</a>
      </div>
    </main>
  );
}
