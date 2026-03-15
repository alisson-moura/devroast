# Roast Submission Flow — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up the "Roast My Code" button to call a mocked tRPC mutation and redirect to `/result/[id]`.

**Architecture:** Add a `createRoast` mutation (mocked, returns a fake UUID) to the tRPC router. Lift `code` and `language` state from `HomeEditor` into `ActionsBar` props. `ActionsBar` calls the mutation on submit, disables the button when code is empty or over 2000 chars, and redirects on success.

**Tech Stack:** Next.js App Router, tRPC, React 19, `useRouter` from `next/navigation`

---

## Chunk 1: tRPC mutation + ActionsBar wiring

### Task 1: Add `createRoast` mutation to tRPC router

**Files:**
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Step 1: Add the mocked `createRoast` mutation**

  Open `src/trpc/routers/_app.ts` and add the following procedure to `appRouter` (after the `metrics` procedure):

  ```ts
  createRoast: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(2000),
        language: z.string().nullable(),
        roastMode: z.boolean(),
      }),
    )
    .mutation(async ({ input: _input }) => {
      // TODO: replace with real AI analysis + DB insert
      const fakeId = crypto.randomUUID();
      return { id: fakeId };
    }),
  ```

- [ ] **Step 2: Format and lint**

  ```bash
  pnpm format && pnpm lint
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/trpc/routers/_app.ts
  git commit -m "feat: add mocked createRoast tRPC mutation"
  ```

---

### Task 2: Update `HomeEditor` to pass code and language to `ActionsBar`

**Files:**
- Modify: `src/components/home-editor.tsx`

Current state: `HomeEditor` already has `code` and `resolvedLanguage` state but passes nothing to `ActionsBar`.

- [ ] **Step 1: Pass `code` and `language` to `ActionsBar`**

  Replace the `<ActionsBar />` line in `src/components/home-editor.tsx`:

  ```tsx
  <ActionsBar code={code} language={resolvedLanguage} />
  ```

  The full file should look like:

  ```tsx
  "use client";

  import { useState } from "react";
  import { ActionsBar } from "@/components/actions-bar";
  import { CodeEditor } from "@/components/ui/code-editor";
  import { useLanguageDetection } from "@/hooks/use-language-detection";

  export function HomeEditor() {
    const [code, setCode] = useState("");
    const [manualLanguage, setManualLanguage] = useState<string | null>(null);
    const { detectedLanguage } = useLanguageDetection(code);

    const resolvedLanguage = manualLanguage ?? detectedLanguage;

    return (
      <>
        <CodeEditor
          value={code}
          onChange={setCode}
          language={resolvedLanguage}
          onLanguageChange={setManualLanguage}
          className="w-full max-w-3xl mx-auto"
        />
        <ActionsBar code={code} language={resolvedLanguage} />
      </>
    );
  }
  ```

- [ ] **Step 2: Format and lint**

  ```bash
  pnpm format && pnpm lint
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/home-editor.tsx
  git commit -m "feat: pass code and language to ActionsBar"
  ```

---

### Task 3: Wire mutation and submission logic in `ActionsBar`

**Files:**
- Modify: `src/components/actions-bar.tsx`

Changes:
- Accept `code` and `language` props
- Default `roastMode` to `true`
- Disable button when code is empty or exceeds 2000 chars or mutation is pending
- Call `createRoast` mutation on click
- Redirect to `/result/[id]` on success

- [ ] **Step 1: Rewrite `ActionsBar`**

  Replace the full content of `src/components/actions-bar.tsx`:

  ```tsx
  "use client";

  import { useRouter } from "next/navigation";
  import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import { AppSwitch } from "@/components/ui/switch";
  import { trpc } from "@/trpc/client";

  const MAX_CHARS = 2000;

  type ActionsBarProps = {
    code: string;
    language: string | null;
  };

  export function ActionsBar({ code, language }: ActionsBarProps) {
    const [roastMode, setRoastMode] = useState(true);
    const router = useRouter();

    const { mutate, isPending } = trpc.createRoast.useMutation({
      onSuccess: ({ id }) => {
        router.push(`/result/${id}`);
      },
    });

    const isDisabled = !code.trim() || code.length > MAX_CHARS || isPending;

    const handleSubmit = () => {
      if (isDisabled) return;
      mutate({ code, language, roastMode });
    };

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AppSwitch
            checked={roastMode}
            onCheckedChange={setRoastMode}
            label="roast mode"
          />
          <span className="font-mono text-sm text-muted">
            {"// maximum sarcasm enabled"}
          </span>
        </div>
        <Button
          size="sm"
          variant="solid"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          {isPending ? "// roasting..." : "$ roast_my_code"}
        </Button>
      </div>
    );
  }
  ```

- [ ] **Step 2: Format and lint**

  ```bash
  pnpm format && pnpm lint
  ```

- [ ] **Step 3: Verify button behavior manually**

  ```bash
  pnpm dev
  ```

  Open `http://localhost:3000` and verify:
  - Button is disabled when editor is empty
  - Button becomes enabled after typing code
  - Button becomes disabled again when code exceeds 2000 chars
  - `roast mode` switch is ON by default
  - Clicking the button redirects to `/result/<uuid>`

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/actions-bar.tsx
  git commit -m "feat: wire createRoast mutation and redirect in ActionsBar"
  ```
