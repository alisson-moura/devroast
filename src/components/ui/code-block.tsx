import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

type CodeBlockProps = {
  code: string;
  lang: BundledLanguage;
  filename?: string;
};

export async function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const html = await codeToHtml(code, { lang, theme: "vesper" });

  return (
    <div
      data-code-block
      className="overflow-hidden rounded-md border border-surface bg-code-bg font-mono text-sm"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-surface px-4 py-2.5">
        <span className="size-3 rounded-full bg-critical" />
        <span className="size-3 rounded-full bg-warning" />
        <span className="size-3 rounded-full bg-accent" />
        {filename && (
          <span className="ml-2 text-xs text-subtle">{filename}</span>
        )}
      </div>
      {/* Highlighted code */}
      <div
        className="overflow-x-auto p-4 [&>pre]:bg-transparent! [&>pre]:p-0!"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is sanitized
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
