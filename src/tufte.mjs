import { escapeHtml } from "./index.mjs";

export function renderTufteProjection(document, design = {}) {
  if (!document || typeof document.title !== "string" || !Array.isArray(document.sections)) {
    throw new TypeError("document requires title and sections");
  }
  const density = ["compact", "comfortable", "spacious"].includes(design.density)
    ? design.density : "comfortable";
  const sections = document.sections.map((section) => {
    if (typeof section.id !== "string" || typeof section.title !== "string") {
      throw new TypeError("each section requires id and title");
    }
    const seen = new Set();
    const tiles = (section.tiles || []).map((tile) => {
      if (!tile || typeof tile.id !== "string") throw new TypeError("each tile requires id");
      if (seen.has(tile.id)) throw new TypeError("duplicate semantic tile id");
      seen.add(tile.id);
      const kind = typeof tile.kind === "string" ? tile.kind : "prose";
      const text = escapeHtml(tile.text ?? "");
      const caption = escapeHtml(tile.caption ?? "");
      const geometry = escapeHtml(tile.geometry ?? "flow");
      return `<article id="${escapeHtml(tile.id)}" class="tufte-tile tufte-tile--${escapeHtml(kind)}" data-semantic-id="${escapeHtml(tile.id)}" data-geometry="${geometry}" tabindex="0"><p>${text}</p>${kind === "figure" ? `<figure><figcaption>${caption}</figcaption></figure>` : ""}</article>`;
    }).join("");
    return `<section id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading"><h2 id="${escapeHtml(section.id)}-heading">${escapeHtml(section.title)}</h2>${tiles}</section>`;
  }).join("");
  const motion = design.reducedMotion ? "transition: none !important;" : "";
  return [
    "<!doctype html><html lang=\"en\"><head>",
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${escapeHtml(document.title)}</title>`,
    `<style>.tufte-document{max-width:70rem;margin:auto;padding:2rem;line-height:1.6}.tufte-tile{margin:1rem 0;padding:1rem;border-left:.2rem solid currentColor}.tufte-tile:focus-visible{outline:.2rem solid currentColor}.tufte-document{--tufte-density:${density}}.tufte-tile{${motion}}</style>`,
    "</head><body><main class=\"tufte-document\">",
    `<h1>${escapeHtml(document.title)}</h1>`, sections,
    "</main></body></html>"
  ].join("");
}
