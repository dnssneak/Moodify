import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export const ShadcnDialogDemo: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className="shadcn-btn">
          Open Shadcn / Radix Dialog
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="shadcn-modal-overlay" />
        <Dialog.Content className="shadcn-modal-container">
          <Dialog.Title className="shadcn-modal-title">
            Shadcn / Radix UI Dialog
          </Dialog.Title>
          <Dialog.Description className="shadcn-modal-description">
            This dialog is built using Radix UI primitives (@radix-ui/react-dialog) powering shadcn/ui.
          </Dialog.Description>
          <div className="shadcn-modal-body">
            <p>Under-the-hood features handled by Radix Dialog:</p>
            <ul style={{ textAlign: 'left', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              <li><strong>Portal Rendering:</strong> Appends overlay and dialog to <code>document.body</code>.</li>
              <li><strong>Inert Tree (Aria Hidden):</strong> Automatically applies <code>aria-hidden="true"</code> to outside document nodes.</li>
              <li><strong>Body Scroll Locking:</strong> Disables body overflow scrolling while dialog is active.</li>
              <li><strong>FocusScope:</strong> Restores focus to trigger even if trigger is unmounted/remounted during dialog lifecycle.</li>
            </ul>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Sample input inside Radix dialog" className="custom-input" />
              <button type="button" className="custom-btn-primary">Submit</button>
            </div>
          </div>
          <Dialog.Close asChild>
            <button type="button" className="shadcn-modal-close-btn" aria-label="Close dialog">
              &times;
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
