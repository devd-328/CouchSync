'use client';

import { useEffect, useRef } from 'react';

export interface UseModalBehaviorOptions<T extends HTMLElement = HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  ref?: React.RefObject<T | null>;
}

export type ModalBehaviorRef<T extends HTMLElement = HTMLDivElement> = React.RefObject<T | null> & {
  modalRef: React.RefObject<T | null>;
  cardRef: React.RefObject<T | null>;
  overlayRef: React.RefObject<T | null>;
};

let activeModalsCount = 0;
let originalBodyOverflow: string | null = null;

function acquireScrollLock() {
  if (typeof document === 'undefined') return;
  if (activeModalsCount === 0) {
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  activeModalsCount++;
}

function releaseScrollLock() {
  if (typeof document === 'undefined') return;
  activeModalsCount = Math.max(0, activeModalsCount - 1);
  if (activeModalsCount === 0) {
    if (originalBodyOverflow !== null) {
      document.body.style.overflow = originalBodyOverflow;
      originalBodyOverflow = null;
    } else {
      document.body.style.overflow = '';
    }
  }
}

/**
 * Reusable modal behavior hook:
 * 1. Locks background scroll (document.body.style.overflow = 'hidden') when open and restores it on close/unmount.
 * 2. Closes modal on Escape key.
 * 3. Closes modal when clicking outside the modal card element (e.g. on the overlay backdrop).
 *
 * Can be used as:
 *   const modalRef = useModalBehavior(isOpen, onClose);
 *   const { overlayRef } = useModalBehavior({ isOpen, onClose });
 *   const modalRef = useModalBehavior({ isOpen, onClose });
 */
export function useModalBehavior<T extends HTMLElement = HTMLDivElement>(
  isOpenOrOptions: boolean | UseModalBehaviorOptions<T>,
  onCloseArg?: () => void,
  passedRef?: React.RefObject<T | null>
): ModalBehaviorRef<T> {
  const isOptionsObject = typeof isOpenOrOptions === 'object' && isOpenOrOptions !== null;
  const isOpen = isOptionsObject ? isOpenOrOptions.isOpen : Boolean(isOpenOrOptions);
  const onClose = isOptionsObject ? isOpenOrOptions.onClose : onCloseArg || (() => {});
  const refOption = isOptionsObject ? isOpenOrOptions.ref : passedRef;

  const internalRef = useRef<T | null>(null);
  const targetRef = (refOption || internalRef) as ModalBehaviorRef<T>;

  // Provide aliases for destructuring flexibility
  targetRef.modalRef = targetRef;
  targetRef.cardRef = targetRef;
  targetRef.overlayRef = targetRef;

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    acquireScrollLock();

    const handleMouseDown = (event: MouseEvent) => {
      // Only respond to primary left button clicks
      if (event.button !== undefined && event.button !== 0) return;

      const target = event.target;
      if (
        targetRef.current &&
        target instanceof Node &&
        !targetRef.current.contains(target)
      ) {
        onCloseRef.current();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      releaseScrollLock();
    };
  }, [isOpen, targetRef]);

  return targetRef;
}
