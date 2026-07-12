// Exports the curriculum (single source of truth: src/data.ts) as JSON for
// other clients — currently the iOS app, which bundles it as a resource.
// Usage: tsx scripts/export-curriculum.ts [output-path]
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { roadmapData } from "../src/data";

const out = resolve(
  process.argv[2] ?? "curriculum.json"
);

const dir = dirname(out);
if (!existsSync(dir)) {
  console.error(`Output directory does not exist: ${dir}`);
  console.error("Pass an explicit output path, e.g. the iOS repo's Resources directory.");
  process.exit(1);
}

mkdirSync(dir, { recursive: true });
writeFileSync(out, JSON.stringify({ steps: roadmapData }, null, 2) + "\n");

const topicCount = roadmapData.reduce((n, s) => n + s.topics.length, 0);
const resourceCount = roadmapData.reduce(
  (n, s) => n + s.topics.reduce((m, t) => m + t.resources.length, 0),
  0
);
console.log(`Wrote ${out}: ${roadmapData.length} steps, ${topicCount} topics, ${resourceCount} resources.`);
