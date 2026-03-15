import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { avg, count, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { analysisItems, roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const google = createGoogleGenerativeAI();

const roastOutputSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum([
    "needs_serious_help",
    "rough_around_edges",
    "decent_code",
    "solid_work",
    "exceptional",
  ]),
  roastQuote: z.string().nullable(),
  suggestedFix: z.string().nullable(),
  analysisItems: z
    .array(
      z.object({
        severity: z.enum(["critical", "warning", "good"]),
        title: z.string().max(200),
        description: z.string(),
      }),
    )
    .min(2)
    .max(8),
});

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
  createRoast: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(2000),
        language: z.string().min(1).max(50),
        roastMode: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const lineCount = input.code.split("\n").length;

      const modeInstruction = input.roastMode
        ? "Modo: sarcasmo máximo, sem filtros, pode ofender, linguagem informal, humilhe o código e implicitamente quem o escreveu. Sem suavizações."
        : "Modo: construtivo, técnico, direto, sem julgamentos pessoais.";

      const { object } = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: roastOutputSchema,
        system: `Você é um revisor de código experiente e impiedoso. Sempre responda em pt-br.
Analise o código submetido considerando qualidade, estilo, corretude e boas práticas.
Dê uma nota de 0 a 10 baseada na tabela:
- 0–2: needs_serious_help
- 3–4: rough_around_edges
- 5–6: decent_code
- 7–8: solid_work
- 9–10: exceptional
Inclua 2–8 analysisItems cobrindo problemas críticos, avisos e pontos positivos.
Inclua um roastQuote (resumo de uma linha).
Para suggestedFix: formate como diff simplificado — cada linha começa com '+' (adicionada), '-' (removida) ou ' ' (contexto). Sem cabeçalhos @@ ou --- +++. Retorne null se o código não precisar de fix ou for muito curto.
${modeInstruction}`,
        prompt: `Linguagem: ${input.language}\n\nCódigo:\n${input.code}`,
      });

      const [inserted] = await db
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

      if (!inserted) {
        throw new Error("Failed to insert roast");
      }

      await db.insert(analysisItems).values(
        object.analysisItems.map((item, i) => ({
          roastId: inserted.id,
          severity: item.severity,
          title: item.title,
          description: item.description,
          order: i,
        })),
      );

      return { id: inserted.id };
    }),
});

export type AppRouter = typeof appRouter;
