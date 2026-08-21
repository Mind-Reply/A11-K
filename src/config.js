import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function env(name, fallback = "") {
  return process.env[name] ?? fallback;
}

export function loadConfig() {
  const sources = JSON.parse(readFileSync(join(root, "config", "sources.json"), "utf8"));
  return {
    root,
    sources,
    provider: env("PROVIDER", "fixture").toLowerCase(),
    publishMode: env("PUBLISH_MODE", "draft"),
    ghostAdminUrl: env("GHOST_ADMIN_URL").replace(/\/$/, ""),
    ghostAdminApiKey: env("GHOST_ADMIN_API_KEY"),
    ghostNewsletterSlug: env("GHOST_NEWSLETTER_SLUG"),
    artifactDir: env("ARTIFACT_DIR", join(root, "out")),
    eurostatEnabled: env("EUROSTAT_ENABLED", "true") === "true",
    egovEnabled: env("EGOV_ENABLED", "true") === "true",
    gcp: {
      projectId: env("GCP_PROJECT_ID", sources.gcp?.projectId || "mind-reply-496111"),
      projectNumber: env("GCP_PROJECT_NUMBER", sources.gcp?.projectNumber || "768983523738"),
      projectName: sources.gcp?.projectName || "MIND REPLY",
      region: env("GCP_REGION", sources.gcp?.region || "europe-west3"),
      consoleUrl:
        sources.gcp?.consoleUrl ||
        "https://console.cloud.google.com/welcome?project=mind-reply-496111",
    },
  };
}
