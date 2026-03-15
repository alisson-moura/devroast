import { avg, count, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const appRouter = createTRPCRouter({
  leaderboard: baseProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(20) }))
    .query(async ({ input }) => {
      const [stats] = await db
        .select({ totalRoasts: count(), avgScore: avg(roasts.score) })
        .from(roasts);

      const entries = await db
        .select({
          id: roasts.id,
          code: roasts.code,
          language: roasts.language,
          score: roasts.score,
          verdict: roasts.verdict,
          roastQuote: roasts.roastQuote,
          suggestedFix: roasts.suggestedFix,
        })
        .from(roasts)
        .orderBy(roasts.score)
        .limit(input.limit);

      return {
        totalRoasts: stats?.totalRoasts ?? 0,
        avgScore: stats?.avgScore ? Number(stats.avgScore).toFixed(1) : "0.0",
        entries,
      };
    }),
  metrics: baseProcedure
    .input(z.object({ limit: z.number().min(0).max(20).default(0) }))
    .query(async ({ input }) => {
      const [stats] = await db
        .select({ totalRoasts: count(), avgScore: avg(roasts.score) })
        .from(roasts);

      const entries =
        input.limit > 0
          ? await db
              .select({
                id: roasts.id,
                code: roasts.code,
                language: roasts.language,
                score: roasts.score,
                verdict: roasts.verdict,
                roastQuote: roasts.roastQuote,
                suggestedFix: roasts.suggestedFix,
              })
              .from(roasts)
              .orderBy(sql`RANDOM()`)
              .limit(input.limit)
          : [];

      return {
        totalRoasts: stats?.totalRoasts ?? 0,
        avgScore: stats?.avgScore ? Number(stats.avgScore).toFixed(1) : "0.0",
        entries,
      };
    }),
});

export type AppRouter = typeof appRouter;
