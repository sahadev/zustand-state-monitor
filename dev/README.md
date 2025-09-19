# Zustand State Monitor - 开发调试工具

这是一个实时调试 Zustand State Monitor 的简单开发环境。

## 特性

🔥 **热更新** - 修改源码立即生效  
⚡ **快速开发** - 使用 Vite 构建，启动速度极快  
🎮 **丰富测试场景** - 包含多个 Zustand store 用于测试  
🔍 **实时监控** - StateMonitorDevTools 始终可见

## 快速开始

### 1. 安装依赖

```bash
# 在项目根目录运行
npm run setup:dev
```

### 2. 启动开发服务器

```bash
# 在项目根目录运行
npm run dev:playground
```

或者直接在 dev 目录运行：

```bash
cd dev
npm run dev
```

### 3. 访问开发环境

打开浏览器访问: http://localhost:3000

## 开发说明

### 文件结构

```
dev/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── stores.ts        # 测试用的 Zustand stores
│   ├── main.tsx         # React 入口
│   └── index.css        # 样式文件
├── package.json         # 项目依赖
├── vite.config.ts       # Vite 配置 (关键配置)
└── index.html           # HTML 模板
```

### 关键配置

在 `vite.config.ts` 中，我们配置了别名来直接使用源码：

```typescript
resolve: {
  alias: {
    // 使用本地源码，实现热更新
    'zustand-state-monitor': path.resolve(__dirname, '../src/index.ts'),
  },
}
```

这样修改 `../src/` 下的任何文件都会立即反映到开发环境中。

### 测试场景

开发环境包含了以下测试store：

1. **Counter Store** - 简单的计数器，测试基础状态变化
2. **User Store** - 用户登录状态，测试复杂对象和异步操作
3. **Todo Store** - 待办事项，测试数组操作和过滤
4. **Settings Store** - 设置项，测试不同类型的状态

### 开发工作流

1. **修改源码** - 编辑 `../src/` 中的任何文件
2. **立即生效** - Vite 热更新会立即反映变化
3. **测试功能** - 在开发环境中操作各种状态
4. **观察调试工具** - StateMonitorDevTools 实时显示状态变化

### 调试技巧

- **StateMonitorDevTools 默认显示** - 方便实时查看状态
- **多个 store 注册** - 可以切换查看不同 store 的状态
- **丰富的操作** - 包含增删改查等各种状态操作
- **实时反馈** - 每个操作都会在调试工具中立即显示

## 开发环境特点

- ✅ **零配置** - 开箱即用
- ✅ **热更新** - 修改源码立即生效  
- ✅ **TypeScript** - 完整类型支持
- ✅ **现代化** - 使用 Vite + React 18
- ✅ **响应式** - 支持移动端调试

现在你可以愉快地开发和调试 Zustand State Monitor 了！🎉