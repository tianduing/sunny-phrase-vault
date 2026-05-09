const DEFAULT_BASE_URL = "https://codex.ximuai.com";
const DEFAULT_MODEL = "gpt-5.4";
const SYNC_PREFIX = "vault:";
const MAX_PHRASES = 500;
const MAX_FAVORITES = 1000;
const MAX_HTML_LENGTH = 500000;
const MAX_COLLECT_TEXT = 60000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const url = new URL(request.url);
    if (url.pathname === "/sync/load") {
      return loadSync(payload, env);
    }
    if (url.pathname === "/sync/save") {
      return saveSync(payload, env);
    }
    if (url.pathname === "/collect/url") {
      return collectUrl(payload);
    }

    return classifyPhrase(payload, env);
  },
};

async function classifyPhrase(payload, env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ error: "Missing OPENAI_API_KEY" }, 500);
  }

  const text = String(payload.text || "").trim().replace(/[。．.]+$/g, "");
  if (!text) {
    return json({ error: "Missing text" }, 400);
  }

  const categories = Array.isArray(payload.categories) ? payload.categories : [];
  const tones = Array.isArray(payload.tones) ? payload.tones : [];
  const risks = Array.isArray(payload.risks) ? payload.risks : [];
  const baseUrl = (env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const model = env.OPENAI_MODEL || DEFAULT_MODEL;

  const prompt = [
    "你是游戏发言素材的分类器，只输出 JSON",
    "把用户输入的一句中文短句划分为 category、tone、risk、note",
    "category 必须从给定 categories 的 key 中选择",
    "tone 必须从给定 tones 的 key 中选择",
    "risk 必须从 safe、spicy、danger 中选择",
    "note 用 2 到 6 个中文字符说明判断依据",
    "不要改写原句，不要输出解释",
    "",
    `categories: ${JSON.stringify(categories)}`,
    `tones: ${JSON.stringify(tones)}`,
    `risks: ${JSON.stringify(risks)}`,
    `text: ${text}`,
  ].join("\n");

  const upstream = await fetch(`${baseUrl}/v1/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "phrase_classification",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              category: { type: "string" },
              tone: { type: "string" },
              risk: { type: "string", enum: ["safe", "spicy", "danger"] },
              note: { type: "string" },
            },
            required: ["category", "tone", "risk", "note"],
          },
        },
      },
    }),
  });

  if (!upstream.ok) {
    return json({ error: "AI upstream failed" }, 502);
  }

  const data = await upstream.json();
  const outputText = extractOutputText(data);
  if (!outputText) {
    return json({ error: "AI returned empty output" }, 502);
  }

  try {
    return json(JSON.parse(outputText), 200);
  } catch {
    return json({ error: "AI returned invalid JSON" }, 502);
  }
}

async function loadSync(payload, env) {
  const store = assertStore(env);
  if (!store.ok) return store.response;

  const syncKey = normalizeSyncKey(payload.syncKey);
  if (!syncKey) {
    return json({ error: "Missing syncKey" }, 400);
  }

  const key = await syncStorageKey(syncKey);
  const data = await env.SUNNY_SYNC.get(key, "json");
  return json(
    data || {
      customPhrases: [],
      favorites: [],
      updatedAt: null,
    },
  );
}

async function saveSync(payload, env) {
  const store = assertStore(env);
  if (!store.ok) return store.response;

  const syncKey = normalizeSyncKey(payload.syncKey);
  if (!syncKey) {
    return json({ error: "Missing syncKey" }, 400);
  }

  const customPhrases = sanitizePhrases(payload.customPhrases);
  const favorites = sanitizeFavorites(payload.favorites);
  const body = {
    customPhrases,
    favorites,
    updatedAt: new Date().toISOString(),
  };
  await env.SUNNY_SYNC.put(await syncStorageKey(syncKey), JSON.stringify(body));
  return json(body);
}

async function collectUrl(payload) {
  const target = normalizeTargetUrl(payload.url);
  if (!target.ok) {
    return json({ error: target.error }, 400);
  }

  let upstream;
  try {
    upstream = await fetch(target.href, {
      redirect: "follow",
      headers: {
        Accept: "text/html,text/plain;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
      },
    });
  } catch {
    return json({ error: "Source fetch failed" }, 502);
  }

  if (!upstream.ok) {
    return json({ error: `Source returned ${upstream.status}` }, 502);
  }

  const contentType = upstream.headers.get("content-type") || "";
  if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(contentType)) {
    return json({ error: "Source is not a readable article" }, 415);
  }

  const html = (await upstream.text()).slice(0, MAX_HTML_LENGTH);
  const title = extractTitle(html);
  const text = extractReadableText(html).slice(0, MAX_COLLECT_TEXT);
  if (!text) {
    return json({ error: "No readable text found" }, 422);
  }

  return json({
    title,
    text,
    url: target.href,
  });
}

function assertStore(env) {
  if (!env.SUNNY_SYNC) {
    return {
      ok: false,
      response: json({ error: "Missing SUNNY_SYNC binding" }, 500),
    };
  }
  return { ok: true };
}

function normalizeTargetUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    if (!["http:", "https:"].includes(url.protocol)) {
      return { ok: false, error: "Only http(s) article URLs are supported" };
    }
    if (isBlockedHost(url.hostname)) {
      return { ok: false, error: "Private or local URLs are not supported" };
    }
    url.hash = "";
    return { ok: true, href: url.href };
  } catch {
    return { ok: false, error: "Invalid article URL" };
  }
}

function isBlockedHost(hostname) {
  const host = String(hostname || "")
    .trim()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .toLowerCase();
  if (!host || host === "localhost" || host.endsWith(".local")) return true;
  if (host.includes(":")) return true;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4) return false;

  const parts = ipv4.slice(1).map(Number);
  if (parts.some((part) => part < 0 || part > 255)) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  );
}

function normalizeSyncKey(syncKey) {
  const value = String(syncKey || "").trim();
  return value.length >= 4 ? value : "";
}

async function syncStorageKey(syncKey) {
  const bytes = new TextEncoder().encode(syncKey);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${SYNC_PREFIX}${hex}`;
}

function sanitizePhrases(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, MAX_PHRASES).flatMap((item) => {
    if (!item || typeof item.text !== "string") return [];
    return [
      {
        id: String(item.id || crypto.randomUUID()).slice(0, 80),
        text: String(item.text).trim().replace(/[。．.]+$/g, "").slice(0, 90),
        category: String(item.category || "uncategorized").slice(0, 32),
        tone: String(item.tone || "soft").slice(0, 32),
        risk: ["safe", "spicy", "danger"].includes(item.risk) ? item.risk : "safe",
        note: String(item.note || "自定义").slice(0, 24),
      },
    ];
  });
}

