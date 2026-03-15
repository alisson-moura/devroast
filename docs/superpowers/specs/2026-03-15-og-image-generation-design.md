# OG Image Generation for Shareable Roast Links

## Problem

Shareable roast links (`/result/[id]`) have `og:title` and `og:description` but no `og:image`. When shared on social media, Discord, Slack, etc., the embed has no visual preview — reducing engagement and shareability.

## Solution

Generate OG images on-demand using Takumi (`@takumi-rs/image-response`), a Rust-based JSX image renderer. Each roast gets a unique 1200×630 PNG showing the score, verdict, language info, and roast quote.

## Design Reference

Pencil design: Node ID `4J5QT` ("Screen 4 - OG Image") in `designs/forms.pen`.

## Architecture

### New Route: `src/app/api/og/[id]/route.tsx`

- **Method**: GET
- **Input**: Roast UUID from URL param
- **Flow**:
  1. Call `caller.roast.getById({ id })` wrapped in try/catch
  2. Zod validates UUID format inside the tRPC procedure — catch `TRPCError` with code `BAD_REQUEST` → return 400
  3. If result is null → return 404
  4. Render JSX component with Takumi's `ImageResponse`
  5. Return PNG 1200×630
- **Error handling**: Catch `TRPCError` from caller and map to HTTP status codes:
  - `BAD_REQUEST` (Zod UUID validation) → 400
  - Not found → 404
  - Any other error → 500
- **Cache**: `Cache-Control: public, max-age=31536000, immutable` (roast data is immutable after creation)

### Updated Metadata: `src/app/result/[id]/page.tsx`

Add to `generateMetadata()`:
- `og:image` → absolute URL to `/api/og/{id}`
- `twitter:card` → `"summary_large_image"`

### Next.js Config: `next.config.ts`

Add `serverExternalPackages: ["@takumi-rs/core"]` for Takumi's native Rust binary.

## OG Image Component

### Layout

Vertical flex, centered, on `#0A0A0A` background. All text in Geist Mono (Takumi embeds Geist and Geist Mono fonts with full weight range 100-900, no font files needed).

```
┌────────────────────────────────────┐
│           > devroast               │  green # + white text
│                                    │
│             3.5 /10                │  large amber score + gray denom
│                                    │
│       ● needs_serious_help         │  colored dot + verdict text
│                                    │
│     lang: javascript · 7 lines     │  gray metadata
│                                    │
│  "this code was written during..." │  white quote, centered
└────────────────────────────────────┘
```

### Dynamic Data

| Element | Source Field | Styling |
|---------|-------------|---------|
| Score number | `roast.score` | 160px, bold 900, amber `#F59E0B`, formatted with `toFixed(1)` (e.g., `3.0` not `3`) |
| Score denominator | — | 56px, normal, gray `#4B5563` |
| Verdict dot + text | `roast.verdict` | Color mapped by verdict (see below) |
| Language info | `roast.language` + `roast.lineCount` | 16px, gray `#4B5563` |
| Roast quote | `roast.roastQuote` | 22px, white `#FAFAFA`, truncated at 120 chars with "..." |

### Verdict Color Map

| Verdict | Color |
|---------|-------|
| `needs_serious_help` | `#EF4444` (red) |
| `rough_around_edges` | `#F97316` (orange) |
| `decent_code` | `#F59E0B` (amber) |
| `solid_work` | `#10B981` (green) |
| `exceptional` | `#3B82F6` (blue) |

### Fallbacks

- If `roastQuote` is null → omit the quote row
- If roast not found → return 404 (no image)

## Dependencies

- `@takumi-rs/image-response` — new dependency
- No font files needed (Geist Mono is embedded in Takumi)
- No external storage needed (images generated on-demand)

## Files Changed

| File | Change |
|------|--------|
| `package.json` | Add `@takumi-rs/image-response` |
| `next.config.ts` | Add `serverExternalPackages: ["@takumi-rs/core"]` |
| `src/app/api/og/[id]/route.tsx` | New — Route Handler with Takumi ImageResponse |
| `src/app/result/[id]/page.tsx` | Update `generateMetadata()` with og:image and twitter:card |

## Output

- Format: PNG
- Dimensions: 1200×630 (standard OG image size)
- Typical size: ~30-80KB per image
