import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStateMonitor, useStateHistory } from './hooks';
import { HistoryTab } from './HistoryTab';
import { CurrentStateTab } from './CurrentStateTab';
import {
  devToolsStyles,
  buttonHoverEffects,
  inputFocusEffects,
} from './DevTools.styles';

const STORAGE_KEY = 'zustand-state-monitor-size';
const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 520;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 300;

function loadSize(): { width: number; height: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        width: Math.max(MIN_WIDTH, parsed.width ?? DEFAULT_WIDTH),
        height: Math.max(MIN_HEIGHT, parsed.height ?? DEFAULT_HEIGHT),
      };
    }
  } catch { /* ignore */ }
  return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
}

function saveSize(width: number, height: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ width, height }));
  } catch { /* ignore */ }
}

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

  const [size, setSize] = useState(loadSize);
  const resizeRef = useRef<{
    startX: number; startY: number;
    startW: number; startH: number;
    edge: string;
  } | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  useEffect(() => {
    const updateStores = () => {
      setStores(monitor.getRegisteredStores());
    };
    updateStores();
    const interval = setInterval(updateStores, 1000);
    return () => clearInterval(interval);
  }, [monitor]);

  const handleResizeStart = useCallback((e: React.MouseEvent, edge: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width,
      startH: size.height,
      edge,
    };

    const handleMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const { startX, startY, startW, startH, edge: e } = resizeRef.current;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let newW = startW;
      let newH = startH;

      if (e.includes('right')) newW = Math.max(MIN_WIDTH, startW + dx);
      if (e.includes('left')) newW = Math.max(MIN_WIDTH, startW - dx);
      if (e.includes('bottom')) newH = Math.max(MIN_HEIGHT, startH + dy);
      if (e.includes('top')) newH = Math.max(MIN_HEIGHT, startH - dy);

      setSize({ width: newW, height: newH });
    };

    const handleUp = () => {
      if (resizeRef.current) {
        setSize((s) => {
          saveSize(s.width, s.height);
          return s;
        });
      }
      resizeRef.current = null;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [size]);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentInput = e.currentTarget.value;
      if (currentInput !== searchQuery) {
        setSearchQuery(currentInput);
      } else if (matchCount > 0) {
        if (e.shiftKey) {
          setActiveMatchIndex((i) => (i - 1 + matchCount) % matchCount);
        } else {
          setActiveMatchIndex((i) => (i + 1) % matchCount);
        }
      }
    }
  }, [matchCount, searchQuery]);

  const handlePrev = useCallback(() => {
    if (matchCount === 0) return;
    setActiveMatchIndex((i) => (i - 1 + matchCount) % matchCount);
  }, [matchCount]);

  const handleNext = useCallback(() => {
    if (matchCount === 0) return;
    setActiveMatchIndex((i) => (i + 1) % matchCount);
  }, [matchCount]);

  useEffect(() => {
    setActiveMatchIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchInput) {
      setSearchQuery('');
    }
  }, [searchInput]);

  const handleMatchCountChange = useCallback((count: number) => {
    setMatchCount(count);
    setActiveMatchIndex((prev) => (count === 0 ? 0 : Math.min(prev, count - 1)));
  }, []);

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
        width: `${size.width}px`,
        height: `${size.height}px`,
        ...style,
      }}
      className={className}
    >
      {/* Resize handles */}
      <div
        style={devToolsStyles.resizeHandleLeft}
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      <div
        style={devToolsStyles.resizeHandleTop}
        onMouseDown={(e) => handleResizeStart(e, 'top')}
      />
      <div
        style={devToolsStyles.resizeHandleTopLeft}
        onMouseDown={(e) => handleResizeStart(e, 'top-left')}
      />

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

      {/* Search bar */}
      <div style={devToolsStyles.searchContainer}>
        <input
          type="text"
          placeholder="搜索属性或值 (Enter 搜索)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#4f46e5';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.boxShadow = 'none';
          }}
          style={devToolsStyles.searchInput}
        />
        {searchInput && (
          <div style={devToolsStyles.searchNav}>
            <span style={devToolsStyles.searchCount}>
              {matchCount > 0 ? `${activeMatchIndex + 1}/${matchCount}` : '0'}
            </span>
            <button
              onClick={handlePrev}
              style={devToolsStyles.searchNavButton}
              title="上一个 (Shift+Enter)"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              ▲
            </button>
            <button
              onClick={handleNext}
              style={devToolsStyles.searchNavButton}
              title="下一个 (Enter)"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              ▼
            </button>
          </div>
        )}
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
              <CurrentStateTab
                monitor={monitor}
                selectedStore={selectedStore}
                searchQuery={searchQuery}
                activeMatchIndex={activeMatchIndex}
                onMatchCountChange={handleMatchCountChange}
              />
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

      {/* Bottom-right resize handle */}
      <div
        style={devToolsStyles.resizeHandle}
        onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
        onMouseEnter={(e) => {
          const icon = e.currentTarget.firstElementChild as HTMLElement;
          if (icon) { icon.style.borderColor = '#4f46e5'; }
        }}
        onMouseLeave={(e) => {
          const icon = e.currentTarget.firstElementChild as HTMLElement;
          if (icon) { icon.style.borderColor = '#cbd5e1'; }
        }}
      >
        <div style={devToolsStyles.resizeHandleIcon} />
      </div>
    </div>
  );
};
