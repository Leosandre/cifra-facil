# Task 04 — Download + Geração de PDF

**Status:** ✅ DONE  
**Sprint:** 4  
**Duração estimada:** 2.5 dias  
**Requisitos cobertos:** FR-4, FR-5, FR-10

## Checklist

- [ ] Implementar `utils/pdfGenerator.ts` (template HTML → PDF: header, monospace 14pt, margens, footer)
- [ ] Implementar `utils/fileSystem.ts` (listFolders, createFolder, saveFile, fileExists)
- [ ] Componente `components/DownloadModal/StepTom.tsx` (confirmar tom, default = tom atual)
- [ ] Componente `components/DownloadModal/StepPasta.tsx` (verificar/criar pasta + tratar duplicatas)
- [ ] Componente `components/DownloadModal/StepConfirmacao.tsx` (sucesso + Abrir/Voltar)
- [ ] Lógica de duplicata: se arquivo existe → "Substituir?" ou "Manter ambos (adiciona número)"
- [ ] Nome de arquivo: `{Artista} - {Música} (Tom {X}).pdf`
- [ ] Testar com cifras curtas e longas (multi-página)

## Critério de Aceite
Baixar cifra → confirmar tom → escolher/criar pasta → PDF gerado com layout correto → salvo no filesystem. Duplicatas tratadas corretamente.
