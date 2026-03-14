# Spec Guide

> Como criar especificacoes de features neste projeto.

## O que e uma spec

Uma spec define **o que** deve ser construido e **por que**, antes de qualquer linha de codigo. Ela elimina ambiguidade, restringe escopo, e serve de referencia durante a implementacao.

---

## Antes de escrever: perguntas obrigatorias

Antes de redigir a spec, o agente **deve** fazer as perguntas abaixo ao usuario. Nao avance sem as respostas.

### Perguntas de escopo
1. **Qual e o objetivo principal?** O que o usuario consegue fazer que nao conseguia antes?
2. **O que esta explicitamente fora do escopo?** (Evita feature creep)
3. **Ha alguma tela, fluxo ou componente ja existente que sera afetado?**

### Perguntas de comportamento
4. **Qual o estado inicial e o estado final do fluxo?** (Ex: usuario abre X, digita Y, ve Z)
5. **Quais sao os casos de erro ou borda mais previstos?**
6. **Ha restricoes de performance, acessibilidade ou SEO?**

### Perguntas de integracao
7. **Depende de API externa, banco, ou servico de terceiro?** Se sim, ja esta disponivel?
8. **Ha restricao de bundle size ou dependencias novas?**

> **Regra:** Se a resposta a qualquer pergunta for "nao sei" ou "tanto faz", sugira um default razoavel e documente a decisao na spec.

---

## Formato da spec

```markdown
# Spec: [Nome curto da feature]

> Uma frase descrevendo o que sera construido e qual problema resolve.

## Contexto

Por que essa feature existe? Qual problema do usuario ela resolve?
Seja breve — 2 a 5 frases.

---

## Requisitos

### Funcionais
- [ ] [O que o sistema deve fazer — comportamento observavel pelo usuario]
- [ ] ...

### Restricoes (nao-funcionais)
- [Performance, bundle size, acessibilidade, SEO, compatibilidade, etc.]
- ...

### Fora do escopo
- [O que explicitamente NAO sera implementado nessa spec]

---

## Decisoes de design

Documente escolhas tecnicas relevantes e o motivo. Use tabelas comparativas quando houver alternativas avaliadas.

| Opcao | Pro | Con | Veredicto |
|---|---|---|---|
| A | ... | ... | Escolhida |
| B | ... | ... | Descartada |

---

## Especificacao de implementacao

### Arquivos a criar/modificar

| Arquivo | Acao | Descricao |
|---|---|---|
| `src/...` | criar/modificar | O que muda e por que |

### Comportamento detalhado

Descreva fluxos, APIs internas, props de componentes, formatos de dados.
Use pseudocodigo onde ajuda — nao e codigo final, e contrato.

---

## Dependencias

| Pacote | Motivo | Ja no projeto? |
|---|---|---|
| `nome` | Para que serve | Sim / Nao |

---

## Riscos e consideracoes

1. **[Risco]** — Descricao + mitigacao proposta.

---

## TODOs de implementacao

- [ ] Tarefa atomica 1
- [ ] Tarefa atomica 2
- [ ] Rodar `pnpm lint` em todos os arquivos modificados
```

---

## Regras de qualidade

- **Uma spec = uma feature coesa.** Se a feature tem partes independentes, considere dividir em duas specs.
- **Requisitos sao observaveis.** "O botao deve ser acessivel via teclado" e um requisito. "O codigo deve ser bonito" nao e.
- **Fora do escopo e obrigatorio.** Pelo menos um item. Previne discussao durante a implementacao.
- **Nao inclua codigo final.** Pseudocodigo de contratos (props, tipos, APIs) e permitido.
- **Decisoes documentadas.** Se voce escolheu A sobre B, escreva por que. Evita revisitar a mesma discussao.
- **TODOs atomicos.** Cada item deve ser verificavel individualmente.
