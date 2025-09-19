# zustand-state-monitor

一个用于 Zustand 状态库的 React 状态监控工具，支持自动注册和调试功能。

## 特性

- 🔍 **监控 Zustand 状态变化**：追踪所有状态变化并记录详细历史
- 🔄 **自动注册**：通过最少的设置自动注册 Zustand 状态库
- 🎣 **React Hooks**：易于使用的 React 集成方式
- 📊 **开发工具**：内置的可视化调试界面
- 🎯 **选择性监控**：监控特定状态库或按条件过滤
- 📝 **类型安全**：完整的 TypeScript 支持
- 🚀 **零依赖**：除了 React 和 Zustand 外无额外依赖

## 安装

```bash
npm install zustand-state-monitor
# 或
yarn add zustand-state-monitor
```

## 快速开始

### 基础用法

```tsx
import { create } from 'zustand';
import { useStateMonitor, registerExistingStore } from 'zustand-state-monitor';

// 创建你的 Zustand 状态库
const useCountStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// 注册状态库进行监控
registerExistingStore('countStore', useCountStore);

function App() {
  const monitor = useStateMonitor();

  // 你的组件逻辑
  return <div>你的应用</div>;
}
```

### 自动注册

```tsx
import { create } from 'zustand';
import { withAutoRegister } from 'zustand-state-monitor';

// 创建时自动注册状态库
const useCountStore = withAutoRegister('countStore', () =>
  create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  })),
);
```

### 使用 Hooks

```tsx
import { useStateHistory, useStateListener } from 'zustand-state-monitor';

function DebugComponent() {
  // 获取状态变化历史
  const { history, clearHistory } = useStateHistory('countStore');

  // 监听状态变化
  useStateListener(
    (change) => {
      console.log('状态变化:', change);
    },
    ['countStore'],
  );

  return (
    <div>
      <h3>状态历史 ({history.length})</h3>
      <button onClick={clearHistory}>清除历史</button>
      {/* 渲染历史记录 */}
    </div>
  );
}
```

### 开发工具

```tsx
import { StateMonitorDevTools } from 'zustand-state-monitor';

function App() {
  return (
    <div>
      {/* 你的应用内容 */}
      <StateMonitorDevTools />
    </div>
  );
}
```

## API 参考

### 核心类

#### StateMonitor

追踪状态变化的主要监控类。

```tsx
import { StateMonitor } from 'zustand-state-monitor';

const monitor = new StateMonitor({
  enabled: true,
  maxHistorySize: 100,
  debugMode: false,
  logChanges: true,
});
```

### Hooks

#### useStateMonitor()

获取全局状态监控器实例。

```tsx
const monitor = useStateMonitor();
```

#### useStateHistory(storeName?)

获取特定状态库或所有状态库的状态变化历史。

```tsx
const { history, clearHistory } = useStateHistory('myStore');
```

#### useStateListener(callback, storeNames?)

监听跨状态库的状态变化。

```tsx
useStateListener(
  (change) => {
    console.log('状态变化:', change);
  },
  ['store1', 'store2'],
);
```

#### useStoreRegistration(storeName, store, autoRegister?)

管理状态库注册和自动清理。

```tsx
const { isRegistered, register, unregister } = useStoreRegistration(
  'myStore',
  myStore,
  true, // 自动注册
);
```

### 自动注册

#### registerExistingStore(storeName, store, config?)

注册现有的 Zustand 状态库。

```tsx
registerExistingStore('myStore', myZustandStore);
```

#### withAutoRegister(storeName, createStore, config?)

包装状态库创建过程并自动注册。

```tsx
const useMyStore = withAutoRegister('myStore', () =>
  create((set) => ({
    /* 状态库配置 */
  })),
);
```

#### setupGlobalAutoRegister(config?)

设置全局自动注册所有 Zustand 状态库（实验性功能）。

