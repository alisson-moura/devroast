# Spec: Deploy com Railpack + Migrations automaticas

> Configurar o build com Railpack e executar migrations do Drizzle automaticamente no startup do container, antes do Next.js iniciar.

## Contexto

A aplicacao sera deployada no Dokploy (PaaS self-hosted) usando Railpack como builder. O PostgreSQL ja esta rodando no servidor. O `DATABASE_URL` so esta disponivel em runtime, entao migrations nao podem rodar durante o build. A solucao precisa rodar migrations automaticamente toda vez que o container inicia, antes do `next start`.

---

## Requisitos

### Funcionais
- [ ] Criar arquivo `railpack.json` configurando Node 24.12.0, pnpm como package manager, e o start command customizado
- [ ] Criar script `migrate.mjs` que executa migrations programaticamente usando `drizzle-orm/node-postgres/migrator`
- [ ] Criar `start.sh` que roda o script de migration e, em caso de sucesso, inicia o Next.js com `next start`
- [ ] Se a migration falhar, o container nao deve subir (fail-fast)

### Restricoes (nao-funcionais)
- Zero devDependencies em runtime — `drizzle-kit` nao estara na imagem final
- O script de migration usa apenas `drizzle-orm` (runtime dep) e os arquivos em `./drizzle/` (SQLs + `meta/_journal.json`)
- O `start.sh` deve ter permissao de execucao

### Fora do escopo
- Rollback automatico de migrations
- UI ou endpoint para status de migrations
- CI/CD pipeline — apenas configuracao do build/runtime

---

## Decisoes de design

| Opcao | Pro | Con | Veredicto |
|---|---|---|---|
| A: `migrate.mjs` (JS puro) | Zero transpilacao, roda direto no Node | Nao usa TypeScript | Escolhida — menos pecas moveis |
| B: `migrate.ts` compilado no build | Type-safe | Precisa garantir que o output vai pra imagem | Descartada |
| C: Rodar `drizzle-kit migrate` em runtime | Simples, usa comando existente | `drizzle-kit` e devDep, nao estara na imagem | Descartada |

---

## Especificacao de implementacao

### Arquivos a criar/modificar

| Arquivo | Acao | Descricao |
|---|---|---|
| `railpack.json` | criar | Configuracao do Railpack (node version, package manager, start command, arquivos de deploy) |
| `migrate.mjs` | criar | Script de migration programatico usando drizzle-orm |
| `start.sh` | criar | Entrypoint do container: migration + next start |

### Comportamento detalhado

#### `railpack.json`

```json
{
  "$schema": "https://schema.railpack.com",
  "provider": "node",
  "packages": {
    "node": "24.12.0"
  },
  "deploy": {
    "startCommand": "./start.sh"
  }
}
```

Railpack detecta pnpm automaticamente pelo `pnpm-lock.yaml`. Configurar `RAILPACK_INSTALL_CMD` como env var no Dokploy se necessario.

#### `migrate.mjs`

```js
// Pseudocodigo do contrato
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

// 1. Ler DATABASE_URL do env
// 2. Criar instancia do drizzle: const db = drizzle(DATABASE_URL)
// 3. Chamar migrate(db, { migrationsFolder: "./drizzle" })
// 4. Fechar pool de conexoes: await db.$client.end()
//    (sem isso o processo trava — o pg.Pool interno mantem o event loop aberto)
// 5. Log sucesso e exit 0, ou log erro e exit 1
```

#### `start.sh`

```bash
#!/bin/sh
set -e
node migrate.mjs
exec node_modules/.bin/next start
```

O `set -e` garante que se o `node migrate.mjs` falhar (exit != 0), o script para e o container nao sobe. O `exec` substitui o processo do shell pelo Next.js (PID 1 correto para sinais). Usa caminho completo para `next` para nao depender do PATH do container.

### Fluxo de execucao

```
Container inicia
  → start.sh executa
    → node migrate.mjs
      → conecta no DATABASE_URL
      → roda migrations de ./drizzle/
      → sucesso? exit 0
    → exec node_modules/.bin/next start (app sobe normalmente)
```

---

## Dependencias

| Pacote | Motivo | Ja no projeto? |
|---|---|---|
| `drizzle-orm` | Funcao `migrate()` para rodar migrations | Sim |
| `pg` | Driver PostgreSQL usado pelo drizzle | Sim |

Nenhuma dependencia nova necessaria.

---

## Riscos e consideracoes

1. **Migration falha em producao** — O container nao sobe (fail-fast). O Dokploy deve manter a versao anterior rodando ate o novo container estar healthy. Verificar se o health check do Dokploy esta configurado.
2. **Tempo de downtime durante migration** — Para migrations rapidas (ALTER TABLE, CREATE INDEX), o tempo e negligivel. Para migrations pesadas, considerar rodar manualmente.
3. **Arquivos de migration no deploy** — O diretorio `./drizzle/` completo (SQLs + `meta/_journal.json`) precisa estar na imagem final. O migrator usa o `_journal.json` para saber quais migrations aplicar. Railpack por padrao copia o diretorio do projeto, entao devem estar incluidos. Verificar que `drizzle/` nao esta no `.gitignore`.

---

## TODOs de implementacao

- [ ] Criar `railpack.json` com configuracao de Node 24.12.0, pnpm e start command
- [ ] Criar `migrate.mjs` com migration programatica via drizzle-orm
- [ ] Criar `start.sh` com entrypoint (migration + next start)
- [ ] Dar permissao de execucao ao `start.sh` (`chmod +x`)
- [ ] Testar localmente: `node migrate.mjs` com DATABASE_URL setado
- [ ] Rodar `pnpm lint` em todos os arquivos modificados
