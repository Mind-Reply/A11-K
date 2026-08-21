import { getFixtureDataset } from "./providers/fixture.js";
import {
  digitalIntensityDelta,
  digitalIntensityTrend,
  registrationsOn,
  techParkShare,
  euFundingOn,
  digitalizationGaps,
  nis2Summary,
  fundingVelocity,
  readinessIndex,
  buildBulletin,
} from "./compute.js";
import { renderAll } from "./render.js";
import { appendEntry, verifyLedger } from "./ledger.js";
import { loadConfig } from "./config.js";
import { maybePublishGhost } from "./publishers/ghost.js";
import { fetchEurostatDigitalIntensity, toIntensitySeries } from "./providers/eurostatLive.js";
import { fetchEgovRegistryDiscovery } from "./providers/egovLive.js";
import { fetchTedDigitalProcurement } from "./providers/tedLive.js";

export async function run({ asOf = defaultAsOf(), provider = "fixture" } = {}) {
  const config = loadConfig();
  const outDir = process.env.STL_OUT_DIR || config.artifactDir;
  const data = provider === "fixture" ? getFixtureDataset(asOf) : getFixtureDataset(asOf);
  let liveEurostat = null;
  let liveEgov = null;
  let liveTed = null;
  const liveAll = process.env.STL_LIVE === "1";
  if (provider !== "fixture" || liveAll || process.env.STL_LIVE_EUROSTAT === "1") {
    liveEurostat = await fetchEurostatDigitalIntensity();
    if (liveEurostat.ok) {
      const liveSeries = toIntensitySeries(liveEurostat.BG);
      if (liveSeries.length) {
        data.smeDigitalIntensity = liveSeries;
        data.eurostatSource = liveEurostat.source;
        data.eu27Intensity = liveEurostat.EU27;
      }
    }
  }
  if (provider !== "fixture" || liveAll || process.env.STL_LIVE_EGOV === "1") {
    liveEgov = await fetchEgovRegistryDiscovery();
  }
  if (provider !== "fixture" || liveAll || process.env.STL_LIVE_TED === "1") {
    liveTed = await fetchTedDigitalProcurement();
    if (liveTed.ok) data.tedProcurement = liveTed.notices;
  }
  const intensitySeries = data.smeDigitalIntensity;
  const delta = digitalIntensityDelta(intensitySeries);
  const trend = digitalIntensityTrend(intensitySeries);
  const todaysRegistrations = registrationsOn(data.registrations, asOf);
  const parkShare = techParkShare(todaysRegistrations.length ? todaysRegistrations : data.registrations);
  const funding = euFundingOn(data.euFundingAwards, asOf);
  const gaps = digitalizationGaps(data.sectorLags);
  const nis2 = nis2Summary(data.nis2Findings);
  const velocity = fundingVelocity(data.fundingRounds, asOf);
  const readiness = readinessIndex({
    latestIntensity: intensitySeries.at(-1).value,
    trend,
    fundingTotalUsd: velocity.totalUsd,
    parkShare,
  });
  const bulletin = buildBulletin({ asOf, delta, todaysRegistrations, funding, gaps, nis2, velocity, readiness });
  const report = {
    asOf,
    provider,
    readiness,
    delta,
    trend,
    parkShare,
    intensitySeries,
    todaysRegistrations,
    funding,
    gaps,
    nis2,
    velocity,
    bulletin,
    eu27Intensity: data.eu27Intensity ?? null,
    gcp: config.gcp,
    liveEurostat: liveEurostat ? { ok: liveEurostat.ok, reason: liveEurostat.reason ?? null, source: liveEurostat.source ?? null, points: liveEurostat.BG?.length ?? 0, eu27Points: liveEurostat.EU27?.length ?? 0 } : null,
    liveEgov: liveEgov ? { ok: liveEgov.ok, reason: liveEgov.reason ?? null, datasets: liveEgov.totalDatasets ?? 0 } : null,
    liveTed: liveTed ? { ok: liveTed.ok, reason: liveTed.reason ?? null, totalNotices: liveTed.total ?? 0, returned: liveTed.notices?.length ?? 0 } : null,
    tedProcurement: data.tedProcurement ?? null,
    generatedAt: new Date().toISOString(),
    ledger: { height: 0 },
  };
  const ledger = appendEntry(outDir, asOf, {
    readiness,
    delta,
    fundingTotalEur: funding.totalEur,
    registrations: todaysRegistrations.length,
    velocityUsd: velocity.totalUsd,
  });
  const verification = verifyLedger(outDir);
  report.ledger = {
    height: ledger.height ?? verification.height,
    tip: verification.tip,
    appended: ledger.appended === true,
    verified: verification.ok,
  };
  const files = renderAll(outDir, report);
  const publish = await maybePublishGhost({
    html: `<p>${bulletin.bg.join("</p><p>")}</p>`,
    title: `Дигитален монитор — София (${asOf})`,
    config,
  });
  report.publish = publish;
  return { report, files, ledger: report.ledger, publish };
}

function defaultAsOf() {
  return new Date().toISOString().slice(0, 10);
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/src/index.js") || process.argv[1]?.endsWith("index.js")) {
  const asOfArg = process.argv.find((arg) => arg.startsWith("--as-of="));
  const asOf = asOfArg ? asOfArg.split("=")[1] : undefined;
  const { report, files, ledger, publish } = await run({ asOf });
  console.log(
    JSON.stringify(
      {
        ok: true,
        asOf: report.asOf,
        provider: report.provider,
        readiness: report.readiness,
        delta: report.delta,
        fundingTodayEur: report.funding.totalEur,
        registrationsToday: report.todaysRegistrations.length,
        velocity7dUsd: report.velocity.totalUsd,
        nis2Open: report.nis2.open,
        ledger,
        publish,
        gcpProject: report.gcp?.projectId || null,
        live: {
          eurostat: report.liveEurostat,
          egov: report.liveEgov,
          ted: report.liveTed
        },
        files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, value.replaceAll("\\", "/")])),
      },
      null,
      2,
    ),
  );
}
