"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";

export function MetricsHint() {
  const [metrics] = trpc.metrics.summary.useSuspenseQuery({ limit: 0 });

  return (
    <p className="font-mono text-xs text-muted text-center">
      {metrics.totalRoasts.toLocaleString()} codes roasted · avg score:{" "}
      {metrics.avgScore}/10
    </p>
  );
}

export function MetricsLeaderboardFooter() {
  const [metrics] = trpc.metrics.summary.useSuspenseQuery({ limit: 0 });

  return (
    <p className="font-mono text-xs text-muted text-center">
      showing top 3 of {metrics.totalRoasts.toLocaleString()} ·{" "}
      <Link
        href="/leaderboard"
        className="text-accent hover:text-accent/80 transition-colors"
      >
        view full leaderboard &gt;&gt;
      </Link>
    </p>
  );
}
