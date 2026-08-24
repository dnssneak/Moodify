import React, { useState, useId } from 'react';

export interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
}

/**
 * Hand-built W3C ARIA Compliant Disclosure Component
 * 
 * Pattern Specifications:
 * - Trigger: <button> element with aria-expanded="true|false" & aria-controls
 * - Content: Container element with matching id and aria-labelledby
 * - Keyboard Interaction:
 *   - Space / Enter: Toggles open/expanded state (handled natively by <button>)
 */
export const Disclosure: React.FC<DisclosureProps> = ({
  title,
  children,
  defaultExpanded = false,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const buttonId = useId();
  const panelId = useId();

  const handleToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (onToggle) {
      onToggle(nextState);
    }
  };

  return (
    <div className="custom-disclosure-container">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={handleToggle}
        className="custom-disclosure-trigger"
      >
        <span className="custom-disclosure-title">{title}</span>
        <span className={`custom-disclosure-icon ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isExpanded}
        className={`custom-disclosure-panel ${isExpanded ? 'open' : ''}`}
      >
        <div className="custom-disclosure-panel-content">{children}</div>
      </div>
    </div>
  );
};
