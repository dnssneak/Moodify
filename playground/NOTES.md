# Accessible Component Fundamentals (FE-05) — Technical Analysis & Notes

> **Deliverable:** Technical audit comparing hand-built React + TypeScript accessible components against `shadcn/ui` (`@radix-ui/react-dialog` and `@radix-ui/react-tabs`).

---

## 1. Overview of Hand-Built Components

Three interactive components were built from scratch without external component libraries, strictly conforming to the W3C ARIA Authoring Practices Guidelines (APG):

1. **Modal Dialog (`src/components/Modal.tsx`)**:
   - Implements `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.
   - Focus management: Captures current active element before opening, focuses initial target/first focusable child on open, traps focus via `Tab` / `Shift+Tab` key cycle, and restores focus to trigger on close.
   - Listens for <kbd>Escape</kbd> key presses to close dialog.

2. **Tabs (`src/components/Tabs.tsx`)**:
   - Implements `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
   - Focus management: Roving `tabIndex` (`0` for selected tab, `-1` for inactive tabs).
   - Keyboard interaction: <kbd>←</kbd> / <kbd>→</kbd> arrow key navigation, <kbd>Home</kbd> / <kbd>End</kbd> bounds navigation, and automatic/manual activation modes.

3. **Disclosure (`src/components/Disclosure.tsx`)**:
   - Implements `<button aria-expanded aria-controls>` trigger and `role="region"` panel.
   - Keyboard interaction: Native <kbd>Space</kbd> and <kbd>Enter</kbd> toggle activation.

---

## 2. Concrete Gaps: Hand-Built vs. Shadcn / Radix UI

Upon inspecting the source code of `@radix-ui/react-dialog` and `@radix-ui/react-tabs` (the underlying primitives for `shadcn/ui`), the following **concrete technical gaps** were identified between our hand-built implementations and production-grade library components:

### Gap 1: Inert Background Tree & Body Scroll Locking (Portal + `aria-hidden`)
* **What Shadcn / Radix Handles:**
  - Radix renders dialog contents into a `Portal` at `document.body`.
  - When opened, Radix automatically applies `aria-hidden="true"` to **all sibling elements in the main DOM tree** outside the portal. This makes the background inert to assistive technologies (screen readers like NVDA/VoiceOver rotor navigation).
  - Radix automatically locks body scrolling (`overflow: hidden` on `body`), while dynamically injecting `padding-right` equivalent to the browser's scrollbar width to prevent visual layout shifts.
* **What Hand-Built Version Missed:**
  - Our hand-built modal overlay traps keyboard `Tab` key cycling, but screen reader virtual cursors (spatial/rotor navigation) can still escape the modal into the background DOM unless non-modal siblings are explicitly marked `aria-hidden="true"` or `inert`.
  - Our hand-built modal does not lock body scrolling or calculate scrollbar width offsets.

### Gap 2: Advanced `FocusScope` Stack & Edge-Case Focus Restoration
* **What Shadcn / Radix Handles:**
  - Radix encapsulates focus logic inside a dedicated `FocusScope` primitive that maintains a stack of active focus layers (handling nested dialogs seamlessly).
  - If the triggering element is unmounted or removed from the DOM while the dialog is open, Radix's focus restoration logic falls back gracefully to alternative focus targets rather than throwing an error or resetting focus to `document.body`.
  - Exposes lifecycle callbacks (`onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`) allowing consumers to intercept or prevent default focus/closing behaviors.
* **What Hand-Built Version Missed:**
  - Our hand-built modal stores `previouslyFocusedElementRef.current = document.activeElement`. If the invoking trigger button is conditionally unmounted while the modal is open, calling `.focus()` on a detached DOM node fails silently.

### Gap 3: Directionality (RTL), Orientation, & Multi-Layer Dismissal
* **What Shadcn / Radix Handles:**
  - Radix Tabs dynamically supports `orientation="horizontal" | "vertical"`, automatically swapping key bindings (Up/Down vs. Left/Right arrows).
  - Handles Right-to-Left (`dir="rtl"`) text directionality, reversing arrow key behaviors automatically.
  - Radix Dialog incorporates a `DismissableLayer` primitive. If a nested select dropdown or tooltip inside a dialog is open and the user presses <kbd>Escape</kbd>, Radix dismisses only the top-most layer (the select dropdown), preventing the event from bubbling up and closing the parent dialog prematurely.
* **What Hand-Built Version Missed:**
  - Our hand-built tabs hardcode horizontal navigation (`ArrowLeft`/`ArrowRight`).
  - Our hand-built modal listens to global `keydown` events for <kbd>Escape</kbd>. Pressing <kbd>Escape</kbd> inside a child control will trigger the modal's `onClose()` directly without event layer hierarchy awareness.

---

## 3. Summary & Key Takeaway

Building components from scratch reveals the hidden complexity behind web accessibility. While ARIA roles (`role="dialog"`, `role="tablist"`) and basic keyboard listeners are easy to write, **edge cases**—such as inert background trees, body scroll lock shifts, layer dismissal hierarchies, and robust focus restoration—require specialized abstractions like Radix UI primitives.
