// AI reply corpus: asks real models for analyses through OpenRouter and runs
// every reply through the app's own import path, as a user would: copy the
// prompt, paste the answer, continue a cut-off answer, send the follow-up
// prompt the app offers, then import.
//
//   npm run corpus                      new run over the cases in ai-corpus/config.json
//   npm run corpus -- --resume          finish the latest run, reusing saved replies to
//                                       the same prompts
//   npm run corpus -- --only bio-fr     only the cases whose name contains "bio-fr"
//   npm run corpus:replay               re-import the latest run and the saved reply
//                                       folders with the current code, and compare
//   npm run corpus:replay -- <folder>   the same for one folder; --accept keeps the
//                                       new results as the baseline
//   npm run corpus:models               list OpenRouter's current free models
//   npm run corpus:score                score the content of the same replies as replay
//                                       with DeepEval (tests/evals/) and a judge model
//                                       ("judge" in config.json overrides the default)
//
// A run needs OPENROUTER_API_KEY in the environment. Output goes to ai-corpus/
// (git-ignored; AI_CORPUS_DIR moves it): config.json, and runs/<time>/ holding
// each reply, cases.json, transcript.json, results.json and report.md.
// Reply files are named <model>-<lens>-<lang>-<depth>-<access>.txt; -cont1.txt
// and on continue a cut-off answer, and -fix.txt answers the app's follow-up
// prompt (targeted completion, language, or JSON repair).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const home = path.resolve(process.env.AI_CORPUS_DIR || path.join(repo, "ai-corpus"));
const api = (process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1").replace(/\/+$/, "");
const MODES = { focused: "simple", expert: "expert", research: "research" };
const NAME = /^(.+?)-(bio|biopolitical|strategic|stategic)-(ar|en|fr)-(focused|expert|research)(?:-(none|provided|web))?(?=-|$)/;
const STEP = /-(?:cont\d+|fix\d*(?:-cont\d+)?)$/;
// Reasoning models spend part of max_tokens thinking; this much is added on top.
const THINKING_TOKENS = 4096;
const JUDGE = "nvidia/nemotron-3-ultra-550b-a55b:free";
const KEY_HELP = 'Set OPENROUTER_API_KEY first. In PowerShell: $env:OPENROUTER_API_KEY = "<your key>"';

class StopRun extends Error {}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (...parts) => console.log(...parts);
const fail = (message) => {
  console.error(message);
  process.exit(2);
};
const readJson = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback);
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const slug = (model) => model.replace(/[^a-z0-9.]+/gi, "-").replace(/^-|-$/g, "");

function loadConfig() {
  const file = path.join(home, "config.json");
  if (!fs.existsSync(file)) {
    const saved = path.join(os.homedir(), "Downloads", "ai-replies");
    writeJson(file, {
      models: ["qwen/qwen3.8-27b:free", "google/gemma-4-31b-it:free", "nvidia/nemotron-3-super-120b-a12b:free"],
      maxTokens: 8192,
      maxContinues: 4,
      followUps: 1,
      topics: {
        biopolitical: { topic: "Digital health passes and conditional mobility in the EU, 2020–2024" },
        strategic: {
          topic: "EU Carbon Border Adjustment Mechanism (CBAM)",
          sources: [
            "Regulation (EU) 2023/956 establishing a carbon border adjustment mechanism: https://eur-lex.europa.eu/eli/reg/2023/956/oj",
            "European Commission, Carbon Border Adjustment Mechanism: https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en",
          ].join("\n"),
        },
      },
      cases: [
        "bio-ar-focused-none",
        "bio-en-research-web",
        "bio-fr-expert-none",
        "strategic-ar-focused-none",
        "strategic-en-expert-provided",
        "strategic-fr-research-web",
      ],
      replay: [saved, path.join(saved, "free")].filter((dir) => fs.existsSync(dir)),
    });
    log(`Created ${file}. Edit it to change the models, topics, cases or replay folders.`);
  }
  return readJson(file);
}

function parseName(name) {
  const match = name.match(NAME);
  if (!match) return null;
  const [, source, lens, lang, depth, access = ""] = match;
  return { name, source, lens: lens.startsWith("bio") ? "biopolitical" : "strategic", lang, depth, access };
}

