import type { ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
  base: "inline-flex items-center gap-1.5 font-mono text-xs font-medium",
  variants: {
    variant: {
      good: "text-accent",
      warning: "text-warning",
      critical: "text-critical",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

const dotWrapper = tv({
  base: "relative size-2 shrink-0",
});

const dotPing = tv({
  base: "absolute inset-0 rounded-full animate-ping opacity-60",
  variants: {
    variant: {
      good: "bg-accent",
      warning: "bg-warning",
      critical: "bg-critical",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

const dot = tv({
  base: "absolute inset-0 rounded-full",
  variants: {
    variant: {
      good: "bg-accent",
      warning: "bg-warning",
      critical: "bg-critical",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

type BadgeVariants = VariantProps<typeof badge>;

type BadgeProps = BadgeVariants & {
  children: ReactNode;
  className?: string;
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={badge({ variant, className })}>
      <span className={dotWrapper()}>
        <span className={dotPing({ variant })} />
        <span className={dot({ variant })} />
      </span>
      {children}
    </span>
  );
}