function sanitizeFavorites(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item).slice(0, 80)))].slice(0, MAX_FAVORITES);
}

function extractOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  const content = data.output?.flatMap((item) => item.content || []) || [];
  const textPart = content.find((item) => typeof item.text === "string");
  return textPart?.text || "";
}

function extractTitle(html) {
  const og =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i);
  const title = og?.[1] || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  return decodeHtmlEntities(stripTags(title)).trim().slice(0, 120);
}

function extractReadableText(html) {
  const source = pickArticleHtml(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<(br|hr)\b[^>]*>/gi, "\n")
    .replace(/<\/(p|div|section|article|li|h[1-6]|blockquote|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeHtmlEntities(source)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function pickArticleHtml(html) {
  const wechatStart = html.search(/<[^>]+id=["']js_content["'][^>]*>/i);
  if (wechatStart >= 0) {
    return html.slice(wechatStart);
  }
  const article = html.match(/<article\b[\s\S]*?<\/article>/i)?.[0];
  if (article) return article;
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0];
  if (main) return main;
  return html.match(/<body\b[\s\S]*?<\/body>/i)?.[0] || html;
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]+>/g, " ");
}

function decodeHtmlEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "-",
    nbsp: " ",
    quot: '"',
    rdquo: "”",
    rsquo: "’",
  };
  return String(value || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, key) => named[key.toLowerCase()] ?? match);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
