import test from "node:test";
import assert from "node:assert/strict";
import { renderTufteProjection } from "../src/tufte.mjs";

const fixture = {
  title: "561 Group",
  sections: [{
    id: "overview",
    title: "Overview",
    tiles: [
      { id: "mission", kind: "prose", text: "Information first.", geometry: "wide" },
      { id: "figure-1", kind: "figure", text: "A figure.", caption: "Caption.", geometry: "margin" }
    ]
  }]
};

test("same input is byte-identical", () => {
  assert.equal(renderTufteProjection(fixture), renderTufteProjection(fixture));
});

test("semantic identity survives geometry changes", () => {
  const altered = structuredClone(fixture);
  altered.sections[0].tiles[0].geometry = "margin";
  const html = renderTufteProjection(altered);
  assert.match(html, /data-semantic-id="mission"/);
  assert.match(html, /data-semantic-id="mission"[^>]*data-geometry="margin"/);
});

test("semantic HTML and landmark relationships exist", () => {
  const html = renderTufteProjection(fixture);
  assert.match(html, /<main class="tufte-document">/);
  assert.match(html, /<h1>561 Group<\/h1>/);
  assert.match(html, /aria-labelledby="overview-heading"/);
  assert.match(html, /<h2 id="overview-heading">Overview<\/h2>/);
});

test("tiles are keyboard focusable", () => {
  const html = renderTufteProjection(fixture);
  assert.equal((html.match(/tabindex="0"/g) || []).length, 2);
});

test("reduced motion removes transitions", () => {
  const html = renderTufteProjection(fixture, { reducedMotion: true });
  assert.match(html, /transition: none !important/);
});

test("text is HTML escaped", () => {
  const html = renderTufteProjection({
    title: "<x>",
    sections: [{ id: "s", title: "A & B", tiles: [{ id: "t", text: "<img>" }] }]
  });
  assert.doesNotMatch(html, /<x>/);
  assert.match(html, /&lt;img&gt;/);
});
