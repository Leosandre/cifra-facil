# Session 004 — Sprint 3: Transposição de Tom

**Data:** 2026-04-05  
**Sprint:** 3  
**Task:** 03-transposicao

## Realizado
- [x] Análise da API do `chord-transposer`: suporta `fromKey().toKey()`, `up()`, `down()`, acordes complexos
- [x] Validação com repertório brasileiro: sertanejo, MPB, gospel, pagode, axé — 100% sucesso
- [x] Acordes testados: `G/B`, `Bb9`, `F#m7(b5)`, `Gsus4`, `D/F#`, `D#m7`, `Cmaj7`, `B7`, `Am7`, `Dm7`, `G7`
- [x] `utils/transposer.ts` — transposeCifra, getSemitonesDiff, getCapoPosition, formatSemitones
- [x] `components/ToneSelectorSheet.tsx` — BottomSheet com grid 12 tons, info de semitons e capotraste
- [x] Tela `/cifra/[id]` integrada: transposição em tempo real via useMemo, botão flutuante, BottomSheet
- [x] Tom selecionado persiste no CifraContext (disponível para download no Sprint 4)
- [x] TypeScript compila sem erros

## Detalhes Técnicos
- Transposição usa `useMemo` — recalcula APENAS quando `currentKey` ou `cifra.content` mudam
- BottomSheet do @gorhom/bottom-sheet com snap point 45%, pan-down-to-close
- Grid circular de 12 tons com indicação visual: tom selecionado (roxo), tom original (borda)
- Capotraste calculado automaticamente: se tom subiu N semitons, capo na Nª casa
- Fallback seguro: se transposição falhar, retorna texto original sem quebrar

## Validação de Repertório
| Gênero | Acordes testados | Resultado |
|--------|-----------------|-----------|
| Sertanejo | E, B9, D#m7, G#m | ✅ |
| MPB | C, G/B, Bb9, Am | ✅ |
| Gospel | G, Gsus4, D/F# | ✅ |
| Pagode | Am7, Dm7, G7, Cmaj7, F#m7(b5), B7 | ✅ |
| Axé | A, D, E, F#m | ✅ |

## Próximos Passos
- Sprint 4: pdfGenerator.ts, fileSystem.ts, DownloadModal (3 steps)
