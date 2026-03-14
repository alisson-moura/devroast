# Spec: Setup tRPC v11

> Configurar tRPC v11 como camada de API/Backend no projeto Next.js App Router, com suporte a Server Components, SSR e TanStack React Query.

## Contexto

O projeto precisa de uma camada de API tipada de ponta a ponta. tRPC v11 com a integração TanStack React Query permite chamar procedures do servidor com type-safety completo, suporta prefetch em Server Components via `HydrateClient`, e expõe um HTTP handler no App Router sem precisar de código gerado.

---

## Requisitos

### Funcionais
- [ ] Servidor tRPC inicializado com contexto base e `baseProcedure`
- [ ] Router raiz (`appRouter`) exportado e tipado
- [ ] HTTP handler disponível em `GET /api/trpc` e `POST /api/trpc`
- [ ] Client-side provider (`TRPCProvider`) configurado no root layout
- [ ] Helpers de servidor (`trpc`, `HydrateClient`, `getQueryClient`) disponíveis para uso em Server Components
- [ ] `makeQueryClient` com configuração SSR correta (`staleTime`, `shouldDehydrateQuery` incluindo queries `pending`)

### Restrições (não-funcionais)
- tRPC versão `^11`
- TanStack React Query versão `^5`
- Sem data transformer (superjson fora do escopo)
- Compatível com Next.js App Router e React 19
- Drizzle ORM já configurado em `src/db/` — não alterar nada nessa camada

### Fora do escopo
- Nenhuma procedure de negócio (router raiz fica vazio nessa spec)
- Autenticação/autorização no contexto tRPC
- Subscriptions / WebSocket
- Data transformer (superjson)
- Upload de arquivos

---

## Decisões de design

| Opção | Pro | Con | Veredicto |
|---|---|---|---|
| `@trpc/react-query` (RSC helpers) | Documentação oficial, `createHydrationHelpers` para Server Components, integração direta com `HydrateClient` | — | **Escolhida** |
| `@trpc/tanstack-react-query` (novo nome v11) | API mais nova | Menos exemplos de RSC/SSR disponíveis na doc oficial | Descartada por ora |
| `createTRPCNext` (Pages Router) | — | Exclusivo para Pages Router | Descartada |

**Sobre `getQueryClient`:** usa `cache()` do React no servidor (garante mesma instância por request) e singleton no browser.

**Sobre `createTRPCContext`:** também envolto em `cache()` para evitar múltiplas execuções por request.

---

## Especificação de implementação

### Arquivos a criar/modificar

| Arquivo | Ação | Descrição |
|---|---|---|
| `src/trpc/init.ts` | criar | Inicializa tRPC: `initTRPC`, `createTRPCRouter`, `createCallerFactory`, `baseProcedure`, `createTRPCContext` |
| `src/trpc/routers/_app.ts` | criar | Router raiz vazio (`appRouter`). Exporta `AppRouter` type. |
| `src/trpc/query-client.ts` | criar | Factory `makeQueryClient()` com opções SSR do TanStack Query |
| `src/trpc/server.ts` | criar | Helpers server-only: `getQueryClient`, `caller`, `trpc`, `HydrateClient` via `createHydrationHelpers` |
| `src/trpc/client.tsx` | criar | `'use client'` — `trpc` (createTRPCReact), `TRPCProvider` com `QueryClientProvider` |
| `src/app/api/trpc/[trpc]/route.ts` | criar | HTTP handler via `fetchRequestHandler` para GET e POST |
| `src/app/layout.tsx` | modificar | Envolver children com `<TRPCProvider>` |

### Comportamento detalhado

#### `src/trpc/init.ts`
```ts
// Contexto base (vazio por ora, pode receber headers/session futuramente)
export const createTRPCContext = cache(async () => ({}))

const t = initTRPC.create()

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
```

#### `src/trpc/routers/_app.ts`
```ts
// Router raiz — vazio, pronto para receber sub-routers
export const appRouter = createTRPCRouter({})
export type AppRouter = typeof appRouter
```

#### `src/trpc/query-client.ts`
```ts
// staleTime: 30s para evitar refetch imediato no cliente após SSR
// shouldDehydrateQuery: inclui queries com status 'pending' para streaming
export function makeQueryClient(): QueryClient
```

#### `src/trpc/server.ts` (`server-only`)
```ts
// getQueryClient: cache() do React — mesma instância por request no servidor
export const getQueryClient = cache(makeQueryClient)

// caller: invoca procedures diretamente no servidor sem HTTP
const caller = createCallerFactory(appRouter)(createTRPCContext)

// trpc e HydrateClient: helpers para prefetch e hidratação em Server Components
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(caller, getQueryClient)
```

#### `src/trpc/client.tsx`
```tsx
'use client'
// trpc: instância React para hooks em Client Components
export const trpc = createTRPCReact<AppRouter>()

// TRPCProvider: monta trpc.Provider + QueryClientProvider
// URL do httpBatchLink: /api/trpc (relativo no browser, absoluto no servidor)
export function TRPCProvider({ children }: { children: React.ReactNode })
```

#### `src/app/api/trpc/[trpc]/route.ts`
```ts
// Adapter fetch para App Router — exporta GET e POST
const handler = (req: Request) =>
  fetchRequestHandler({ endpoint: '/api/trpc', req, router: appRouter, createContext: createTRPCContext })

export { handler as GET, handler as POST }
```

#### `src/app/layout.tsx` (modificação)
```tsx
// Envolver {children} com TRPCProvider mantendo todos os providers existentes
<TRPCProvider>{children}</TRPCProvider>
```

---

## Dependências

| Pacote | Motivo | Já no projeto? |
|---|---|---|
| `@trpc/server@^11` | Core do servidor — `initTRPC`, routers, procedures | Não |
| `@trpc/client@^11` | Links HTTP (`httpBatchLink`) e client base | Não |
| `@trpc/react-query@^11` | `createTRPCReact`, `createHydrationHelpers` (RSC) | Não |
| `@tanstack/react-query@^5` | QueryClient, HydrationBoundary, dehydrate | Não |

---

## Riscos e considerações

1. **React 19 + TanStack Query v5** — A versão v5 do TanStack Query é totalmente compatível com React 19. Sem riscos conhecidos.
2. **`server-only` em `src/trpc/server.ts`** — Garante que helpers de servidor (caller, getQueryClient) não vazem para o bundle do cliente. Necessário instalar o pacote `server-only`.
3. **URL do `httpBatchLink` no SSR** — No servidor, `window` é undefined; a URL deve ser absoluta. O client.tsx precisa detectar o ambiente e montar a URL correta (ex: via `VERCEL_URL` ou `localhost:3000`).
4. **`cache()` do React no contexto** — `createTRPCContext` e `getQueryClient` usam `cache()` do React para memoizar por request. Isso é exclusivo do App Router — não funciona fora do contexto de um request React.

---

## TODOs de implementação

- [ ] Instalar dependências: `pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query server-only`
- [ ] Criar `src/trpc/init.ts`
- [ ] Criar `src/trpc/routers/_app.ts`
- [ ] Criar `src/trpc/query-client.ts`
- [ ] Criar `src/trpc/server.ts`
- [ ] Criar `src/trpc/client.tsx`
- [ ] Criar `src/app/api/trpc/[trpc]/route.ts`
- [ ] Modificar `src/app/layout.tsx` para incluir `TRPCProvider`
- [ ] Rodar `pnpm dev` e verificar que `GET /api/trpc` responde sem erros
- [ ] Rodar `pnpm lint` em todos os arquivos modificados/criados
