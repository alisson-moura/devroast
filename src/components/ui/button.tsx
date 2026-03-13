import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: [
    "inline-flex items-center gap-2 font-mono font-medium",
    "cursor-pointer select-none transition-all duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  variants: {
    variant: {
      terminal:
        "bg-background text-accent border border-surface hover:bg-surface/30 hover:border-accent/40 active:scale-[0.98] before:content-['$_'] before:text-accent/60",
      solid: "bg-accent text-background hover:bg-accent/80 active:scale-[0.98]",
      outline:
        "bg-transparent text-accent border border-accent hover:bg-accent/10 active:scale-[0.98]",
      ghost:
        "bg-transparent text-accent hover:bg-accent/10 active:scale-[0.98]",
    },
    size: {
      sm: "px-3 py-1.5 text-sm rounded",
      md: "px-5 py-3 text-base rounded-md",
      lg: "px-7 py-4 text-lg rounded-lg",
    },
  },
  defaultVariants: {
    variant: "terminal",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = ComponentProps<"button"> & ButtonVariants;

export function Button({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={button({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
