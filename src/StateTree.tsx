import React, { useState } from 'react';

interface TreeNodeProps {
  label: string;
  value: any;
  path: string;
  level: number;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ label, value, path, level, expandedPaths, onToggle }) => {
  const isExpanded = expandedPaths.has(path);
  const hasChildren = (typeof value === 'object' && value !== null && !Array.isArray(value)) || Array.isArray(value);
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  const isArray = Array.isArray(value);

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
          />
        );
      });
    }

    return null;
  };

  return (
    <div style={{ marginLeft: `${level * 16}px` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '2px 4px',
          cursor: hasChildren ? 'pointer' : 'default',
          borderRadius: '4px',
          transition: 'background-color 0.15s',
          fontSize: '13px',
          lineHeight: '1.5',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        onClick={() => {
          if (hasChildren) {
            onToggle(path);
          }
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
          {label}:
        </span>
        {hasChildren && (
          <span style={{ color: '#9ca3af', fontSize: '12px', marginRight: '6px' }}>
            {getTypeLabel()}
          </span>
        )}
        {!hasChildren && (
          <span style={{ color: '#6b7280', fontSize: '12px' }}>
            {getValueDisplay()}
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
}

export const StateTree: React.FC<StateTreeProps> = ({ data, defaultExpanded = true }) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (defaultExpanded && data) {
      const paths = new Set<string>();
      
      // 只展开第一级（默认展开）
      if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
          // 数组：展开所有数组项（如果它们是对象）
          data.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              paths.add(`root[${index}]`);
            }
          });
        } else {
          // 对象：展开所有第一级键
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

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  if (data === null || data === undefined) {
    return (
      <div style={{ padding: '8px', color: '#9ca3af', fontSize: '13px' }}>
        {String(data)}
      </div>
    );
  }

  const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
  const isArray = Array.isArray(data);

  // 如果是对象或数组，直接渲染其子节点，不显示 root
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
            />
          ))
        )}
      </div>
    );
  }

  // 原始值直接显示
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '8px', color: '#6b7280', fontSize: '13px' }}>
      {typeof data === 'string' ? `"${data}"` : String(data)}
    </div>
  );
};

