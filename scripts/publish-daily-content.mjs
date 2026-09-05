import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { run } from "../src/index.js";

const asOf = new Date().toISOString().slice(0, 10);
const outDir = join(process.cwd(), "out");
const publicDir = join(process.cwd(), "ledger");

process.env.STL_LIVE = "1";
process.env.ARTIFACT_DIR = outDir;

const { report, files } = await run({ asOf, provider: "live" });
mkdirSync(publicDir, { recursive: true });

copyFileSync(files.html, join(publicDir, "index.html"));
copyFileSync(files.svg, join(publicDir, "latest.svg"));
copyFileSync(files.social, join(publicDir, "latest.social.txt"));
copyFileSync(files.json, join(publicDir, "latest.json"));

const manifest = {
  generatedAt: report.generatedAt,
  asOf: report.asOf,
  provider: report.provider,
  readiness: report.readiness,
  live: {
    eurostat: report.liveEurostat,
    egov: report.liveEgov,
    ted: report.liveTed,
  },
  ledger: report.ledger,
  files: {
    html: `sofia-tech-ledger-${asOf}.html`,
    svg: `sofia-tech-ledger-${asOf}.svg`,
    social: `sofia-tech-ledger-${asOf}.social.txt`,
    json: `sofia-tech-ledger-${asOf}.json`,
  },
};
writeFileSync(join(publicDir, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log(JSON.stringify({ ok: true, ...manifest }, null, 2));