function commit() {
  try {
    const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: repo }).toString().trim();
    const changed = execFileSync("git", ["status", "--porcelain"], { cwd: repo }).toString().trim();
    return changed ? `${sha} + uncommitted changes` : sha;
  } catch {
    return "unknown";
  }
}

function runDirs() {
  const runs = path.join(home, "runs");
  if (!fs.existsSync(runs)) return [];
  return fs
    .readdirSync(runs, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(runs, entry.name, "cases.json")))
    .map((entry) => path.join(runs, entry.name))
    .sort();
}

// ---------- OpenRouter ----------

async function openRouter(route, options = {}) {
  const key = process.env.OPENROUTER_API_KEY;
  const response = await fetch(`${api}${route}`, {
    ...options,
    headers: { ...(key ? { Authorization: `Bearer ${key}` } : {}), "Content-Type": "application/json" },
  });
  const body = await response.json().catch(() => ({}));
  return { response, body, message: body?.error?.message || response.statusText };
}

async function listModels() {
  const { response, body, message } = await openRouter("/models");
  if (!response.ok) throw new Error(`OpenRouter model list failed (${response.status}: ${message})`);
  return body.data || [];
}

// The account's free-model requests for the current UTC day, or null when
// OpenRouter does not report them. A new key does not reset this count.
async function freeRequests() {
  try {
    const { response, body } = await openRouter("/key");
    const daily = body?.data?.free_model_daily_requests;
    return response.ok && Number.isFinite(daily?.remaining) ? daily : null;
  } catch {
    return null;
  }
}

async function chat(model, messages, maxTokens, thinking) {
  for (let attempt = 1; ; attempt += 1) {
    let reply;
    try {
      reply = await openRouter("/chat/completions", {
        method: "POST",
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          ...(thinking ? { reasoning: { max_tokens: thinking } } : {}),
        }),
        signal: AbortSignal.timeout(600_000),
      });
    } catch (error) {
      if (attempt >= 4) throw error;
      log(`    network error (${error.message}); retrying`);
      await wait(15_000 * attempt);
      continue;
    }
    const { response, body, message } = reply;
    if (response.status === 401) throw new StopRun("OpenRouter rejected the key (401). Check OPENROUTER_API_KEY.");
    if (response.status === 402) throw new StopRun(`OpenRouter needs credits for this request (402: ${message}).`);
    if (response.status === 429 && /per.?day|daily/i.test(message)) {
      throw new StopRun(`The daily free-model limit is reached (${message}).`);
    }
    if (response.status === 429 || response.status === 408 || response.status >= 500) {
      if (attempt >= 4) throw new Error(`OpenRouter ${response.status} after ${attempt} tries: ${message}`);
      const reset = Number(response.headers.get("x-ratelimit-reset"));
      const delay = Math.min(60_000, reset > Date.now() ? reset - Date.now() + 1000 : 15_000 * 2 ** (attempt - 1));
      log(`    OpenRouter ${response.status} (${message}); waiting ${Math.round(delay / 1000)}s`);
      await wait(delay);
      continue;
    }
    if (!response.ok) throw new Error(`OpenRouter ${response.status}: ${message}`);
    const choice = body.choices?.[0] || {};
    const content = choice.message?.content || "";
    const finish = choice.finish_reason || choice.native_finish_reason || "";
    if (!content.trim()) {
      const reasoning = body.usage?.completion_tokens_details?.reasoning_tokens;
      const problem = `empty reply (finish: ${finish || "?"}${reasoning ? `, ${reasoning} reasoning tokens` : ""})`;
      // A provider error mid-answer is worth another try; a used-up token budget is not.
      if (finish === "error" && attempt < 4) {
        log(`    ${problem}; retrying`);
        continue;
      }
      throw new Error(problem);
    }
    // Some providers send their error as the reply: "[ERROR: Max tokens (16384) exceeded]".
    if (/^\s*\[ERROR:[^\]]*\]\s*$/.test(content)) {
      throw new Error(`provider error: ${content.trim().replace(/^\[ERROR:\s*|\]$/g, "")}`);
    }
    return { content, finish, served: body.model, usage: body.usage };
  }
}

// ---------- the app ----------

