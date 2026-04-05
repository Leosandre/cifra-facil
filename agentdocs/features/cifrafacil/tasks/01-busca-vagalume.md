# Task 01 — Busca + Integração Vagalume

**Status:** ✅ DONE  
**Sprint:** 1  
**Duração estimada:** 2 dias  
**Requisitos cobertos:** FR-1, FR-14

## Checklist

- [ ] Implementar `services/vagalume.service.ts` (searchMusic, getLyrics, tratamento de erros)
- [ ] Tela `/search` com SearchBar (debounce 300ms) + histórico recente (AsyncStorage, últimas 10)
- [ ] Tela `/results` com lista de MusicCards (título, artista)
- [ ] Componente `components/SearchBar.tsx`
- [ ] Componente `components/MusicCard.tsx`
- [ ] Estados: vazio, loading, erro, sem resultados
- [ ] Navegação results → cifra/[id] passando dados via context

## Critério de Aceite
Buscar "Roberto Carlos Emoções" → ver resultado na lista → tocar → navegar para tela de cifra (ainda vazia). Histórico de buscas persiste entre sessões.
