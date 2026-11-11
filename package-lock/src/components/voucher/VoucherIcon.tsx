export type VoucherIconName =
  | "document"
  | "save"
  | "new"
  | "send"
  | "trash"
  | "search"
  | "print"
  | "exit"
  | "archive"
  | "reset"
  | "check"
  | "calendar"
  | "shield"
  | "plus"
  | "hash"
  | "filter"
  | "ascending"
  | "descending"
  | "unposted"
  | "userAccount";
const paths: Record<VoucherIconName, string> = {
  hash: "M9 3 7 21M17 3l-2 18M4 9h17M3 15h17",
  filter: "M3 4h18l-7 8v7l-4 2v-9L3 4Z",
  ascending: "M6 19V5m-4 4 4-4 4 4M13 6h3M13 12h5M13 18h8",
  descending: "M6 5v14m-4-4 4 4 4-4M13 6h8M13 12h5M13 18h3",
  unposted: "M9 9l6 6M15 9l-6 6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  document: "M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 11h8M8 15h8M8 18h5",
  save: "M4 3h13l4 4v14H3V3h1Zm3 0v6h10V3M7 21v-8h10v8",
  new: "M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 14h8M12 10v8",
  send: "m3 10 18-7-7 18-3-8-8-3Zm8 3L21 3",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  print: "M7 8V3h10v5M7 17H3V8h18v9h-4M7 14h10v7H7v-7M17 11h1",
  exit: "M9 3H3v18h6M13 7l5 5-5 5M7 12h11",
  archive: "M3 3h18v5H3V3Zm2 5v13h14V8M9 12h6",
  reset: "M3 11a9 9 0 1 1 2 7M3 4v7h7",
  check: "m8 12 3 3 5-6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  calendar: "M4 5h16v16H4V5Zm0 5h16M8 2v6M16 2v6",
  shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Zm-4 10 3 3 5-6",
  plus: "M12 5v14M5 12h14",
  userAccount:
    "M18 21a6 6 0 0 0-12 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
};
export default function VoucherIcon({
  name,
  className = "",
}: {
  name: VoucherIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={"size-4 shrink-0 " + className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