async function withApp(work) {
  const port = 4300 + Math.floor(Math.random() * 500);
  const server = spawn(process.execPath, ["scripts/static-server.mjs"], {
    cwd: repo,
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });
  const base = `http://127.0.0.1:${port}/`;
  try {
    for (let tries = 0; ; tries += 1) {
      try {
        if ((await fetch(base)).ok) break;
      } catch {}
      if (tries > 50) throw new Error("the static server did not start");
      await wait(100);
    }
    const browser = await chromium.launch();
    try {
      return await work(browser, base);
    } finally {
      await browser.close();
    }
  } finally {
    server.kill();
  }
}

function counts(state) {
  const number = (pattern, text) => {
    const match = text.match(pattern);
    return match ? Number(match[1]) : null;
  };
  return {
    ...state,
    gaps: number(/with (\d+) (?:targeted completion )?gaps?\b/, state.status) ?? 0,
    added: number(/Added (\d+) missing parts?/, state.status),
    blockers: number(/(\d+) publication blockers?/, state.audit),
    review: number(/(\d+) review\b/, state.audit),
    repaired: number(/(\d+) repaired/, state.audit),
  };
}

const snapshot = (page) =>
  page
    .evaluate(() => {
      const el = (id) => document.getElementById(id);
      const visible = (id) => Boolean(el(id) && !el(id).hidden && el(id).offsetParent !== null);
      return {
        status: el("jsonStatus")?.textContent.trim().replace(/\s+/g, " ") || "",
        audit: visible("importAuditDetails") ? el("importAuditSummary")?.textContent.trim() || "" : "",
        importable: !el("importBtn")?.disabled,
        cutOff: visible("continuationField"),
        nextStep: el("repairPromptBtn")?.disabled ? "" : el("repairPromptBtn")?.textContent.trim() || "",
      };
    })
    .then(counts);

// One case, start to finish. `reply(name, messages)` returns the answer to the
// last message (from the API or a saved file), or null when there is none.
async function runCase(browser, base, kase, reply, config) {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(base);
    await page.evaluate(() => {
      window.__copied = [];
      Object.defineProperty(navigator.clipboard, "writeText", {
        configurable: true,
        value: async (text) => {
          window.__copied.push(text);
        },
      });
    });
    const copied = async (button) => {
      const before = await page.evaluate(() => window.__copied.length);
      await page.locator(button).click();
      await page.waitForFunction((count) => window.__copied.length > count, before);
      return page.evaluate(() => window.__copied.at(-1));
    };
    const settle = () => page.waitForTimeout(400);

    await page.locator("#langEn").click();
    await page.locator(`[data-lens="${kase.lens}"]`).click();
    await page.locator("#analysisLang").selectOption(kase.lang);
    await page.locator("#promptMode").selectOption(MODES[kase.depth]);
    if (kase.access) await page.locator("#evidenceAccess").selectOption(kase.access);
    let prompt = null;
    if (kase.topic) {
      await page.locator("#topicInput").fill(kase.topic);
      if (kase.sources) await page.locator("#sourcesInput").fill(kase.sources);
      prompt = await copied("#copyPromptBtn");
    }

    const history = [];
    let chars = 0;
    const say = async (step, text) => {
      const messages = [...history, { role: "user", content: text }];
      const answer = await reply(`${kase.name}${step}`, messages);
      if (answer !== null) history.push(messages.at(-1), { role: "assistant", content: answer });
      if (answer !== null && !step.includes("-fix")) chars += answer.length;
      return answer;
    };
    const continueCutOff = async (step) => {
      let used = 0;
      while (used < config.maxContinues && (await page.locator("#continuationField").isVisible())) {
        const answer = await say(`${step}-cont${used + 1}`, await copied("#repairPromptBtn"));
        if (answer === null) break;
        await page.locator("#continuationInput").fill(answer);
        await settle();
        used += 1;
      }
      return used;
    };

    const answer = await say("", prompt);
    if (answer === null) throw new Error("no reply");
    await page.locator("#jsonInput").fill(answer);
    await settle();
    const continues = [await continueCutOff("")];
    const first = await snapshot(page);
    // The answer to the prompt itself, continues joined. Merging a follow-up
    // can rewrite the box into the app's canonical form.
    const answered = await page.locator("#jsonInput").inputValue();
    const followUps = [];
    for (let round = 1; round <= config.followUps; round += 1) {
      if ((await page.locator("#continuationField").isVisible()) || !(await page.locator("#repairPromptBtn").isEnabled())) break;
      const asked = (await page.locator("#repairPromptBtn").textContent()).trim();
      const step = `-fix${round > 1 ? round : ""}`;
      const fix = await say(step, await copied("#repairPromptBtn"));
      if (fix === null) break;
      await page.locator("#jsonInput").fill(fix);
      await settle();
      continues.push(await continueCutOff(step));
      followUps.push(asked);
    }
    const final = await snapshot(page);
    // The analysis as the app holds it: continues joined, completions merged.
    const text = await page.locator("#jsonInput").inputValue();
    let imported = false;
    if (final.importable) {
      await page.locator("#importBtn").click();
      imported = await page
        .locator("#reviewContent")
        .waitFor({ state: "visible", timeout: 10_000 })
        .then(
          () => true,
          () => false,
        );
    }
    return { name: kase.name, chars, continues, followUps, first, final, imported, pageErrors, prompt, answered, text };
  } finally {
    await context.close();
  }
}

