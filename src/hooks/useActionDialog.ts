import i18n from "../i18n";
import { useEffect } from "react";
import { useDialog } from "../context/dialogContext";
type Result = { message?: string; isError?: boolean } | undefined;
export function useActionDialog(result: Result) {
  const { showDialog, closeDialog } = useDialog();
  useEffect(() => {
    if (result?.isError && result.message)
      showDialog({
        title: i18n.t("requestUnsuccessful"),
        message: result.message,
        variant: "error",
      });
  }, [result, showDialog]);
  useEffect(() => () => closeDialog(), [closeDialog]);
}


