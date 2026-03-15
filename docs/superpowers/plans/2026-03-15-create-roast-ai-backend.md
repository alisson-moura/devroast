# createRoast AI Backend Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mocked `createRoast` tRPC mutation with real Gemini 2.0 Flash AI analysis and persist results to PostgreSQL.

**Architecture:** Single mutation in `_app.ts` — validate input, call `generateObject` with a structured Zod schema, insert into `roasts` then bulk-insert into `analysisItems`. No transactions needed at this scale.

**Tech Stack:** Vercel AI SDK (`ai` + `@ai-sdk/google`), Drizzle ORM, Zod v4, tRPC

---

## Chunk 1: Implementation

### Task 1: Replace `createRoast` mutation

**Files:**
- Modify: `src/trpc/routers/_app.ts`

#### Context you need before touching code

- `@ai-sdk/google` and `ai` are already installed (see `package.json`).
- The DB schema already has `roasts` and `analysisItems` tables in `src/db/schema.ts`. Both are already imported or available — `analysisItems` is **not yet imported** in `_app.ts`, add it.
- `generateObject` is imported from `"ai"`, the Google provider from `"@ai-sdk/google"`.
- The `GOOGLE_GENERATIVE_AI_API_KEY` env var is used automatically by `@ai-sdk/google` — no manual config needed.
- There is **no test framework** in this project. Verification is done by running the dev server and calling the mutation manually.

---

- [ ] **Step 1: Add missing import for `analysisItems`**

In `src/trpc/routers/_app.ts`, update the schema import line:

```ts
import { analysisItems, roasts } from "@/db/schema";
```

- [ ] **Step 2: Add AI SDK imports**

At the top of `src/trpc/routers/_app.ts`, add:

```ts
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
```

Remove the now-unused `import { randomUUID } from "node:crypto";`.

- [ ] **Step 3: Define the AI output schema**

Inside `_app.ts`, before the router definition, add:

```ts
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
```

- [ ] **Step 4: Replace the `createRoast` mutation body**

Replace the entire mutation implementation (lines 66–81 in current file):

```ts
createRoast: baseProcedure
  .input(
    z.object({
      code: z.string().min(1).max(2000),
      language: z.string().min(1),
      roastMode: z.boolean(),
    }),
  )
  .mutation(async ({ input }) => {
    const lineCount = input.code.split("\n").length;

    const google = createGoogleGenerativeAI();

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
```

- [ ] **Step 5: Format and lint**

```bash
pnpm format && pnpm lint
```

Fix any issues reported by Biome before continuing.

- [ ] **Step 6: Verify the dev server starts without errors**

```bash
pnpm dev
```

Expected: server starts on `http://localhost:3000` with no TypeScript or import errors in the terminal.

- [ ] **Step 7: Manual smoke test**

Open the app in a browser, paste some code, select a language, click Roast. Expected:
- Request takes a few seconds (real AI call)
- Client redirects to the result page with a real UUID in the URL
- No errors in server terminal

- [ ] **Step 8: Commit**

```bash
git add src/trpc/routers/_app.ts
git commit -m "feat: implement createRoast with Gemini 2.0 Flash and DB persistence"
```

---

## Chunk 2: (none — single-file change, no further tasks)

This spec is a single-file implementation. No additional subsystems to implement.
