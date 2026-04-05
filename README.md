# 🎵 CifraFácil

App mobile (Android/iOS) para tablet que centraliza busca, transposição e armazenamento local de cifras musicais.

## Problema

O fluxo atual do músico amador envolve 6 etapas manuais: buscar no site, escolher tom, baixar, converter para DOCX, transferir via USB, organizar em pastas. O CifraFácil reduz isso para 4 etapas — tudo no tablet.

## Stack

- **Framework:** React Native + Expo (SDK 54)
- **Navegação:** Expo Router (file-based, tabs + stacks)
- **Busca/Letra:** cifras.com.br API (JSON público, sem key)
- **Cifras/Acordes:** cifras.com.br (scraping com cheerio)
- **Transposição:** chord-transposer (100% local, offline)
- **PDF:** expo-print (HTML → PDF nativo)
- **Storage:** expo-file-system (diretório privado do app)

## Estrutura

```
src/
├── app/                    ← Telas (Expo Router)
│   └── (tabs)/
│       ├── (search)/       ← Busca → Resultados → Cifra → Download → Viewer
│       └── (library)/      ← Biblioteca → Artista → Viewer
├── contexts/               ← Estado global (CifraContext)
├── services/               ← Vagalume API, Cifra Club scraping, cache
├── utils/                  ← Transposição, PDF, filesystem, sanitização
├── components/             ← UI reutilizável
└── constants/              ← API keys, seletores CSS
```

## Desenvolvimento

```bash
cd cifra-facil
npm start          # Expo dev server
npm run android    # Emulador Android
```

## Build

```bash
npx eas build --platform android --profile preview   # APK
```

## Documentação

- **Spec completa:** `cifrafacil-spec-driven.md` (raiz do projeto)
- **Plano e tasks:** `agentdocs/features/cifrafacil/`

## Status

| Sprint | Escopo | Status |
|--------|--------|--------|
| 0 | Setup + Fundação | ✅ Done |
| 1 | Busca + API cifras.com.br | ✅ Done |
| 2 | Scraping + Visualização + Cache | ✅ Done |
| 3 | Transposição de Tom | ✅ Done |
| 4 | Download + PDF | ✅ Done |
| 5 | Biblioteca + Viewer | ✅ Done |
| 6 | Polimento + Build | ✅ Done |
