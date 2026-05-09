# 公网部署指南

这个项目是纯静态网站，没有构建步骤。只要把以下文件作为站点根目录上传即可：

- `index.html`
- `styles.css`
- `app.js`
- `assets/`

## 最简单：Netlify 手动上传

适合先快速发给手机、朋友或同学访问。

1. 打开 Netlify。
2. 新建站点，选择手动上传或拖拽部署。
3. 上传整个项目文件夹，或上传压缩包。
4. 获得一个形如 `https://xxx.netlify.app` 的公网地址。

优点：不用先学 Git，最快能看到结果。  
缺点：以后改了文件，需要重新上传。

## 最推荐：GitHub Pages

适合长期维护。

1. 新建 GitHub 仓库。
2. 把项目文件推到仓库根目录。
3. 在仓库 Settings 里打开 Pages。
4. Source 选择 `main` 分支和根目录。
5. 等待部署完成，访问 `https://你的用户名.github.io/仓库名/`。

优点：免费、稳定、更新靠提交代码。  
缺点：第一次需要配置 GitHub 仓库。

## 也很好用：Vercel / Cloudflare Pages

如果你以后想接入自定义域名、预览环境或更多云功能，可以用这两个。

通用配置：

- Framework Preset：Other / Static
- Build Command：留空
- Output Directory：`.` 或留空
- Root Directory：项目根目录

## 重要：数据同步

当前版本的自定义句子存在浏览器 `localStorage` 里。公网部署后：

- 同一台设备、同一浏览器：会保留新增句子。
- 换手机或换浏览器：看不到之前新增的句子。
- 可以用 JSON 导入导出手动迁移。

如果要多设备自动同步，需要再接一个免费云数据库，例如 Supabase 或 Firebase。
