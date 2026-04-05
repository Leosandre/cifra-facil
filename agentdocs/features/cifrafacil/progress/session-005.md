# Session 005 — Sprint 4: Download + PDF

**Data:** 2026-04-05  
**Sprint:** 4  
**Task:** 04-download-pdf

## Realizado
- [x] `utils/pdfGenerator.ts` — gera PDF via expo-print com template HTML (A4, monospace 14pt, header com tom)
- [x] `utils/fileSystem.ts` — CRUD de pastas/PDFs usando nova API `expo-file-system/next` (SDK 54: Paths, Directory, File)
- [x] `components/DownloadModal/StepTom.tsx` — grid 12 tons para confirmar tom do download
- [x] `components/DownloadModal/StepPasta.tsx` — verifica pasta existente + trata duplicatas (substituir/manter ambos)
- [x] `components/DownloadModal/StepConfirmacao.tsx` — sucesso + Abrir/Voltar
- [x] Tela `/download` orquestrando 3 steps com geração de PDF e salvamento
- [x] Botão "⬇ Download" adicionado na tela de cifra
- [x] Tela `/viewer` com WebView para exibir PDF
- [x] react-native-webview instalado
- [x] TypeScript compila sem erros

## Decisões Técnicas
- `expo-print` (Print.printToFileAsync) em vez de react-native-html-to-pdf — nativo do Expo
- `expo-file-system/next` (nova API SDK 54) com Paths, Directory, File — API síncrona para exists/create/list
- WebView para visualizar PDF (simples e funcional)
- Nome do arquivo: `{Artista} - {Música} (Tom {X}).pdf` com sanitização

## Próximos Passos
- Sprint 5: Biblioteca Local + Viewer na tab Biblioteca
