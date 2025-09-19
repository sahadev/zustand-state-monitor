export interface StoreState {
  [key: string]: any;
}

export interface StateChange<T = any> {
  storeName: string;
  oldState: T;
  newState: T;
  timestamp: number;
  diff?: Partial<T>;
}

export interface StateMonitorConfig {
  enabled?: boolean;
  maxHistorySize?: number;
  debugMode?: boolean;
  autoRegister?: boolean;
  logChanges?: boolean;
  filters?: {
    storeNames?: string[];
    excludeKeys?: string[];
  };
}

export interface StateListener<T = any> {
  id: string;
  callback: (change: StateChange<T>) => void;
  storeNames?: string[];
}

export interface MonitoredStore<T = any> {
  name: string;
  store: any;
  unsubscribe: () => void;
  currentState: T;
  history: StateChange<T>[];
}

export interface StateMonitorAPI {
  register<T = StoreState>(storeName: string, store: any): void;
  unregister(storeName: string): void;
  addListener<T = any>(listener: StateListener<T>): string;
  removeListener(listenerId: string): void;
  getState<T = StoreState>(storeName: string): T | undefined;
  getAllStates(): Record<string, any>;
  getHistory(storeName?: string): StateChange[];
  clearHistory(storeName?: string): void;
  isRegistered(storeName: string): boolean;
  getRegisteredStores(): string[];
  pause(): void;
  resume(): void;
  isPaused(): boolean;
}

export type StateMonitorHook = () => StateMonitorAPI;

export interface ZustandStore<T = any> {
  getState: () => T;
  setState: (state: T | Partial<T> | ((state: T) => T | Partial<T>)) => void;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  destroy?: () => void;
}