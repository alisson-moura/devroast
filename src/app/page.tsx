import Link from "next/link";
import { Suspense } from "react";
import { HomeEditor } from "@/components/home-editor";
import {
  MetricsHint,
  MetricsLeaderboardFooter,
} from "@/components/metrics-stats";
import { Badge } from "@/components/ui/badge";
import { HydrateClient, trpc } from "@/trpc/server";

const LEADERBOARD = [
  {
    rank: 1,
    score: "1.2",
    snippet: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    lang: "javascript",
  },
  {
    rank: 2,
    score: "1.8",
    snippet: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    lang: "typescript",
  },
  {
    rank: 3,
    score: "2.1",
    snippet: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    lang: "sql",
  },
];

export default async function Home() {
  void trpc.metrics.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-col bg-background flex-1">
        <div className="mx-auto w-full max-w-[960px] px-10 py-20 flex flex-col gap-8">
          {/* Hero */}
          <section className="flex items-center flex-col gap-2">
            <h1 className="font-mono text-2xl font-medium text-foreground">
              <span className="text-accent">$</span> paste your code. get
              roasted.
            </h1>
            <p className="font-mono text-sm text-muted">
              {
                "// drop your code below and we'll rate it — brutally honest or full roast mode"
              }
            </p>
          </section>

          {/* Code Editor + Actions */}
          <HomeEditor />

          {/* Footer Hint */}
          <Suspense
            fallback={
              <p className="font-mono text-xs text-muted text-center">
                <span className="inline-block h-3 w-48 rounded bg-surface animate-pulse" />
              </p>
            }
          >
            <MetricsHint />
          </Suspense>

          {/* Leaderboard Preview */}
          <section className="flex flex-col gap-3 mt-20">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-foreground font-medium">
                {"// shame_leaderboard"}
              </span>
              <Link
                href="/leaderboard"
                className="font-mono text-sm text-accent hover:text-accent/80 transition-colors"
              >
                $ view_all &gt;&gt;
              </Link>
            </div>
            <p className="font-mono text-xs text-muted">
              {"// the worst code on the internet, ranked by shame"}
            </p>
            <div className="overflow-hidden rounded-md border border-surface">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="border-b border-surface bg-code-bg text-muted text-xs">
                    <th className="px-4 py-2.5 text-left font-medium w-12">
                      #
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium w-20">
                      score
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium">
                      snippet
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium w-28">
                      lang
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD.map((entry) => (
                    <tr
                      key={entry.rank}
                      className="border-b border-surface last:border-0 hover:bg-surface/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted">{entry.rank}</td>
                      <td className="px-4 py-3">
                        <Badge variant="critical">{entry.score}</Badge>
                      </td>
                      <td className="px-4 py-3 text-subtle">
                        {entry.snippet.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-muted">{entry.lang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Suspense
              fallback={
                <p className="font-mono text-xs text-muted text-center">
                  <span className="inline-block h-3 w-56 rounded bg-surface animate-pulse" />
                </p>
              }
            >
              <MetricsLeaderboardFooter />
            </Suspense>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
