# Task 00 — Setup + Fundação

**Status:** ✅ DONE  
**Sprint:** 0  
**Duração estimada:** 1 dia  
**Requisitos cobertos:** FR-9 (sanitização)

## Checklist

- [ ] Criar projeto Expo: `npx create-expo-app cifra-facil --template blank-typescript`
- [ ] Instalar dependências (validar compatibilidade de libs de PDF com SDK atual)
- [ ] Configurar Expo Router com layout de tabs + stacks
- [ ] Criar estrutura de pastas (src/app, services, utils, components, contexts, constants)
- [ ] Configurar `eas.json` para build Android
- [ ] Criar `.env` com `VAGALUME_API_KEY` + `.gitignore`
- [ ] Implementar `contexts/CifraContext.tsx` (estado global)
- [ ] Implementar `utils/sanitize.ts` (normalização de nomes)
- [ ] Implementar `constants/keys.ts` (leitura do .env)
- [ ] Implementar `constants/cifraclub-selectors.ts` (seletores CSS)
- [ ] Verificar que app abre e navega entre telas vazias

## Critério de Aceite
App roda no emulador/Expo Go, navega entre tabs (Busca/Biblioteca) e telas vazias, contexto global funciona.
