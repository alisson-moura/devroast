# Design: createRoast — AI Backend Integration

**Date:** 2026-03-15
**Status:** Approved

---

## Overview

Implement the `createRoast` tRPC mutation to analyze submitted code using Google Gemini 2.0 Flash via the Vercel AI SDK (`generateObject`), persist the result to PostgreSQL, and return the roast ID for client-side redirection.

---

## Scope

- Replace the mocked `createRoast` mutation with real AI analysis
- Persist to `roasts` and `analysisItems` tables
- Support two modes: constructive feedback and sarcastic roast (pt-br)
- `suggestedFix` returned as unified diff format
- Result page wiring is **out of scope** for this task

---

## Architecture

### Flow

```
Input: { code, language, roastMode }
  → compute lineCount (split by \n)
  → call generateObject (Gemini 2.0 Flash)
  → insert into roasts
  → bulk insert into analysisItems
  → return { id }
```

### File changed

- `src/trpc/routers/_app.ts` — only file modified

---

## AI Integration

**Model:** `gemini-2.0-flash` via `@ai-sdk/google`

**Function:** `generateObject` from `ai`

### Zod output schema

```ts
z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum([
    "needs_serious_help",
    "rough_around_edges",
    "decent_code",
    "solid_work",
    "exceptional",
  ]),
  roastQuote: z.string().nullable(),
  suggestedFix: z.string().nullable(), // unified diff or null
  analysisItems: z
    .array(
      z.object({
        severity: z.enum(["critical", "warning", "good"]),
        title: z.string().max(200),
        description: z.string(),
      })
    )
    .min(2)
    .max(8),
})
```

### Score → Verdict mapping (guidance for the prompt)

| Score | Verdict |
|-------|---------|
| 0–2   | needs_serious_help |
| 3–4   | rough_around_edges |
| 5–6   | decent_code |
| 7–8   | solid_work |
| 9–10  | exceptional |

### Prompt strategy

The system prompt instructs the model to:
- Always respond in **pt-br**
- Analyze the submitted code for quality, style, correctness, and best practices
- Return a score from 0 to 10 based on the table above
- Include 2–8 `analysisItems` covering critical issues, warnings, and positives
- Include a `roastQuote` (a one-liner summary)
- Include a `suggestedFix` as a **unified diff** (lines prefixed with `+`, `-`, or ` `) when there are meaningful improvements; `null` if the code is already good or too short to diff

**roastMode: false** — construtivo, técnico, direto, sem julgamentos pessoais

**roastMode: true** — sarcasmo máximo, sem filtros, pode ofender, linguagem informal, a ideia é humilhar o código (e implicitamente quem o escreveu). Sem suavizações.

---

## Input Validation

The `language` input must be changed from `z.string().nullable()` to `z.string().min(1)` — the `roasts.language` DB column is `NOT NULL`. The client already enforces language selection before enabling submit (commit `bb0c01e`), so this is not a breaking change.

---

## `suggestedFix` Diff Format Contract

The AI prompt must instruct the model to format `suggestedFix` as a **simplified diff** — not a full unified diff. Rules:
- Each line must start with exactly one character: `+` (added), `-` (removed), or ` ` (space, context)
- **No** `@@` hunk headers
- **No** `--- file` / `+++ file` headers
- Return `null` if the code needs no fix or is too short to diff meaningfully

This format maps directly to the `DiffLine` component's `type` prop (`added`, `removed`, `context`) when parsed line-by-line.

---

## Persistence

Single async flow (no explicit transaction needed for this scale):

1. `db.insert(roasts).values({ code, language, lineCount, roastMode, score, verdict, roastQuote, suggestedFix }).returning({ id })`
   - `createdAt` is omitted — the DB column has `defaultNow()` and is set automatically
2. `db.insert(analysisItems).values(items.map((item, i) => ({ roastId: id, ...item, order: i })))`

---

## Error Handling

- AI SDK errors propagate as tRPC `INTERNAL_SERVER_ERROR`
- No retries at this stage — keep it simple
- Zod schema validation on the AI response is handled automatically by `generateObject`

---

## Out of Scope

- Result page dynamic data fetching
- Language auto-detection fallback
- Streaming / progressive loading
- Rate limiting
- Caching
