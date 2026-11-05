import { createContext, useContext } from "react";
export type ToastOptions = {
  message?: string;
  messageKey?: string;
  title?: string;
  duration?: number;
};
export const ToastContext = createContext<{
  showToast: (options: ToastOptions) => void;
  dismissToast: (id: number) => void;
} | null>(null);
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast requires ToastProvider");
  return context;
}
