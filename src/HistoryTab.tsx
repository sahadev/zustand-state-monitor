import React from 'react';
import { StateChange } from './types';
import {
  devToolsStyles,
  stateChangeItemStyles,
  buttonHoverEffects,
  stateChangeItemHoverEffects,
} from './DevTools.styles';

interface HistoryTabProps {
  history: StateChange[];
  clearHistory: () => void;
}

const StateChangeItem: React.FC<{ change: StateChange }> = ({ change }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

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

export const HistoryTab: React.FC<HistoryTabProps> = ({ history, clearHistory }) => {
  return (
    <>
      <div style={devToolsStyles.historySection}>
        <div style={devToolsStyles.historyHeader}>
          <span style={devToolsStyles.historyTitle}>变更历史 ({history.length})</span>
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
    </>
  );
};

