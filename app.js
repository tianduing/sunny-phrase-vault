const CATEGORIES = [
  { key: "all", label: "全部", icon: "sparkles" },
  { key: "uncategorized", label: "未分类", icon: "inbox" },
  { key: "fallen", label: "被击杀", icon: "skull" },
  { key: "counter", label: "反杀收割", icon: "swords" },
  { key: "teammate", label: "队友名场面", icon: "users" },
  { key: "objective", label: "龙团资源", icon: "gem" },
  { key: "lane", label: "对线拉扯", icon: "route" },
  { key: "comeback", label: "逆风翻盘", icon: "flame" },
  { key: "ending", label: "结算散场", icon: "flag" },
];

const TONES = [
  { key: "all", label: "全部", icon: "sparkles" },
  { key: "classic", label: "成语典故", icon: "scroll-text" },
  { key: "abstract", label: "抽象发疯", icon: "zap" },
  { key: "soft", label: "清新自嘲", icon: "leaf" },
  { key: "drama", label: "台词感", icon: "theater" },
  { key: "yin", label: "阴阳怪气", icon: "moon" },
  { key: "hype", label: "热血", icon: "badge-bolt" },
];

const RISK_OPTIONS = [
  { key: "default", label: "绿色+黄色", icon: "shield-check" },
  { key: "safe", label: "绿色", icon: "leaf" },
  { key: "spicy", label: "黄色", icon: "flame" },
  { key: "all", label: "全部火力", icon: "shield-alert" },
];

const RISK_LABELS = {
  safe: "绿色",
  spicy: "黄色",
  danger: "红色",
};

