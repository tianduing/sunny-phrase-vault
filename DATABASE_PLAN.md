# 数据库同步方案

当前版本已经支持轻量云同步：浏览器仍以 `localStorage` 本地优先，默认同步口令是 `235126`。用户也可以输入自己的“同步口令”，通过 Cloudflare Worker 把自定义句子和收藏同步到 Cloudflare KV。

这个方案不需要账号系统。口令会在 Worker 端做 SHA-256 哈希后再作为云端存储键使用，云端不会直接使用明文口令作为键。知道同一个口令的设备可以读写同一份句库。

## 当前实现：Cloudflare KV

### 接口

- `POST /sync/load`
- `POST /sync/save`

请求体示例：

```json
{
  "syncKey": "你的同步口令",
  "customPhrases": [],
  "favorites": []
}
```

### 前端行为

- 点击“合并同步”：拉取云端数据，和本地数据按 `id` 合并，再写回云端
- 点击“上传本地”：用当前本地句库覆盖云端
- 设置同步口令后：新增、编辑、删除、收藏会自动保存到云端
- 清除口令：只清除本机保存的口令，不删除云端数据

## 后续升级：Supabase 账号同步

## 推荐方案：Supabase 免费版

Supabase 的好处是：免费额度够个人项目使用，底层是 Postgres，前端静态站也能直接接入。

### 数据表

```sql
create table phrases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null check (char_length(text) between 1 and 90),
  category text not null,
  tone text not null,
  risk text not null check (risk in ('safe', 'spicy', 'danger')),
  note text default '',
  created_at timestamptz not null default now()
);

create table favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  phrase_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, phrase_id)
);
```

### 权限策略

```sql
alter table phrases enable row level security;
alter table favorites enable row level security;

create policy "read own phrases"
on phrases for select
using (auth.uid() = user_id);

create policy "insert own phrases"
on phrases for insert
with check (auth.uid() = user_id);

create policy "delete own phrases"
on phrases for delete
using (auth.uid() = user_id);

create policy "read own favorites"
on favorites for select
using (auth.uid() = user_id);

create policy "insert own favorites"
on favorites for insert
with check (auth.uid() = user_id);

create policy "delete own favorites"
on favorites for delete
using (auth.uid() = user_id);
```

### 前端接入节奏

1. 保留现在的本地模式，继续可离线使用。
2. 增加“登录/同步”开关，用 Supabase Auth 邮箱验证码登录。
3. 登录后把本地自定义句子上传到 `phrases`。
4. 页面加载时合并云端句子和本地内置句库。
5. 收藏写入 `favorites`，换设备后自动恢复。

## 备选方案

- Firebase Firestore：生态成熟，但规则和控制台略绕。
- GitHub Gist：可以当个人云备份，但不适合多人和实时同步。
- LeanCloud：国内访问体验可能更好，但长期免费策略需要看当期规则。

我建议先用 GitHub Pages 做公网静态部署，再接 Supabase 同步。先让网站“远近皆可至”，再让数据“车同轨、书同文”。
