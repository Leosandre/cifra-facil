# Task 06 — Polimento + Build

**Status:** ✅ DONE  
**Sprint:** 6  
**Duração estimada:** 1.5 dias  
**Requisitos cobertos:** NFRs (performance, acessibilidade, legibilidade, confiabilidade)

## Checklist

- [ ] Skeleton loading em todas as telas de carregamento
- [ ] Toast notifications (erros, confirmações, fallbacks)
- [ ] Acessibilidade: área de toque 44×44px, labels, contraste
- [ ] Edge cases: sem internet, disco cheio, tablatura não suportada
- [ ] Teste em tablet físico Android
- [ ] Build APK: `eas build --platform android --profile preview`
- [ ] Teste end-to-end: buscar → transpor → baixar → abrir da biblioteca

## Critério de Aceite
APK instalável e funcional no tablet. Todos os fluxos funcionam end-to-end. Loading states e erros tratados em todas as telas.
