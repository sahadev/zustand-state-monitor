import React from 'react';

export const devToolsStyles = {
  floatingButton: {
    padding: '12px 16px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    zIndex: 9999,
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
  },

  container: {
    width: '420px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    zIndex: 9999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '13px',
    backdropFilter: 'blur(20px)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },

  header: {
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    borderBottom: 'none',
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },

  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
  },

  closeButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: 'white',
    borderRadius: '8px',
    padding: '6px 8px',
    transition: 'all 0.2s ease',
  },

  content: {
    padding: '20px',
  },

  tabContainer: {
    marginBottom: '16px',
  },

  tabList: {
    display: 'flex',
    gap: '8px',
    borderBottom: '2px solid #e5e7eb',
    marginBottom: '16px',
  },

  tabButton: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#9ca3af',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '-2px',
  },

  tabButtonActive: {
    color: '#4f46e5',
  },

  tabContent: {
    minHeight: '200px',
  },

  storeSection: {
    marginBottom: '16px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
  },

  select: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    outline: 'none',
  },

  historySection: {
    marginBottom: '16px',
  },

  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },

  historyTitle: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
  },

  clearButton: {
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },

  historyContainer: {
    maxHeight: '300px',
    overflowY: 'auto' as const,
    border: '2px solid #f1f5f9',
    borderRadius: '12px',
    backgroundColor: '#fafbfc',
    scrollbarWidth: 'thin' as const,
    scrollbarColor: '#cbd5e1 #f1f5f9',
  },

  emptyState: {
    padding: '32px',
    textAlign: 'center' as const,
    color: '#9ca3af',
    fontSize: '14px',
  },

  emptyStateIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },

  statusSection: {
    marginTop: '16px',
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '10px',
  },

  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  statusActive: {
    color: '#10b981',
  },

  statusPaused: {
    color: '#ef4444',
  },

  buttonGroup: {
    marginTop: '8px',
    display: 'flex',
    gap: '8px',
  },

  actionButton: {
    padding: '6px 12px',
    fontSize: '12px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    flex: 1,
  },

  pauseButton: {
    backgroundColor: '#10b981',
  },

  resumeButton: {
    backgroundColor: '#f59e0b',
  },

  logButton: {
    backgroundColor: '#4f46e5',
  },
};

export const stateChangeItemStyles = {
  container: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  expandedContainer: {
    backgroundColor: '#f8fafc',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  expandIcon: {
    fontSize: '12px',
    transition: 'all 0.2s ease',
  },

  expandIconExpanded: {
    color: '#4f46e5',
  },

  expandIconCollapsed: {
    color: '#6b7280',
  },

  storeName: {
    fontWeight: '600',
    color: '#4f46e5',
    fontSize: '14px',
  },

  timestamp: {
    fontSize: '11px',
    color: '#9ca3af',
    fontWeight: '500',
  },

  expandedContent: {
    marginTop: '12px',
    fontSize: '11px',
    animation: 'fadeIn 0.2s ease-in',
    textAlign: 'left' as const,
  },

  changesSection: {
    marginBottom: '8px',
    textAlign: 'left' as const,
  },

  changesLabel: {
    color: '#374151',
    fontSize: '12px',
    textAlign: 'left' as const,
  },

  codeBlock: {
    margin: '6px 0',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    border: '1px solid #e9ecef',
    fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '11px',
    lineHeight: '1.4',
    cursor: 'text',
    userSelect: 'text' as const,
    textAlign: 'left' as const,
  },

  details: {
    marginTop: '8px',
    textAlign: 'left' as const,
  },

  summary: {
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    padding: '4px 0',
    borderRadius: '4px',
    transition: 'color 0.2s ease',
    textAlign: 'left' as const,
  },

  fullStateCodeBlock: {
    margin: '6px 0',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    overflowY: 'auto' as const,
    border: '1px solid #e9ecef',
    fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '11px',
    lineHeight: '1.4',
    cursor: 'text',
    userSelect: 'text' as const,
    textAlign: 'left' as const,
  },
};

export const buttonHoverEffects = {
  floatingButton: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 12px 35px rgba(79, 70, 229, 0.4)';
      e.currentTarget.style.backgroundColor = '#3b38f0';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
      e.currentTarget.style.backgroundColor = '#4f46e5';
    },
  },

  closeButton: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
      e.currentTarget.style.transform = 'scale(1.05)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.transform = 'scale(1)';
    },
  },

  clearButton: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = '#dc2626';
      e.currentTarget.style.transform = 'scale(1.02)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = '#ef4444';
      e.currentTarget.style.transform = 'scale(1)';
    },
  },

  actionButton: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'scale(1.02)';
      e.currentTarget.style.opacity = '0.9';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.opacity = '1';
    },
  },

  logButton: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'scale(1.02)';
      e.currentTarget.style.backgroundColor = '#3b38f0';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.backgroundColor = '#4f46e5';
    },
  },
};

export const inputFocusEffects = {
  select: {
    onFocus: (e: React.FocusEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = '#4f46e5';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
    },
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = '#e5e7eb';
      e.currentTarget.style.boxShadow = 'none';
    },
  },
};

export const stateChangeItemHoverEffects = {
  container: {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, isExpanded: boolean) => {
      if (!isExpanded) {
        e.currentTarget.style.backgroundColor = '#f1f5f9';
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>, isExpanded: boolean) => {
      if (!isExpanded) {
        e.currentTarget.style.backgroundColor = 'transparent';
      }
    },
  },
};
