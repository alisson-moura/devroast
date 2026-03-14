import type { Metadata } from "next";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";

export const metadata: Metadata = {
  title: "Roast Results | devroast",
  description:
    '"this code looks like it was written during a power outage... in 2005."',
  openGraph: {
    title: "Roast Results | devroast",
    description:
      '"this code looks like it was written during a power outage... in 2005."',
    type: "website",
  },
};

const SUBMITTED_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`;

type Severity = "critical" | "warning" | "good";

const ISSUES: Array<{
  severity: Severity;
  title: string;
  description: string;
}> = [
  {
    severity: "critical",
    title: "using var instead of const/let",
    description:
      "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
  },
  {
    severity: "warning",
    title: "imperative loop pattern",
    description:
      "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
  },
  {
    severity: "good",
    title: "clear naming conventions",
    description:
      "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
  },
  {
    severity: "good",
    title: "single responsibility",
    description:
      "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
  },
];

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: _id } = await params;

  return (
    <main className="flex-1 px-10 py-10">
      <div className="mx-auto w-full max-w-[960px] flex flex-col gap-10">
        {/* Score Hero */}
        <section
          className="animate-fade-up flex items-center gap-12"
          style={{ animationDelay: "0ms" }}
        >
          <ScoreRing score={3.5} />

          <div className="flex flex-1 flex-col gap-4">
            <Badge variant="critical">verdict: needs_serious_help</Badge>

            <p
              className="text-xl leading-relaxed text-foreground"
              style={{ fontFamily: "var(--font-ibm-plex-mono, monospace)" }}
            >
              &ldquo;this code looks like it was written during a power
              outage... in 2005.&rdquo;
            </p>

            <div className="flex items-center gap-4 font-mono text-xs text-subtle">
              <span>lang: javascript</span>
              <span>·</span>
              <span>7 lines</span>
            </div>

            <div>
              <button
                type="button"
                className="border border-surface px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
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
            <CodeBlock.Header filename="calculateTotal.js" />
            <CodeBlock.Content code={SUBMITTED_CODE} lang="javascript" />
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
            {ISSUES.map((issue) => (
              <AnalysisCard key={issue.title}>
                <AnalysisCard.Header>
                  <Badge variant={issue.severity}>{issue.severity}</Badge>
                </AnalysisCard.Header>
                <AnalysisCard.Title>{issue.title}</AnalysisCard.Title>
                <AnalysisCard.Description>
                  {issue.description}
                </AnalysisCard.Description>
              </AnalysisCard>
            ))}
          </div>
        </section>

        <hr className="border-surface" />

        {/* Suggested Fix */}
        <section
          className="animate-fade-up flex flex-col gap-6"
          style={{ animationDelay: "300ms" }}
        >
          <SectionTitle prompt="//" title="suggested_fix" />
          <div className="overflow-hidden rounded-md border border-surface bg-code-bg">
            <div className="flex h-10 items-center border-b border-surface px-4">
              <span className="font-mono text-xs font-medium text-muted">
                your_code.js → improved_code.js
              </span>
            </div>
            <div className="py-1">
              <DiffLine type="context">
                {"function calculateTotal(items) {"}
              </DiffLine>
              <DiffLine type="removed">{"  var total = 0;"}</DiffLine>
              <DiffLine type="removed">
                {"  for (var i = 0; i < items.length; i++) {"}
              </DiffLine>
              <DiffLine type="removed">
                {"    total = total + items[i].price;"}
              </DiffLine>
              <DiffLine type="removed">{"  }"}</DiffLine>
              <DiffLine type="removed">{"  return total;"}</DiffLine>
              <DiffLine type="added">
                {"  return items.reduce((sum, item) => sum + item.price, 0);"}
              </DiffLine>
              <DiffLine type="context">{"}"}</DiffLine>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ScoreRing({ score }: { score: number }) {
  const degrees = (score / 10) * 360;

  return (
    <div className="relative h-[180px] w-[180px] shrink-0">
      {/* Background ring */}
      <div className="absolute inset-0 rounded-full border-[4px] border-surface" />

      {/* Conic gradient ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from -90deg at 50% 50%, #ef4444 0deg, #f59e0b ${degrees}deg, #10b981 ${degrees + 0.1}deg, #10b981 360deg)`,
          WebkitMask: "radial-gradient(transparent 83px, #000 84px)",
          mask: "radial-gradient(transparent 83px, #000 84px)",
        }}
      />

      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-5xl font-bold leading-none text-warning">
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
