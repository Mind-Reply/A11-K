import { DatabaseSync } from "node:sqlite";
import { homedir } from "node:os";
import { join } from "node:path";

const dbPath = join(homedir(), "AppData", "Local", "Temp", "chrome-history-readonly.db");
const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = db
  .prepare(
    `SELECT datetime(last_visit_time/1000000-11644473600, 'unixepoch') AS last_visit,
            visit_count, url, title
     FROM urls
     WHERE url LIKE '%grok%' OR url LIKE '%x.ai%' OR title LIKE '%Grok%'
     ORDER BY last_visit_time DESC
     LIMIT 50`,
  )
  .all();
console.log(`ROWS ${rows.length}`);
for (const row of rows) {
  console.log(`${row.last_visit}\t${row.visit_count}\t${String(row.title || "").slice(0, 80)}\t${String(row.url).slice(0, 220)}`);
}
