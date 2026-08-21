import sqlite3
from pathlib import Path

db = Path.home() / "AppData" / "Local" / "Temp" / "chrome-history-readonly.db"
if not db.exists():
    raise SystemExit(f"missing {db}")

con = sqlite3.connect(str(db))
cur = con.cursor()
q = """
SELECT
  datetime(last_visit_time/1000000-11644473600, 'unixepoch') AS last_visit,
  visit_count,
  url,
  title
FROM urls
WHERE url LIKE '%grok%'
   OR url LIKE '%x.ai%'
   OR title LIKE '%Grok%'
ORDER BY last_visit_time DESC
LIMIT 50
"""
rows = cur.execute(q).fetchall()
print(f"ROWS {len(rows)}")
for last_visit, count, url, title in rows:
    print(f"{last_visit}\t{count}\t{(title or '')[:80]}\t{url[:220]}")
