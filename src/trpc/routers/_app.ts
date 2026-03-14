import { avg, count } from "drizzle-orm";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const appRouter = createTRPCRouter({
  metrics: baseProcedure.query(async () => {
    const result = await db
      .select({
        totalRoasts: count(),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    const row = result[0];
    return {
      totalRoasts: row?.totalRoasts ?? 0,
      avgScore: row?.avgScore ? Number(row.avgScore).toFixed(1) : "0.0",
    };
  }),
});

export type AppRouter = typeof appRouter;
