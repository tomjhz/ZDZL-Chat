# ZDZL Chat

一个基于 React + TypeScript + Vite 的聊天界面练习项目，当前实现重点是消息列表、上下文菜单、撤回、多选删除和移动端长按交互。

## 当前能力

- 多会话列表，显示未读数、最后一条消息和相对时间
- 文本发送，`Enter` 发送、`Shift + Enter` 换行
- 发送状态模拟：`sending -> sent -> read`
- 桌面端右键 / 移动端长按打开菜单
- 单条复制、单条删除、单条撤回
- 多选批量删除
- 跨天消息时间分隔线
- 长文本自动换行
- 剪贴板调用失败提示

## 目录结构

```text
src/
  App.tsx
  constants.ts
  types.ts
  utils/
    chat.ts
  components/
    ContextMenu.tsx
    ConfirmDialog.tsx
    MessageBubble.tsx
    SelectModeBar.tsx
    MessageList/
      index.css
```

## 开发命令

```bash
npm install
npm run dev
npm run build
npm run test
npm run test:e2e
npm run ci
```

## CI / 质量门禁

- 仓库已提供本地统一校验命令 `npm run ci`
- 如需远端同等级的严格依赖审计，可额外执行 `npm run audit`；该命令依赖外网访问 npm advisory 服务
- GitHub Actions 工作流位于 `.github/workflows/ci.yml`
- 远端 `quality` job 会执行 `lint`、覆盖率测试、生产构建和严格 `npm audit --omit=dev --audit-level=high`
- 远端 `e2e` job 会运行 Playwright 冒烟测试，覆盖页面加载、发送消息、右键菜单和批量删除
- `main` 分支会发布到 GitHub Pages `production` 环境，PR 会产出 `preview` 构建产物
- 流水线启用 npm 缓存，并在执行后上传 `coverage/`、`playwright-report/` 与构建产物

如果你把仓库推到 GitHub，启用 Actions 后，这套检查就会在 `push`、`pull_request` 和手动触发时自动运行。

## 说明

- 样式入口是 `src/components/MessageList/index.css`
- 纯逻辑工具函数在 `src/utils/chat.ts`
- 当前没有使用 `dangerouslySetInnerHTML`，消息内容按 React 文本节点渲染
