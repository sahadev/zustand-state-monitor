import React from "react";
import { devToolsStyles, stateChangeItemStyles } from "./DevTools.styles";
import { StateMonitorAPI } from "./types";
import { StateTree, collectAllMatches, MatchInfo, getAncestorPaths } from "./StateTree";

interface CurrentStateTabProps {
  monitor: StateMonitorAPI;
  selectedStore: string;
  searchQuery?: string;
  activeMatchIndex?: number;
  onMatchCountChange?: (count: number) => void;
}

export const CurrentStateTab: React.FC<CurrentStateTabProps> = ({
  monitor,
  selectedStore,
  searchQuery = '',
  activeMatchIndex = 0,
  onMatchCountChange,
}) => {
  const [states, setStates] = React.useState<Record<string, any>>({});
  const [expandedStores, setExpandedStores] = React.useState<Set<string>>(
    new Set()
  );

  const allMatchesRef = React.useRef<{ storeName: string; match: MatchInfo }[]>([]);

  React.useEffect(() => {
    const updateStates = () => {
      if (selectedStore) {
        const state = monitor.getState(selectedStore);
        setStates(state ? { [selectedStore]: state } : {});
      } else {
        setStates(monitor.getAllStates());
      }
    };

    updateStates();
    const interval = setInterval(updateStates, 100);

    return () => clearInterval(interval);
  }, [monitor, selectedStore]);

  React.useEffect(() => {
    if (!searchQuery) {
      allMatchesRef.current = [];
      onMatchCountChange?.(0);
      return;
    }

    const results: { storeName: string; match: MatchInfo }[] = [];
    const storeNames = Object.keys(states);
    const storesToExpand = new Set<string>();

    storeNames.forEach((storeName) => {
      const storeMatches = collectAllMatches(states[storeName], searchQuery);
      if (storeMatches.length > 0) {
        storesToExpand.add(storeName);
        storeMatches.forEach((m) => results.push({ storeName, match: m }));
      }
    });

    allMatchesRef.current = results;
    onMatchCountChange?.(results.length);

    if (results.length > 0) {
      const first = results[0];
      setExpandedStores((prev) => {
        if (prev.has(first.storeName)) return prev;
        const next = new Set(prev);
        next.add(first.storeName);
        return next;
      });
    }
  }, [searchQuery, states, onMatchCountChange]);

  React.useEffect(() => {
    if (allMatchesRef.current.length === 0) return;
    const active = allMatchesRef.current[activeMatchIndex];
    if (!active) return;

    setExpandedStores((prev) => {
      if (prev.has(active.storeName)) return prev;
      const next = new Set(prev);
      next.add(active.storeName);
      return next;
    });
  }, [activeMatchIndex]);

  const toggleExpand = (storeName: string) => {
    setExpandedStores((prev) => {
      const next = new Set(prev);
      if (next.has(storeName)) {
        next.delete(storeName);
      } else {
        next.add(storeName);
      }
      return next;
    });
  };

  const storeNames = Object.keys(states);

  const activeGlobal = allMatchesRef.current[activeMatchIndex] ?? null;

  const getStoreMatchInfo = (storeName: string) => {
    const storeMatches = allMatchesRef.current
      .filter((m) => m.storeName === storeName)
      .map((m) => m.match);

    let storeActiveMatch: MatchInfo | null = null;
    if (activeGlobal && activeGlobal.storeName === storeName) {
      storeActiveMatch = activeGlobal.match;
    }

    return { storeMatches, storeActiveMatch };
  };

  return (
    <div style={devToolsStyles.historyContainer}>
      {storeNames.length === 0 ? (
        <div style={devToolsStyles.emptyState}>
          <div style={devToolsStyles.emptyStateIcon}>📦</div>
          {selectedStore
            ? `No state found for store: ${selectedStore}`
            : "No stores registered"}
        </div>
      ) : (
        storeNames.map((storeName) => {
          const isExpanded = expandedStores.has(storeName);
          const state = states[storeName];
          const { storeMatches, storeActiveMatch } = getStoreMatchInfo(storeName);

          return (
            <div
              key={storeName}
              style={{
                ...stateChangeItemStyles.container,
                backgroundColor: isExpanded
                  ? stateChangeItemStyles.expandedContainer.backgroundColor
                  : "transparent",
              }}
              onClick={() => toggleExpand(storeName)}
            >
              <div style={stateChangeItemStyles.header}>
                <div style={stateChangeItemStyles.headerLeft}>
                  <span
                    style={{
                      ...stateChangeItemStyles.expandIcon,
                      color: isExpanded
                        ? stateChangeItemStyles.expandIconExpanded.color
                        : stateChangeItemStyles.expandIconCollapsed.color,
                    }}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </span>
                  <span style={stateChangeItemStyles.storeName}>
                    {storeName}
                  </span>
                </div>
                <span style={stateChangeItemStyles.timestamp}>
                  Current State
                </span>
              </div>

              {isExpanded && (
                <div
                  style={stateChangeItemStyles.expandedContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <pre style={stateChangeItemStyles.fullStateCodeBlock}>
                    <StateTree
                      data={state}
                      defaultExpanded={false}
                      searchQuery={searchQuery}
                      externalMatches={storeMatches}
                      externalActiveMatch={storeActiveMatch}
                    />
                  </pre>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
