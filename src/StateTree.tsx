import React, { useState, useEffect, useRef, useCallback } from 'react';
import { devToolsStyles } from './DevTools.styles';

export interface MatchInfo {
  path: string;
  type: 'key' | 'value';
}

function collectMatches(data: any, query: string, parentPath: string): MatchInfo[] {
  if (!query) return [];
  const lowerQ = query.toLowerCase();
  const results: MatchInfo[] = [];

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const childPath = `${parentPath}[${index}]`;
      const indexLabel = `[${index}]`;
      if (indexLabel.toLowerCase().includes(lowerQ)) {
        results.push({ path: childPath, type: 'key' });
      }
      if (typeof item === 'object' && item !== null) {
        results.push(...collectMatches(item, query, childPath));
      } else {
        const valStr = item === null ? 'null' : item === undefined ? 'undefined' : String(item);
        if (valStr.toLowerCase().includes(lowerQ)) {
          results.push({ path: childPath, type: 'value' });
        }
      }
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach((key) => {
      const childPath = parentPath ? `${parentPath}.${key}` : key;
      if (key.toLowerCase().includes(lowerQ)) {
        results.push({ path: childPath, type: 'key' });
      }
      const val = data[key];
      if (typeof val === 'object' && val !== null) {
        results.push(...collectMatches(val, query, childPath));
      } else {
        const valStr = val === null ? 'null' : val === undefined ? 'undefined' : String(val);
        if (valStr.toLowerCase().includes(lowerQ)) {
          results.push({ path: childPath, type: 'value' });
        }
      }
    });
  }

  return results;
}

export function collectAllMatches(data: any, query: string): MatchInfo[] {
  if (!query || !data) return [];
  const isArray = Array.isArray(data);
  if (isArray) return collectMatches(data, query, 'root');
  if (typeof data === 'object' && data !== null) return collectMatches(data, query, '');
  return [];
}

export function getAncestorPaths(path: string): string[] {
  const ancestors: string[] = [];
  let current = path;
  while (true) {
    const dotIdx = current.lastIndexOf('.');
    const bracketIdx = current.lastIndexOf('[');
    const cutIdx = Math.max(dotIdx, bracketIdx);
    if (cutIdx <= 0) break;
    current = current.substring(0, cutIdx);
    ancestors.push(current);
  }
  return ancestors;
}

function highlightText(text: string, query: string, isActive: boolean): React.ReactNode {
  if (!query) return text;
  const lowerText = text.toLowerCase();
  const lowerQ = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQ);
  if (idx === -1) return text;

  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let pos = idx;

  while (pos !== -1) {
    if (pos > lastIdx) parts.push(text.substring(lastIdx, pos));
    parts.push(
      <span
        key={pos}
        style={isActive ? devToolsStyles.searchHighlightActive : devToolsStyles.searchHighlight}
      >
        {text.substring(pos, pos + query.length)}
      </span>
    );
    lastIdx = pos + query.length;
    pos = lowerText.indexOf(lowerQ, lastIdx);
  }
  if (lastIdx < text.length) parts.push(text.substring(lastIdx));
  return <>{parts}</>;
}

interface TreeNodeProps {
  label: string;
  value: any;
  path: string;
  level: number;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
  searchQuery: string;
  activeMatch: MatchInfo | null;
  matchPaths: Set<string>;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  label, value, path, level, expandedPaths, onToggle,
  searchQuery, activeMatch, matchPaths,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isExpanded = expandedPaths.has(path);
  const hasChildren = (typeof value === 'object' && value !== null);
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  const isArray = Array.isArray(value);

  const isActiveNode = activeMatch?.path === path;

  useEffect(() => {
    if (isActiveNode && nodeRef.current) {
      nodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActiveNode]);

  const getValueDisplay = () => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return '';
  };

  const getTypeLabel = () => {
    if (isArray) return `[${value.length}]`;
    if (isObject) return `{${Object.keys(value).length}}`;
    return '';
  };

  const renderLabel = () => {
    const isKeyMatch = matchPaths.has(path) && searchQuery;
    return highlightText(label, isKeyMatch ? searchQuery : '', isActiveNode && activeMatch?.type === 'key');
  };

  const renderValue = () => {
    const valStr = getValueDisplay();
    if (!searchQuery) return valStr;
    const isValMatch = matchPaths.has(path);
    return highlightText(valStr, isValMatch ? searchQuery : '', isActiveNode && activeMatch?.type === 'value');
  };

  const renderChildren = () => {
    if (!hasChildren || !isExpanded) return null;

    if (isArray) {
      return value.map((item: any, index: number) => {
        const childPath = `${path}[${index}]`;
        return (
          <TreeNode
            key={childPath}
            label={`[${index}]`}
            value={item}
            path={childPath}
            level={level + 1}
            expandedPaths={expandedPaths}
            onToggle={onToggle}
            searchQuery={searchQuery}
            activeMatch={activeMatch}
            matchPaths={matchPaths}
          />
        );
      });
    }

    if (isObject) {
      return Object.keys(value).map((key) => {
        const childPath = `${path}.${key}`;
        return (
          <TreeNode
            key={childPath}
            label={key}
            value={value[key]}
            path={childPath}
            level={level + 1}
            expandedPaths={expandedPaths}
            onToggle={onToggle}
            searchQuery={searchQuery}
            activeMatch={activeMatch}
            matchPaths={matchPaths}
          />
        );
      });
    }

    return null;
  };

