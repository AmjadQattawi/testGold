import { useState, type InputHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { formatDecimal, normalizeDecimal } from "../../utils/numberFormat";
type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "min" | "step"
> & { value: string; onValueChange: (value: string) => void; min?: string };
export default function DecimalInput({
  value,
  onValueChange,
  min,
  ...props
}: Props) {
  const [editing, setEditing] = useState(false);
  const { t } = useTranslation();
  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      dir="ltr"
      value={editing ? value : formatDecimal(value || "0")}
      onFocus={(event) => {
        setEditing(true);
        props.onFocus?.(event);
      }}
      onBlur={(event) => {
        setEditing(false);
        const number = Number(value);
        if (Number.isFinite(number)) onValueChange(number.toFixed(4));
        else onValueChange("0.0000");
        props.onBlur?.(event);
      }}
      onChange={(event) => {
        const normalized = normalizeDecimal(event.target.value);
        if (normalized === null) return;
        const number = Number(normalized);
        event.target.setCustomValidity(
          min !== undefined &&
            normalized !== "" &&
            (!Number.isFinite(number) || number < Number(min))
            ? t("decimalMinimum", { value: min })
            : "",
        );
        onValueChange(normalized);
      }}
    />
  );
}