async function runCases(browser, base, cases, replyFor, config) {
  const rows = [];
  for (const [index, kase] of cases.entries()) {
    log(`[${index + 1}/${cases.length}] ${kase.name}`);
    try {
      rows.push(await runCase(browser, base, kase, replyFor(kase), config));
    } catch (error) {
      if (error instanceof StopRun) return { rows, stopped: error.message };
      log(`    error: ${error.message}`);
      rows.push({ name: kase.name, error: error.message });
    }
  }
  return { rows, stopped: "" };
}

// Results files keep the counts, not the prompt and analysis text.
const lean = ({ prompt, answered, text, ...row }) => row;

function savedReplies(dir) {
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(".txt"));
  const byName = new Map(files.map((name) => [name.replace(/(\.txt)+$/, ""), name]));
  const known = new Map(readJson(path.join(dir, "cases.json"), []).map((kase) => [kase.name, kase]));
  const names = [...byName.keys()].filter((name) => !STEP.test(name)).sort();
  for (const name of names) if (!known.has(name) && !parseName(name)) log(`Skipping ${name}: unrecognized name`);
  return {
    cases: names.map((name) => known.get(name) || parseName(name)).filter(Boolean),
    text: (name) => (byName.has(name) ? fs.readFileSync(path.join(dir, byName.get(name)), "utf8") : null),
  };
}

// ---------- reports ----------

function compare(before, now) {
  const worse = [];
  const better = [];
  const notes = [];
  if (!before) return { worse, better, text: "new" };
  if (before.error || now.error) {
    if (now.error && !before.error) worse.push("error");
    if (before.error && !now.error) better.push("no error");
    return { worse, better, text: [...worse, ...better].join("; ") || "same" };
  }
  if (before.imported !== now.imported) (now.imported ? better : worse).push(now.imported ? "imports" : "no longer imports");
  // Review items and blockers belong to an imported analysis; when a case
  // starts or stops importing, their counts are not comparable.
  const sameImport = before.imported === now.imported;
  for (const [label, was, is] of [
    ["first-pass gaps", before.first.gaps, now.first.gaps],
    ["gaps", before.final.gaps, now.final.gaps],
    ...(sameImport
      ? [
          ["review", before.final.review ?? 0, now.final.review ?? 0],
          ["blockers", before.final.blockers ?? 0, now.final.blockers ?? 0],
        ]
      : []),
  ]) {
    if (is > was) worse.push(`${label} ${was}→${is}`);
    if (is < was) better.push(`${label} ${was}→${is}`);
  }
  if (now.pageErrors.length > before.pageErrors.length) worse.push("page errors");
  if (before.final.nextStep !== now.final.nextStep) {
    notes.push(`next step: ${before.final.nextStep || "none"} → ${now.final.nextStep || "none"}`);
  }
  if (before.chars !== now.chars) notes.push("different reply");
  const text = [...worse.map((item) => `worse: ${item}`), ...better.map((item) => `better: ${item}`), ...notes].join("; ");
  return { worse, better, text: text || "same" };
}

