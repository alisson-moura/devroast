import { cacheLife } from "next/cache";
import Link from "next/link";
import { type BundledLanguage, codeToHtml } from "shiki";
import { LeaderboardRow } from "@/components/leaderboard-row";
import { caller } from "@/trpc/server";

export async function LeaderboardPreview() {
  "use cache";
  cacheLife("hours");

  const { entries, totalRoasts } = await caller.metrics({ limit: 3 });

  const rows = await Promise.all(
    entries.map(async (entry, i) => {
      const lang = entry.language as BundledLanguage;
      const html = await codeToHtml(entry.code, {
        lang,
        theme: "vesper",
      }).catch(() => codeToHtml(entry.code, { lang: "text", theme: "vesper" }));
      return { ...entry, rank: i + 1, html };
    }),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-md border border-surface">
        {/* Header */}
        <div className="grid grid-cols-[3rem_5rem_1fr_7rem] border-b border-surface bg-code-bg text-muted text-xs font-mono font-medium px-4 py-2.5">
          <span>#</span>
          <span>score</span>
          <span>roast</span>
          <span>lang</span>
        </div>
        {/* Rows */}
        {rows.length === 0 && (
          <div className="px-4 py-6 text-center text-muted font-mono text-xs">
            {/* no roasts yet — be the first */}
          </div>
        )}
        {rows.map((row) => (
          <LeaderboardRow
            key={row.id}
            rank={row.rank}
            score={row.score.toFixed(1)}
            language={row.language}
            verdict={row.verdict}
            roastQuote={row.roastQuote ?? null}
            suggestedFix={row.suggestedFix ?? null}
            highlightedHtml={row.html}
          />
        ))}
      </div>
      <p className="font-mono text-xs text-muted text-center">
        showing top 3 of {totalRoasts.toLocaleString()} ·{" "}
        <Link
          href="/leaderboard"
          className="text-accent hover:text-accent/80 transition-colors"
        >
          view full leaderboard &gt;&gt;
        </Link>
      </p>
    </div>
  );
}
