# OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate dynamic OG images for shareable roast links using Takumi, so social media embeds show a visual card with the roast score, verdict, and quote.

**Architecture:** A Next.js Route Handler at `/api/og/[id]` fetches roast data via tRPC caller, renders a JSX component with Takumi's `ImageResponse`, and returns a cached PNG. The result page's `generateMetadata()` is updated to include the `og:image` URL.

**Tech Stack:** Takumi (`@takumi-rs/image-response`), Next.js App Router, tRPC caller, Geist Mono (embedded in Takumi)

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/app/api/og/[id]/route.tsx` | **New** — Route Handler: fetches roast, renders OG image via Takumi |
| `src/app/result/[id]/page.tsx` | **Modify** — Add `og:image` and `twitter:card` to `generateMetadata()` |
| `next.config.ts` | **Modify** — Add `serverExternalPackages: ["@takumi-rs/core"]` |
| `package.json` | **Modify** — Add `@takumi-rs/image-response` dependency |

---

## Chunk 1: Setup and OG Route Implementation

### Task 1: Install Takumi and configure Next.js

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Install Takumi dependency**

Run:
```bash
pnpm add @takumi-rs/image-response
```

- [ ] **Step 2: Add serverExternalPackages to next.config.ts**

In `next.config.ts`, add `serverExternalPackages` to the config object:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  serverExternalPackages: ["@takumi-rs/core"],
};

export default nextConfig;
```

- [ ] **Step 3: Verify dev server starts**

Run:
```bash
pnpm dev
```
Expected: Dev server starts without errors.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml next.config.ts
git commit -m "chore: add takumi image-response and configure serverExternalPackages"
```

---

### Task 2: Create the OG image Route Handler

**Files:**
- Create: `src/app/api/og/[id]/route.tsx`

- [ ] **Step 1: Create the route handler file**

Create `src/app/api/og/[id]/route.tsx` with the full implementation:

```tsx
import { ImageResponse } from "@takumi-rs/image-response";
import { TRPCError } from "@trpc/server";
import { caller } from "@/trpc/server";

const VERDICT_COLORS: Record<string, string> = {
  needs_serious_help: "#EF4444",
  rough_around_edges: "#F97316",
  decent_code: "#F59E0B",
  solid_work: "#10B981",
  exceptional: "#3B82F6",
};

function truncateQuote(quote: string, max = 120): string {
  if (quote.length <= max) return quote;
  return `${quote.slice(0, max)}...`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let roast: Awaited<ReturnType<typeof caller.roast.getById>>;
  try {
    roast = await caller.roast.getById({ id });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
      return new Response("Invalid ID", { status: 400 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }

  if (!roast) {
    return new Response("Not Found", { status: 404 });
  }

  const verdictColor = VERDICT_COLORS[roast.verdict] ?? "#4B5563";
  const formattedScore = roast.score.toFixed(1);

  return new ImageResponse(
    <div
      tw="flex flex-col items-center justify-center w-full h-full bg-[#0A0A0A]"
      style={{ gap: 28, padding: 64, fontFamily: "Geist Mono" }}
    >
      {/* Logo */}
      <div tw="flex items-center" style={{ gap: 8 }}>
        <span tw="text-2xl font-bold" style={{ color: "#10B981" }}>
          &gt;
        </span>
        <span tw="text-xl font-medium" style={{ color: "#FAFAFA" }}>
          devroast
        </span>
      </div>

      {/* Score */}
      <div tw="flex items-end" style={{ gap: 4 }}>
        <span
          tw="font-black"
          style={{ fontSize: 160, lineHeight: 1, color: "#F59E0B" }}
        >
          {formattedScore}
        </span>
        <span tw="text-6xl" style={{ lineHeight: 1, color: "#4B5563" }}>
          /10
        </span>
      </div>

      {/* Verdict */}
      <div tw="flex items-center" style={{ gap: 8 }}>
        <div
          tw="rounded-full"
          style={{
            width: 12,
            height: 12,
            backgroundColor: verdictColor,
          }}
        />
        <span tw="text-xl" style={{ color: verdictColor }}>
          {roast.verdict}
        </span>
      </div>

      {/* Language info */}
      <span tw="text-base" style={{ color: "#4B5563" }}>
        lang: {roast.language} · {roast.lineCount} lines
      </span>

      {/* Quote */}
      {roast.roastQuote && (
        <span
          tw="text-center"
          style={{
            fontSize: 22,
            lineHeight: 1.5,
            color: "#FAFAFA",
            maxWidth: 900,
          }}
        >
          &ldquo;{truncateQuote(roast.roastQuote)}&rdquo;
        </span>
      )}
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "image/png",
      },
    },
  );
}
```

- [ ] **Step 2: Verify the route responds**

Start the dev server (`pnpm dev`), then test with an existing roast ID from the database:

```bash
curl -o /tmp/test-og.png -w "%{http_code}" http://localhost:3000/api/og/<existing-roast-id>
```

Expected: HTTP 200 and a valid PNG file at `/tmp/test-og.png`. Open it to verify visually.

- [ ] **Step 3: Test error cases**

```bash
# Invalid UUID → 400
curl -w "%{http_code}" http://localhost:3000/api/og/not-a-uuid

