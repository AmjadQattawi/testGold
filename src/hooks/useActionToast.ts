import { useEffect, useRef } from "react";
import { useToast } from "../context/toastContext";
type ActionResult =
  | {
      message?: string;
      messageKey?: string;
      isError?: boolean;
      errors?: unknown;
    }
  | undefined;
export function useActionToast(result: ActionResult) {
  const { showToast } = useToast();
  const previous = useRef<ActionResult>(undefined);
  useEffect(() => {
    if (previous.current === result) return;
    previous.current = result;
    if (
      result &&
      !result.isError &&
      !result.errors &&
      (result.message || result.messageKey)
    ) {
      showToast({ message: result.message, messageKey: result.messageKey });
    }
  }, [result, showToast]);
}