const SEED_PHRASES = [
  {
    id: "seed-001",
    text: "此番败走泉水，乃是韬光养晦",
    category: "fallen",
    tone: "classic",
    risk: "safe",
    note: "成语改写",
  },
  {
    id: "seed-002",
    text: "我不是被击杀，我是回泉水翻阅兵书",
    category: "fallen",
    tone: "soft",
    risk: "safe",
    note: "自嘲",
  },
  {
    id: "seed-003",
    text: "倒下的是角色，站起来的是理解",
    category: "fallen",
    tone: "drama",
    risk: "safe",
    note: "台词感",
  },
  {
    id: "seed-004",
    text: "这波属于以身入局，给大家提供反面教材",
    category: "fallen",
    tone: "abstract",
    risk: "safe",
    note: "抽象",
  },
  {
    id: "seed-005",
    text: "阁下这一刀，颇有春秋笔法",
    category: "fallen",
    tone: "yin",
    risk: "spicy",
    note: "阴阳",
  },
  {
    id: "seed-006",
    text: "我去泉水充电，诸君且守半壁江山",
    category: "fallen",
    tone: "classic",
    risk: "safe",
    note: "典故感",
  },
  {
    id: "seed-007",
    text: "风水轮流转，刚才只是你家水表跑得快",
    category: "counter",
    tone: "abstract",
    risk: "spicy",
    note: "搞怪",
  },
  {
    id: "seed-008",
    text: "先礼后兵，刚才礼完了",
    category: "counter",
    tone: "classic",
    risk: "spicy",
    note: "成语",
  },
  {
    id: "seed-009",
    text: "你看，春风得意也要系安全带",
    category: "counter",
    tone: "yin",
    risk: "spicy",
    note: "提醒式阴阳",
  },
  {
    id: "seed-010",
    text: "血条见底，志气见顶",
    category: "counter",
    tone: "hype",
    risk: "safe",
    note: "热血",
  },
  {
    id: "seed-011",
    text: "此剑归鞘之前，峡谷还得听我说两句",
    category: "counter",
    tone: "drama",
    risk: "safe",
    note: "台词感",
  },
  {
    id: "seed-012",
    text: "队友此举，深得行为艺术三昧",
    category: "teammate",
    tone: "yin",
    risk: "spicy",
    note: "轻阴阳",
  },
  {
    id: "seed-013",
    text: "胜败乃兵家常事，关键是我们别常事常办",
    category: "teammate",
    tone: "classic",
    risk: "safe",
    note: "成语改写",
  },
  {
    id: "seed-014",
    text: "问题不大，问题正在变大",
    category: "teammate",
    tone: "abstract",
    risk: "safe",
    note: "抽象",
  },
  {
    id: "seed-015",
    text: "别慌，大家都是峡谷里长出来的野草",
    category: "teammate",
    tone: "soft",
    risk: "safe",
    note: "安慰",
  },
  {
    id: "seed-016",
    text: "这条龙不是丢了，是先寄存在对面名下",
    category: "objective",
    tone: "abstract",
    risk: "safe",
    note: "嘴硬",
  },
  {
    id: "seed-017",
    text: "龙坑风急，诸位莫要各奔东西",
    category: "objective",
    tone: "classic",
    risk: "safe",
    note: "古风",
  },
  {
    id: "seed-018",
    text: "暴君一声吼，我方五人各有春秋",
    category: "objective",
    tone: "yin",
    risk: "spicy",
    note: "阴阳",
  },
  {
    id: "seed-019",
    text: "此刻不争龙，更待何时争晚饭",
    category: "objective",
    tone: "abstract",
    risk: "safe",
    note: "搞怪",
  },
  {
    id: "seed-020",
    text: "对线如弈棋，阁下一步一惊雷",
    category: "lane",
    tone: "classic",
    risk: "spicy",
    note: "典故感",
  },
  {
    id: "seed-021",
    text: "你压我兵线，我压住情绪，双方都有操作",
    category: "lane",
    tone: "soft",
    risk: "safe",
    note: "自嘲",
  },
  {
    id: "seed-022",
    text: "草丛不是家，别住太久",
    category: "lane",
    tone: "yin",
    risk: "spicy",
    note: "提示",
  },
  {
    id: "seed-023",
    text: "塔下三分地，容我再苟一局春秋",
    category: "lane",
    tone: "classic",
    risk: "safe",
    note: "成语感",
  },
  {
    id: "seed-024",
    text: "逆风不投，星火可燎原",
    category: "comeback",
    tone: "classic",
    risk: "safe",
    note: "典故",
  },
  {
    id: "seed-025",
    text: "经济落后只是账面，气势领先全靠嘴硬",
    category: "comeback",
    tone: "abstract",
    risk: "safe",
    note: "嘴硬",
  },
  {
    id: "seed-026",
    text: "别急，剧本刚翻到伏笔",
    category: "comeback",
    tone: "drama",
    risk: "safe",
    note: "台词感",
  },
  {
    id: "seed-027",
    text: "我们虽处下风，仍可借东风",
    category: "comeback",
    tone: "classic",
    risk: "safe",
    note: "典故",
  },
  {
    id: "seed-028",
    text: "顺风莫浪，浪里容易没有白条",
    category: "ending",
    tone: "classic",
    risk: "safe",
    note: "俗语改写",
  },
  {
    id: "seed-029",
    text: "这一局尘埃落定，我的嘴还在补刀",
    category: "ending",
    tone: "abstract",
    risk: "safe",
    note: "收尾",
  },
  {
    id: "seed-030",
    text: "胜不骄，败不馁，截图先别发群里",
    category: "ending",
    tone: "soft",
    risk: "safe",
    note: "自嘲",
  },
  {
    id: "seed-031",
    text: "今日峡谷风平浪静，除了我方心率",
    category: "ending",
    tone: "abstract",
    risk: "safe",
    note: "搞怪",
  },
  {
    id: "seed-032",
    text: "山重水复疑无路，复活甲后又一村",
    category: "counter",
    tone: "classic",
    risk: "safe",
    note: "诗句化用",
  },
];

const STORAGE_KEY = "canyon-quip-custom-v1";
const FAVORITES_KEY = "canyon-quip-favorites-v1";
const SYNC_KEY = "sunny-phrase-sync-key-v1";
const DEFAULT_SYNC_KEY = "235126";

const state = {
  category: "all",
  tone: "all",
  risk: "default",
  search: "",
  currentId: null,
  editingId: null,
  custom: normalizeStoredPhrases(readStorage(STORAGE_KEY, [])),
  favorites: new Set(readStorage(FAVORITES_KEY, [])),
  syncKey: localStorage.getItem(SYNC_KEY) || DEFAULT_SYNC_KEY,
};

const $ = (selector) => document.querySelector(selector);

