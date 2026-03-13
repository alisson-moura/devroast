import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const root = tv({
  base: "flex flex-col gap-3 rounded-md border border-surface p-5",
});

const header = tv({
  base: "flex items-center",
});

const title = tv({
  base: "font-mono text-[13px] font-medium text-foreground",
});

const description = tv({
  base: "font-mono text-xs text-muted leading-[1.5]",
});

function Root({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={root({ className })} {...props}>
      {children}
    </div>
  );
}

function Header({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={header({ className })} {...props}>
      {children}
    </div>
  );
}

function Title({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p className={title({ className })} {...props}>
      {children}
    </p>
  );
}

function Description({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p className={description({ className })} {...props}>
      {children}
    </p>
  );
}

export const AnalysisCard = Object.assign(Root, { Header, Title, Description });
