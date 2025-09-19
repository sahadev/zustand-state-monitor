# zustand-state-monitor

A React state monitor for Zustand stores with automatic registration and debugging capabilities.

## 🚀 [Live Demo](https://zustand-state-monitor.surge.sh/)

Try out the interactive demo to see Zustand State Monitor in action!

## Features

- 🔍 **Monitor Zustand State Changes**: Track all state changes with detailed history
- 🔄 **Automatic Registration**: Auto-register Zustand stores with minimal setup
- 🎣 **React Hooks**: Easy-to-use hooks for React integration
- 📊 **Dev Tools**: Built-in visual debugging interface
- 🎯 **Selective Monitoring**: Monitor specific stores or filter by criteria
- 📝 **Type Safe**: Full TypeScript support
- 🚀 **Zero Dependencies**: No additional dependencies beyond React and Zustand

## Installation

```bash
npm install zustand-state-monitor
# or
yarn add zustand-state-monitor
```

## Quick Start

### Basic Usage

```tsx
import { create } from 'zustand';
import { useStateMonitor, registerExistingStore } from 'zustand-state-monitor';

// Create your Zustand store
const useCountStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Register the store for monitoring
registerExistingStore('countStore', useCountStore);

function App() {
  const monitor = useStateMonitor();
  
  // Your component logic here
  return <div>Your App</div>;
}
```

### Auto Registration

```tsx
import { create } from 'zustand';
import { withAutoRegister } from 'zustand-state-monitor';

// Automatically register store on creation
const useCountStore = withAutoRegister('countStore', () =>
  create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
);
```

### Using Hooks

```tsx
import { useStateHistory, useStateListener } from 'zustand-state-monitor';

function DebugComponent() {
  // Get state change history
  const { history, clearHistory } = useStateHistory('countStore');
  
  // Listen to state changes
  useStateListener((change) => {
    console.log('State changed:', change);
  }, ['countStore']);

  return (
    <div>
      <h3>State History ({history.length})</h3>
      <button onClick={clearHistory}>Clear History</button>
      {/* Render history */}
    </div>
  );
}
```

### Dev Tools

```tsx
import { StateMonitorDevTools } from 'zustand-state-monitor';

function App() {
  return (
    <div>
      {/* Your app content */}
      <StateMonitorDevTools />
    </div>
  );
}
```

## API Reference

### Core Classes

#### StateMonitor

The main monitoring class that tracks state changes.

```tsx
import { StateMonitor } from 'zustand-state-monitor';

const monitor = new StateMonitor({
  enabled: true,
  maxHistorySize: 100,
  debugMode: false,
  logChanges: true
});
```

### Hooks

#### useStateMonitor()

Get access to the global state monitor instance.

```tsx
const monitor = useStateMonitor();
```

#### useStateHistory(storeName?)

Get state change history for a specific store or all stores.

```tsx
const { history, clearHistory } = useStateHistory('myStore');
```

#### useStateListener(callback, storeNames?)

Listen to state changes across stores.

```tsx
useStateListener((change) => {
  console.log('State changed:', change);
}, ['store1', 'store2']);
```

#### useStoreRegistration(storeName, store, autoRegister?)

Manage store registration with automatic cleanup.

```tsx
const { isRegistered, register, unregister } = useStoreRegistration(
  'myStore',
  myStore,
  true // auto register
);
```

### Auto Registration

#### registerExistingStore(storeName, store, config?)

Register an existing Zustand store.

```tsx
registerExistingStore('myStore', myZustandStore);
```

#### withAutoRegister(storeName, createStore, config?)

Wrap store creation with automatic registration.

```tsx
const useMyStore = withAutoRegister('myStore', () =>
  create((set) => ({ /* store config */ }))
);
```

#### setupGlobalAutoRegister(config?)

Set up global auto-registration for all Zustand stores (experimental).

```tsx
setupGlobalAutoRegister({
  debugMode: true,
  exclude: ['temporaryStore']
});
```

### Configuration

```tsx
interface StateMonitorConfig {
  enabled?: boolean;          // Enable/disable monitoring
  maxHistorySize?: number;    // Maximum history entries per store
  debugMode?: boolean;        // Enable debug logging
  autoRegister?: boolean;     // Auto-register new stores
  logChanges?: boolean;       // Log changes to console
  filters?: {
    storeNames?: string[];    // Only monitor specific stores
    excludeKeys?: string[];   // Exclude specific state keys
  };
}
```

### State Change Object

```tsx
interface StateChange<T = any> {
  storeName: string;      // Name of the store
  oldState: T;           // Previous state
  newState: T;           // New state
  timestamp: number;     // Change timestamp
  diff?: Partial<T>;     // State differences
}
```

## Examples

### Complete Example

```tsx
import React from 'react';
import { create } from 'zustand';
import {
  registerExistingStore,
  useStateMonitor,
  useStateHistory,
  StateMonitorDevTools
} from 'zustand-state-monitor';

// Create stores
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

// Register stores
registerExistingStore('counter', useCountStore);
registerExistingStore('user', useUserStore);

function Counter() {
  const { count, increment, decrement } = useCountStore();
  const { history } = useStateHistory('counter');
  
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <p>Changes: {history.length}</p>
    </div>
  );
}

function App() {
  const monitor = useStateMonitor();
  
  return (
    <div>
      <h1>State Monitor Demo</h1>
      <Counter />
      
      <div>
        <h3>Monitor Status</h3>
        <p>Registered stores: {monitor.getRegisteredStores().join(', ')}</p>
        <p>Total changes: {monitor.getHistory().length}</p>
      </div>
      
      {/* Dev Tools */}
      <StateMonitorDevTools />
    </div>
  );
}

export default App;
```

## Best Practices

1. **Register stores early**: Register your stores as early as possible in your app lifecycle
2. **Use meaningful names**: Give your stores descriptive names for easier debugging
3. **Limit history size**: Set appropriate `maxHistorySize` to prevent memory issues
4. **Development only**: Consider disabling in production or use feature flags
5. **Cleanup**: The hooks handle cleanup automatically, but manual registration should be paired with unregistration

## TypeScript Support

Full TypeScript support with proper type inference:

```tsx
interface CountState {
  count: number;
  increment: () => void;
}

const useCountStore = create<CountState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Type-safe registration
registerExistingStore<CountState>('counter', useCountStore);

// Type-safe history
const { history } = useStateHistory<CountState>('counter');
```

## License

MIT