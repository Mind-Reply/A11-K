import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fixturePath = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "fixtures", "sofia-day.json");

export function getFixtureDataset(asOf) {
  const data = JSON.parse(readFileSync(fixturePath, "utf8"));
  data.asOf = asOf || data.asOf;
  return data;
}

export async function loadFixtureDataset(root) {
  return JSON.parse(readFileSync(join(root, "fixtures", "sofia-day.json"), "utf8"));
}
