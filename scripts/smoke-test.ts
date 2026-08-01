/**
 * Backend smoke tests — the automated half of docs/qa-checklist.md.
 *
 * Boots the built server and exercises every endpoint's deterministic
 * behaviour: contracts, validation, CORS, rate limiting and static serving.
 * Deliberately requires NO LLM key — validation short-circuits before any
 * model call, and /api/ai/health returns a well-formed { ok: false } when the
 * provider is unreachable. That keeps this runnable in CI.
 *
 * What it does NOT cover: the success paths of explain/quiz/interview, which
 * need a live model, and anything in the UI. Those stay in the manual
 * checklist.
 *
 *   npm run build && npm run smoke
 */
import { spawn } from "child_process";
import path from "path";

// server.ts hardcodes 3000 (see docs/mobile-backend.md), so this cannot be
// parameterised without changing the server.
const BASE = "http://127.0.0.1:3000";
const IOS_ORIGIN = "capacitor://localhost";
const ANDROID_ORIGIN = "http://localhost";

let passed = 0;
const failures: string[] = [];

async function check(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${name}: ${message}`);
    console.log(`  ✗ ${name}\n      ${message}`);
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  assert(
    actual === expected,
    `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
  );
}

async function waitForServer(timeoutMs = 30_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(`${BASE}/`);
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  throw new Error(`server did not become ready within ${timeoutMs}ms`);
}

