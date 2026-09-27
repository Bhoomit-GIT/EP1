'use client';

import { useEffect } from 'react';

/**
 * Modal accessibility: moves focus into the dialog on open, traps Tab
 * navigation inside it, closes on Escape, and restores focus on close.
 */
export default function useModalA11y(isOpen, onClose, ref) {
  useEffect(() => {
    if (!isOpen || !ref?.current) return;

    const dialog = ref.current;
    const previouslyFocused = document.activeElement;

    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = Array.from(dialog.querySelectorAll(selector)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    dialog.focus({ preventScroll: true });

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      // Restore focus to the trigger element on close
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose, ref]);
}
