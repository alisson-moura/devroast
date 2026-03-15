# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Specs

Quando o usuario pedir para comecar uma spec (ex: "cria uma spec para X", "faz a spec de Y"), siga o processo definido em `specs/spec-guide.md`:

1. Leia o `spec-guide.md` antes de qualquer outra coisa.
2. Faca as perguntas obrigatorias ao usuario antes de redigir.
3. So comece a escrever a spec apos ter as respostas.
4. Salve em `specs/<nome-kebab-case>.md`.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Biome linter (biome check)
pnpm format       # Format code with Biome (biome format --write)
```

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Tech Stack

- **Framework**: Next.js (App Router) with TypeScript
- **React**: 19
- **Styling**: Tailwind CSS v4
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Package Manager**: pnpm

## Architecture

This is a Next.js App Router project. All source code lives under `src/app/`. The path alias `@/*` maps to `src/*`.

- `src/app/layout.tsx` — Root layout (fonts, metadata)
- `src/app/page.tsx` — Home page
- `src/app/globals.css` — Global styles

## Code Style

Biome enforces formatting and linting. Run `pnpm lint` to check and `pnpm format` to auto-fix. Biome is configured with Next.js and React recommended rules plus import organization.

## Component Conventions

### Exports
- **Always use named exports.** Never use default exports in components, hooks, or utilities.
- Default exports are reserved **only** for `page.tsx` files (Next.js App Router requirement).

```tsx
// ✅ correct
export function Button() {}

// ❌ wrong
export default function Button() {}
```

### Styling with tailwind-variants
- Use `tailwind-variants` (`tv`) for all component variants.
- Pass `className` directly into the `tv` call — it handles merging internally. **Do not use `twMerge` alongside `tv`.**

```tsx
// ✅ correct — tv merges className automatically
<button className={button({ variant, size, className })} />

// ❌ wrong — redundant double merge
<button className={twMerge(button({ variant, size }), className)} />
```

### UI Component Location
All reusable UI components live in `src/components/ui/`. The showcase page at `src/app/ui/page.tsx` renders every component with all its variants for visual reference.

### Behavioral Components
For interactive/behavioral primitives (Switch, Select, Dialog, Checkbox, etc.), always use `@base-ui/react` — never build custom implementations from scratch.

## tRPC

Arquivos de referência: [`src/trpc/`](src/trpc/)

| Arquivo | Responsabilidade |
|---|---|
| `src/trpc/init.ts` | `createTRPCContext`, `baseProcedure`, `createCallerFactory` |
| `src/trpc/routers/_app.ts` | `appRouter` — adicione procedures aqui |
| `src/trpc/server.ts` | `caller`, `trpc`, `HydrateClient` — use em Server Components |
| `src/trpc/client.tsx` | `trpc` (hooks), `TRPCProvider` — use em Client Components |

### Server Component

```tsx
import { caller, HydrateClient, trpc } from "@/trpc/server";

export default async function Page() {
  void trpc.myProcedure.prefetch(); // hidrata o cache para o client
  const data = await caller.myProcedure(); // busca direto no servidor
  return <HydrateClient>...</HydrateClient>;
}
```

### Client Component

```tsx
"use client";
import { trpc } from "@/trpc/client";

export function MyComponent() {
  const { data } = trpc.myProcedure.useQuery();
}
```

### Navigation Links
Always use the `<Link>` component from `next/link` for internal navigation — never use a raw `<a>` tag for internal routes. `Link` provides automatic prefetching and client-side navigation.

```tsx
// ✅ correct
import Link from 'next/link'
<Link href="/dashboard">Dashboard</Link>

// ❌ wrong
<a href="/dashboard">Dashboard</a>
```
