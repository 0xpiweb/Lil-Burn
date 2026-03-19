import type { Toast } from "@/types/Toast";

export type ToastContext = {
  addToast: (options: Omit<Toast, "id">) => string;
  updateToast: (toastId: string, updates: Partial<Omit<Toast, "id">>) => void;
  removeToast: (toastId: string) => void;
};
