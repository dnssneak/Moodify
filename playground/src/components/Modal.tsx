import React, { useEffect, useRef, useId } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Hand-built W3C ARIA Compliant Modal Dialog Component
 * 
 * Pattern Specifications:
 * - Role: dialog, aria-modal="true"
 * - Labelling: aria-labelledby, aria-describedby
 * - Focus Management:
 *   - Moves focus to initial element or first focusable child upon opening
 *   - Traps focus (Tab / Shift+Tab cycling within dialog)
 *   - Restores focus to trigger element upon closing
 * - Keyboard Interaction: Escape key closes modal
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  // Helper to retrieve focusable elements inside the modal
  const getFocusableElements = (): HTMLElement[] => {
    if (!dialogRef.current) return [];
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const nodes = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    return nodes.filter(
      (node) => node.offsetWidth > 0 || node.offsetHeight > 0 || node.getClientRects().length > 0
    );
  };

  // Manage focus on open/close
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element before opening modal
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

      // Request animation frame to ensure modal DOM is mounted before focusing
      const timer = requestAnimationFrame(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else {
          const focusable = getFocusableElements();
          if (focusable.length > 0) {
            focusable[0].focus();
          } else if (dialogRef.current) {
            dialogRef.current.focus();
          }
        }
      });

      return () => cancelAnimationFrame(timer);
    } else {
      // Restore focus on close
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
        previouslyFocusedElementRef.current.focus();
      }
    }
  }, [isOpen, initialFocusRef]);

  // Handle Keyboard Navigation (Escape & Focus Trap Tab)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusables = getFocusableElements();
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: if on first element, wrap around to last
          if (document.activeElement === firstElement || !dialogRef.current?.contains(document.activeElement)) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap around to first
          if (document.activeElement === lastElement || !dialogRef.current?.contains(document.activeElement)) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="custom-modal-overlay"
      onClick={(e) => {
        // Backdrop click closes dialog if clicked outside container
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="custom-modal-container"
      >
        <div className="custom-modal-header">
          <h2 id={titleId} className="custom-modal-title">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="custom-modal-close-btn"
          >
            &times;
          </button>
        </div>

        {description && (
          <p id={descriptionId} className="custom-modal-description">
            {description}
          </p>
        )}

        <div className="custom-modal-body">{children}</div>
      </div>
    </div>
  );
};
