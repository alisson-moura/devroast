import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { generateRoast } from "@/ai/roast-agent";
import { db } from "@/db";
import { analysisItems, roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const roastRouter = createTRPCRouter({
  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [roast] = await db
        .select()
        .from(roasts)
        .where(eq(roasts.id, input.id))
        .limit(1);

      if (!roast) return null;

      const items = await db
        .select()
        .from(analysisItems)
        .where(eq(analysisItems.roastId, input.id))
        .orderBy(asc(analysisItems.order));

      return { ...roast, analysisItems: items };
    }),

  create: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(2000),
        language: z.string().min(1).max(50),
        roastMode: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const lineCount = input.code.split("\n").length;

      console.log("[createRoast] start", {
        language: input.language,
        lineCount,
        roastMode: input.roastMode,
        codeLength: input.code.length,
      });

      let object: Awaited<ReturnType<typeof generateRoast>>;
      try {
        object = await generateRoast(input);
        console.log("[createRoast] ai ok", {
          score: object.score,
          verdict: object.verdict,
          analysisItemsCount: object.analysisItems.length,
        });
      } catch (err) {
        console.error("[createRoast] ai error", err);
        throw err;
      }

      let inserted: { id: string } | undefined;
      try {
        const rows = await db
          .insert(roasts)
          .values({
            code: input.code,
            language: input.language,
            lineCount,
            roastMode: input.roastMode,
            score: object.score,
            verdict: object.verdict,
            roastQuote: object.roastQuote,
            suggestedFix: object.suggestedFix,
          })
          .returning({ id: roasts.id });
        inserted = rows[0];
      } catch (err) {
        console.error("[createRoast] db insert roast error", err);
        throw err;
      }

      if (!inserted) {
        console.error("[createRoast] db insert roast returned no rows");
        throw new Error("Failed to insert roast");
      }

      console.log("[createRoast] roast inserted", { id: inserted.id });

      try {
        await db.insert(analysisItems).values(
          object.analysisItems.map((item, i) => ({
            roastId: inserted.id,
            severity: item.severity,
            title: item.title,
            description: item.description,
            order: i,
          })),
        );
        console.log("[createRoast] analysisItems inserted", {
          roastId: inserted.id,
          count: object.analysisItems.length,
        });
      } catch (err) {
        console.error("[createRoast] analysisItems insert error", {
          roastId: inserted.id,
          error: err,
        });
      }

      return { id: inserted.id };
    }),
});
