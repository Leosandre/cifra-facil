# CifraFácil — Plano de Implementação

## Visão Geral

7 sprints, ~13 dias úteis. Cada sprint tem entregável funcional testável.

## Sprints

| Sprint | Escopo | Duração | Acumulado |
|--------|--------|---------|-----------|
| 0 | Setup + Fundação | 1 dia | 1 dia |
| 1 | Busca + Vagalume API | 2 dias | 3 dias |
| 2 | Scraping + Visualização + Cache | 2.5 dias | 5.5 dias |
| 3 | Transposição de Tom | 1.5 dias | 7 dias |
| 4 | Download + Geração de PDF | 2.5 dias | 9.5 dias |
| 5 | Biblioteca Local + Viewer | 2 dias | 11.5 dias |
| 6 | Polimento + Build | 1.5 dias | 13 dias |

## Dependências entre Sprints

```
Sprint 0 (setup)
    ↓
Sprint 1 (busca) ──→ Sprint 2 (cifra + cache)
                          ↓
                     Sprint 3 (transposição)
                          ↓
                     Sprint 4 (download + PDF)
                          ↓
                     Sprint 5 (biblioteca + viewer)
                          ↓
                     Sprint 6 (polimento + build)
```

## Decisões Técnicas

- **State management**: React Context (CifraContext) — suficiente para o escopo
- **Cache**: AsyncStorage com TTL 30 dias
- **Sanitização**: utils/sanitize.ts para nomes de arquivo
- **Navegação**: Tab Navigator (Busca + Biblioteca) com Stack Navigator em cada tab
- **PDF**: react-native-html-to-pdf (validar no Sprint 0, fallback: expo-print)