function table(rows, before, against) {
  const cell = (value) => String(value ?? "–").replace(/\|/g, "\\|").replace(/\s+/g, " ");
  const old = new Map((before || []).map((row) => [row.name, row]));
  const lines = [
    `| Case | Chars | Continues | Follow-up | Imported | Gaps | Review | Blockers | Repaired | Next step | vs ${against} |`,
    "|---|---:|---|---|---|---|---:|---:|---:|---|---|",
  ];
  for (const row of rows) {
    const diff = cell(compare(old.get(row.name), row).text);
    if (row.error) {
      lines.push(`| ${row.name} | | | | error: ${cell(row.error)} | | | | | | ${diff} |`);
      continue;
    }
    const { first, final } = row;
    const gaps = row.followUps.length
      ? `${first.gaps} → ${final.gaps}${final.added === null ? "" : ` (${final.added} added)`}`
      : String(final.gaps);
    lines.push(
      [
        "",
        row.name,
        row.chars,
        `${row.continues[0]}${row.continues.slice(1).some(Boolean) ? ` + ${row.continues.slice(1).join(" + ")} on follow-up` : ""}${final.cutOff ? " (still cut off)" : ""}`,
        cell(row.followUps.join(", ") || "–"),
        row.imported ? "yes" : final.importable ? "import failed" : "no",
        gaps,
        cell(final.review),
        cell(final.blockers),
        cell(final.repaired),
        cell(final.nextStep || "–"),
        diff,
        "",
      ].join(" | ").trim(),
    );
  }
  return lines.join("\n");
}

// ---------- commands ----------

async function generate(args) {
  const config = loadConfig();
  if (!process.env.OPENROUTER_API_KEY) fail(KEY_HELP);
  const runs = runDirs();
  const known = new Map((await listModels()).map((model) => [model.id, model]));
  const outputLimit = (model) => known.get(model)?.top_provider?.max_completion_tokens || known.get(model)?.context_length;
  let dir;
  let cases;
  if (args.resume) {
    dir = runs.at(-1);
    if (!dir) fail("There is no run to resume.");
    cases = readJson(path.join(dir, "cases.json"));
  } else {
    cases = [];
    for (const model of config.models) {
      if (!known.has(model)) {
        log(`Skipping ${model}: OpenRouter does not list it now (npm run corpus:models shows the current free models).`);
        continue;
      }
      for (const spec of config.cases) {
        const kase = parseName(`${slug(model)}-${spec}`);
        if (!kase) fail(`Case "${spec}" should look like bio-en-research-web.`);
        const topic = config.topics[kase.lens];
        cases.push({
          ...kase,
          model,
          maxTokens: Math.min(config.maxTokens, outputLimit(model) || config.maxTokens),
          topic: topic.topic,
          sources: kase.access === "provided" ? topic.sources || "" : "",
        });
      }
    }
    dir = path.join(home, "runs", new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19));
  }
  if (args.only) cases = cases.filter((kase) => kase.name.includes(args.only));
  if (!cases.length) fail("No case to run.");
  if (!args.resume) writeJson(path.join(dir, "cases.json"), cases);

  const { response, body } = await openRouter("/key");
  const daily = response.ok ? body.data?.free_model_daily_requests : null;
  log(`Run folder: ${dir}`);
  log(
    `${cases.length} case(s). Each uses 1 request, plus 1 per continue and per follow-up.` +
      (daily ? ` Free-model requests left today: ${daily.remaining} of ${daily.limit}.` : ""),
  );

  const transcriptFile = path.join(dir, "transcript.json");
  const transcript = readJson(transcriptFile, []);
  let fetched = 0;
  const busy = new Set();
  const replyFor = (kase) => async (name, messages) => {
    const file = path.join(dir, `${name}.txt`);
    // A saved reply is reused only for the same prompt: after a code change the
    // app may ask something else at this step.
    const asked = createHash("sha256").update(String(messages.at(-1).content)).digest("hex").slice(0, 16);
    const answered = transcript.findLast((entry) => entry.name === name && !entry.error)?.asked;
    if (fs.existsSync(file) && answered === asked) return fs.readFileSync(file, "utf8");
    if (busy.has(kase.model)) throw new Error("skipped: its provider was rate-limiting earlier in this run");
    const thinking = known.get(kase.model)?.supported_parameters?.includes("reasoning") ? THINKING_TOKENS : 0;
    const started = Date.now();
    try {
      const answer = await chat(kase.model, messages, Math.min(kase.maxTokens + thinking, outputLimit(kase.model) || Infinity), thinking);
      fetched += 1;
      const seconds = Math.round((Date.now() - started) / 1000);
      transcript.push({ name, asked, model: kase.model, served: answer.served, finish: answer.finish, usage: answer.usage, seconds });
      fs.writeFileSync(file, answer.content);
      log(`    ${name}: ${answer.content.length} chars, finish ${answer.finish || "?"}, ${seconds}s`);
      return answer.content;
    } catch (error) {
      transcript.push({ name, model: kase.model, error: error.message });
      if (/^OpenRouter 429 after/.test(error.message)) {
        busy.add(kase.model);
        log(`    ${kase.model} keeps being rate-limited; skipping its other cases (--resume retries them)`);
      }
      throw error;
    } finally {
      writeJson(transcriptFile, transcript);
    }
  };

  const run = await withApp((browser, base) => runCases(browser, base, cases, replyFor, config));
  const { stopped } = run;
  const rows = run.rows.map(lean);
  const previous = runs.filter((run) => run !== dir).at(-1);
  const before = previous ? readJson(path.join(previous, "results.json"), {}).rows : [];
  const report = table(rows, before, previous ? `run ${path.basename(previous)}` : "previous run");
  const at = new Date().toISOString();
  writeJson(path.join(dir, "results.json"), { commit: commit(), at, finished: !stopped, rows });
  fs.writeFileSync(
    path.join(dir, "report.md"),
    `# AI corpus run ${path.basename(dir)}\n\nCommit: ${commit()} · ${at}\n\n${report}\n${stopped ? `\nStopped early: ${stopped}\n` : ""}`,
  );
  log(`\n${report}\n\n${fetched} new repl${fetched === 1 ? "y" : "ies"} from OpenRouter. Report: ${path.join(dir, "report.md")}`);
  if (stopped) {
    log(`\nStopped early: ${stopped}\nThe replies so far are saved. To finish this run later: npm run corpus -- --resume`);
    process.exitCode = 1;
  }
}

