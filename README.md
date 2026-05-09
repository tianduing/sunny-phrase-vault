# 仅予你的晴天网站

一个清新静态版的常用语收藏箱，用来保存、筛选、随机和复制对局常用语。

## 功能

- 场景筛选：被击杀、反杀、队友名场面、龙团资源、对线拉扯、逆风翻盘、结算散场
- 语气筛选：成语典故、抽象发疯、清新自嘲、台词感、阴阳怪气、热血
- 一键随机、一键复制、收藏加权
- 本地新增句子，保存在浏览器 `localStorage`
- JSON 导入导出，方便备份和迁移
- 纯静态文件，可部署到 GitHub Pages、Vercel、Netlify、Cloudflare Pages

## 本地打开

直接双击 `index.html` 即可使用。

## 电脑运行，手机访问

双击 `start-lan.cmd`，窗口里会显示两个地址：

- 电脑访问：`http://127.0.0.1:5173/`
- 手机访问：形如 `http://192.168.0.5:5173/`

手机和电脑需要连同一个 Wi-Fi。首次访问时如果 Windows 防火墙弹窗，请允许 Python 访问专用网络。

## 部署

把整个项目文件夹作为静态站点根目录上传即可。无需构建命令。

更详细的公网部署步骤见 `DEPLOY.md`。

多设备同步方案见 `DATABASE_PLAN.md`。

AI 自动划分中转方案见 `AI_RELAY.md`。

常见平台配置：

- Vercel：Framework Preset 选 `Other`，Build Command 留空，Output Directory 留空或填 `.`
- Netlify：Build command 留空，Publish directory 填 `.`
- GitHub Pages：把这些文件放到仓库根目录，Pages Source 选择对应分支

## 版权提示

内置句子以原创和改写为主。若继续添加歌词、台词或网络梗，建议只做短句、化用或自己改写，避免整段搬运。
