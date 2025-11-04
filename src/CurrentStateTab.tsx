import React from "react";
import { devToolsStyles, stateChangeItemStyles } from "./DevTools.styles";
import { StateMonitorAPI } from "./types";
import { StateTree } from "./StateTree";

interface CurrentStateTabProps {
  monitor: StateMonitorAPI;
  selectedStore: string;
}

export const CurrentStateTab: React.FC<CurrentStateTabProps> = ({
  monitor,
  selectedStore,
}) => {
  const [states, setStates] = React.useState<Record<string, any>>({});
  const [expandedStores, setExpandedStores] = React.useState<Set<string>>(
    new Set()
  );

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
                    <StateTree data={state} defaultExpanded={false} />
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
