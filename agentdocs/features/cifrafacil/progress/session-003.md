# Session 003 — Sprint 2: Scraping + Visualização + Cache

**Data:** 2026-04-05  
**Sprint:** 2  
**Task:** 02-scraping-visualizacao

## Realizado
- [x] Análise detalhada do Cifra Club: sem API pública (401 Unauthorized), scraping com Selenium (inviável para mobile)
- [x] Descoberta do endpoint Solr público do Cifra Club (`solr.sscdn.co/cc/h2/`) via OpenCifra
- [x] **Descoberta do cifras.com.br**: API JSON pública (`/api/search`) com dados ricos (sem API key!)
- [x] Análise do HTML do cifras.com.br: acordes em `<span data-chord="X">`, tom em `CHORDS_KEY` JS inline
- [x] `services/cifras.service.ts` — busca via API JSON + scraping de cifra
- [x] `services/cache.service.ts` — cache AsyncStorage com TTL 30 dias
- [x] `services/music.service.ts` — orquestrador (cache → cifras.com.br)
- [x] `components/CifraViewer.tsx` — renderização monospace com scroll horizontal/vertical
- [x] Tela `/cifra/[id]` completa com loading, erro, fallback, header com tom
- [x] Tela de busca atualizada para usar cifras.com.br API
- [x] `constants/selectors.ts` — seletores CSS do cifras.com.br
- [x] `constants/keys.ts` — URLs atualizadas
- [x] CifraContext atualizado com slugs (artistSlug, songSlug)
- [x] Removidos: vagalume.service.ts (não mais necessário para busca), cifraclub-selectors.ts
- [x] TypeScript compila sem erros

## Decisão Arquitetural Importante
**cifras.com.br substituiu Vagalume + Cifra Club como fonte primária:**
- Busca: API JSON pública `/api/search` — sem API key, dados ricos (instrumentos, dificuldade, compositor, hits)
- Cifra: scraping do HTML (acordes em `<span data-chord>`, tom em JS inline)
- Vagalume: mantido como fallback futuro para letra pura (não implementado nesta sprint)
- Cifra Club: descartado (Cloudflare agressivo, sem API, Selenium inviável)

## Arquivos Criados/Modificados
- `src/services/cifras.service.ts` (novo)
- `src/services/cache.service.ts` (novo)
- `src/services/music.service.ts` (novo)
- `src/components/CifraViewer.tsx` (novo)
- `src/constants/selectors.ts` (novo, substitui cifraclub-selectors.ts)
- `src/constants/keys.ts` (atualizado)
- `src/contexts/CifraContext.tsx` (atualizado)
- `src/app/(tabs)/(search)/index.tsx` (atualizado)
- `src/app/(tabs)/(search)/cifra/[id].tsx` (reescrito)
- Removidos: `vagalume.service.ts`, `cifraclub-selectors.ts`, `cifraclub.service.ts`

## Próximos Passos
- Sprint 3: transposer.ts, ToneSelectorSheet, transposição em tempo real
