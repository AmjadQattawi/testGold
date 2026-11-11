import FieldIcon from "./FieldIcon";
import BasePhoneInput, {
  type Country,
  type Value,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import type { InputHTMLAttributes } from "react";

interface PhoneInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: Country;
}

export function PhoneInput({
  value,
  onChange,
  placeholder,
  defaultCountry = "JO",
  ...inputProps
}: PhoneInputProps) {
  return (
    <div className="phone-input-wrapper">
      <span className="phone-field-icon">
        <FieldIcon name="phone" />
      </span>
      <BasePhoneInput
        {...inputProps}
        international
        defaultCountry={defaultCountry}
        value={(value || undefined) as Value | undefined}
        onChange={(v) => onChange(v ?? "")}
        placeholder={placeholder}
        flags={flags}
        autoComplete={inputProps.autoComplete ?? "tel"}
      />
    </div>
  );
}