async function replay(args) {
  const config = loadConfig();
  const dirs = args.dirs.length ? args.dirs.map((dir) => path.resolve(dir)) : [runDirs().at(-1), ...config.replay].filter(Boolean);
  if (!dirs.length) fail("Nothing to replay yet: run npm run corpus first, or pass a folder of saved replies.");
  let worse = 0;
  await withApp(async (browser, base) => {
    for (const dir of dirs) {
      log(`\n## ${dir}\n`);
      const { cases, text } = savedReplies(dir);
      const rows = (await runCases(browser, base, cases, () => async (name) => text(name), config)).rows.map(lean);
      const inRuns = path.dirname(dir) === path.join(home, "runs");
      const file = inRuns ? path.join(dir, "results.json") : path.join(home, "baselines", `${slug(path.resolve(dir)).slice(-80)}.json`);
      const baseline = readJson(file, null);
      log(`\n${table(rows, baseline?.rows, "baseline")}\n`);
      const regressions = baseline ? rows.filter((row) => compare(baseline.rows.find((old) => old.name === row.name), row).worse.length) : [];
      if (!baseline || args.accept) {
        writeJson(file, { ...(baseline || {}), commit: commit(), at: new Date().toISOString(), rows });
        log(baseline ? `Baseline updated: ${file}` : `Baseline saved: ${file}`);
      } else {
        worse += regressions.length;
        log(regressions.length ? `${regressions.length} case(s) got worse.` : "Nothing got worse.");
      }
    }
  });
  if (worse) {
    log(`\n${worse} case(s) got worse than their baseline. If that is intended: npm run corpus:replay -- --accept`);
    process.exitCode = 1;
  }
}

