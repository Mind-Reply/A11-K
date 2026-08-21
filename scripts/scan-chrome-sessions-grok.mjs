import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const dir = join(homedir(), "AppData", "Local", "Google", "Chrome", "User Data", "Default", "Sessions");
const files = readdirSync(dir).filter((name) => /^(Session_|Tabs_)/.test(name));
const found = new Set();
for (const name of files) {
  try {
    const buf = readFileSync(join(dir, name));
    const text = buf.toString("latin1");
    const matches = text.match(/https?:\/\/[^\x00-\x1f\s"'<>]{8,220}/g) || [];
    for (const url of matches) {
      if (/grok\.com|x\.ai|grok\.x\.ai/i.test(url)) found.add(url.replace(/[\x00-\x1f]+$/g, ""));
    }
  } catch (err) {
    console.log(`SKIP ${name} ${err.code || err.message}`);
  }
}
console.log(`FILES ${files.length}`);
console.log(`GROK_URLS ${found.size}`);
for (const url of [...found].slice(0, 40)) console.log(url);
