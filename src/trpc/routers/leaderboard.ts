import { avg, count } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const leaderboardRouter = createTRPCRouter({
  list: baseProcedure
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
});
