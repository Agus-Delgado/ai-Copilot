import React, { useEffect } from "react";

export type ToastVariant = "success" | "error";

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface Props {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<Props> = ({ messages, onDismiss }) => {
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    messages.forEach((toast) => {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, 2500);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [messages, onDismiss]);

  if (messages.length === 0) return null;

  return (
    <div
      className="toast-container"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {messages.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.variant}`}
          role="status"
        >
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
