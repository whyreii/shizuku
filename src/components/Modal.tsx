import { useEffect, useRef } from "react";

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}

/**
 * Stacked dialogs can capture each other's "hidden" as the value to restore,
 * which leaves the page unscrollable. Count locks instead of storing per-modal.
 */
let scrollLocks = 0;
let previousOverflow = "";

function lockScroll(): () => void {
  if (scrollLocks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLocks += 1;
  return () => {
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (scrollLocks === 0) {
      document.body.style.overflow = previousOverflow;
    }
  };
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const unlock = lockScroll();
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={wide ? "modal modal-wide" : "modal"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panelRef}
      >
        <header className="modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="modal-body">{children}</div>

        {footer ? <footer className="modal-foot">{footer}</footer> : null}
      </div>
    </div>
  );
}

interface ConfirmProps {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmProps) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="link" onClick={onCancel}>
            cancel
          </button>
          <button
            className={danger ? "btn danger" : "btn primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="modal-text">{body}</p>
    </Modal>
  );
}
