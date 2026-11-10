import { createContext, useContext } from "react";
export type DialogOptions = {
  title?: string;
  message: string;
  variant?: "error" | "info" | "success";
  buttonLabel?: string;
};
export const DialogContext = createContext<{
  showDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
} | null>(null);
export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useDialog requires DialogProvider");
  return context;
}

