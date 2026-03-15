"use client";
import { Collapsible } from "@base-ui/react/collapsible";
import { Badge } from "@/components/ui/badge";

type Props = {
  rank: number;
  score: string;
  language: string;
  snippetLines: string[];
  highlightedHtml: string;
};

export function LeaderboardRow({
  rank,
  score,
  language,
  snippetLines,
  highlightedHtml,
}: Props) {
  return (
    <Collapsible.Root className="border-b border-surface last:border-0">
      <Collapsible.Trigger className="w-full grid grid-cols-[3rem_5rem_1fr_7rem] items-start px-4 py-3 text-left hover:bg-surface/30 transition-colors cursor-pointer font-mono text-sm group">
        <span className="text-muted">{rank}</span>
        <span>
          <Badge variant="critical">{score}</Badge>
        </span>
        <span className="text-subtle">
          {snippetLines.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: preview lines have no stable key
            <div key={i}>{line}</div>
          ))}
        </span>
        <span className="text-muted flex items-center justify-between">
          {language}
          <span className="text-xs text-accent group-data-[open]:rotate-180 transition-transform">
            ▼
          </span>
        </span>
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <div
          className="p-4 overflow-x-auto [&>pre]:bg-transparent! [&>pre]:p-0! font-mono text-sm"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated Shiki HTML
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
