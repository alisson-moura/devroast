import { AnalysisCard } from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { AppSwitch } from "@/components/ui/switch";

type ShowcaseSectionProps = {
  title: string;
  children: React.ReactNode;
};

function ShowcaseSection({ title, children }: ShowcaseSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-2">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default async function UiShowcasePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-10 flex flex-col gap-12">
      <header>
        <h1 className="font-mono text-2xl font-bold text-green-400">
          $ ui_components
        </h1>
        <p className="font-mono text-sm text-neutral-500 mt-1">
          visual reference for all variants
        </p>
      </header>

      {/* Button */}
      <div className="flex flex-col gap-8">
        <h2 className="font-mono text-lg font-semibold text-neutral-300">
          Button
        </h2>

        <ShowcaseSection title="variant — terminal (default)">
          <Button size="sm">roast_my_code</Button>
          <Button size="md">roast_my_code</Button>
          <Button size="lg">roast_my_code</Button>
        </ShowcaseSection>

        <ShowcaseSection title="variant — solid">
          <Button variant="solid" size="sm">
            roast_my_code
          </Button>
          <Button variant="solid" size="md">
            roast_my_code
          </Button>
          <Button variant="solid" size="lg">
            roast_my_code
          </Button>
        </ShowcaseSection>

        <ShowcaseSection title="variant — outline">
          <Button variant="outline" size="sm">
            roast_my_code
          </Button>
          <Button variant="outline" size="md">
            roast_my_code
          </Button>
          <Button variant="outline" size="lg">
            roast_my_code
          </Button>
        </ShowcaseSection>

        <ShowcaseSection title="variant — ghost">
          <Button variant="ghost" size="sm">
            roast_my_code
          </Button>
          <Button variant="ghost" size="md">
            roast_my_code
          </Button>
          <Button variant="ghost" size="lg">
            roast_my_code
          </Button>
        </ShowcaseSection>

        <ShowcaseSection title="disabled state">
          <Button disabled>roast_my_code</Button>
          <Button variant="solid" disabled>
            roast_my_code
          </Button>
          <Button variant="outline" disabled>
            roast_my_code
          </Button>
          <Button variant="ghost" disabled>
            roast_my_code
          </Button>
        </ShowcaseSection>

        <ShowcaseSection title="className override (custom color)">
          <Button className="text-orange-400 border-orange-400/40 hover:border-orange-400">
            custom_color
          </Button>
        </ShowcaseSection>
      </div>

      {/* Badge */}
      <div className="flex flex-col gap-8">
        <h2 className="font-mono text-lg font-semibold text-neutral-300">
          Badge
        </h2>

        <ShowcaseSection title="variants">
          <Badge variant="good">No issues found</Badge>
          <Badge variant="warning">2 warnings</Badge>
          <Badge variant="critical">3 errors</Badge>
        </ShowcaseSection>
      </div>

      {/* Switch */}
      <div className="flex flex-col gap-8">
        <h2 className="font-mono text-lg font-semibold text-neutral-300">
          Switch
        </h2>

        <ShowcaseSection title="unchecked (default)">
          <AppSwitch label="Enable roasting" />
        </ShowcaseSection>

        <ShowcaseSection title="checked (defaultChecked)">
          <AppSwitch label="Enable roasting" defaultChecked />
        </ShowcaseSection>

        <ShowcaseSection title="disabled">
          <AppSwitch label="Enable roasting" disabled />
          <AppSwitch label="Enable roasting" disabled defaultChecked />
        </ShowcaseSection>

        <ShowcaseSection title="no label">
          <AppSwitch />
          <AppSwitch defaultChecked />
        </ShowcaseSection>
      </div>

      {/* CodeBlock */}
      <div className="flex flex-col gap-8">
        <h2 className="font-mono text-lg font-semibold text-neutral-300">
          CodeBlock
        </h2>

        <ShowcaseSection title="with filename">
          <div className="w-full max-w-2xl">
            <CodeBlock
              lang="typescript"
              filename="roast.ts"
              code={`async function roastCode(input: string): Promise<string> {
  const issues = await analyze(input);
  return issues.map(i => i.message).join("\\n");
}`}
            />
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="without filename">
          <div className="w-full max-w-2xl">
            <CodeBlock
              lang="bash"
              code={`$ pnpm dev\n> ready on http://localhost:3000`}
            />
          </div>
        </ShowcaseSection>
      </div>

      {/* DiffLine */}
      <div className="flex flex-col gap-8">
        <h2 className="font-mono text-lg font-semibold text-neutral-300">
          DiffLine
        </h2>

        <ShowcaseSection title="variants">
          <div className="w-full max-w-2xl rounded-md border border-[#2A2A2A] overflow-hidden">
            <DiffLine type="context">
              import {"{"} useState {"}"} from "react"
            </DiffLine>
            <DiffLine type="removed">const count = 0</DiffLine>
            <DiffLine type="added">
              const [count, setCount] = useState(0)
            </DiffLine>
            <DiffLine type="context">
              export default function Counter() {"{"}
            </DiffLine>
          </div>
        </ShowcaseSection>
      </div>

      {/* AnalysisCard */}
      <div className="flex flex-col gap-8">
        <h2 className="font-mono text-lg font-semibold text-neutral-300">
          AnalysisCard
        </h2>

        <ShowcaseSection title="all severity variants">
          <div className="w-full grid grid-cols-2 gap-3 max-w-3xl">
            <AnalysisCard>
              <AnalysisCard.Header>
                <Badge variant="critical">critical</Badge>
              </AnalysisCard.Header>
              <AnalysisCard.Title>
                using var instead of const/let
              </AnalysisCard.Title>
              <AnalysisCard.Description>
                var is function-scoped and leads to hoisting bugs. use const by
                default, let when reassignment is needed.
              </AnalysisCard.Description>
            </AnalysisCard>

            <AnalysisCard>
              <AnalysisCard.Header>
                <Badge variant="warning">warning</Badge>
              </AnalysisCard.Header>
              <AnalysisCard.Title>
                missing dependency in useEffect
              </AnalysisCard.Title>
              <AnalysisCard.Description>
                the effect references userId but it's not listed in the
                dependency array, which can cause stale closure bugs.
              </AnalysisCard.Description>
            </AnalysisCard>

            <AnalysisCard>
              <AnalysisCard.Header>
                <Badge variant="good">good</Badge>
              </AnalysisCard.Header>
              <AnalysisCard.Title>
                consistent error handling pattern
              </AnalysisCard.Title>
              <AnalysisCard.Description>
                all async functions properly catch errors and return typed
                result objects. clean and predictable control flow.
              </AnalysisCard.Description>
            </AnalysisCard>

            <AnalysisCard className="border-accent/30">
              <AnalysisCard.Header>
                <Badge variant="critical">critical</Badge>
              </AnalysisCard.Header>
              <AnalysisCard.Title className="text-accent">
                className override
              </AnalysisCard.Title>
              <AnalysisCard.Description>
                this card uses a custom border color and title color via
                className to verify tv() merging works correctly.
              </AnalysisCard.Description>
            </AnalysisCard>
          </div>
        </ShowcaseSection>
      </div>
    </main>
  );
}
