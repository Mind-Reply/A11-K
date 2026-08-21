import { run } from "../src/index.js";

export async function handler(req, res) {
  const asOf = req?.query?.asOf || req?.body?.asOf;
  const result = await run({ asOf, provider: process.env.PROVIDER || "fixture" });
  if (res) {
    res.status(200).json({
      ok: true,
      asOf: result.report.asOf,
      readiness: result.report.readiness,
      ledger: result.ledger,
      gcpProject: result.report.gcp?.projectId,
    });
    return;
  }
  return result;
}
