import { cn } from "@/lib/utils";

interface TechChipProps {
  label: string;
  size?: "xs" | "sm";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<TechChipProps["size"]>, string> = {
  xs: "px-2 py-0.5 text-[9px]",
  sm: "px-3 py-1 text-xs",
};

/** A small tech-stack/category pill, standardizing the near-duplicate inline
 * chip markup that otherwise gets hand-rolled slightly differently at every
 * call site. */
export function TechChip({ label, size = "sm", className }: Readonly<TechChipProps>) {
  return (
    <span
      className={cn(
        "font-semibold bg-forest-50 text-forest-800 rounded-md border border-forest-200/50",
        SIZE_CLASSES[size],
        className
      )}
    >
      {label}
    </span>
  );
}
