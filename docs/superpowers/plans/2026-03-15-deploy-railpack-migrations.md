# Deploy Railpack + Migrations Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure Railpack build and automatic Drizzle migrations on container startup for Dokploy deployment.

**Architecture:** Shell entrypoint (`start.sh`) runs a programmatic migration script (`migrate.mjs`) using `drizzle-orm`'s migrate function, then starts Next.js. Railpack config (`railpack.json`) pins Node 24.12.0 and sets the custom start command.

**Tech Stack:** Railpack, Drizzle ORM, Node.js 24.12.0, pnpm, PostgreSQL

**Spec:** `specs/deploy-railpack-migrations.md`

---

## Chunk 1: All files

### Task 1: Create `railpack.json`

**Files:**
- Create: `railpack.json`

- [ ] **Step 1: Create the Railpack config file**

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

- [ ] **Step 2: Commit**

```bash
git add railpack.json
git commit -m "chore: add railpack.json with Node 24.12.0 and custom start command"
```

---

### Task 2: Create `migrate.mjs`

**Files:**
- Create: `migrate.mjs`
- Reference: `src/db/index.ts` (for drizzle connection pattern)
- Reference: `drizzle/` (migration output directory)

- [ ] **Step 1: Create the migration script**

```js
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const db = drizzle(databaseUrl);

try {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations completed successfully");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  await db.$client.end();
}
```

Key details:
- Uses `drizzle-orm/node-postgres` (runtime dep) — NOT `drizzle-kit` (devDep)
- `db.$client.end()` in `finally` closes the pg.Pool so the process can exit
- `migrationsFolder: "./drizzle"` matches the `out` dir in `drizzle.config.ts`
- Top-level await works in `.mjs` files

- [ ] **Step 2: Test locally**

Run: `DATABASE_URL=<your-local-pg-url> node migrate.mjs`

Expected output:
```
Running migrations...
Migrations completed successfully
```

If migrations were already applied, it should still succeed (no-op).

- [ ] **Step 3: Commit**

```bash
git add migrate.mjs
git commit -m "feat: add migrate.mjs for programmatic Drizzle migrations"
```

---

### Task 3: Create `start.sh`

**Files:**
- Create: `start.sh`

- [ ] **Step 1: Create the entrypoint script**

```bash
#!/bin/sh
set -e
node migrate.mjs
exec node_modules/.bin/next start
```

- `set -e`: exit immediately if `node migrate.mjs` fails (fail-fast)
- `exec`: replaces shell process with Next.js (correct PID 1 for signal handling)
- `node_modules/.bin/next`: explicit path, no PATH dependency

- [ ] **Step 2: Make it executable**

```bash
chmod +x start.sh
```

- [ ] **Step 3: Commit**

```bash
git add start.sh
git commit -m "feat: add start.sh entrypoint for migration + next start"
```

---

### Task 4: Lint and final verification

- [ ] **Step 1: Run linter**

```bash
pnpm format && pnpm lint
```

Fix any issues if they appear (unlikely — only `.mjs`, `.sh`, and `.json` files were created).

- [ ] **Step 2: Verify all files are committed**

```bash
git status
```

Expected: clean working tree.