# Non-existent UUID → 404
curl -w "%{http_code}" http://localhost:3000/api/og/00000000-0000-0000-0000-000000000000
```

Expected: `400` for invalid UUID, `404` for non-existent.

- [ ] **Step 4: Run lint and format**

```bash
pnpm format && pnpm lint
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/og/[id]/route.tsx
git commit -m "feat: add OG image generation route with Takumi"
```

---

### Task 3: Update generateMetadata with og:image

**Files:**
- Modify: `src/app/result/[id]/page.tsx` (lines 17-36, the `generateMetadata` function)

- [ ] **Step 1: Add og:image and twitter metadata**

In `src/app/result/[id]/page.tsx`, update the `generateMetadata` function. The `og:image` URL must be absolute for social media crawlers. Use the `metadataBase` from Next.js or construct the URL manually.

Replace the current `generateMetadata` return with:

```tsx
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
      images: [`/api/og/${id}`],
    },
    twitter: {
      card: "summary_large_image",
      title: "Roast Results | devroast",
      description: quote,
      images: [`/api/og/${id}`],
    },
  };
}
```

Note: Next.js resolves relative URLs in `images` against `metadataBase` (which defaults to the deployment URL). This produces absolute URLs in the rendered `<meta>` tags.

- [ ] **Step 2: Verify meta tags in HTML**

Start the dev server and check the rendered HTML:

```bash
curl -s http://localhost:3000/result/<existing-roast-id> | grep -E "og:image|twitter:card|twitter:image"
```

Expected: `og:image` and `twitter:image` pointing to `/api/og/<id>` (with absolute URL), and `twitter:card` set to `summary_large_image`.

- [ ] **Step 3: Run lint and format**

```bash
pnpm format && pnpm lint
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/result/[id]/page.tsx
git commit -m "feat: add og:image and twitter card metadata to roast result page"
```

---

### Task 4: Final verification

- [ ] **Step 1: Run full build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Visual verification**

Start production server and test with a real roast:

```bash
pnpm start
```

Open `http://localhost:3000/api/og/<existing-roast-id>` in the browser. Verify:
- Dark background (`#0A0A0A`)
- "> devroast" logo in green/white
- Score number in amber, "/10" in gray
- Verdict with colored dot matching the verdict enum
- Language and line count info in gray
- Quote in white (if present), truncated if over 120 chars

- [ ] **Step 3: Test with social media debuggers**

If deployed, test with:
- https://cards-dev.twitter.com/validator (Twitter)
- Facebook Sharing Debugger
- Discord: paste the URL in a channel

- [ ] **Step 4: Final commit if any fixes needed**

Only if adjustments were made during verification.
