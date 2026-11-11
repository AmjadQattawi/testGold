import type { ButtonHTMLAttributes } from "react";
export default function SubmitButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type="submit"
      className={
        "my-4 w-full cursor-pointer rounded bg-accent p-2 font-medium text-accent-button-text transition duration-150 hover:bg-accent-hover active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 " +
        className
      }
    />
  );
}
