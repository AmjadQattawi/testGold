export const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export const nodeClasses =
  "group relative my-0.5 flex min-h-10 w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-start text-[13px] font-medium transition-colors duration-200 motion-reduce:transition-none " +
  focusClasses;
export const activeClasses =
  "border-accent bg-accent text-accent-button-text shadow-sm";
export const idleClasses =
  "cursor-pointer text-secondary-text hover:bg-hover-background hover:text-primary-text";
export const iconClasses =
  "flex size-5 shrink-0 items-center justify-center text-current [&>svg]:size-[18px] [&>img]:size-[18px] [&>img]:object-contain [&>img]:brightness-0 [&>img]:opacity-65 [:root[data-theme=dark]_&>img]:invert group-aria-[current=page]:[&>img]:brightness-0 group-aria-[current=page]:[&>img]:invert group-aria-[current=page]:[&>img]:opacity-100 [:root[data-theme=dark]_&>img]:group-aria-[current=page]:invert-0";
export const titleClasses =
  "min-w-0 flex-1 whitespace-normal break-words text-start leading-5";
export const childrenClasses =
  "my-1 ms-3 border-s border-control-border/70 ps-2";
export const statusClasses =
  "my-3 rounded-xl border border-control-border bg-page-background px-4 py-4 text-xs leading-6 text-secondary-text";
