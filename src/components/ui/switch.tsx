"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";

type SwitchProps = ComponentProps<typeof Switch.Root> & {
  label?: string;
};

export function AppSwitch({ label, className, ...props }: SwitchProps) {
  return (
    <div className="group inline-flex cursor-pointer items-center gap-3 select-none">
      <Switch.Root
        className={[
          "relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-full border transition-colors duration-150",
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "data-[checked]:bg-accent data-[checked]:border-accent",
          "data-[unchecked]:bg-transparent data-[unchecked]:border-surface",
          "disabled:pointer-events-none disabled:opacity-40",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <Switch.Thumb className="block size-4 rounded-full bg-foreground shadow-sm transition-transform duration-150 data-[unchecked]:translate-x-[3px] data-[checked]:translate-x-[19px]" />
      </Switch.Root>
      {label && (
        <span className="font-mono text-sm transition-colors duration-150 group-has-data-[checked]:text-accent group-has-data-[unchecked]:text-muted">
          {label}
        </span>
      )}
    </div>
  );
}
