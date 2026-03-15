import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { BundledLanguage } from "shiki";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { caller } from "@/trpc/server";

async function fetchResult(id: string) {
  "use cache";
  cacheLife("minutes");
  return caller.roast.getById({ id });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchResult(id);
  const quote = result?.roastQuote
    ? `"${result.roastQuote}"`
    : "Your code, professionally demolished.";
  return {
    title: "Roast Results | devroast",
    description: quote,
    openGraph: {
      title: "Roast Results | devroast",
      description: quote,
      type: "website",
    },
  };
}

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="flex-1 px-10 py-10">
      <div className="mx-auto w-full max-w-[960px] flex flex-col gap-10">
        <Suspense fallback={<ResultSkeleton />}>
          <ResultContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function ResultContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await fetchResult(id);

  if (!result) notFound();

  const lang = `${langExtension(result.language)}`; // for filename display
  const severity = verdictSeverity(result.verdict);

  return (
    <>
      {/* Score Hero */}
      <section
        className="animate-fade-up flex items-center gap-12"
        style={{ animationDelay: "0ms" }}
      >
        <ScoreRing score={result.score} />

        <div className="flex flex-1 flex-col gap-4">
          <Badge variant={severity}>verdict: {result.verdict}</Badge>

          {result.roastQuote && (
            <p
              className="text-xl leading-relaxed text-foreground"
              style={{ fontFamily: "var(--font-ibm-plex-mono, monospace)" }}
            >
              &ldquo;{result.roastQuote}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-4 font-mono text-xs text-subtle">
            <span>lang: {result.language}</span>
            <span>·</span>
            <span>{result.lineCount} lines</span>
          </div>

          <div>
            <button
              type="button"
              disabled
              className="border border-surface px-4 py-2 font-mono text-xs text-foreground opacity-40 cursor-not-allowed"
            >
              $ share_roast
            </button>
          </div>
        </div>
      </section>

      <hr className="border-surface" />

      {/* Submitted Code */}
      <section
        className="animate-fade-up flex flex-col gap-4"
        style={{ animationDelay: "100ms" }}
      >
        <SectionTitle prompt="//" title="your_submission" />
        <CodeBlock>
          <CodeBlock.Header filename={`your_code.${lang}`} />
          <CodeBlock.Content
            code={result.code}
            lang={result.language as BundledLanguage}
            className="max-h-[320px] overflow-y-auto"
          />
        </CodeBlock>
      </section>

      <hr className="border-surface" />

      {/* Detailed Analysis */}
      <section
        className="animate-fade-up flex flex-col gap-6"
        style={{ animationDelay: "200ms" }}
      >
        <SectionTitle prompt="//" title="detailed_analysis" />
        <div className="grid grid-cols-2 gap-5">
          {result.analysisItems.map((item) => (
            <AnalysisCard key={item.id}>
              <AnalysisCard.Header>
                <Badge
                  variant={item.severity as "critical" | "warning" | "good"}
                >
                  {item.severity}
                </Badge>
              </AnalysisCard.Header>
              <AnalysisCard.Title>{item.title}</AnalysisCard.Title>
              <AnalysisCard.Description>
                {item.description}
              </AnalysisCard.Description>
            </AnalysisCard>
          ))}
        </div>
      </section>

      {result.suggestedFix && (
        <>
          <hr className="border-surface" />

          {/* Suggested Fix */}
          <section
            className="animate-fade-up flex flex-col gap-6"
            style={{ animationDelay: "300ms" }}
          >
            <SectionTitle prompt="//" title="suggested_fix" />
            <CodeBlock>
              <CodeBlock.Header filename={`improved_code.${lang}`} />
              <CodeBlock.Content
                code={result.suggestedFix}
                lang={result.language as BundledLanguage}
              />
            </CodeBlock>
          </section>
        </>
      )}
    </>
  );
}

function verdictSeverity(verdict: string): "critical" | "warning" | "good" {
  if (verdict === "needs_serious_help") return "critical";
  if (verdict === "rough_around_edges" || verdict === "decent_code")
    return "warning";
  return "good";
}

function scoreColor(score: number): string {
  if (score < 4) return "text-critical";
  if (score <= 7) return "text-warning";
  return "text-accent";
}

function langExtension(language: string): string {
  const map: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    rust: "rs",
    go: "go",
    java: "java",
  };
  return map[language.toLowerCase()] ?? language;
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const rad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(startDeg));
  const y1 = cy + r * Math.sin(rad(startDeg));
  const x2 = cx + r * Math.cos(rad(endDeg));
  const y2 = cy + r * Math.sin(rad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;
}

