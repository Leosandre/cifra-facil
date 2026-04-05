# Task 03 — Transposição de Tom

**Status:** ✅ DONE  
**Sprint:** 3  
**Duração estimada:** 1.5 dias  
**Requisitos cobertos:** FR-3, FR-15, FR-16

## Checklist

- [ ] Implementar `utils/transposer.ts` (wrapper chord-transposer: transpose(text, fromKey, toKey))
- [ ] Componente `components/ToneSelectorSheet.tsx` (BottomSheet, grid 12 tons, tom atual destacado)
- [ ] Exibir: tom original, tom selecionado, diferença em semitons, capotraste equivalente
- [ ] Integrar no CifraViewer: re-render instantâneo ao mudar tom
- [ ] Atualizar CifraContext com tom selecionado (persiste no fluxo de download)
- [ ] Validar com repertório variado (sertanejo, MPB, gospel, pagode, axé)

## Critério de Aceite
Abrir cifra → tocar botão de tom → BottomSheet abre → selecionar tom → cifra atualiza instantaneamente com acordes transpostos. Funciona offline após cifra carregada.
