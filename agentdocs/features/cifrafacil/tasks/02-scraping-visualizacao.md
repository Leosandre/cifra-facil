# Task 02 — Scraping + Visualização + Cache

**Status:** ✅ DONE  
**Sprint:** 2  
**Duração estimada:** 2.5 dias  
**Requisitos cobertos:** FR-2, FR-8, FR-13

## Checklist

- [ ] Implementar `services/cifraclub.service.ts` (getCifra com cheerio, user-agent, rate limiting 1s)
- [ ] Implementar `services/music.service.ts` (orquestra Vagalume + Cifra Club em paralelo)
- [ ] Implementar `services/cache.service.ts` (get/set com TTL 30 dias, chave: `cifra:{artist}:{music}`)
- [ ] Implementar fallback: se scraping falhar → letra pura + aviso "Acordes indisponíveis"
- [ ] Componente `components/CifraViewer.tsx` (fonte monospace, acordes acima das sílabas, ScrollView)
- [ ] Tela `/cifra/[id]` completa com loading, erro, fallback
- [ ] Integrar cache: busca primeiro no cache, depois na rede

## Critério de Aceite
Buscar música → ver cifra completa formatada com acordes alinhados. Segunda busca da mesma música carrega do cache (instantâneo). Se scraping falhar, exibe letra pura com aviso.
