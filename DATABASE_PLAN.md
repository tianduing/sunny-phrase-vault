# 数据库同步方案

当前版本把自定义句子和收藏保存在浏览器 `localStorage`。优点是简单、离线可用；缺点是换手机、换浏览器不会自动同步。

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
