// Minimal HTTP server for Cloud Run — runs the ledger pipeline on demand.
// GET /healthz  -> liveness
// GET /run?as_of=YYYY-MM-DD&live=1 -> executes the pipeline and returns the report summary

import { createServer } from 'node:http';
import { run } from './index.js';

const PORT = Number(process.env.PORT ?? 8080);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === '/healthz') {
      return json(res, 200, { ok: true, service: 'sofia-tech-ledger' });
    }
    if (url.pathname === '/run') {
      if (url.searchParams.get('live') === '1') process.env.STL_LIVE = '1';
      const asOf = url.searchParams.get('as_of') ?? undefined;
      const { report, files, ledger, publish } = await run({ asOf });
      return json(res, 200, {
        ok: true,
        asOf: report.asOf,
        readiness: report.readiness,
        live: { eurostat: report.liveEurostat, egov: report.liveEgov, ted: report.liveTed },
        ledger, publish, files
      });
    }
    return json(res, 404, { ok: false, error: 'not-found' });
  } catch (err) {
    return json(res, 500, { ok: false, error: String(err.message || err) });
  }
});

server.listen(PORT, () => console.log(`sofia-tech-ledger listening on :${PORT}`));

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(payload) });
  res.end(payload);
}
