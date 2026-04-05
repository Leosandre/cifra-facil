# CifraFácil — Spec Resumida

> Spec completa: `/cifrafacil-spec-driven.md` (raiz do projeto)

## Objetivo
App mobile (Android/iOS tablet) que unifica busca, transposição e armazenamento local de cifras musicais.

## Requisitos Funcionais (MUST)

| ID | Requisito |
|----|-----------|
| FR-1 | Buscar músicas por nome/artista via Vagalume API |
| FR-2 | Exibir cifra completa com acordes (scraping Cifra Club) |
| FR-3 | Transpor tom em tempo real (12 tons, 100% local) |
| FR-4 | Gerar PDF com cifra no tom selecionado |
| FR-5 | Salvar PDF em pasta organizada por artista |
| FR-6 | Visualizar PDF dentro do app |
| FR-7 | Biblioteca Local — navegar pastas e PDFs salvos |
| FR-9 | Sanitização de nomes de arquivo/pasta |
| FR-12 | Bottom navigation (Busca + Biblioteca) |
| FR-13 | Fallback: letra pura quando scraping falhar |
| FR-15 | Exibir tom original, tom atual e diferença em semitons |

## Requisitos Funcionais (SHOULD)

| ID | Requisito |
|----|-----------|
| FR-8 | Cache local de cifras (TTL 30 dias) |
| FR-10 | Tratamento de download duplicado |
| FR-11 | Deletar PDFs da biblioteca |
| FR-14 | Histórico de buscas recentes |
| FR-16 | Indicação de capotraste equivalente |

## Requisitos Não Funcionais

- Performance: busca < 2s em 4G
- Offline parcial: transposição funciona sem internet
- Acessibilidade: toque mínimo 44×44px
- Legibilidade: fonte mínima 14pt
- Privacidade: nenhum dado enviado a servidores externos

## Stack
React Native + Expo (SDK 52+), Expo Router, Vagalume API, Cheerio, chord-transposer, react-native-html-to-pdf, react-native-pdf, expo-file-system, AsyncStorage
