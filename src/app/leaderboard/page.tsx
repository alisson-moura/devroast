import type { Metadata } from "next";
import type { BundledLanguage } from "shiki";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Shame Leaderboard | devroast",
  description:
    "The most roasted code on the internet. 2,847 submissions of terrible code, ranked by shame score.",
  openGraph: {
    title: "Shame Leaderboard | devroast",
    description:
      "The most roasted code on the internet. Ranked by shame score.",
    type: "website",
  },
};

type LeaderboardEntry = {
  rank: number;
  score: number;
  lang: BundledLanguage;
  lines: number;
  code: string;
};

const entries: LeaderboardEntry[] = [
  {
    rank: 1,
    score: 1.2,
    lang: "javascript",
    lines: 3,
    code: `eval(prompt("enter code"))\ndocument.write(response)\n// trust the user lol`,
  },
  {
    rank: 2,
    score: 1.8,
    lang: "typescript",
    lines: 3,
    code: `if (x == true) { return true; }\nelse if (x == false) { return false; }\nelse { return !false; }`,
  },
  {
    rank: 3,
    score: 2.1,
    lang: "sql",
    lines: 2,
    code: `SELECT * FROM users WHERE 1=1\n-- TODO: add authentication`,
  },
  {
    rank: 4,
    score: 2.3,
    lang: "java",
    lines: 3,
    code: `catch (e) {\n  // ignore\n}`,
  },
  {
    rank: 5,
    score: 2.6,
    lang: "javascript",
    lines: 3,
    code: `const sleep = (ms) =>\n  new Date(Date.now() + ms)\n  while(new Date() < end) {}`,
  },
];

export default function LeaderboardPage() {
  return (
    <main className="flex-1 px-10 py-10 md:px-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        {/* Hero */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="flex items-center gap-3 font-mono text-2xl font-bold md:text-3xl">
              <span className="text-accent">&gt;</span>
              <span>shame_leaderboard</span>
            </h1>
            <p className="font-mono text-sm text-muted">
              {`// the most roasted code on the internet`}
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-subtle">
            <span>2,847 submissions</span>
            <span>·</span>
            <span>avg score: 4.2/10</span>
          </div>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-5">
          {entries.map((entry) => (
            <Entry key={entry.rank} entry={entry} />
          ))}
        </div>
      </div>
    </main>
  );
}

async function Entry({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className="overflow-hidden rounded-md border border-surface">
      {/* Meta row */}
      <div className="flex h-12 items-center justify-between border-b border-surface px-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-sm">
            <span className="text-subtle">#</span>
            <span className="font-bold text-warning">{entry.rank}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-subtle">score:</span>
            <span className="font-bold text-critical">{entry.score}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-muted">{entry.lang}</span>
          <span className="text-subtle">{entry.lines} lines</span>
        </div>
      </div>

      {/* Code block — no terminal header, the meta row replaces it */}
      <CodeBlock className="rounded-none border-0">
        <CodeBlock.Content code={entry.code} lang={entry.lang} />
      </CodeBlock>
    </div>
  );
}
