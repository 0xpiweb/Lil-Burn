"use client";

import { ToastBanner } from "@/components/ui/ToastBanner";
import type { Toast } from "@/types/Toast";
import type { ToastContext } from "@/types/ToastContext";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

const DISMISS_MS = 5000;

const ToastContext = createContext<ToastContext | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((toastId: string) => {
    setToasts((previous) => previous.filter(({ id }) => id !== toastId));

    const timer = timers.current.get(toastId);

    if (timer != null) {
      clearTimeout(timer);
      timers.current.delete(toastId);
    }
  }, []);

  const scheduleRemove = useCallback(
    (toastId: string) => {
      const existing = timers.current.get(toastId);

      if (existing != null) {
        clearTimeout(existing);
      }

      timers.current.set(
        toastId,
        setTimeout(() => removeToast(toastId), DISMISS_MS),
      );
    },
    [removeToast],
  );

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();

      setToasts((previous) => [...previous, { ...toast, id }]);

      if (toast.status === "success") {
        scheduleRemove(id);
      }

      return id;
    },
    [scheduleRemove],
  );

  const updateToast = useCallback(
    (toastId: string, update: Partial<Omit<Toast, "id">>) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === toastId ? { ...toast, ...update } : toast,
        ),
      );

      if (update.status === "success" || update.status === "error") {
        scheduleRemove(toastId);
      }
    },
    [scheduleRemove],
  );

  return (
    <ToastContext.Provider value={{ addToast, updateToast, removeToast }}>
      {children}
      <ToastBanner toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (ctx == null) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return ctx;
}
