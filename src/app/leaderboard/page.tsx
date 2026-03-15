import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { type BundledLanguage, codeToHtml } from "shiki";
import { LeaderboardRow } from "@/components/leaderboard-row";
import { caller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Shame Leaderboard | devroast",
  description: "The most roasted code on the internet. Ranked by shame score.",
  openGraph: {
    title: "Shame Leaderboard | devroast",
    description:
      "The most roasted code on the internet. Ranked by shame score.",
    type: "website",
  },
};

export default function LeaderboardPage() {
  return (
    <main className="flex-1 px-10 py-10 md:px-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <Suspense fallback={<LeaderboardSkeleton />}>
          <LeaderboardContent />
        </Suspense>
      </div>
    </main>
  );
}

async function LeaderboardContent() {
  "use cache";
  cacheLife("hours");

  const { entries, totalRoasts, avgScore } = await caller.leaderboard({
    limit: 20,
  });

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

  const top3 = rows.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <div className="relative flex flex-col gap-6">
        {/* CRT scanline overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            zIndex: 1,
          }}
        />

        <div className="flex flex-col gap-3 relative z-10">
          <h1
            className="animate-flicker font-mono text-3xl font-bold md:text-4xl tracking-tight"
            style={{
              textShadow:
                "0 0 20px rgba(239,68,68,0.7), 0 0 40px rgba(239,68,68,0.3)",
            }}
          >
            <span className="text-critical">☠</span>
            <span className="text-foreground mx-3">HALL OF SHAME</span>
            <span className="text-critical">☠</span>
            <span className="animate-blink text-critical ml-2">▌</span>
          </h1>
          <p className="font-mono text-sm text-muted">
            {`// the most catastrophically bad code the internet has produced`}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs relative z-10">
          <span className="px-3 py-1.5 rounded border border-surface bg-code-bg text-muted">
            <span className="text-accent">[</span>
            <span className="mx-1">
              {totalRoasts.toLocaleString()} submissions
            </span>
            <span className="text-accent">]</span>
          </span>
          <span className="px-3 py-1.5 rounded border border-surface bg-code-bg text-muted">
            <span className="text-warning">[</span>
            <span className="mx-1">avg score: {avgScore}/10</span>
            <span className="text-warning">]</span>
          </span>
        </div>
      </div>

      {/* Top 3 Podium of Shame */}
      {top3.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs text-subtle uppercase tracking-widest">
            — top 3 worst offenders —
          </p>
          {top3.map((row, i) => {
            const podiumConfig = [
              {
                emoji: "☠",
                label: "#1 MOST SHAMEFUL",
                borderClass: "border-critical/60 animate-glow-pulse",
                rankClass: "text-critical",
              },
              {
                emoji: "🔥",
                label: "#2 SPECTACULAR FAILURE",
                borderClass: "border-warning/50",
                rankClass: "text-warning",
              },
              {
                emoji: "💀",
                label: "#3 HALL OF SHAME",
                borderClass: "border-surface",
                rankClass: "text-muted",
              },
            ][i];

            return (
              <div
                key={row.id}
                className={`rounded-md border ${podiumConfig.borderClass} bg-code-bg px-4 py-3 font-mono`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{podiumConfig.emoji}</span>
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${podiumConfig.rankClass}`}
                  >
                    {podiumConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-2xl font-bold ${podiumConfig.rankClass}`}
                  >
                    {row.score.toFixed(1)}
                  </span>
                  <span className="text-subtle text-xs">/10</span>
                  <span className="px-2 py-0.5 rounded border border-surface text-muted bg-background text-xs">
                    {row.language}
                  </span>
                </div>
                {row.roastQuote && (
                  <p className="mt-2 text-xs text-critical/80 italic leading-snug line-clamp-2">
                    &ldquo;{row.roastQuote}&rdquo;
                  </p>
                )}
                <p className="mt-1 text-xs text-muted capitalize">
                  {row.verdict.replace(/_/g, " ")}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-surface">
        {/* Header */}
        <div className="grid grid-cols-[3rem_5rem_1fr_7rem] border-b border-surface bg-code-bg px-4 py-2.5 font-mono text-xs font-medium text-muted">
          <span>#</span>
          <span>score</span>
          <span>roast</span>
          <span>lang</span>
        </div>
        {rows.length === 0 && (
          <div className="px-4 py-6 text-center font-mono text-xs text-muted">
            no roasts yet — be the first
          </div>
        )}
        {rows.map((row, i) => (
          <div
            key={row.id}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <LeaderboardRow
              rank={row.rank}
              score={row.score.toFixed(1)}
              language={row.language}
              verdict={row.verdict}
              roastQuote={row.roastQuote ?? null}
              suggestedFix={row.suggestedFix ?? null}
              highlightedHtml={row.html}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Bone({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-surface ${className ?? ""}`} />
  );
}

function LeaderboardSkeleton() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="font-mono text-3xl font-bold md:text-4xl tracking-tight">
            <span className="text-critical">☠</span>
            <span className="text-foreground mx-3">HALL OF SHAME</span>
            <span className="text-critical">☠</span>
            <span className="animate-blink text-critical/30 ml-2">▌</span>
          </h1>
          <p className="font-mono text-sm text-muted">
            {"// the most catastrophically bad code the internet has produced"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Bone className="h-7 w-36" />
          <Bone className="h-7 w-36" />
        </div>
      </div>

      {/* Top 3 podium skeleton */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-subtle uppercase tracking-widest">
          — top 3 worst offenders —
        </p>
        {(
          [
            { key: "p1", border: "border-critical/30" },
            { key: "p2", border: "border-warning/20" },
            { key: "p3", border: "border-surface" },
          ] as const
        ).map(({ key, border }) => (
          <div
            key={key}
            className={`rounded-md border ${border} bg-code-bg px-4 py-3`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Bone className="h-3 w-3 rounded-full" />
              <Bone className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Bone className="h-7 w-10" />
              <Bone className="h-4 w-16" />
            </div>
            <Bone className="h-3 w-3/4 mb-1.5" />
            <Bone className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-md border border-surface">
        <div className="grid grid-cols-[3rem_5rem_1fr_7rem] border-b border-surface bg-code-bg px-4 py-2.5 font-mono text-xs font-medium text-muted">
          <span>#</span>
          <span>score</span>
          <span>roast</span>
          <span>lang</span>
        </div>
        {(
          [
            { key: "r1", w: "w-28" },
            { key: "r2", w: "w-20" },
            { key: "r3", w: "w-32" },
            { key: "r4", w: "w-24" },
            { key: "r5", w: "w-28" },
            { key: "r6", w: "w-20" },
            { key: "r7", w: "w-26" },
            { key: "r8", w: "w-22" },
          ] as const
        ).map(({ key, w }) => (
          <div
            key={key}
            className="grid grid-cols-[3rem_5rem_1fr_7rem] items-start border-b border-surface px-4 py-3 last:border-0"
          >
            <Bone className="mt-0.5 h-3 w-4" />
            <Bone className="mt-0.5 h-5 w-10" />
            <div className="flex flex-col gap-1.5">
              <Bone className={`h-3 ${w}`} />
              <Bone className="h-4 w-28" />
            </div>
            <Bone className="mt-0.5 h-5 w-16" />
          </div>
        ))}
      </div>
    </>
  );
}
