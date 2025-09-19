import { StateMonitor } from './StateMonitor';
import { getGlobalStateMonitor } from './hooks';
import { StateMonitorConfig, ZustandStore } from './types';

interface ZustandCreate {
  <T>(
    initializer: (set: any, get: any, api: any) => T,
    ...args: any[]
  ): ZustandStore<T>;
}

interface AutoRegisterConfig extends StateMonitorConfig {
  storeNameExtractor?: (store: ZustandStore) => string;
  exclude?: string[];
}

const registeredStores = new Set<ZustandStore>();
let storeCounter = 0;

export function createAutoRegisterWrapper(config: AutoRegisterConfig = {}) {
  const monitor = getGlobalStateMonitor(config);
  
  const defaultNameExtractor = (store: ZustandStore): string => {
    return `zustand-store-${++storeCounter}`;
  };

  const storeNameExtractor = config.storeNameExtractor || defaultNameExtractor;
  const excludeList = new Set(config.exclude || []);

  return function wrapZustandCreate(originalCreate: ZustandCreate): ZustandCreate {
    return function <T>(
      initializer: (set: any, get: any, api: any) => T,
      ...args: any[]
    ): ZustandStore<T> {
      const store = originalCreate(initializer, ...args);
      
      if (registeredStores.has(store)) {
        return store;
      }

      const storeName = storeNameExtractor(store);
      
      if (excludeList.has(storeName)) {
        return store;
      }

      // 自动注册到监控器
      try {
        monitor.register(storeName, store);
        registeredStores.add(store);
        
        if (config.debugMode) {
          console.log(`[StateMonitor] Auto-registered store: ${storeName}`);
        }
      } catch (error) {
        console.error(`[StateMonitor] Failed to auto-register store: ${storeName}`, error);
      }

      return store;
    };
  };
}

export function setupGlobalAutoRegister(config: AutoRegisterConfig = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  // 尝试拦截全局的 zustand create 函数
  const tryInterceptZustand = () => {
    try {
      // 检查是否存在 zustand 模块
      const zustandModule = (window as any).__ZUSTAND_MODULE__;
      if (zustandModule && zustandModule.create) {
        const wrapper = createAutoRegisterWrapper(config);
        const originalCreate = zustandModule.create;
        zustandModule.create = wrapper(originalCreate);
        
        if (config.debugMode) {
          console.log('[StateMonitor] Global auto-register setup completed');
        }
        return true;
      }
    } catch (error) {
      if (config.debugMode) {
        console.warn('[StateMonitor] Failed to setup global auto-register:', error);
      }
    }
    return false;
  };

  // 立即尝试
  if (!tryInterceptZustand()) {
    // 如果失败，等待一段时间后再试
    setTimeout(tryInterceptZustand, 100);
  }
}

export function withAutoRegister<T>(
  storeName: string, 
  createStore: () => ZustandStore<T>,
  config?: StateMonitorConfig
): ZustandStore<T> {
  const store = createStore();
  const monitor = getGlobalStateMonitor(config);
  
  try {
    monitor.register(storeName, store);
    
    if (config?.debugMode) {
      console.log(`[StateMonitor] Auto-registered store with withAutoRegister: ${storeName}`);
    }
  } catch (error) {
    console.error(`[StateMonitor] Failed to register store: ${storeName}`, error);
  }
  
  return store;
}

export function createMonitoredStore<T>(
  storeName: string,
  storeConfig: T,
  monitorConfig?: StateMonitorConfig
) {
  // 这个函数需要用户传入具体的 zustand create 函数
  return function(zustandCreate: ZustandCreate) {
    return withAutoRegister(
      storeName,
      () => zustandCreate(() => storeConfig),
      monitorConfig
    );
  };
}

export function registerExistingStore<T>(
  storeName: string,
  store: ZustandStore<T>,
  config?: StateMonitorConfig
): void {
  const monitor = getGlobalStateMonitor(config);
  
  try {
    monitor.register(storeName, store);
    registeredStores.add(store);
    
    if (config?.debugMode) {
      console.log(`[StateMonitor] Manually registered existing store: ${storeName}`);
    }
  } catch (error) {
    console.error(`[StateMonitor] Failed to register existing store: ${storeName}`, error);
  }
}

export function unregisterStore(storeName: string, config?: StateMonitorConfig): void {
  const monitor = getGlobalStateMonitor(config);
  monitor.unregister(storeName);
  
  if (config?.debugMode) {
    console.log(`[StateMonitor] Unregistered store: ${storeName}`);
  }
}