const els = {
  categoryTabs: $("#categoryTabs"),
  toneTabs: $("#toneTabs"),
  riskTabs: $("#riskTabs"),
  phraseList: $("#phraseList"),
  currentQuote: $("#currentQuote"),
  currentNote: $("#currentNote"),
  currentCategory: $("#currentCategory"),
  currentTone: $("#currentTone"),
  currentRisk: $("#currentRisk"),
  randomBtn: $("#randomBtn"),
  copyBtn: $("#copyBtn"),
  favoriteBtn: $("#favoriteBtn"),
  exportBtn: $("#exportBtn"),
  importInput: $("#importInput"),
  searchInput: $("#searchInput"),
  phraseForm: $("#phraseForm"),
  phraseText: $("#phraseText"),
  phraseCategory: $("#phraseCategory"),
  phraseTone: $("#phraseTone"),
  phraseRisk: $("#phraseRisk"),
  phraseNote: $("#phraseNote"),
  phraseMode: () => document.querySelector('input[name="phraseMode"]:checked'),
  classifyBtn: $("#classifyBtn"),
  submitBtn: $("#submitPhraseBtn"),
  cancelEditBtn: $("#cancelEditBtn"),
  syncCode: $("#syncCode"),
  syncStatus: $("#syncStatus"),
  syncNowBtn: $("#syncNowBtn"),
  pushCloudBtn: $("#pushCloudBtn"),
  clearSyncBtn: $("#clearSyncBtn"),
  totalCount: $("#totalCount"),
  favoriteCount: $("#favoriteCount"),
  customCount: $("#customCount"),
  visibleCount: $("#visibleCount"),
  toast: $("#toast"),
};

writeStorage(STORAGE_KEY, state.custom);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function persistLocal(options = {}) {
  writeStorage(STORAGE_KEY, state.custom);
  writeStorage(FAVORITES_KEY, [...state.favorites]);
  if (options.sync) {
    queueCloudSave();
  }
}

function makeId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function trimSentencePeriod(text) {
  return String(text || "")
    .trim()
    .replace(/[。．.]+$/g, "")
    .trim();
}

function normalizePhrase(phrase) {
  const categoryOk = CATEGORIES.some((item) => item.key === phrase.category && item.key !== "all");
  const toneOk = TONES.some((item) => item.key === phrase.tone && item.key !== "all");
  return {
    id: phrase.id?.startsWith("custom-") ? phrase.id : `custom-${makeId()}`,
    text: trimSentencePeriod(phrase.text).slice(0, 90),
    category: categoryOk ? phrase.category : "uncategorized",
    tone: toneOk ? phrase.tone : "soft",
    risk: RISK_LABELS[phrase.risk] ? phrase.risk : "safe",
    note: typeof phrase.note === "string" ? phrase.note.slice(0, 24) : "自定义",
  };
}

function normalizeStoredPhrases(phrases) {
  return Array.isArray(phrases)
    ? phrases.filter((item) => item && typeof item.text === "string").map(normalizePhrase)
    : [];
}

function allPhrases() {
  return [...SEED_PHRASES, ...state.custom];
}

function findOption(list, key) {
  return list.find((item) => item.key === key);
}

function riskAllows(phrase) {
  if (state.risk === "all") return true;
  if (state.risk === "default") return phrase.risk !== "danger";
  return phrase.risk === state.risk;
}

function filteredPhrases() {
  const query = state.search.trim().toLowerCase();
  return allPhrases().filter((phrase) => {
    const sceneOk = state.category === "all" || phrase.category === state.category;
    const toneOk = state.tone === "all" || phrase.tone === state.tone;
    const riskOk = riskAllows(phrase);
    const queryOk =
      !query ||
      phrase.text.toLowerCase().includes(query) ||
      phrase.note.toLowerCase().includes(query) ||
      (findOption(CATEGORIES, phrase.category)?.label || "").toLowerCase().includes(query) ||
      (findOption(TONES, phrase.tone)?.label || "").toLowerCase().includes(query);
    return sceneOk && toneOk && riskOk && queryOk;
  });
}

function renderIcon() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function createChip(item, activeKey, group) {
  const button = document.createElement("button");
  button.className = `chip${item.key === activeKey ? " is-active" : ""}`;
  button.type = "button";
  button.dataset.group = group;
  button.dataset.key = item.key;
  button.innerHTML = `<i data-lucide="${item.icon}" aria-hidden="true"></i><span>${item.label}</span>`;
  return button;
}

