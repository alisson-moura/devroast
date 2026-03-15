import Link from "next/link";
import { Suspense } from "react";
import { HomeEditor } from "@/components/home-editor";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { LeaderboardPreviewSkeleton } from "@/components/leaderboard-preview-skeleton";
import { MetricsHint } from "@/components/metrics-stats";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Home() {
  void trpc.metrics.prefetch({ limit: 0 });

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
            <Suspense fallback={<LeaderboardPreviewSkeleton />}>
              <LeaderboardPreview />
            </Suspense>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