function scoreHex(score: number): string {
  if (score < 4) return "#ef4444";
  if (score <= 7) return "#f59e0b";
  return "#10b981";
}

function ScoreRing({ score }: { score: number }) {
  const cx = 90;
  const cy = 90;
  const r = 72;
  const SEG = 30; // arc degrees per segment
  const GAP = 6; // gap degrees between segments
  const PITCH = SEG + GAP; // 36° × 10 = 360°
  const START = -90; // top

  const fill = scoreHex(score);
  const dim = "#222222";
  const glow =
    score < 4
      ? "rgba(239,68,68,0.35)"
      : score <= 7
        ? "rgba(245,158,11,0.35)"
        : "rgba(16,185,129,0.35)";

  return (
    <div className="relative h-[180px] w-[180px] shrink-0">
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        aria-label={`Score: ${score} out of 10`}
        role="img"
        style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const s = START + i * PITCH;
          const e = s + SEG;
          const frac = Math.min(1, Math.max(0, score - i));
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional, index is stable
            <g key={i}>
              <path
                d={arcPath(cx, cy, r, s, e)}
                stroke={dim}
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
              />
              {frac > 0 && (
                <path
                  d={arcPath(cx, cy, r, s, s + SEG * frac)}
                  stroke={fill}
                  strokeWidth={8}
                  fill="none"
                  strokeLinecap="round"
                  opacity={frac < 1 ? 0.55 : 1}
                />
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-mono text-5xl font-bold leading-none ${scoreColor(score)}`}
        >
          {score}
        </span>
        <span className="font-mono text-sm text-subtle">/10</span>
      </div>
    </div>
  );
}

function SectionTitle({ prompt, title }: { prompt: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm font-bold text-accent">{prompt}</span>
      <span className="font-mono text-sm font-bold text-foreground">
        {title}
      </span>
    </div>
  );
}

function Bone({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-surface ${className ?? ""}`} />
  );
}

function ResultSkeleton() {
  return (
    <>
      {/* Score hero skeleton */}
      <div className="flex items-center gap-12">
        {/* Ring placeholder */}
        <div className="relative h-[180px] w-[180px] shrink-0">
          <div className="absolute inset-0 rounded-full border-[4px] border-surface" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Bone className="h-12 w-16" />
            <Bone className="h-3 w-8" />
          </div>
        </div>
        {/* Text bones */}
        <div className="flex flex-1 flex-col gap-4">
          <Bone className="h-6 w-48" />
          <div className="flex flex-col gap-2">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-4">
            <Bone className="h-3 w-24" />
            <Bone className="h-3 w-12" />
          </div>
          <Bone className="h-8 w-28" />
        </div>
      </div>

      <hr className="border-surface" />

      {/* Code section skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Bone className="h-4 w-6" />
          <Bone className="h-4 w-32" />
        </div>
        <div className="overflow-hidden rounded-md border border-surface">
          <div className="flex h-10 items-center gap-2 border-b border-surface bg-code-bg px-4">
            <Bone className="h-3 w-3 rounded-full" />
            <Bone className="h-3 w-3 rounded-full" />
            <Bone className="h-3 w-3 rounded-full" />
          </div>
          <div className="flex flex-col gap-2 p-4">
            {(["w-3/4", "w-1/2", "w-5/6", "w-2/3", "w-1/2"] as const).map(
              (w, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <Bone key={i} className={`h-3 ${w}`} />
              ),
            )}
          </div>
        </div>
      </div>

      <hr className="border-surface" />

      {/* Analysis grid skeleton — 2×2 */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Bone className="h-4 w-6" />
          <Bone className="h-4 w-36" />
        </div>
        <div className="grid grid-cols-2 gap-5">
          {([0, 1, 2, 3] as const).map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-md border border-surface p-4"
            >
              <Bone className="h-5 w-20" />
              <Bone className="h-4 w-3/4" />
              <div className="flex flex-col gap-1.5">
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
