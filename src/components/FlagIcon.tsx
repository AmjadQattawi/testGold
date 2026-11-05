type Props = { country: "GB" | "JO"; className?: string };

export default function FlagIcon({ country, className = "" }: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="13"
      viewBox="0 0 60 40"
      className={"shrink-0 " + className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {country === "GB" ? (
        <>
          <rect width="60" height="40" fill="var(--color-flag-uk-blue)" />
          <path
            d="M0 0 60 40M60 0 0 40"
            stroke="var(--color-flag-white)"
            strokeWidth="8"
          />
          <path
            d="M0 0 60 40M60 0 0 40"
            stroke="var(--color-flag-uk-red)"
            strokeWidth="5"
          />
          <path
            d="M30 0v40M0 20h60"
            stroke="var(--color-flag-white)"
            strokeWidth="13"
          />
          <path
            d="M30 0v40M0 20h60"
            stroke="var(--color-flag-uk-red)"
            strokeWidth="8"
          />
        </>
      ) : (
        <>
          <rect width="60" height="40" fill="var(--color-flag-jordan-green)" />
          <rect width="60" height="13.33" fill="var(--color-flag-black)" />
          <rect
            y="13.33"
            width="60"
            height="13.34"
            fill="var(--color-flag-white)"
          />
          <polygon
            points="0,0 24,20 0,40"
            fill="var(--color-flag-jordan-red)"
          />
          <polygon
            points="9.5,15.5 10.37,18.2 13.02,17.19 11.46,19.55 13.89,21 11.13,21.3 11.45,24.05 9.5,22.1 7.55,24.05 7.87,21.3 5.11,21 7.54,19.55 5.98,17.19 8.63,18.2"
            fill="var(--color-flag-white)"
          />
        </>
      )}
    </svg>
  );
}