function renderTabs() {
  els.categoryTabs.replaceChildren(
    ...CATEGORIES.map((item) => createChip(item, state.category, "category")),
  );
  els.toneTabs.replaceChildren(...TONES.map((item) => createChip(item, state.tone, "tone")));
  els.riskTabs.replaceChildren(
    ...RISK_OPTIONS.map((item) => createChip(item, state.risk, "risk")),
  );
  renderIcon();
}

function renderSelects() {
  els.phraseCategory.replaceChildren(
    ...CATEGORIES.filter((item) => item.key !== "all").map((item) => option(item.key, item.label)),
  );
  els.phraseTone.replaceChildren(
    ...TONES.filter((item) => item.key !== "all").map((item) => option(item.key, item.label)),
  );
  ["safe", "spicy", "danger"].forEach((key) => {
    els.phraseRisk.append(option(key, RISK_LABELS[key]));
  });
}

function option(value, label) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function renderStats(pool) {
  els.totalCount.textContent = allPhrases().length;
  els.favoriteCount.textContent = state.favorites.size;
  els.customCount.textContent = state.custom.length;
  els.visibleCount.textContent = `${pool.length} 条`;
}

function renderList(pool) {
  if (pool.length === 0) {
    els.phraseList.innerHTML = `<div class="empty-state">暂时没有匹配句子，换个筛选或添一句</div>`;
    return;
  }

  const items = pool.map((phrase) => {
    const scene = findOption(CATEGORIES, phrase.category)?.label || "未分类";
    const tone = findOption(TONES, phrase.tone)?.label || "未知语气";
    const isFavorite = state.favorites.has(phrase.id);
    const isCustom = phrase.id.startsWith("custom-");
    const item = document.createElement("article");
    item.className = `phrase-item${phrase.id === state.currentId ? " is-selected" : ""}`;
    item.dataset.id = phrase.id;
    item.innerHTML = `
      <button class="phrase-select" type="button" data-action="select" data-id="${phrase.id}">
        <span class="phrase-line">${escapeHtml(phrase.text)}</span>
        <span class="phrase-foot">
          <span class="mini-pill">${scene}</span>
          <span class="mini-pill">${tone}</span>
          <span class="mini-pill">${RISK_LABELS[phrase.risk] || "绿色"}</span>
          <span>${escapeHtml(phrase.note || "原创")}</span>
        </span>
      </button>
      <span class="phrase-tools">
        <button class="tiny-button${isFavorite ? " is-active" : ""}" type="button" title="收藏" aria-label="收藏" data-action="favorite" data-id="${phrase.id}">
          <i data-lucide="star" aria-hidden="true"></i>
        </button>
        <button class="tiny-button" type="button" title="复制" aria-label="复制" data-action="copy" data-id="${phrase.id}">
          <i data-lucide="copy" aria-hidden="true"></i>
        </button>
        ${
          isCustom
            ? `<button class="tiny-button" type="button" title="编辑" aria-label="编辑" data-action="edit" data-id="${phrase.id}">
                <i data-lucide="square-pen" aria-hidden="true"></i>
              </button>
              <button class="tiny-button" type="button" title="删除" aria-label="删除" data-action="delete" data-id="${phrase.id}">
                <i data-lucide="trash-2" aria-hidden="true"></i>
              </button>`
            : ""
        }
      </span>
    `;
    return item;
  });
  els.phraseList.replaceChildren(...items);
  renderIcon();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char];
  });
}

function selectPhrase(id) {
  const phrase = allPhrases().find((item) => item.id === id) || filteredPhrases()[0];
  if (!phrase) {
    state.currentId = null;
    els.currentQuote.textContent = "这里暂时无句可抽";
    els.currentNote.textContent = "换一个筛选条件，或把你的神来之笔收进句库";
    return;
  }

  state.currentId = phrase.id;
  const scene = findOption(CATEGORIES, phrase.category)?.label || "未分类";
  const tone = findOption(TONES, phrase.tone)?.label || "未知语气";
  els.currentQuote.textContent = phrase.text;
  els.currentNote.textContent = phrase.note || "原创";
  els.currentCategory.textContent = scene;
  els.currentTone.textContent = tone;
  els.currentRisk.textContent = RISK_LABELS[phrase.risk] || "绿色";
  els.currentRisk.className = `badge risk-${phrase.risk || "safe"}`;
  els.favoriteBtn.classList.toggle("is-active", state.favorites.has(phrase.id));
  render();
}

