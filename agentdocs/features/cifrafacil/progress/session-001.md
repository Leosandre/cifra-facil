# Session 001 — Sprint 0: Setup + Fundação

**Data:** 2026-04-05  
**Sprint:** 0  
**Task:** 00-setup

## Realizado
- [x] Spec v1.1 atualizada com gaps identificados (FR-7 a FR-16, seções 16 e 17)
- [x] Estrutura spec-driven criada (spec.md, plan.md, tasks/, progress/)
- [x] Tasks 00-06 criadas com checklists e critérios de aceite
- [x] Projeto Expo criado (SDK 54, React Native 0.81.5, TypeScript 5.9)
- [x] Dependências instaladas: expo-router, expo-file-system, AsyncStorage, cheerio, chord-transposer, @gorhom/bottom-sheet, expo-print, expo-sharing, gesture-handler, reanimated
- [x] Expo Router configurado com root em `src/app`
- [x] Tab Navigator (Busca + Biblioteca) com Stack Navigator em cada tab
- [x] Todas as telas placeholder criadas e navegáveis
- [x] `CifraContext.tsx` — estado global (selectedMusic, cifra, currentKey)
- [x] `sanitize.ts` — normalização de nomes para filesystem
- [x] `keys.ts` — constantes de API
- [x] `cifraclub-selectors.ts` — seletores CSS isolados
- [x] `eas.json` configurado para build Android (preview = APK)
- [x] `.env` + `.gitignore` configurados
- [x] TypeScript compila sem erros

## Decisões Tomadas
- **expo-print** em vez de react-native-html-to-pdf (nativo do Expo, sem problemas de compatibilidade)
- **SDK 54** (mais recente disponível, spec original mencionava 51)
- **--legacy-peer-deps** necessário para cheerio + bottom-sheet (conflito de React peer deps)

## Próximos Passos
- Sprint 1: Implementar vagalume.service.ts, tela de busca funcional, tela de resultados
