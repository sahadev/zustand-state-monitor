import React, { useState, useEffect } from 'react';
import { useStateMonitor, useStateHistory } from './hooks';
import { StateChange } from './types';
import {
  devToolsStyles,
  stateChangeItemStyles,
  buttonHoverEffects,
  inputFocusEffects,
  stateChangeItemHoverEffects,
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

        <div style={devToolsStyles.historySection}>
          <div style={devToolsStyles.historyHeader}>
            <span style={devToolsStyles.historyTitle}>History ({history.length})</span>
            <button
              onClick={clearHistory}
              style={devToolsStyles.clearButton}
              {...buttonHoverEffects.clearButton}
            >
              Clear
            </button>
          </div>
        </div>

        <div style={devToolsStyles.historyContainer}>
          {history.length === 0 ? (
            <div style={devToolsStyles.emptyState}>
              <div style={devToolsStyles.emptyStateIcon}>📊</div>
              No state changes recorded
            </div>
          ) : (
            history
              .slice()
              .reverse()
              .map((change, index) => <StateChangeItem key={`${change.timestamp}-${index}`} change={change} />)
          )}
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

interface StateChangeItemProps {
  change: StateChange;
}

const StateChangeItem: React.FC<StateChangeItemProps> = ({ change }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        ...stateChangeItemStyles.container,
        backgroundColor: isExpanded ? stateChangeItemStyles.expandedContainer.backgroundColor : 'transparent',
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => stateChangeItemHoverEffects.container.onMouseEnter(e, isExpanded)}
      onMouseLeave={(e) => stateChangeItemHoverEffects.container.onMouseLeave(e, isExpanded)}
    >
      <div style={stateChangeItemStyles.header}>
        <div style={stateChangeItemStyles.headerLeft}>
          <span
            style={{
              ...stateChangeItemStyles.expandIcon,
              color: isExpanded ? stateChangeItemStyles.expandIconExpanded.color : stateChangeItemStyles.expandIconCollapsed.color,
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </span>
          <span style={stateChangeItemStyles.storeName}>{change.storeName}</span>
        </div>
        <span style={stateChangeItemStyles.timestamp}>
          {new Date(change.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {isExpanded && (
        <div
          style={stateChangeItemStyles.expandedContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={stateChangeItemStyles.changesSection}>
            <strong style={stateChangeItemStyles.changesLabel}>Changes:</strong>
            <pre style={stateChangeItemStyles.codeBlock}>
              {JSON.stringify(change.diff, null, 2)}
            </pre>
          </div>
          <details style={stateChangeItemStyles.details}>
            <summary style={stateChangeItemStyles.summary}>
              Full New State
            </summary>
            <pre style={stateChangeItemStyles.fullStateCodeBlock}>
              {JSON.stringify(change.newState, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};