function pickRandom() {
  const pool = filteredPhrases();
  if (!pool.length) {
    selectPhrase(null);
    showToast("没有匹配内容，换个条件试试");
    return;
  }

  const weighted = pool.flatMap((phrase) => {
    const weight = state.favorites.has(phrase.id) ? 3 : 1;
    return Array.from({ length: weight }, () => phrase);
  });
  const picked = weighted[Math.floor(Math.random() * weighted.length)];
  selectPhrase(picked.id);
}

async function copyPhrase(phrase) {
  if (!phrase) return;
  try {
    await navigator.clipboard.writeText(phrase.text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = phrase.text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("已复制，开麦如有神助");
}

function toggleFavorite(id) {
  if (!id) return;
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  persistLocal({ sync: true });
  render();
}

function deleteCustom(id) {
  const phrase = state.custom.find((item) => item.id === id);
  if (!phrase) return;
  const confirmed = window.confirm(`删除这句？\n${phrase.text}`);
  if (!confirmed) return;

  state.custom = state.custom.filter((item) => item.id !== id);
  state.favorites.delete(id);
  persistLocal({ sync: true });
  if (state.editingId === id) resetComposer();
  if (state.currentId === id) {
    state.currentId = null;
    pickRandom();
  } else {
    render();
  }
  showToast("已从本地句库移除");
}

function beginEdit(id) {
  const phrase = state.custom.find((item) => item.id === id);
  if (!phrase) return;
  state.editingId = id;
  els.phraseText.value = phrase.text;
  els.phraseCategory.value = phrase.category;
  els.phraseTone.value = phrase.tone;
  els.phraseRisk.value = phrase.risk;
  els.phraseNote.value = phrase.note || "";
  setPhraseMode("manual");
  updateComposerState();
  els.phraseText.focus();
  els.phraseForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetComposer() {
  state.editingId = null;
  els.phraseForm.reset();
  setPhraseMode("manual");
  updateComposerState();
}

function updateComposerState() {
  const isEditing = Boolean(state.editingId);
  els.submitBtn.innerHTML = `<i data-lucide="${isEditing ? "save" : "plus"}" aria-hidden="true"></i>${isEditing ? "保存修改" : "收进句库"}`;
  els.cancelEditBtn.hidden = !isEditing;
  renderIcon();
}

function setPhraseMode(mode) {
  const radio = document.querySelector(`input[name="phraseMode"][value="${mode}"]`);
  if (radio) radio.checked = true;
}

function currentMode() {
  return els.phraseMode()?.value || "manual";
}

function scoreByKeywords(text, groups) {
  return Object.entries(groups).reduce(
    (best, [key, words]) => {
      const score = words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
      return score > best.score ? { key, score } : best;
    },
    { key: "uncategorized", score: 0 },
  );
}

function inferPhrase(text) {
  const source = trimSentencePeriod(text);
  const category = scoreByKeywords(source, {
    fallen: ["被杀", "击杀", "倒下", "泉水", "复活", "暴毙", "没了", "阵亡", "回家"],
    counter: ["反杀", "收割", "换掉", "拿下", "归鞘", "血条", "回头", "一刀"],
    teammate: ["队友", "兄弟", "大家", "我方", "五人", "辅助", "打野", "射手"],
    objective: ["龙", "暴君", "主宰", "资源", "龙坑", "buff", "红蓝"],
    lane: ["对线", "兵线", "塔下", "草丛", "压线", "河道", "补刀"],
    comeback: ["逆风", "翻盘", "不投", "守", "高地", "落后", "东风", "燎原"],
    ending: ["结算", "散场", "截图", "胜", "败", "结束", "尘埃落定"],
  });
  const tone = scoreByKeywords(source, {
    classic: ["乃", "诸君", "阁下", "春秋", "东风", "山重水复", "韬光养晦", "兵家", "燎原"],
    abstract: ["充电", "水表", "行为艺术", "问题", "账面", "寄存", "晚饭", "理解"],
    soft: ["不是", "别慌", "压住情绪", "自嘲", "回泉水", "安慰"],
    drama: ["此剑", "剧本", "伏笔", "命运", "尘埃", "站起来"],
    yin: ["阁下", "颇有", "你看", "住太久", "此举", "操作"],
    hype: ["血条", "志气", "不投", "星火", "燎原", "领先"],
  });
  const dangerWords = ["垃圾", "废物", "傻", "蠢", "菜狗", "脑残", "弱智", "nt"];
  const spicyWords = ["阁下", "颇有", "你看", "行为艺术", "操作", "水表", "住太久"];
  const risk = dangerWords.some((word) => source.toLowerCase().includes(word))
    ? "danger"
    : spicyWords.some((word) => source.includes(word))
      ? "spicy"
      : "safe";

  return {
    category: category.score ? category.key : "uncategorized",
    tone: tone.score ? tone.key : "soft",
    risk,
    note: "智能划分",
  };
}

function validateInference(value) {
  if (!value || typeof value !== "object") return null;
  const categoryOk = CATEGORIES.some((item) => item.key === value.category && item.key !== "all");
  const toneOk = TONES.some((item) => item.key === value.tone && item.key !== "all");
  return {
    category: categoryOk ? value.category : "uncategorized",
    tone: toneOk ? value.tone : "soft",
    risk: RISK_LABELS[value.risk] ? value.risk : "safe",
    note: typeof value.note === "string" && value.note.trim() ? value.note.trim().slice(0, 24) : "AI 划分",
  };
}

async function inferPhraseWithRelay(text) {
  const endpoint = relayUrl("");
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      categories: CATEGORIES.filter((item) => item.key !== "all").map(({ key, label }) => ({
        key,
        label,
      })),
      tones: TONES.filter((item) => item.key !== "all").map(({ key, label }) => ({ key, label })),
      risks: Object.entries(RISK_LABELS).map(([key, label]) => ({ key, label })),
    }),
  });

  if (!response.ok) {
    throw new Error(`AI relay returned ${response.status}`);
  }

  return validateInference(await response.json());
}

