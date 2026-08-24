import React, { useState, useRef, useId } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  ariaLabel?: string;
  activationMode?: 'automatic' | 'manual';
  onChange?: (tabId: string) => void;
}

/**
 * Hand-built W3C ARIA Compliant Tabs Component
 * 
 * Pattern Specifications:
 * - Roles: tablist, tab, tabpanel
 * - Attributes: aria-selected, aria-controls, aria-labelledby, id
 * - Focus Management: Roving tabIndex (selected tab tabIndex=0, others tabIndex=-1)
 * - Keyboard Interaction:
 *   - ArrowRight / ArrowLeft: Move focus to next / previous tab
 *   - Home / End: Move focus to first / last tab
 *   - Space / Enter: Select focused tab (in manual mode)
 */
export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTabId,
  ariaLabel = 'Content tabs',
  activationMode = 'automatic',
  onChange,
}) => {
  const [selectedTabId, setSelectedTabId] = useState<string>(
    defaultTabId || (items[0]?.id ?? '')
  );
  const [focusedTabId, setFocusedTabId] = useState<string>(
    defaultTabId || (items[0]?.id ?? '')
  );

  const baseId = useId();
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const enabledItems = items.filter((item) => !item.disabled);

  const handleSelectTab = (id: string) => {
    setSelectedTabId(id);
    setFocusedTabId(id);
    if (onChange) {
      onChange(id);
    }
  };

  const focusTab = (id: string) => {
    setFocusedTabId(id);
    const elem = tabRefs.current.get(id);
    if (elem) {
      elem.focus();
    }
    if (activationMode === 'automatic') {
      handleSelectTab(id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentId: string) => {
    const currentIndex = enabledItems.findIndex((item) => item.id === currentId);
    if (currentIndex === -1) return;

    let targetIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        targetIndex = (currentIndex + 1) % enabledItems.length;
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        targetIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
        break;

      case 'Home':
        event.preventDefault();
        targetIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        targetIndex = enabledItems.length - 1;
        break;

      case ' ':
      case 'Enter':
        if (activationMode === 'manual') {
          event.preventDefault();
          handleSelectTab(currentId);
        }
        return;

      default:
        return;
    }

    if (targetIndex !== -1 && enabledItems[targetIndex]) {
      focusTab(enabledItems[targetIndex].id);
    }
  };

  const activeItem = items.find((item) => item.id === selectedTabId);

  return (
    <div className="custom-tabs-wrapper">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="custom-tablist"
      >
        {items.map((item) => {
          const isSelected = item.id === selectedTabId;
          const isFocused = item.id === focusedTabId;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  tabRefs.current.set(item.id, el);
                } else {
                  tabRefs.current.delete(item.id);
                }
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              disabled={item.disabled}
              tabIndex={isSelected || (!selectedTabId && isFocused) ? 0 : -1}
              onClick={() => handleSelectTab(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className={`custom-tab-button ${isSelected ? 'active' : ''}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {activeItem && (
        <div
          key={activeItem.id}
          id={`${baseId}-panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          tabIndex={0}
          className="custom-tabpanel"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
};
