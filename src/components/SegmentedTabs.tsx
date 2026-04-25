import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SegmentedTab<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedTabsProps<T extends string> {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const SegmentedTabs = <T extends string>({ tabs, value, onChange }: SegmentedTabsProps<T>) => (
  <div role="tablist" className="inline-flex flex-wrap items-center gap-1 rounded-md bg-muted p-1 text-muted-foreground">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        role="tab"
        aria-selected={value === tab.value}
        onClick={() => onChange(tab.value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          value === tab.value
            ? "bg-background text-foreground shadow-sm"
            : "hover:bg-background/60 hover:text-foreground",
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
