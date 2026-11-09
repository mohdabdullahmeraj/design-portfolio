// Lists the pages, top-level frames (id, name, size) and text of a Figma .fig file — offline.
// Usage: node scripts/fig-inspect.mjs <file.fig> [--text]
import { parseFig, nodeId } from "openfig-core";
import { readFileSync, writeFileSync } from "node:fs";

const [file, flag] = process.argv.slice(2);
const doc = parseFig(new Uint8Array(readFileSync(file)));
const kids = (id) => doc.childrenMap.get(id) ?? [];
const size = (n) => (n.size ? `${Math.round(n.size.x)}x${Math.round(n.size.y)}` : "");

console.log(`nodes: ${doc.nodes.length}, images: ${doc.images.size}`);
if (doc.thumbnail) writeFileSync(file.replace(/\.fig$/, "-thumb.png"), doc.thumbnail);

const doc0 = doc.nodes.find((n) => n.type === "DOCUMENT");
for (const page of kids(nodeId(doc0))) {
  console.log(`\nPAGE ${nodeId(page)} "${page.name}"`);
  for (const f of kids(nodeId(page))) {
    console.log(`  ${nodeId(f)}  ${f.type}  "${f.name}"  ${size(f)}`);
    for (const c of kids(nodeId(f)).slice(0, 25)) {
      if (["FRAME", "INSTANCE", "SECTION", "GROUP", "SYMBOL"].includes(c.type)) console.log(`      ${nodeId(c)}  ${c.type}  "${c.name}"  ${size(c)}`);
    }
  }
}

if (flag === "--text") {
  console.log("\nTEXT:");
  const seen = new Set();
  for (const n of doc.nodes) {
    const t = n.textData?.characters?.trim();
    if (t && t.length > 2 && !seen.has(t)) { seen.add(t); console.log(" -", t.replace(/\s+/g, " ").slice(0, 400)); }
  }
}
