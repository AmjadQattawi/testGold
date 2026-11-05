export default function SidebarChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className={
        "size-4 shrink-0 text-secondary-text transition-transform duration-200 motion-reduce:transition-none " +
        (expanded ? "rotate-0" : "-rotate-90 rtl:rotate-90")
      }
    >
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
