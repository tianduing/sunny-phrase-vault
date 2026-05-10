# AI 自动划分中转方案

GitHub Pages 只能托管静态文件，不能安全保存 API Key。AI 自动划分需要一个中转函数，推荐 Cloudflare Worker 免费版。

## 部署 Worker

1. 打开 Cloudflare Workers，新建 Worker。
2. 把 `workers/ai-classify-worker.js` 的内容粘进去。
3. 在 Worker 的环境变量里设置：
   - `OPENAI_API_KEY`：你的中转 Key
   - `OPENAI_BASE_URL`：`https://codex.ximuai.com`
   - `OPENAI_MODEL`：`gpt-5.4`
4. 部署后得到一个地址，例如：
   `https://sunny-ai-classify.xxx.workers.dev/classify`
5. 修改 `config.js`：

```js
window.SUNNY_AI_ENDPOINT = "https://sunny-ai-classify.xxx.workers.dev/classify";
```

## 安全提醒

不要把 API Key 写进 `config.js`、`app.js` 或 GitHub 仓库。Key 只能放在 Worker / Supabase Edge Function / Netlify Function 这类服务端环境变量里。

## 当前前端行为

- 配了 `SUNNY_AI_ENDPOINT`：优先调用中转 AI 分类。
- 没配或接口失败：自动用本地规则兜底。
- 链接采集会调用同一个 Worker 的 `/collect/url`，只抓公开 `http/https` 文章链接，并由 AI 提炼候选文案；本机、内网等地址会被拦截。
- 一键润色会调用 `/polish`，API Key 仍只保存在 Worker 环境变量里。

这样即使 AI 服务临时不可用，网站也不会罢工。
