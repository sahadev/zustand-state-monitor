import React, { useState, useEffect } from 'react';
import { useStateMonitor, useStateHistory } from './hooks';
import { HistoryTab } from './HistoryTab';
import { CurrentStateTab } from './CurrentStateTab';
import {
  devToolsStyles,
  buttonHoverEffects,
  inputFocusEffects,
} from './DevTools.styles';

interface StateMonitorDevToolsProps {
  className?: string;
  style?: React.CSSProperties;
  defaultVisible?: boolean;
}

export const StateMonitorDevTools: React.FC<StateMonitorDevToolsProps> = ({
  className,
  style,
  defaultVisible = false,
}) => {
  const monitor = useStateMonitor();
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [stores, setStores] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'current'>('current');
  const { history, clearHistory } = useStateHistory(selectedStore);

  useEffect(() => {
    const updateStores = () => {
      setStores(monitor.getRegisteredStores());
    };

    updateStores();
    const interval = setInterval(updateStores, 1000);

    return () => clearInterval(interval);
  }, [monitor]);


  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          ...devToolsStyles.floatingButton,
          ...style,
        }}
        className={className}
        {...buttonHoverEffects.floatingButton}
      >
        🔍 Zustand State Monitor
      </button>
    );
  }

  return (
    <div
      style={{
        ...devToolsStyles.container,
        ...style,
      }}
      className={className}
    >
      <div style={devToolsStyles.header}>
        <h3 style={devToolsStyles.title}>Zustand State Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={devToolsStyles.closeButton}
          {...buttonHoverEffects.closeButton}
        >
          ✕
        </button>
      </div>

      <div style={devToolsStyles.content}>
        <div style={devToolsStyles.storeSection}>
          <label style={devToolsStyles.label}>
            Store:
          </label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            style={devToolsStyles.select}
            {...inputFocusEffects.select}
          >
            <option value="">All Stores</option>
            {stores.map((storeName) => (
              <option key={storeName} value={storeName}>
                {storeName}
              </option>
            ))}
          </select>
        </div>

        <div style={devToolsStyles.tabContainer}>
          <div style={devToolsStyles.tabList}>
            <button
              onClick={() => setActiveTab('current')}
              style={{
                ...devToolsStyles.tabButton,
                ...(activeTab === 'current' ? devToolsStyles.tabButtonActive : {}),
              }}
            >
              当前状态
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                ...devToolsStyles.tabButton,
                ...(activeTab === 'history' ? devToolsStyles.tabButtonActive : {}),
              }}
            >
              变更历史
            </button>
          </div>
          <div style={devToolsStyles.tabContent}>
            {activeTab === 'history' ? (
              <HistoryTab history={history} clearHistory={clearHistory} />
            ) : (
              <CurrentStateTab monitor={monitor} selectedStore={selectedStore} />
            )}
          </div>
        </div>

        <div style={devToolsStyles.statusSection}>
          <div style={devToolsStyles.statusRow}>
            <span>
              Registered stores: <strong>{stores.length}</strong>
            </span>
            <span>
              Status:{' '}
              <strong style={monitor.isPaused() ? devToolsStyles.statusPaused : devToolsStyles.statusActive}>
                {monitor.isPaused() ? 'Paused' : 'Active'}
              </strong>
            </span>
          </div>
          <div style={devToolsStyles.buttonGroup}>
            <button
              onClick={() => (monitor.isPaused() ? monitor.resume() : monitor.pause())}
              style={{
                ...devToolsStyles.actionButton,
                backgroundColor: monitor.isPaused() ? '#10b981' : '#f59e0b',
              }}
              {...buttonHoverEffects.actionButton}
            >
              {monitor.isPaused() ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button
              onClick={() => {
                console.log('All States:', monitor.getAllStates());
                console.log('All History:', monitor.getHistory());
              }}
              style={{
                ...devToolsStyles.actionButton,
                ...devToolsStyles.logButton,
              }}
              {...buttonHoverEffects.logButton}
            >
              🖥️ Log to Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