async function score(args) {
  const config = loadConfig();
  if (!process.env.OPENROUTER_API_KEY) fail(KEY_HELP);
  const judge = config.judge || JUDGE;
  const daily = judge.endsWith(":free") ? await freeRequests() : null;
  if (daily && daily.remaining <= 0) {
    const reset = new Date(new Date().setUTCHours(24, 0, 0, 0)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    fail(
      `No free-model requests are left today (${daily.used} of ${daily.limit} used), so nothing was scored.` +
        ` The count resets at ${reset} your time (midnight UTC).`,
    );
  }
  if (daily) log(`Free-model requests left today: ${daily.remaining} of ${daily.limit}.`);
  const windows = process.platform === "win32";
  const venv = path.join(home, ".venv");
  const bin = (name) => path.join(venv, windows ? "Scripts" : "bin", windows ? `${name}.exe` : name);
  const run = (command, commandArgs, options) => spawnSync(command, commandArgs, { stdio: "inherit", ...options }).status;
  const requirements = path.join(repo, "tests", "evals", "requirements.txt");
  const installed = path.join(venv, "requirements.installed");
  const wanted = fs.readFileSync(requirements, "utf8");
  if (!fs.existsSync(installed) || fs.readFileSync(installed, "utf8") !== wanted) {
    log(`Installing DeepEval into ${venv}…`);
    const ready =
      (fs.existsSync(bin("python")) || run(windows ? "python" : "python3", ["-m", "venv", venv]) === 0) &&
      run(bin("python"), ["-m", "pip", "install", "--quiet", "--disable-pip-version-check", "-r", requirements]) === 0;
    if (!ready) fail("Could not set up DeepEval. It needs Python 3.9 or later on the PATH.");
    fs.writeFileSync(installed, wanted);
  }

  // Each golden is one reply: the prompt the app gave, and the final analysis.
  const dirs = args.dirs.length ? args.dirs.map((dir) => path.resolve(dir)) : [runDirs().at(-1), ...config.replay].filter(Boolean);
  if (!dirs.length) fail("Nothing to score yet: run npm run corpus first, or pass a folder of saved replies.");
  const goldens = [];
  const notImported = [];
  const stale = [];
  await withApp(async (browser, base) => {
    for (const dir of dirs) {
      log(`\n## ${dir}\n`);
      const { cases, text } = savedReplies(dir);
      // A run folder records a hash of the prompt each reply answered.
      const asked = new Map(readJson(path.join(dir, "transcript.json"), []).filter((entry) => !entry.error).map((entry) => [entry.name, entry.asked]));
      const wanted = [];
      for (const kase of cases.filter((item) => item.name.includes(args.only))) {
        if (kase.topic) {
          wanted.push(kase);
          continue;
        }
        // Saved replies have no record of their prompt; it is rebuilt from the title the reply gives.
        const title = text(kase.name).match(/"title"\s*:\s*("(?:[^"\\]|\\.)*")/)?.[1];
        if (!title) {
          log(`Skipping ${kase.name}: no title to rebuild its prompt from`);
          continue;
        }
        const sources = kase.access === "provided" ? config.topics[kase.lens]?.sources || "" : "";
        wanted.push({ ...kase, topic: JSON.parse(title), sources });
      }
      const { rows } = await runCases(browser, base, wanted, () => async (name) => text(name), config);
      for (const row of rows.filter((item) => item.text)) {
        // A reply the app did not import has no analysis to judge; its
        // problem is already in the import table.
        if (!row.imported) {
          notImported.push(`${path.basename(dir)}/${row.name}`);
          continue;
        }
        // After a prompt change the app asks something else; judging the old
        // reply against instructions it never had would score the wrong thing.
        const hash = asked.get(row.name);
        if (hash && hash !== createHash("sha256").update(String(row.prompt)).digest("hex").slice(0, 16)) {
          stale.push(`${path.basename(dir)}/${row.name}`);
          continue;
        }
        goldens.push({
          name: `${path.basename(dir)}/${row.name}`,
          input: row.prompt,
          // Judged against the prompt, so the model's own answer to it.
          actual_output: row.answered,
          additional_metadata: { folder: dir, imported: row.imported, gaps: row.final.gaps },
        });
      }
    }
  });
  if (!goldens.length) {
    log("\nNothing to score: the app imported none of these replies, or the prompt changed since they were generated.");
    if (stale.length) log(`Prompt changed since: ${stale.join(", ")}`);
    return;
  }
  const evals = path.join(home, "evals");
  const dataset = path.join(evals, ".dataset.json");
  writeJson(dataset, goldens);
  log(`\nScoring ${goldens.length} replies on 4 criteria with ${judge}. Scores already made are reused.\n`);
  const status = run(
    bin("deepeval"),
    ["test", "run", path.join(repo, "tests", "evals", "test_corpus_quality.py"), "--use-cache", "--ignore-errors", "--identifier", "corpus-quality"],
    {
      cwd: evals,
      env: {
        ...process.env,
        JUDGE_MODEL: judge,
        AI_CORPUS_DATASET: dataset,
        DEEPEVAL_RESULTS_FOLDER: path.join(evals, "results"),
        DEEPEVAL_TELEMETRY_OPT_OUT: "YES",
        // The free judge often needs more than DeepEval's 180 s per metric. A
        // timed-out call still counts against the daily limit, and its score is
        // lost; the judge's own request timeout in metrics.py applies instead.
        DEEPEVAL_DISABLE_TIMEOUTS: "1",
        PYTHONDONTWRITEBYTECODE: "1",
        PYTHONUTF8: "1",
        PYTEST_ADDOPTS: "-p no:cacheprovider",
      },
    },
  );
  const results = path.join(evals, "results");
  const latest = fs.existsSync(results) ? fs.readdirSync(results).filter((name) => name.endsWith(".json")).sort().at(-1) : null;
  if (latest) {
    const report = scoreReport(readJson(path.join(results, latest)), judge, notImported, stale);
    fs.writeFileSync(path.join(evals, "report.md"), report);
    log(`\n${report.split("\n## ")[0]}\nReasons for each low score: ${path.join(evals, "report.md")}`);
  }
  process.exitCode = status === 0 ? 0 : 1;
}

function scoreReport(run, judge, notImported = [], stale = []) {
  const label = (metric) => metric.name.replace(/ \[GEval\]$/, "");
  const criteria = [...new Set(run.testCases.flatMap((test) => test.metricsData.map(label)))];
  const tests = [...run.testCases].sort((a, b) => a.name.localeCompare(b.name));
  const rows = [];
  const low = [];
  let missing = 0;
  const errors = new Set();
  for (const test of tests) {
    const byLabel = new Map(test.metricsData.map((metric) => [label(metric), metric]));
    const cells = criteria.map((criterion) => {
      const metric = byLabel.get(criterion);
      if (!metric || metric.error || typeof metric.score !== "number") {
        missing += 1;
        if (metric?.error) errors.add(metric.error);
        return "–";
      }
      if (!metric.success) low.push(`- **${test.name}**, ${criterion} ${metric.score.toFixed(1)}: ${metric.reason}`);
      return metric.success ? metric.score.toFixed(1) : `**${metric.score.toFixed(1)}**`;
    });
    rows.push(`| ${test.name} | ${cells.join(" | ")} |`);
  }
  const threshold = tests[0]?.metricsData[0]?.threshold;
  return [
    `# Corpus content scores`,
    "",
    `Judge: ${judge}. Scores run from 0 to 1; bold is below the ${threshold} threshold, – is not scored yet.`,
    "",
    `| Reply | ${criteria.join(" | ")} |`,
    `|---|${criteria.map(() => "---:").join("|")}|`,
    ...rows,
    "",
    ...(missing
      ? [
          `${missing} score(s) missing. Run npm run corpus:score again once this is fixed (or tomorrow, after a daily limit): scores already made are reused.`,
          ...[...errors].slice(0, 3).map((error) => `- ${error}`),
          "",
        ]
      : []),
    ...(notImported.length
      ? [`Not scored, because the app did not import them: ${notImported.join(", ")}.`, ""]
      : []),
    ...(stale.length
      ? [
          `Not scored, because the prompt changed after they were generated (npm run corpus -- --resume --only <case> regenerates them): ${stale.join(", ")}.`,
          "",
        ]
      : []),
    `## Below threshold`,
    "",
    ...(low.length ? low : ["None."]),
    "",
  ].join("\n");
}

async function models() {
  const config = loadConfig();
  const free = (await listModels()).filter((model) => model.id.endsWith(":free")).sort((a, b) => a.id.localeCompare(b.id));
  for (const model of free) {
    const output = model.top_provider?.max_completion_tokens || "?";
    log(`${config.models.includes(model.id) ? "*" : " "} ${model.id.padEnd(52)} context ${model.context_length}, max output ${output}`);
  }
  log(`\n${free.length} free models; * = in ${path.join(home, "config.json")}`);
}

const [command, ...rest] = process.argv.slice(2);
const args = {
  resume: rest.includes("--resume"),
  accept: rest.includes("--accept"),
  only: rest.includes("--only") ? rest[rest.indexOf("--only") + 1] || "" : "",
  dirs: rest.filter((arg, index) => !arg.startsWith("--") && rest[index - 1] !== "--only"),
};
const commands = { generate, replay, score, models };
if (!commands[command]) {
  fail("usage: node scripts/ai-corpus.mjs generate [--resume] [--only <text>] | replay [<folder>...] [--accept] | score [<folder>...] [--only <text>] | models");
}
await commands[command](args);