function relayUrl(path) {
  const endpoint = window.SUNNY_AI_ENDPOINT?.trim();
  if (!endpoint) return "";
  return `${endpoint.replace(/\/$/, "")}${path}`;
}

async function getSmartInference(text) {
  try {
    const remote = await inferPhraseWithRelay(text);
    if (remote) return remote;
  } catch (error) {
    console.warn(error);
    showToast("AI 中转暂不可用，已用本地规则兜底");
  }
  return inferPhrase(text);
}

async function applyInference() {
  const text = trimSentencePeriod(els.phraseText.value);
  if (!text) {
    showToast("先写一句，智能划分才有米下锅");
    return null;
  }
  els.classifyBtn.disabled = true;
  els.classifyBtn.innerHTML = `<i data-lucide="loader-circle" aria-hidden="true"></i>划分中`;
  renderIcon();
  const inferred = await getSmartInference(text);
  els.phraseText.value = text;
  els.phraseCategory.value = inferred.category;
  els.phraseTone.value = inferred.tone;
  els.phraseRisk.value = inferred.risk;
  if (!els.phraseNote.value.trim() || ["自定义", "未分类", "智能划分"].includes(els.phraseNote.value.trim())) {
    els.phraseNote.value = inferred.note;
  }
  els.classifyBtn.disabled = false;
  els.classifyBtn.innerHTML = `<i data-lucide="wand-sparkles" aria-hidden="true"></i>智能划分`;
  renderIcon();
  showToast(inferred.note === "AI 划分" ? "AI 已完成划分，可继续微调" : "已按内容智能划分，可继续微调");
  return inferred;
}

