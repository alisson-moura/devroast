import { createTRPCRouter } from "@/trpc/init";
import { leaderboardRouter } from "./leaderboard";
import { metricsRouter } from "./metrics";
import { roastRouter } from "./roast";

export const appRouter = createTRPCRouter({
  roast: roastRouter,
  leaderboard: leaderboardRouter,
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
