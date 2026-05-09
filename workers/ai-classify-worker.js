const DEFAULT_BASE_URL = "https://codex.ximuai.com";
const DEFAULT_MODEL = "gpt-5.4";

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

    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return json({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
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
  },
};

function extractOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  const content = data.output?.flatMap((item) => item.content || []) || [];
  const textPart = content.find((item) => typeof item.text === "string");
  return textPart?.text || "";
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
