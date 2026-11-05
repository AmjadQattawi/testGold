import { useTranslation } from "react-i18next";
import FieldIcon from "./FieldIcon";
import { useState, type ComponentProps } from "react";
import FormField from "./FormField";
type Props = Omit<ComponentProps<typeof FormField>, "type" | "suffix">;
export default function PasswordField(props: Props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      {...props}
      icon="lock"
      type={visible ? "text" : "password"}
      suffix={
        <button
          type="button"
          className="absolute right-1 top-0 flex h-10 w-10 items-center justify-center rounded text-muted-text focus-visible:outline-2 focus-visible:outline-accent"
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          aria-controls={props.id}
          aria-pressed={visible}
          disabled={props.disabled}
          onClick={() => setVisible(!visible)}
        >
          <FieldIcon name={visible ? "eye-slash" : "eye"} />
        </button>
      }
    />
  );
}