async function makePhraseFromForm(existingId) {
  const text = trimSentencePeriod(els.phraseText.value);
  if (!text) return null;

  const mode = currentMode();
  let category = els.phraseCategory.value;
  let tone = els.phraseTone.value;
  let risk = els.phraseRisk.value;
  let note = els.phraseNote.value.trim();

  if (mode === "ai") {
    const inferred = await getSmartInference(text);
    category = inferred.category;
    tone = inferred.tone;
    risk = inferred.risk;
    note ||= inferred.note;
  }

  if (mode === "uncategorized") {
    category = "uncategorized";
    tone = "soft";
    risk = "safe";
    if (!note || ["自定义", "智能划分", "AI 划分"].includes(note)) {
      note = "未分类";
    }
  }

  return {
    id: existingId || `custom-${makeId()}`,
    text,
    category,
    tone,
    risk,
    note: note || "自定义",
  };
}

function render() {
  const pool = filteredPhrases();
  renderTabs();
  renderStats(pool);
  renderList(pool);
  els.favoriteBtn.classList.toggle("is-active", state.favorites.has(state.currentId));
}

function showToast(message) {
  window.clearTimeout(showToast.timer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, 1900);
}

function setSyncStatus(message) {
  els.syncStatus.textContent = message;
}

function normalizeSyncInput() {
  const value = els.syncCode.value.trim();
  state.syncKey = value;
  if (value) {
    localStorage.setItem(SYNC_KEY, value);
  } else {
    localStorage.removeItem(SYNC_KEY);
  }
  setSyncStatus(value ? "已保存口令" : "未连接");
  return value;
}

function mergePhrases(localPhrases, cloudPhrases) {
  const merged = new Map();
  [...cloudPhrases, ...localPhrases].forEach((phrase) => {
    merged.set(phrase.id, phrase);
  });
  return [...merged.values()];
}

async function loadCloudData(syncKey) {
  const endpoint = relayUrl("/sync/load");
  if (!endpoint) throw new Error("Missing relay endpoint");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ syncKey }),
  });
  if (!response.ok) throw new Error(`Sync load failed ${response.status}`);
  return response.json();
}

async function saveCloudData(syncKey) {
  const endpoint = relayUrl("/sync/save");
  if (!endpoint) throw new Error("Missing relay endpoint");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      syncKey,
      customPhrases: state.custom,
      favorites: [...state.favorites],
    }),
  });
  if (!response.ok) throw new Error(`Sync save failed ${response.status}`);
  return response.json();
}

async function syncNow() {
  const syncKey = normalizeSyncInput();
  if (syncKey.length < 4) {
    showToast("同步口令至少 4 个字符");
    return;
  }
  setSyncButtons(true);
  try {
    setSyncStatus("同步中");
    const cloud = await loadCloudData(syncKey);
    const cloudPhrases = normalizeStoredPhrases(cloud.customPhrases);
    const cloudFavorites = Array.isArray(cloud.favorites) ? cloud.favorites : [];
    state.custom = mergePhrases(state.custom, cloudPhrases);
    state.favorites = new Set([...state.favorites, ...cloudFavorites]);
    persistLocal();
    await saveCloudData(syncKey);
    render();
    setSyncStatus("已同步");
    showToast("云端和本地已合并同步");
  } catch (error) {
    console.warn(error);
    setSyncStatus("同步失败");
    showToast("同步失败，稍后再试");
  } finally {
    setSyncButtons(false);
  }
}

async function pushCloud() {
  const syncKey = normalizeSyncInput();
  if (syncKey.length < 4) {
    showToast("同步口令至少 4 个字符");
    return;
  }
  setSyncButtons(true);
  try {
    setSyncStatus("上传中");
    await saveCloudData(syncKey);
    setSyncStatus("已上传");
    showToast("本地句库已上传云端");
  } catch (error) {
    console.warn(error);
    setSyncStatus("上传失败");
    showToast("上传失败，稍后再试");
  } finally {
    setSyncButtons(false);
  }
}

function queueCloudSave() {
  if (!state.syncKey) return;
  window.clearTimeout(queueCloudSave.timer);
  queueCloudSave.timer = window.setTimeout(() => {
    saveCloudData(state.syncKey)
      .then(() => setSyncStatus("已自动保存"))
      .catch(() => setSyncStatus("自动保存失败"));
  }, 700);
}

function setSyncButtons(disabled) {
  els.syncNowBtn.disabled = disabled;
  els.pushCloudBtn.disabled = disabled;
  els.clearSyncBtn.disabled = disabled;
}