function postJson(pathname: string, body: unknown): Promise<Response> {
  return fetch(`${BASE}${pathname}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function run(): Promise<void> {
  console.log("\nContracts");

  await check("GET /api/curriculum returns the full curriculum", async () => {
    const res = await fetch(`${BASE}/api/curriculum`);
    assertEqual(res.status, 200, "status");
    const body = (await res.json()) as { steps?: unknown[] };
    assert(Array.isArray(body.steps), "body.steps must be an array");
    assert(body.steps.length > 0, "curriculum must not be empty");
  });

  await check("GET /api/curriculum is cacheable", async () => {
    const res = await fetch(`${BASE}/api/curriculum`);
    const cacheControl = res.headers.get("cache-control") ?? "";
    assert(cacheControl.includes("max-age"), `expected max-age, got "${cacheControl}"`);
  });

  await check("GET /api/premium/teasers degrades to an empty list", async () => {
    const res = await fetch(`${BASE}/api/premium/teasers`);
    assertEqual(res.status, 200, "status");
    const body = (await res.json()) as { modules?: unknown[] };
    assert(Array.isArray(body.modules), "body.modules must be an array");
  });

  await check("GET /api/ai/health reports provider status", async () => {
    const res = await fetch(`${BASE}/api/ai/health`);
    assertEqual(res.status, 200, "status");
    const body = (await res.json()) as { ok?: unknown; provider?: unknown };
    assert(typeof body.ok === "boolean", "ok must be a boolean");
    assert(typeof body.provider === "string", "provider must be a string");
    // ok:false is a legitimate result here — CI has no model configured.
    if (body.ok === false) {
      const withHint = body as { hint?: unknown };
      assert(typeof withHint.hint === "string", "an unhealthy provider must explain why");
    }
  });

  console.log("\nInput validation (must reject before reaching the model)");

  await check("explain rejects a missing topicTitle", async () => {
    const res = await postJson("/api/ai/explain", {});
    assertEqual(res.status, 400, "status");
  });

  await check("explain rejects an over-long topicTitle", async () => {
    const res = await postJson("/api/ai/explain", { topicTitle: "x".repeat(301) });
    assertEqual(res.status, 400, "status");
  });

  await check("quiz rejects a missing topicTitle", async () => {
    const res = await postJson("/api/ai/quiz", {});
    assertEqual(res.status, 400, "status");
  });

  await check("interview rejects a missing topicTitle", async () => {
    const res = await postJson("/api/ai/interview", {});
    assertEqual(res.status, 400, "status");
  });

  await check("interview rejects a non-array messages field", async () => {
    const res = await postJson("/api/ai/interview", {
      topicTitle: "Vector databases",
      messages: "not an array",
    });
    assertEqual(res.status, 400, "status");
  });

  console.log("\nCORS (native webview origins)");

  await check("preflight from the iOS webview origin is allowed", async () => {
    const res = await fetch(`${BASE}/api/ai/explain`, {
      method: "OPTIONS",
      headers: {
        Origin: IOS_ORIGIN,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });
    assertEqual(res.status, 204, "status");
    assertEqual(res.headers.get("access-control-allow-origin"), IOS_ORIGIN, "allow-origin");
    assert(
      (res.headers.get("access-control-allow-headers") ?? "").toLowerCase().includes("content-type"),
      "Content-Type must be an allowed header or JSON POSTs cannot be sent"
    );
  });

  await check("preflight from the Android webview origin is allowed", async () => {
    const res = await fetch(`${BASE}/api/ai/explain`, {
      method: "OPTIONS",
      headers: { Origin: ANDROID_ORIGIN, "Access-Control-Request-Method": "POST" },
    });
    assertEqual(res.headers.get("access-control-allow-origin"), ANDROID_ORIGIN, "allow-origin");
  });

  await check("an unknown origin is refused", async () => {
    const res = await fetch(`${BASE}/api/ai/explain`, {
      method: "OPTIONS",
      headers: { Origin: "https://evil.example.com", "Access-Control-Request-Method": "POST" },
    });
    assertEqual(res.headers.get("access-control-allow-origin"), null, "allow-origin must be absent");
  });

  await check("responses vary on Origin so caches cannot cross-serve", async () => {
    const res = await fetch(`${BASE}/api/curriculum`, { headers: { Origin: IOS_ORIGIN } });
    assert((res.headers.get("vary") ?? "").includes("Origin"), "Vary must include Origin");
  });

  console.log("\nStatic serving");

  await check("the SPA is served at the root", async () => {
    const res = await fetch(`${BASE}/`);
    assertEqual(res.status, 200, "status");
    assert((await res.text()).includes("<!doctype html"), "expected an HTML document");
  });

  await check("the server bundle is not reachable over HTTP", async () => {
    for (const leak of ["/server.cjs", "/server.cjs.map"]) {
      const body = await (await fetch(`${BASE}${leak}`)).text();
      assert(
        !body.includes("express") && !body.includes("createViteServer"),
        `${leak} exposed server source`
      );
    }
  });

  // Last: this deliberately exhausts the per-minute budget, so nothing that
  // needs a non-429 response may run after it.
  console.log("\nRate limiting (exhausts the budget — must run last)");

  await check("preflights do not consume the rate-limit budget", async () => {
    const remaining = async (): Promise<number> => {
      const res = await fetch(`${BASE}/api/curriculum`);
      return Number(res.headers.get("ratelimit-remaining"));
    };
    const before = await remaining();
    for (let i = 0; i < 5; i++) {
      await fetch(`${BASE}/api/ai/explain`, {
        method: "OPTIONS",
        headers: { Origin: IOS_ORIGIN, "Access-Control-Request-Method": "POST" },
      });
    }
    const after = await remaining();
    assertEqual(before - after, 1, "only the two probe requests should count (delta of 1)");
  });

  await check("the per-minute limit is enforced", async () => {
    let sawLimit = false;
    for (let i = 0; i < 30 && !sawLimit; i++) {
      if ((await fetch(`${BASE}/api/curriculum`)).status === 429) sawLimit = true;
    }
    assert(sawLimit, "expected a 429 once the budget was exhausted");
  });
}

async function main(): Promise<void> {
  const bundle = path.join(process.cwd(), "dist", "server.cjs");
  console.log(`Starting ${bundle}`);
  const server = spawn("node", [bundle], {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "ignore", "inherit"],
  });

  let exitCode = 1;
  try {
    await waitForServer();
    await run();
    exitCode = failures.length === 0 ? 0 : 1;
  } catch (error) {
    console.error(`\nHarness error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    server.kill("SIGTERM");
  }

  console.log(`\n${passed} passed, ${failures.length} failed`);
  for (const failure of failures) console.log(`  ✗ ${failure}`);
  process.exit(exitCode);
}

void main();