  return (
    <div style={{ marginLeft: `${level * 16}px` }}>
      <div
        ref={nodeRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '2px 4px',
          cursor: hasChildren ? 'pointer' : 'default',
          borderRadius: '4px',
          transition: 'background-color 0.15s',
          fontSize: '13px',
          lineHeight: '1.5',
          backgroundColor: isActiveNode ? 'rgba(79, 70, 229, 0.08)' : undefined,
          outline: isActiveNode ? '1.5px solid rgba(79, 70, 229, 0.3)' : undefined,
        }}
        onMouseEnter={(e) => {
          if (!isActiveNode) e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          if (!isActiveNode) e.currentTarget.style.backgroundColor = isActiveNode ? 'rgba(79, 70, 229, 0.08)' : 'transparent';
        }}
        onClick={() => {
          if (hasChildren) onToggle(path);
        }}
      >
        <span
          style={{
            width: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#6b7280',
            marginRight: '6px',
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            opacity: hasChildren ? 1 : 0,
          }}
        >
          ▶
        </span>
        <span style={{ fontWeight: hasChildren ? '600' : '400', color: '#374151', marginRight: '6px' }}>
          {renderLabel()}:
        </span>
        {hasChildren && (
          <span style={{ color: '#9ca3af', fontSize: '12px', marginRight: '6px' }}>
            {getTypeLabel()}
          </span>
        )}
        {!hasChildren && (
          <span style={{ color: '#6b7280', fontSize: '12px' }}>
            {renderValue()}
          </span>
        )}
      </div>
      {renderChildren()}
    </div>
  );
};

interface StateTreeProps {
  data: any;
  defaultExpanded?: boolean;
  searchQuery?: string;
  /** Matches pre-computed externally (by CurrentStateTab for cross-store coordination) */
  externalMatches?: MatchInfo[];
  /** The currently active match (one of externalMatches) */
  externalActiveMatch?: MatchInfo | null;
  /** Legacy: when used standalone without external match management */
  activeMatchIndex?: number;
  onMatchCountChange?: (count: number) => void;
}

export const StateTree: React.FC<StateTreeProps> = ({
  data,
  defaultExpanded = true,
  searchQuery = '',
  externalMatches,
  externalActiveMatch,
  activeMatchIndex = 0,
  onMatchCountChange,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [internalMatches, setInternalMatches] = useState<MatchInfo[]>([]);
  const matchPathsRef = useRef<Set<string>>(new Set());

  const useExternal = externalMatches !== undefined;
  const matches = useExternal ? externalMatches : internalMatches;
  const activeMatch = useExternal
    ? (externalActiveMatch ?? null)
    : (internalMatches[activeMatchIndex] ?? null);

  useEffect(() => {
    if (defaultExpanded && data) {
      const paths = new Set<string>();
      if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
          data.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              paths.add(`root[${index}]`);
            }
          });
        } else {
          Object.keys(data).forEach((key) => {
            if (typeof data[key] === 'object' && data[key] !== null) {
              paths.add(key);
            }
          });
        }
      }
      setExpandedPaths(paths);
    }
  }, [data, defaultExpanded]);

  useEffect(() => {
    if (useExternal) {
      matchPathsRef.current = new Set(matches.map((m) => m.path));

      if (matches.length > 0) {
        setExpandedPaths((prev) => {
          const next = new Set(prev);
          matches.forEach((m) => {
            getAncestorPaths(m.path).forEach((a) => next.add(a));
          });
          return next;
        });
      }
      return;
    }

    if (!searchQuery || !data) {
      setInternalMatches([]);
      matchPathsRef.current = new Set();
      onMatchCountChange?.(0);
      return;
    }

    const allMatches = collectAllMatches(data, searchQuery);
    setInternalMatches(allMatches);
    matchPathsRef.current = new Set(allMatches.map((m) => m.path));
    onMatchCountChange?.(allMatches.length);

    if (allMatches.length > 0) {
      setExpandedPaths((prev) => {
        const next = new Set(prev);
        allMatches.forEach((m) => {
          getAncestorPaths(m.path).forEach((a) => next.add(a));
        });
        return next;
      });
    }
  }, [searchQuery, data, useExternal, matches, onMatchCountChange]);

  useEffect(() => {
    if (!activeMatch) return;

    setExpandedPaths((prev) => {
      const ancestors = getAncestorPaths(activeMatch.path);
      const allPresent = ancestors.every((a) => prev.has(a));
      if (allPresent) return prev;

      const next = new Set(prev);
      ancestors.forEach((a) => next.add(a));
      return next;
    });
  }, [activeMatch]);

  const handleToggle = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  if (data === null || data === undefined) {
    return (
      <div style={{ padding: '8px', color: '#9ca3af', fontSize: '13px' }}>
        {String(data)}
      </div>
    );
  }

  const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
  const isArray = Array.isArray(data);

  if (isObject || isArray) {
    return (
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {isArray ? (
          data.map((item: any, index: number) => (
            <TreeNode
              key={`root[${index}]`}
              label={`[${index}]`}
              value={item}
              path={`root[${index}]`}
              level={0}
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
              searchQuery={searchQuery}
              activeMatch={activeMatch}
              matchPaths={matchPathsRef.current}
            />
          ))
        ) : (
          Object.keys(data).map((key) => (
            <TreeNode
              key={key}
              label={key}
              value={data[key]}
              path={key}
              level={0}
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
              searchQuery={searchQuery}
              activeMatch={activeMatch}
              matchPaths={matchPathsRef.current}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '8px', color: '#6b7280', fontSize: '13px' }}>
      {typeof data === 'string' ? `"${data}"` : String(data)}
    </div>
  );
};
