import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { StateMonitor } from "./StateMonitor";
import {
  StateMonitorConfig,
  StateChange,
  StateListener,
  StateMonitorAPI,
} from "./types";

let globalStateMonitor: StateMonitor | null = null;

export function createStateMonitor(config?: StateMonitorConfig): StateMonitor {
  return new StateMonitor(config);
}

export function getGlobalStateMonitor(
  config?: StateMonitorConfig
): StateMonitor {
  if (!globalStateMonitor) {
    globalStateMonitor = new StateMonitor(config);
  }
  return globalStateMonitor;
}

export function useStateMonitor(config?: StateMonitorConfig): StateMonitorAPI {
  const monitorRef = useRef<StateMonitor>();

  if (!monitorRef.current) {
    monitorRef.current = getGlobalStateMonitor(config);
  }

  useEffect(() => {
    return () => {
      // 组件卸载时不销毁全局监控器，保持状态
    };
  }, []);

  return monitorRef.current;
}

export function useStateHistory(storeName: string) {
  const monitor = useStateMonitor();
  const [refreshKey, setRefreshKey] = useState(0);

  // 使用 useMemo 计算历史记录，基于 storeName 和 refreshKey
  const history = useMemo(() => {
    return monitor.getHistory(storeName);
  }, [monitor, storeName, refreshKey]);

  useEffect(() => {
    const listenerId = monitor.addListener({
      id: `history-listener-${storeName || "all"}-${Date.now()}`,
      callback: () => {
        // 通过更新 refreshKey 来触发 useMemo 重新计算
        setRefreshKey((prev) => prev + 1);
      },
      storeNames: storeName ? [storeName] : undefined,
    });

    return () => {
      monitor.removeListener(listenerId);
    };
  }, [monitor, storeName]);

  const clearHistory = useCallback(() => {
    monitor.clearHistory(storeName);
    setRefreshKey((prev) => prev + 1);
  }, [monitor, storeName]);

  return {
    history,
    clearHistory,
  };
}

export function useStateListener<T = any>(
  callback: (change: StateChange<T>) => void,
  storeNames?: string[]
) {
  const monitor = useStateMonitor();
  const callbackRef = useRef(callback);

  // 保持回调函数最新
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const listener: StateListener<T> = {
      id: "hook-listener",
      callback: (change) => callbackRef.current(change),
      storeNames,
    };

    const listenerId = monitor.addListener(listener);

    return () => {
      monitor.removeListener(listenerId);
    };
  }, [monitor, storeNames]);
}

export function useStoreRegistration<T = any>(
  storeName: string,
  store: any,
  autoRegister: boolean = true
) {
  const monitor = useStateMonitor();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (autoRegister && store && !monitor.isRegistered(storeName)) {
      monitor.register(storeName, store);
      setIsRegistered(true);
    }

    return () => {
      if (autoRegister && monitor.isRegistered(storeName)) {
        monitor.unregister(storeName);
        setIsRegistered(false);
      }
    };
  }, [monitor, storeName, store, autoRegister]);

  const manualRegister = useCallback(() => {
    if (store && !monitor.isRegistered(storeName)) {
      monitor.register(storeName, store);
      setIsRegistered(true);
    }
  }, [monitor, storeName, store]);

  const manualUnregister = useCallback(() => {
    if (monitor.isRegistered(storeName)) {
      monitor.unregister(storeName);
      setIsRegistered(false);
    }
  }, [monitor, storeName]);

  return {
    isRegistered,
    register: manualRegister,
    unregister: manualUnregister,
  };
}
