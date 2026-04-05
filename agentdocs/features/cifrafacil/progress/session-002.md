# Session 002 — Sprint 1: Busca + Vagalume API

**Data:** 2026-04-05  
**Sprint:** 1  
**Task:** 01-busca-vagalume

## Realizado
- [x] `services/vagalume.service.ts` — searchMusic() e getLyrics() com timeout 8s e tratamento de erros
- [x] `components/SearchBar.tsx` — debounce 300ms, botão limpar, submit via teclado
- [x] `components/MusicCard.tsx` — card com ícone, título, artista, chevron, acessibilidade
- [x] Tela `/search` completa com 5 estados: idle, loading, results, empty, error
- [x] Histórico de buscas recentes (AsyncStorage, últimas 10, com limpar)
- [x] Navegação: tocar no card → `/cifra/[id]` via CifraContext
- [x] Tela `/results` como redirect (resultados são inline na busca — melhor UX)
- [x] `.env` corrigido para convenção `EXPO_PUBLIC_`
- [x] TypeScript compila sem erros

## Decisões Tomadas
- Resultados exibidos inline na tela de busca (não em tela separada) — reduz navegação, UX mais fluida
- Tela `/results` mantida como redirect para compatibilidade com a estrutura de rotas
- Timeout de 8s no fetch (balanceia UX vs conexões lentas)
- Debounce de 300ms (busca só dispara após parar de digitar, mínimo 2 caracteres)

## Arquivos Criados/Modificados
- `src/services/vagalume.service.ts` (novo)
- `src/components/SearchBar.tsx` (novo)
- `src/components/MusicCard.tsx` (novo)
- `src/app/(tabs)/(search)/index.tsx` (reescrito)
- `src/app/(tabs)/(search)/results.tsx` (reescrito)
- `src/constants/keys.ts` (atualizado)
- `.env` (corrigido)

## Próximos Passos
- Sprint 2: cifraclub.service.ts, music.service.ts, cache.service.ts, CifraViewer, tela cifra/[id]
