import type { ComponentProps } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { tv } from "tailwind-variants";

const root = tv({
  base: "overflow-hidden rounded-md border border-surface bg-code-bg font-mono text-sm",
});

const headerStyle = tv({
  base: "flex items-center gap-2 border-b border-surface px-4 py-2.5",
});

const contentStyle = tv({
  base: "overflow-x-auto p-4 [&>pre]:bg-transparent! [&>pre]:p-0!",
});

type HeaderProps = ComponentProps<"div"> & {
  filename?: string;
};

type ContentProps = {
  code: string;
  lang: BundledLanguage;
  className?: string;
};

function Root({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div data-code-block className={root({ className })} {...props}>
      {children}
    </div>
  );
}

function Header({ className, filename, children, ...props }: HeaderProps) {
  return (
    <div className={headerStyle({ className })} {...props}>
      <span className="size-3 rounded-full bg-critical" />
      <span className="size-3 rounded-full bg-warning" />
      <span className="size-3 rounded-full bg-accent" />
      {filename && <span className="ml-2 text-xs text-subtle">{filename}</span>}
      {children}
    </div>
  );
}

async function Content({ code, lang, className }: ContentProps) {
  "use cache";
  const html = await codeToHtml(code, { lang, theme: "vesper" });
  return (
    <div
      className={contentStyle({ className })}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is sanitized
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export const CodeBlock = Object.assign(Root, { Header, Content });
