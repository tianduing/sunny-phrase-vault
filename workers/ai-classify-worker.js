const DEFAULT_BASE_URL = "https://codex.ximuai.com";
const DEFAULT_MODEL = "gpt-5.4";
const SYNC_PREFIX = "vault:";
const MAX_PHRASES = 500;
const MAX_FAVORITES = 1000;
const MAX_HTML_LENGTH = 500000;
const MAX_COLLECT_TEXT = 60000;
const MAX_AI_INPUT_TEXT = 14000;
const MAX_EXTRACTED_PHRASES = 40;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    try {
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
        return collectUrl(payload, env);
      }

      return classifyPhrase(payload, env);
    } catch (error) {
      return json({ error: "Worker crashed", detail: String(error?.message || error) }, 500);
    }
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

async function collectUrl(payload, env) {
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

  const categories = Array.isArray(payload.categories) ? payload.categories : [];
  const tones = Array.isArray(payload.tones) ? payload.tones : [];
  const risks = Array.isArray(payload.risks) ? payload.risks : [];
  const phrases = await extractPhrasesWithAi(
    {
      title,
      text,
      categories,
      tones,
      risks,
    },
    env,
  );

  return json({
    title,
    text,
    phrases,
    extractedBy: phrases.length ? "ai" : "ai-empty",
    url: target.href,
  });
}

async function extractPhrasesWithAi(article, env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) return [];

  const categories = article.categories.length ? article.categories : defaultCategories();
  const tones = article.tones.length ? article.tones : defaultTones();
  const risks = article.risks.length ? article.risks : defaultRisks();
  const baseUrl = (env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const model = env.OPENAI_MODEL || DEFAULT_MODEL;

  const prompt = [
    "你是游戏文案采集器，只输出 JSON",
    "任务：从网页正文中提取适合收进游戏发言句库的中文短句，并完成分类",
    "只要像玩家可直接复制发送的抽象、搞怪、成语化用、台词感、阴阳怪气、热血短句",
    "必须排除网页 UI、公众号操作提示、广告、作者来源、日期、目录、按钮文案、教程步骤、网址、部署说明、标签说明",
    "尤其排除：预览时标签不可点、继续滑动看下一个、向上滑动看下一个、使用完整服务、轻点两下取消赞、取消赞、引导切换、功能提示、公网地址、多设备、电脑打开、手机访问",
    "每句 6 到 60 个中文字符，去掉末尾句号、问号、感叹号和省略号，不要保留重复句",
    "如果没有适合文案，返回空数组",
    "category 必须从 categories 的 key 中选",
    "tone 必须从 tones 的 key 中选",
    "risk 必须从 safe、spicy、danger 中选",
    "note 用 2 到 6 个中文字符说明风格，不要写“功能提示”这类 UI 说明",
    "",
    `categories: ${JSON.stringify(categories)}`,
    `tones: ${JSON.stringify(tones)}`,
    `risks: ${JSON.stringify(risks)}`,
    `title: ${article.title}`,
    `text: ${article.text.slice(0, MAX_AI_INPUT_TEXT)}`,
  ].join("\n");

  try {
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
            name: "phrase_extraction",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                phrases: {
                  type: "array",
                  maxItems: MAX_EXTRACTED_PHRASES,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      text: { type: "string" },
                      category: { type: "string" },
                      tone: { type: "string" },
                      risk: { type: "string", enum: ["safe", "spicy", "danger"] },
                      note: { type: "string" },
                    },
                    required: ["text", "category", "tone", "risk", "note"],
                  },
                },
              },
              required: ["phrases"],
            },
          },
        },
      }),
    });

    if (!upstream.ok) return [];
    const data = await upstream.json();
    const outputText = extractOutputText(data);
    if (!outputText) return [];
    return sanitizeExtractedPhrases(JSON.parse(outputText).phrases, categories, tones);
  } catch {
    return [];
  }
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

function sanitizeExtractedPhrases(value, categories, tones) {
  if (!Array.isArray(value)) return [];
  const categoryKeys = new Set(categories.map((item) => item.key));
  const toneKeys = new Set(tones.map((item) => item.key));
  const seen = new Set();
  return value
    .flatMap((item) => {
      if (!item || typeof item.text !== "string") return [];
      const text = normalizeCollectedLine(item.text);
      if (isNoiseCollectedLine(text) || seen.has(text)) return [];
      seen.add(text);
      return [
        {
          text,
          category: categoryKeys.has(item.category) ? item.category : "uncategorized",
          tone: toneKeys.has(item.tone) ? item.tone : "soft",
          risk: ["safe", "spicy", "danger"].includes(item.risk) ? item.risk : "safe",
          note: normalizeNote(item.note),
          extractedBy: "ai",
        },
      ];
    })
    .slice(0, MAX_EXTRACTED_PHRASES);
}

function normalizeCollectedLine(value) {
  return String(value || "")
    .trim()
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/^[\s>*#\-–—·•●◆◇★☆]+/, "")
    .replace(/^\d{1,3}[、.)）]\s*/, "")
    .replace(/^[一二三四五六七八九十百]+[、.)）]\s*/, "")
    .replace(/[。．.，,、；;：:！!？?~～…]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);
}

function isNoiseCollectedLine(line) {
  if (!line || line.length < 6 || line.length > 90) return true;
  if (!/[\u4e00-\u9fa5]/.test(line)) return true;
  if (/^[\d\s:：.,，、-]+$/.test(line)) return true;
  const noiseWords = [
    "阅读全文",
    "阅读原文",
    "点击",
    "关注",
    "公众号",
    "微信",
    "作者",
    "来源",
    "声明",
    "广告",
    "二维码",
    "扫码",
    "图片",
    "视频",
    "播放",
    "菜单",
    "投诉",
    "在看",
    "转发",
    "分享",
    "复制链接",
    "留言",
    "评论",
    "发布于",
    "展开",
    "收起",
    "订阅",
    "搜一搜",
    "预览时标签不可点",
    "继续滑动看下一个",
    "向上滑动看下一个",
    "使用完整服务",
    "轻点两下取消赞",
    "取消赞",
    "引导切换",
    "功能提示",
    "含自贬词",
    "用迹说明",
    "公网地址",
    "多设备",
    "电脑打开",
    "手机访问",
  ];
  return noiseWords.some((word) => line.includes(word));
}

function normalizeNote(value) {
  const note = String(value || "").trim();
  if (!note) return "AI 提炼";
  const noiseNotes = ["功能提示", "引导切换", "用迹说明", "含自贬词", "标签"];
  if (noiseNotes.some((word) => note.includes(word))) return "AI 提炼";
  return note.slice(0, 24);
}

function defaultCategories() {
  return [
    { key: "uncategorized", label: "未分类" },
    { key: "fallen", label: "被击杀" },
    { key: "counter", label: "反杀收割" },
    { key: "teammate", label: "队友名场面" },
    { key: "objective", label: "龙团资源" },
    { key: "lane", label: "对线拉扯" },
    { key: "comeback", label: "逆风翻盘" },
    { key: "ending", label: "结算散场" },
  ];
}

function defaultTones() {
  return [
    { key: "classic", label: "成语典故" },
    { key: "abstract", label: "抽象发疯" },
    { key: "soft", label: "清新自嘲" },
    { key: "drama", label: "台词感" },
    { key: "yin", label: "阴阳怪气" },
    { key: "hype", label: "热血" },
  ];
}

function defaultRisks() {
  return [
    { key: "safe", label: "绿色" },
    { key: "spicy", label: "黄色" },
    { key: "danger", label: "红色" },
  ];
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
