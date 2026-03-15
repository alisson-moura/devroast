import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({});

export const roastOutputSchema = z.object({
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

export type RoastOutput = z.infer<typeof roastOutputSchema>;

type GenerateRoastInput = {
  code: string;
  language: string;
  roastMode: boolean;
};

export async function generateRoast(
  input: GenerateRoastInput,
): Promise<RoastOutput> {
  const modeInstruction = input.roastMode
    ? "Modo: sarcasmo máximo, sem filtros, pode ofender, linguagem informal, humilhe o código e implicitamente quem o escreveu. Sem suavizações."
    : "Modo: construtivo, técnico, direto, sem julgamentos pessoais.";

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({ schema: roastOutputSchema }),
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

  if (!result.output) {
    throw new Error("AI did not generate a valid roast output");
  }

  return result.output;
}