function clearSyncKey() {
  state.syncKey = "";
  els.syncCode.value = "";
  localStorage.removeItem(SYNC_KEY);
  setSyncStatus("未连接");
  showToast("已清除本机同步口令");
}

function exportLibrary() {
  const payload = {
    app: "sunny-phrase-vault",
    version: 2,
    exportedAt: new Date().toISOString(),
    customPhrases: state.custom,
    favorites: [...state.favorites],
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sunny-phrase-vault.json";
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("句库已导出");
}

async function importLibrary(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    const importedCustom = normalizeStoredPhrases(payload.customPhrases);
    const importedFavorites = Array.isArray(payload.favorites) ? payload.favorites : [];
    const merged = new Map(state.custom.map((item) => [item.id, item]));
    importedCustom.forEach((item) => merged.set(item.id, item));
    state.custom = [...merged.values()];
    state.favorites = new Set([...state.favorites, ...importedFavorites]);
    persistLocal({ sync: true });
    render();
    showToast("导入完成，旧雨新知并入句库");
  } catch {
    showToast("导入失败，请检查 JSON 文件");
  } finally {
    els.importInput.value = "";
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  els.submitBtn.disabled = true;
  const phrase = await makePhraseFromForm(state.editingId);
  if (!phrase) {
    els.submitBtn.disabled = false;
    showToast("先写一句，方能入库");
    return;
  }

  if (state.editingId) {
    state.custom = state.custom.map((item) => (item.id === state.editingId ? phrase : item));
    showToast("已保存修改");
  } else {
    state.custom.unshift(phrase);
    showToast("已收进句库");
  }

  persistLocal({ sync: true });
  resetComposer();
  selectPhrase(phrase.id);
  els.submitBtn.disabled = false;
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (chip) {
      state[chip.dataset.group] = chip.dataset.key;
      render();
      if (!filteredPhrases().some((item) => item.id === state.currentId)) {
        pickRandom();
      }
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const phrase = allPhrases().find((item) => item.id === actionButton.dataset.id);
    if (actionButton.dataset.action === "select") selectPhrase(actionButton.dataset.id);
    if (actionButton.dataset.action === "favorite") toggleFavorite(actionButton.dataset.id);
    if (actionButton.dataset.action === "copy") copyPhrase(phrase);
    if (actionButton.dataset.action === "edit") beginEdit(actionButton.dataset.id);
    if (actionButton.dataset.action === "delete") deleteCustom(actionButton.dataset.id);
  });

  els.randomBtn.addEventListener("click", pickRandom);
  els.copyBtn.addEventListener("click", () => {
    copyPhrase(allPhrases().find((item) => item.id === state.currentId));
  });
  els.favoriteBtn.addEventListener("click", () => toggleFavorite(state.currentId));
  els.exportBtn.addEventListener("click", exportLibrary);
  els.importInput.addEventListener("change", (event) => importLibrary(event.target.files[0]));
  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });
  els.classifyBtn.addEventListener("click", () => {
    applyInference();
  });
  els.syncNowBtn.addEventListener("click", syncNow);
  els.pushCloudBtn.addEventListener("click", pushCloud);
  els.clearSyncBtn.addEventListener("click", clearSyncKey);
  els.syncCode.addEventListener("change", normalizeSyncInput);
  els.cancelEditBtn.addEventListener("click", resetComposer);
  els.phraseText.addEventListener("blur", () => {
    els.phraseText.value = trimSentencePeriod(els.phraseText.value);
  });
  document.querySelectorAll('input[name="phraseMode"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked && radio.value === "ai") applyInference();
      if (radio.checked && radio.value === "uncategorized") {
        els.phraseCategory.value = "uncategorized";
        els.phraseTone.value = "soft";
        els.phraseRisk.value = "safe";
        if (!els.phraseNote.value.trim() || ["自定义", "智能划分", "AI 划分"].includes(els.phraseNote.value.trim())) {
          els.phraseNote.value = "未分类";
        }
      }
    });
  });
  els.phraseForm.addEventListener("submit", handleFormSubmit);
}

renderSelects();
bindEvents();
render();
updateComposerState();
els.syncCode.value = state.syncKey;
setSyncStatus(state.syncKey ? "已保存口令" : "未连接");
if (state.syncKey) {
  window.setTimeout(syncNow, 500);
}
pickRandom();
