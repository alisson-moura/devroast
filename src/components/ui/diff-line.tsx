import type { ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
  base: "flex items-baseline gap-2 px-4 py-0.5 font-mono text-sm",
  variants: {
    type: {
      added: "bg-diff-added text-accent",
      removed: "bg-diff-removed text-critical",
      context: "bg-transparent text-muted",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const PREFIX = { added: "+", removed: "-", context: " " } as const;

type DiffLineVariants = VariantProps<typeof diffLine>;

type DiffLineProps = DiffLineVariants & {
  children: ReactNode;
  className?: string;
};

export function DiffLine({
  type = "context",
  children,
  className,
}: DiffLineProps) {
  return (
    <div className={diffLine({ type, className })}>
      <span className="select-none opacity-60">
        {PREFIX[type ?? "context"]}
      </span>
      <span>{children}</span>
    </div>
  );
}
