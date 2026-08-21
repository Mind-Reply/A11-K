import { readFileSync } from "node:fs";

const path = process.argv[2];
const rawText = readFileSync(path, "utf8");
let data;
try {
  data = JSON.parse(rawText);
} catch {
  data = null;
}

const blob = typeof data === "string" ? data : rawText;
const id = blob.match(/"id":"(1a0[0-9a-f]+)"/)?.[1] || null;
const snippet = blob.match(/"snippet":"([^"]{20,400})"/)?.[1] || "";
const subject = blob.match(/"Subject":"([^"]+)"/)?.[1] || blob.match(/subject\\":\\"([^\\"]+)/i)?.[1] || null;
const gmail = id ? `https://mail.google.com/mail/u/0/#inbox/${id}` : null;
const exportLinks = [...blob.matchAll(/https:\/\/(?:email\.mail\.manus\.im|manus\.(?:im|cdn)|files\.manuscdn\.com)[^"\\\s<>]+/g)].map((m) => m[0]);
const unique = [...new Set(exportLinks)].slice(0, 12);
console.log(JSON.stringify({ id, subject, snippet: snippet.replace(/\\n/g, " ").slice(0, 500), gmail, exportLinks: unique }, null, 2));
