# PERSONAL BLOG

一个完整的个人博客系统，采用雾蓝、暖灰和米白配色，以信纸、胶带、手写批注和轻微纸张动效构成安静的手账风界面。

## 已完成功能

- 用户注册、登录、退出、资料查看与修改
- JWT 登录状态持久化与受保护页面
- 文章列表、详情、创建、编辑和删除
- 仅允许作者编辑或删除自己的文章
- Markdown 写作与实时双栏预览
- 封面图片上传、分类、标签和精选文章
- 关键词搜索、分类筛选和分页
- 桌面端与移动端响应式布局
- 键盘焦点、语义结构与“减少动态效果”适配
- MySQL 持久化模式与免安装的内存演示模式

## 技术栈

- 前端：React、TypeScript、Vite、React Router、React Markdown
- 后端：Node.js、Express、TypeScript、JWT、Multer
- 数据库：MySQL 8；开发演示也可以使用内存数据

## 本地运行

需要 Node.js 20 或更高版本。打开两个终端窗口：

```bash
# 终端一：启动后端
npm run dev:server

# 终端二：启动前端
npm run dev:client
```

前端默认地址为 `http://localhost:5173`，后端默认地址为 `http://localhost:3001`。

演示账号：

- 用户名：`paperwriter`
- 密码：`demo123`

内存模式每次重启后端会恢复演示数据，适合课堂展示。

## 使用 MySQL

1. 将根目录的 `.env.example` 复制为 `server/.env`。
2. 把 `DATABASE_DRIVER` 改成 `mysql`，并填写数据库连接信息。
3. 可以运行 `docker compose up -d` 启动项目自带的 MySQL，也可以使用本机 MySQL。
4. 运行 `npm run db:init` 创建数据表，然后重新启动后端。

## 验证

```bash
npm test
npm run build
```

## 上传到 GitHub

项目已经建立 Git 仓库并按功能迭代保存。创建空的 GitHub 仓库后，再添加远程地址并推送即可。GitHub Pages 只能托管前端静态文件；若要让登录、上传和数据库功能在线可用，还需要把 Express 后端和 MySQL 部署到支持服务器程序的平台。

## 图片说明

演示封面经 [Lorem Picsum](https://picsum.photos/) 提供，摄影作者为 Paul E. Harrer、Barcelona、Larry Chen 与 Ales Krivec。项目代码和页面中均保留了署名信息。