```tsx
setupGlobalAutoRegister({
  debugMode: true,
  exclude: ['temporaryStore'],
});
```

### 配置选项

```tsx
interface StateMonitorConfig {
  enabled?: boolean; // 启用/禁用监控
  maxHistorySize?: number; // 每个状态库的最大历史记录数
  debugMode?: boolean; // 启用调试日志
  autoRegister?: boolean; // 自动注册新状态库
  logChanges?: boolean; // 在控制台记录变化
  filters?: {
    storeNames?: string[]; // 只监控特定状态库
    excludeKeys?: string[]; // 排除特定状态键
  };
}
```

### 状态变化对象

```tsx
interface StateChange<T = any> {
  storeName: string; // 状态库名称
  oldState: T; // 前一个状态
  newState: T; // 新状态
  timestamp: number; // 变化时间戳
  diff?: Partial<T>; // 状态差异
}
```

## 示例

### 完整示例

```tsx
import React from 'react';
import { create } from 'zustand';
import { registerExistingStore, useStateMonitor, useStateHistory, StateMonitorDevTools } from 'zustand-state-monitor';

// 创建状态库
const useCountStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// 注册状态库
registerExistingStore('counter', useCountStore);
registerExistingStore('user', useUserStore);

function Counter() {
  const { count, increment, decrement } = useCountStore();
  const { history } = useStateHistory('counter');

  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <p>变化次数: {history.length}</p>
    </div>
  );
}

function App() {
  const monitor = useStateMonitor();

  return (
    <div>
      <h1>状态监控器演示</h1>
      <Counter />

      <div>
        <h3>监控状态</h3>
        <p>已注册状态库: {monitor.getRegisteredStores().join(', ')}</p>
        <p>总变化次数: {monitor.getHistory().length}</p>
      </div>

      {/* 开发工具 */}
      <StateMonitorDevTools />
    </div>
  );
}

export default App;
```

## 最佳实践

1. **尽早注册状态库**：在应用生命周期的早期注册你的状态库
2. **使用有意义的名称**：为你的状态库起描述性的名称以便于调试
3. **限制历史大小**：设置合适的 `maxHistorySize` 以防止内存问题
4. **仅在开发环境使用**：考虑在生产环境中禁用或使用功能标志
5. **清理资源**：Hooks 会自动处理清理，但手动注册应该配对取消注册

## TypeScript 支持

完整的 TypeScript 支持和正确的类型推断：

```tsx
interface CountState {
  count: number;
  increment: () => void;
}

const useCountStore = create<CountState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 类型安全的注册
registerExistingStore<CountState>('counter', useCountStore);

// 类型安全的历史记录
const { history } = useStateHistory<CountState>('counter');
```

## 开发工具界面

内置的 `StateMonitorDevTools` 组件提供：

- 📋 **状态库选择**：从下拉菜单选择要监控的状态库
- 📜 **历史记录查看**：查看所有状态变化的时间线
- 🔍 **状态差异显示**：查看每次变化的具体差异
- ⏸️ **暂停/恢复**：控制监控的暂停和恢复
- 🗑️ **清除历史**：清除历史记录
- 💾 **导出到控制台**：将状态和历史记录输出到浏览器控制台

## 使用场景

### 开发阶段

- 🐛 **调试状态变化**：追踪意外的状态更新
- 🔄 **性能优化**：识别不必要的重新渲染
- 📊 **状态分析**：了解应用的状态流

### 测试阶段

- ✅ **状态验证**：验证状态变化是否符合预期
- 📋 **测试辅助**：在测试中监控状态变化
- 🎯 **问题定位**：快速定位状态相关的问题

## 许可证

MIT

---

## 贡献

欢迎提交 Issue 和 Pull Request！

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/your-repo/zustand-state-monitor.git

# 安装依赖
npm install

# 构建
npm run build

# 开发模式
npm run dev
```

### 发布新版本

```bash
# 构建
npm run build

# 发布到 npm
npm publish
```
