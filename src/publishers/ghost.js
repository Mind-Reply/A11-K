import { createHmac } from "node:crypto";

export async function maybePublishGhost({ html, title, config }) {
  if (!config?.ghostAdminUrl || !config?.ghostAdminApiKey) {
    return { skipped: true, reason: "missing Ghost credentials" };
  }
  const [id, secret] = config.ghostAdminApiKey.split(":");
  if (!id || !secret) {
    return { skipped: true, reason: "invalid Ghost Admin API key format" };
  }
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", kid: id, typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" })).toString("base64url");
  const sig = createHmac("sha256", Buffer.from(secret, "hex")).update(`${header}.${payload}`).digest("base64url");
  const status = config.publishMode === "live" ? "published" : "draft";
  const response = await fetch(`${config.ghostAdminUrl}/ghost/api/admin/posts/?source=html`, {
    method: "POST",
    headers: {
      Authorization: `Ghost ${header}.${payload}.${sig}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      posts: [{ title, html, status, tags: ["sofia-tech-ledger", "bulgaria", "sme"] }],
    }),
  });
  if (!response.ok) {
    throw new Error(`Ghost ${response.status}: ${await response.text()}`);
  }
  return { skipped: false, status, result: await response.json() };
}
