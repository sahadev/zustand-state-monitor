import {
  StateMonitorConfig,
  StateChange,
  StateListener,
  MonitoredStore,
  StateMonitorAPI,
  ZustandStore,
  StoreState
} from './types';

export class StateMonitor implements StateMonitorAPI {
  private stores: Map<string, MonitoredStore> = new Map();
  private listeners: Map<string, StateListener> = new Map();
  private config: Required<StateMonitorConfig>;
  private paused: boolean = false;
  private listenerIdCounter: number = 0;

  constructor(config: StateMonitorConfig = {}) {
    this.config = {
      enabled: true,
      maxHistorySize: 100,
      debugMode: false,
      autoRegister: false,
      logChanges: false,
      filters: {
        storeNames: [],
        excludeKeys: []
      },
      ...config
    };

    if (this.config.debugMode) {
      console.log('[StateMonitor] Initialized with config:', this.config);
    }
  }

  register<T = StoreState>(storeName: string, store: ZustandStore<T>): void {
    if (!this.config.enabled) return;

    if (this.stores.has(storeName)) {
      console.warn(`[StateMonitor] Store "${storeName}" is already registered`);
      return;
    }

    const shouldFilter = this.shouldFilterStore(storeName);
    if (shouldFilter) {
      if (this.config.debugMode) {
        console.log(`[StateMonitor] Store "${storeName}" filtered out`);
      }
      return;
    }

    const currentState = store.getState();
    
    const unsubscribe = store.subscribe((newState: T, prevState: T) => {
      if (this.paused) return;

      const stateChange: StateChange<T> = {
        storeName,
        oldState: prevState,
        newState,
        timestamp: Date.now(),
        diff: this.computeDiff(prevState, newState)
      };

      this.recordStateChange(storeName, stateChange);
      this.notifyListeners(stateChange);

      if (this.config.logChanges) {
        console.log(`[StateMonitor] State changed in "${storeName}":`, stateChange);
      }
    });

    const monitoredStore: MonitoredStore<T> = {
      name: storeName,
      store,
      unsubscribe,
      currentState,
      history: []
    };

    this.stores.set(storeName, monitoredStore);

    if (this.config.debugMode) {
      console.log(`[StateMonitor] Registered store "${storeName}"`);
    }
  }

  unregister(storeName: string): void {
    const monitoredStore = this.stores.get(storeName);
    if (!monitoredStore) {
      console.warn(`[StateMonitor] Store "${storeName}" is not registered`);
      return;
    }

    monitoredStore.unsubscribe();
    this.stores.delete(storeName);

    if (this.config.debugMode) {
      console.log(`[StateMonitor] Unregistered store "${storeName}"`);
    }
  }

  addListener<T = any>(listener: StateListener<T>): string {
    const id = `listener_${++this.listenerIdCounter}`;
    this.listeners.set(id, { ...listener, id });

    if (this.config.debugMode) {
      console.log(`[StateMonitor] Added listener "${id}"`);
    }

    return id;
  }

  removeListener(listenerId: string): void {
    const removed = this.listeners.delete(listenerId);
    
    if (this.config.debugMode) {
      console.log(`[StateMonitor] ${removed ? 'Removed' : 'Failed to remove'} listener "${listenerId}"`);
    }
  }

  getState<T = StoreState>(storeName: string): T | undefined {
    const monitoredStore = this.stores.get(storeName);
    return monitoredStore?.store.getState() as T;
  }

  getAllStates(): Record<string, any> {
    const states: Record<string, any> = {};
    
    for (const [storeName, monitoredStore] of this.stores) {
      states[storeName] = monitoredStore.store.getState();
    }
    
    return states;
  }

  getHistory(storeName?: string): StateChange[] {
    if (storeName) {
      const monitoredStore = this.stores.get(storeName);
      return monitoredStore?.history || [];
    }

    const allHistory: StateChange[] = [];
    for (const monitoredStore of this.stores.values()) {
      allHistory.push(...monitoredStore.history);
    }

    return allHistory.sort((a, b) => a.timestamp - b.timestamp);
  }

  clearHistory(storeName?: string): void {
    if (storeName) {
      const monitoredStore = this.stores.get(storeName);
      if (monitoredStore) {
        monitoredStore.history = [];
      }
    } else {
      for (const monitoredStore of this.stores.values()) {
        monitoredStore.history = [];
      }
    }

    if (this.config.debugMode) {
      console.log(`[StateMonitor] Cleared history for ${storeName || 'all stores'}`);
    }
  }

  isRegistered(storeName: string): boolean {
    return this.stores.has(storeName);
  }

  getRegisteredStores(): string[] {
    return Array.from(this.stores.keys());
  }

  pause(): void {
    this.paused = true;
    if (this.config.debugMode) {
      console.log('[StateMonitor] Paused');
    }
  }

  resume(): void {
    this.paused = false;
    if (this.config.debugMode) {
      console.log('[StateMonitor] Resumed');
    }
  }

  isPaused(): boolean {
    return this.paused;
  }

  private shouldFilterStore(storeName: string): boolean {
    const { filters } = this.config;
    
    if (filters.storeNames && filters.storeNames.length > 0) {
      return !filters.storeNames.includes(storeName);
    }
    
    return false;
  }

  private recordStateChange<T>(storeName: string, stateChange: StateChange<T>): void {
    const monitoredStore = this.stores.get(storeName);
    if (!monitoredStore) return;

    monitoredStore.history.push(stateChange as StateChange);
    monitoredStore.currentState = stateChange.newState;

    if (monitoredStore.history.length > this.config.maxHistorySize) {
      monitoredStore.history.shift();
    }
  }

  private notifyListeners<T>(stateChange: StateChange<T>): void {
    for (const listener of this.listeners.values()) {
      const shouldNotify = !listener.storeNames || 
                          listener.storeNames.includes(stateChange.storeName);
      
      if (shouldNotify) {
        try {
          listener.callback(stateChange);
        } catch (error) {
          console.error('[StateMonitor] Error in listener callback:', error);
        }
      }
    }
  }

  private computeDiff<T>(oldState: T, newState: T): Partial<T> {
    if (typeof oldState !== 'object' || typeof newState !== 'object') {
      return newState as Partial<T>;
    }

    const diff: Partial<T> = {};
    const oldKeys = Object.keys(oldState as any);
    const newKeys = Object.keys(newState as any);
    const allKeys = new Set([...oldKeys, ...newKeys]);

    for (const key of allKeys) {
      const oldValue = (oldState as any)[key];
      const newValue = (newState as any)[key];

      if (oldValue !== newValue) {
        (diff as any)[key] = newValue;
      }
    }

    return diff;
  }

  destroy(): void {
    for (const monitoredStore of this.stores.values()) {
      monitoredStore.unsubscribe();
    }
    
    this.stores.clear();
    this.listeners.clear();

    if (this.config.debugMode) {
      console.log('[StateMonitor] Destroyed');
    }
  }
}