"use client";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Verdict =
  | "needs_serious_help"
  | "rough_around_edges"
  | "decent_code"
  | "solid_work"
  | "exceptional";

type Props = {
  rank: number;
  score: string;
  language: string;
  verdict: Verdict;
  roastQuote: string | null;
  suggestedFix: string | null;
  highlightedHtml: string;
};

const verdictLabel: Record<Verdict, string> = {
  needs_serious_help: "needs serious help",
  rough_around_edges: "rough around edges",
  decent_code: "decent code",
  solid_work: "solid work",
  exceptional: "exceptional",
};

const verdictQuoteColor: Record<Verdict, string> = {
  needs_serious_help: "text-critical/90",
  rough_around_edges: "text-critical/90",
  decent_code: "text-warning/90",
  solid_work: "text-accent/90",
  exceptional: "text-accent",
};

const verdictVariant: Record<Verdict, "critical" | "warning" | "good"> = {
  needs_serious_help: "critical",
  rough_around_edges: "critical",
  decent_code: "warning",
  solid_work: "good",
  exceptional: "good",
};

function rankColor(rank: number): string {
  if (rank === 1) return "text-critical font-bold";
  if (rank === 2) return "text-warning font-bold";
  if (rank === 3) return "text-warning/60 font-bold";
  if (rank <= 10) return "text-muted";
  return "text-subtle";
}

export function LeaderboardRow({
  rank,
  score,
  language,
  verdict,
  roastQuote,
  suggestedFix,
  highlightedHtml,
}: Props) {
  return (
    <Collapsible.Root className="border-b border-surface last:border-0 group border-l-2 border-l-transparent hover:border-l-accent/40 data-[open]:border-l-accent/60 transition-colors">
      <Collapsible.Trigger className="w-full grid grid-cols-[3rem_5rem_1fr_7rem] items-start px-4 py-3 text-left hover:bg-surface/30 transition-colors cursor-pointer font-mono text-sm">
        <span className={`pt-0.5 ${rankColor(rank)}`}>{rank}</span>
        <span className="pt-0.5">
          <Badge variant={verdictVariant[verdict]}>{score}</Badge>
        </span>
        <span className="flex flex-col gap-1.5 min-w-0">
          {roastQuote && (
            <span
              className={`${verdictQuoteColor[verdict]} italic text-xs leading-snug line-clamp-2`}
            >
              &ldquo;{roastQuote}&rdquo;
            </span>
          )}
          <Badge
            variant={verdictVariant[verdict]}
            className="w-fit text-[10px]"
          >
            {verdictLabel[verdict]}
          </Badge>
          {suggestedFix && (
            <span className="text-muted text-xs leading-snug line-clamp-1">
              <span className="text-accent mr-1">→</span>
              {suggestedFix}
            </span>
          )}
        </span>
        <span className="text-muted flex items-center justify-between pt-0.5">
          <span className="px-2 py-0.5 rounded border border-surface text-muted bg-code-bg text-xs">
            {language}
          </span>
          <ChevronDown className="size-3.5 text-accent group-data-[open]:rotate-180 transition-transform duration-200" />
        </span>
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <div
          className="px-4 pb-4 pt-2 overflow-x-auto [&>pre]:bg-transparent! [&>pre]:p-0! font-mono text-sm border-t border-surface/50"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated Shiki HTML
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
