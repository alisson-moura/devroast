# devroast

**Paste your code. Get roasted.**

devroast analisa seu código e te dá um feedback honesto (e sem piedade) sobre a qualidade dele — com uma pontuação, análise de problemas e sugestões de melhoria.

🔗 **Demo ao vivo:** [devroast.am-dev.app.br](https://devroast.am-dev.app.br)

---

## O que o app faz

- Cole qualquer trecho de código no editor
- Escolha entre o modo **honest** (feedback direto) ou **full roast** (sem filtro)
- Receba uma pontuação de 0 a 10 com análise dos problemas encontrados
- Veja o **shame leaderboard** — um ranking público dos piores códigos já enviados

> Análise com IA em breve.

---

## Como rodar localmente

**Requisitos:** Node.js 18+ e pnpm

```bash
# 1. Clone o repositório
git clone https://github.com/alisson-moura/devroast.git
cd devroast

# 2. Instale as dependências
pnpm install

# 3. Inicie o servidor de desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
