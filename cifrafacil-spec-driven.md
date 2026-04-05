# CifraFácil — Especificação Técnica (Spec-Driven)

> **Versão:** 1.1  
> **Data:** Abril 2026  
> **Autor:** Leonardo (STIT Cloud)  
> **Status:** Aprovado para desenvolvimento  
> **Changelog v1.1:** Adicionados FR-7 a FR-12 (Biblioteca Local, Cache, Sanitização, Duplicatas, Deleção, Bottom Nav). Adicionada seção 16 (Cache Local). Atualizada arquitetura de telas e serviços. Riscos adicionais mapeados.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Problema e Solução](#2-problema-e-solução)
3. [Decisões de Produto](#3-decisões-de-produto)
4. [Arquitetura de Dados](#4-arquitetura-de-dados)
5. [Stack Técnica](#5-stack-técnica)
6. [Arquitetura de Telas](#6-arquitetura-de-telas)
7. [Fluxos Detalhados](#7-fluxos-detalhados)
8. [Estrutura de Armazenamento](#8-estrutura-de-armazenamento)
9. [Arquitetura de Serviços](#9-arquitetura-de-serviços)
10. [Transposição de Tom](#10-transposição-de-tom)
11. [Geração de PDF](#11-geração-de-pdf)
12. [Plano de Ação — Sprints](#12-plano-de-ação--sprints)
13. [Riscos e Mitigações](#13-riscos-e-mitigações)
14. [Decisões de Armazenamento no Dispositivo](#14-decisões-de-armazenamento-no-dispositivo)
15. [Requisitos Não Funcionais](#15-requisitos-não-funcionais)
16. [Cache Local de Cifras](#16-cache-local-de-cifras)
17. [Requisitos Funcionais — Rastreabilidade](#17-requisitos-funcionais--rastreabilidade)

---

## 1. Visão Geral

**CifraFácil** é um aplicativo móvel (Android/iOS) para tablet que centraliza todo o fluxo de busca, transposição e armazenamento local de cifras musicais. O objetivo é eliminar as etapas manuais do processo atual do usuário final, oferecendo uma experiência simples, direta e funcional.

**Usuário-alvo:** Músico amador (violonista) que precisa buscar cifras, ajustar o tom para sua voz e salvar em pastas organizadas por artista no tablet.

---

## 2. Problema e Solução

### Processo atual (fluxo manual com 6 etapas)

```
1. Acessa cifraclub.com.br no navegador
2. Pesquisa a música desejada
3. Escolhe o tom manualmente no site
4. Faz download da cifra
5. Converte para DOCX manualmente
6. Transfere via cabo USB para o tablet, organizando em pastas por artista
```

**Problemas identificados:**
- Processo fragmentado com múltiplas ferramentas
- Dependência de cabo USB e computador
- Organização manual de pastas sujeita a erros
- Sem controle de tom no arquivo final salvo
- Músicas em tons altos impossibilitam o canto prolongado

### Solução proposta (fluxo unificado com 4 etapas)

```
1. Busca a música no app
2. Visualiza e ajusta o tom em tempo real
3. Clica em Download → escolhe pasta (ou cria nova)
4. Abre ou volta à busca — tudo no tablet
```

---

## 3. Decisões de Produto

### 3.1 Plataforma

| Item | Decisão | Justificativa |
|---|---|---|
| Plataforma | Android/iOS (tablet) | Dispositivo já em uso pelo usuário |
| Framework | React Native + Expo | Familiaridade da equipe, suporte multi-plataforma, EAS Build |
| Formato de saída | **PDF** | Funciona nativamente no tablet sem app adicional, preserva layout e espaçamento das cifras, abre dentro do próprio app |

**Por que PDF e não DOCX ou TXT:**

| Critério | PDF | DOCX | TXT |
|---|---|---|---|
| Abre no tablet sem app externo | ✅ | ❌ (precisa Word) | ⚠️ parcial |
| Preserva layout dos acordes | ✅ | ✅ | ❌ |
| Abre direto no app após salvar | ✅ | ❌ | ⚠️ |
| Compatibilidade universal | ✅ | ✅ | ✅ |

### 3.2 Autenticação

O app funciona **sem login**. Acesso às fontes de dados é feito como visitante / via API key própria do desenvolvedor.

---

## 4. Arquitetura de Dados

### 4.1 Mapeamento de Fontes

Nenhum site brasileiro de cifras oferece API oficial completa (acordes + letra + transposição). A solução adota uma abordagem híbrida com as melhores fontes disponíveis para cada responsabilidade:

| Responsabilidade | Fonte | Método | Estabilidade |
|---|---|---|---|
| Busca de músicas | Vagalume API | API oficial (`search.artmus`) | 🟢 Alta |
| Letra da música | Vagalume API | API oficial (`search.php`) | 🟢 Alta |
| Cifra completa (acordes) | Cifra Club | Scraping de HTML público | 🟡 Média |
| Transposição de tom | `chord-transposer` (npm) | Processamento 100% local | 🟢 Alta |

### 4.2 Sobre a Vagalume API

- **Base URL:** `https://api.vagalume.com.br`
- **Autenticação:** API key gratuita (registro no site)
- **Rate limit:** 1.000 requisições/hora
- **Endpoints utilizados:**

```
# Busca por artista + música
GET /search.artmus?q={query}&limit=10&apikey={key}

# Letra da música
GET /search.php?art={artista}&mus={musica}&apikey={key}

# Busca por trecho da letra
GET /search.excerpt?q={trecho}&limit=5&apikey={key}
```

- **Limitação conhecida:** A API retorna letra (`text`) mas **não retorna cifras** (acordes). O campo de cifras foi solicitado como feature em 2016 e não foi implementado.
- **Obs:** O Vagalume possui cifras no site (páginas `-cifrada.html`), mas estas não são expostas via API. O scraping dessas páginas é tecnicamente possível como fallback.

### 4.3 Sobre o Cifra Club (Scraping)

- **URL padrão de cifra:** `https://www.cifraclub.com.br/{artista}/{musica}/`
- **Método:** `fetch` + `cheerio` para parseamento do HTML
- **Seletores:** Isolados em arquivo de configuração dedicado para facilitar atualização
- **User-agent:** Simula navegador real para evitar bloqueios
- **Fallback:** Se scraping falhar → exibe apenas letra do Vagalume com aviso ao usuário

### 4.4 Estratégia de Fallback

```
Busca: Vagalume API
    ↓ sucesso → usa resultado
    ↓ falha   → erro amigável "Música não encontrada"

Cifra: Cifra Club (scraping)
    ↓ sucesso → cifra completa com acordes
    ↓ falha   → exibe letra pura do Vagalume + aviso "Acordes indisponíveis no momento"
```

---

## 5. Stack Técnica

| Camada | Tecnologia | Versão | Justificativa |
|---|---|---|---|
| Framework mobile | React Native + Expo | SDK 51+ | Familiar, multi-plataforma, EAS Build |
| Navegação | Expo Router | v3 | File-based routing, padrão moderno Expo |
| Busca/Letra | Vagalume API | — | API oficial gratuita, estável |
| Scraping de cifras | `cheerio` | ^1.0 | Parser HTML leve, funciona no RN com fetch |
| Transposição | `chord-transposer` | ^1.x | Suporte a cifras em português, todos os tons |
| Geração de PDF | `react-native-html-to-pdf` | latest | Converte HTML estilizado em PDF nativo |
| Visualização de PDF | `react-native-pdf` | latest | Renderiza PDF dentro do app |
| Armazenamento local | `expo-file-system` | — | Leitura/escrita de pastas e arquivos no dispositivo |
| Build | EAS Build (Expo) | — | Geração de APK/IPA sem Xcode/Android Studio local |

---

## 6. Arquitetura de Telas

```
Tab Navigator (Bottom Navigation)
│
├── 🔍 Busca
│   └── Stack Navigator
│       ├── /search                  → Tela de Busca (home)
│       │   └── SearchBar + histórico recente
│       │
│       ├── /results                 → Lista de resultados
│       │   └── Cards: título, artista
│       │
│       ├── /cifra/[id]              → Visualização da cifra
│       │   ├── Cifra renderizada com acordes
│       │   ├── Botão flutuante "🎵 Tom" → BottomSheet de transposição
│       │   └── Botão fixo "⬇ Download"
│       │
│       ├── /download (Modal Stack)  → Fluxo de download (3 steps)
│       │   ├── Step 1: Confirmação do tom selecionado
│       │   ├── Step 2: Seleção ou criação de pasta do artista
│       │   │   └── Se arquivo já existe → "Substituir?" ou "Manter ambos"
│       │   └── Step 3: Confirmação + Abrir ou Voltar
│       │
│       └── /viewer                  → Visualizador de PDF interno
│           └── react-native-pdf + botão Voltar
│
└── 📚 Biblioteca
    └── Stack Navigator
        ├── /library                 → Lista de pastas por artista
        │   ├── Contagem de PDFs por pasta
        │   ├── Busca/filtro por nome
        │   └── Toque na pasta → lista de PDFs
        │
        ├── /library/[artist]        → PDFs do artista
        │   ├── Lista de PDFs com nome, tom, data
        │   ├── Swipe para deletar
        │   └── Toque no PDF → /viewer
        │
        └── /viewer                  → Visualizador de PDF interno
```

---

## 7. Fluxos Detalhados

### 7.1 Fluxo de Busca

```
[Tela /search]
Usuário digita nome da música ou artista
        ↓
App chama Vagalume API (search.artmus)
        ↓
[Tela /results]
Exibe lista de cards:
  - Título da música
  - Nome do artista
  - Ícone de instrumento (quando disponível)
        ↓
Usuário toca em um card
        ↓
[Tela /cifra/[id]]
```

### 7.2 Fluxo de Visualização

```
[Tela /cifra/[id]]
        ↓
App busca letra via Vagalume API
App busca acordes via scraping do Cifra Club (paralelo)
        ↓
Loading state enquanto carrega
        ↓
Renderiza cifra formatada:
  - Acordes posicionados acima das sílabas correspondentes
  - Fonte monoespaçada para preservar alinhamento
  - Tom original exibido no header
        ↓
Botão flutuante "🎵 Tom: [tom atual]"
  → Abre BottomSheet com seletor de 12 tons
  → Transposição em tempo real (sem recarregar)
        ↓
Botão "⬇ Download" fixo no rodapé
```

### 7.3 Fluxo de Download (requisito central)

```
[Usuário clica em ⬇ Download]
        ↓
[Modal — Step 1: Tom]
"Confirmar o tom para download:"
Seletor de tom (padrão = tom atual visualizado)
[Confirmar] → Step 2

        ↓
[Modal — Step 2: Pasta do Artista]
App verifica pastas existentes no armazenamento

┌─ Pasta "{Artista}" já existe? ──────────────────────────────┐
│                                                              │
│  SIM → Exibe:                                               │
│    "Pasta '{Artista}' encontrada."                          │
│    [✅ Salvar aqui]  [📁 Escolher outra pasta]              │
│                                                              │
│  NÃO → Exibe:                                               │
│    "Pasta '{Artista}' não encontrada."                      │
│    [➕ Criar pasta '{Artista}']  [📁 Escolher outra pasta]  │
└──────────────────────────────────────────────────────────────┘
        ↓
App verifica se arquivo já existe na pasta

┌─ Arquivo já existe? ────────────────────────────────────────┐
│                                                              │
│  SIM → Exibe:                                               │
│    "'{Artista} - {Música} (Tom {X}).pdf' já existe."        │
│    [🔄 Substituir]  [📄 Manter ambos (adiciona número)]    │
│                                                              │
│  NÃO → Prossegue normalmente                               │
└──────────────────────────────────────────────────────────────┘
        ↓
App gera PDF com a cifra no tom selecionado
App salva na pasta escolhida/criada
        ↓
[Modal — Step 3: Confirmação]
"✅ Cifra salva com sucesso!"
Nome do arquivo: "{Artista} - {Música} (Tom {X}).pdf"

[📖 Abrir agora]    [🔍 Voltar à Busca]

        ↓                       ↓
[Tela /viewer]          [Tela /search]
PDF aberto              Retorna ao início
```

### 7.4 Diagrama de Decisão — Pasta do Artista

```
                    ┌──────────────────────┐
                    │  Verificar pastas    │
                    │  no armazenamento    │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
        Pasta existe                     Pasta não existe
              │                                 │
    ┌─────────▼──────────┐           ┌──────────▼─────────┐
    │ "Salvar em         │           │ "Criar pasta       │
    │  '{Artista}'?"     │           │  '{Artista}'?"     │
    │  [Sim] [Outra]     │           │  [Criar] [Outra]   │
    └─────────┬──────────┘           └──────────┬─────────┘
              │                                 │
              └──────────────┬──────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Arquivo existe? │
                    └────────┬────────┘
                      ┌──────┴──────┐
                    SIM            NÃO
                      │              │
              ┌───────▼──────┐       │
              │ Substituir?  │       │
              │ Manter ambos?│       │
              └───────┬──────┘       │
                      └──────┬───────┘
                    ┌────────▼────────┐
                    │  Gera e salva   │
                    │     o PDF       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  "Abrir agora   │
                    │   ou Voltar?"   │
                    └────────┬────────┘
                      ┌──────┴──────┐
                      │             │
                  [Abrir]       [Voltar]
                      │             │
                 /viewer        /search
```

### 7.5 Fluxo da Biblioteca Local

```
[Tab 📚 Biblioteca]
        ↓
[Tela /library]
Lista de pastas por artista (ordem alfabética)
Cada card exibe: nome do artista + quantidade de PDFs
Barra de busca/filtro no topo
        ↓
Usuário toca em uma pasta
        ↓
[Tela /library/[artist]]
Lista de PDFs do artista
Cada card exibe: nome da música, tom, data de criação
        ↓
┌─ Ações disponíveis ─────────────────────────────┐
│                                                   │
│  Toque no PDF → Abre no /viewer                  │
│  Swipe para esquerda → Confirmar deleção         │
│  Long press → Menu: Abrir | Deletar              │
└───────────────────────────────────────────────────┘
```

---

## 8. Estrutura de Armazenamento

O app utiliza o diretório privado do app (`expo-file-system documentDirectory`) para MVP, organizando os arquivos em estrutura de pastas por artista.

```
/CifraFácil/
├── Roberto Carlos/
│   ├── Roberto Carlos - Detalhes da Vida (Tom C).pdf
│   └── Roberto Carlos - Emoções (Tom G).pdf
├── Ed Sheeran/
│   └── Ed Sheeran - Perfect (Tom Ab).pdf
├── Chitãozinho e Xororó/
│   └── Chitãozinho e Xororó - Evidências (Tom E).pdf
└── ...
```

**Convenção de nomenclatura de arquivo:**
```
{Artista} - {Título da Música} (Tom {X}).pdf
```

**Exemplo:** `Roberto Carlos - Emoções (Tom G).pdf`

---

## 9. Arquitetura de Serviços

```
src/
├── app/                          ← Expo Router (telas)
│   ├── (tabs)/                   ← Tab Navigator (Bottom Navigation)
│   │   ├── _layout.tsx           ← Tab layout (Busca + Biblioteca)
│   │   ├── (search)/             ← Stack: fluxo de busca
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx         ← Tela de busca (/search)
│   │   │   ├── results.tsx
│   │   │   ├── cifra/[id].tsx
│   │   │   ├── download.tsx      ← Modal com 3 steps
│   │   │   └── viewer.tsx
│   │   └── (library)/            ← Stack: biblioteca local
│   │       ├── _layout.tsx
│   │       ├── index.tsx         ← Lista de pastas/artistas
│   │       ├── [artist].tsx      ← PDFs do artista
│   │       └── viewer.tsx
│   └── _layout.tsx               ← Root layout
│
├── contexts/
│   └── CifraContext.tsx           ← Estado global (cifra, tom, artista)
│
├── services/
│   ├── vagalume.service.ts       ← Busca + Letra (API oficial)
│   ├── cifraclub.service.ts      ← Acordes (scraping isolado)
│   ├── music.service.ts          ← Orquestra as duas fontes
│   └── cache.service.ts          ← Cache local de cifras (TTL 30 dias)
│
├── utils/
│   ├── transposer.ts             ← Wrapper do chord-transposer
│   ├── pdfGenerator.ts           ← Geração de PDF via HTML
│   ├── fileSystem.ts             ← Leitura/escrita de pastas
│   └── sanitize.ts               ← Normalização de nomes para filesystem
│
├── components/
│   ├── SearchBar.tsx
│   ├── MusicCard.tsx
│   ├── CifraViewer.tsx           ← Renderiza cifra formatada
│   ├── ToneSelectorSheet.tsx     ← BottomSheet de seleção de tom
│   ├── LibraryFolderCard.tsx     ← Card de pasta na biblioteca
│   ├── LibraryFileCard.tsx       ← Card de PDF na biblioteca
│   └── DownloadModal/
│       ├── StepTom.tsx
│       ├── StepPasta.tsx
│       └── StepConfirmacao.tsx
│
└── constants/
    ├── keys.ts                   ← API keys (não comitar)
    └── cifraclub-selectors.ts    ← Seletores CSS isolados para scraping
```

---

## 10. Transposição de Tom

### 10.1 Por que é crítico

O usuário final (violonista amador) frequentemente encontra músicas cujas gravações originais estão em tons vocalmente elevados para cantar por períodos prolongados. A transposição para um tom confortável é um requisito essencial, não opcional.

### 10.2 Como funciona

A transposição acontece **100% localmente no app**, sem nenhuma dependência de API externa:

```
1. App recebe cifra do Cifra Club (texto com acordes embutidos)
          ↓
2. chord-transposer identifica e parseia todos os acordes
          ↓
3. Usuário escolhe o tom desejado no seletor (12 opções)
          ↓
4. Biblioteca transpõe todos os acordes em tempo real
          ↓
5. CifraViewer re-renderiza com novos acordes instantaneamente
          ↓
6. Download gera PDF já com o tom selecionado gravado permanentemente
```

### 10.3 Tons disponíveis

```
C  | C# | D  | D# | E  | F  | F# | G  | G# | A  | A# | B
Do | Do#| Re | Re#| Mi | Fa | Fa#| Sol|Sol#| La | La#| Si
```

### 10.4 Informações exibidas na tela

- Tom original da música (conforme gravação)
- Tom atualmente selecionado
- Número de semitons de diferença (+3, -2, etc.)
- Indicação de capotraste equivalente (quando aplicável)

### 10.5 Vantagens da transposição local

- Funciona **offline** — após carregar a cifra, o usuário pode navegar por todos os tons sem internet
- Instantânea — sem latência de API
- Gravada no PDF — o arquivo salvo já reflete o tom escolhido no nome e no conteúdo

---

## 11. Geração de PDF

### 11.1 Tecnologia

`react-native-html-to-pdf` converte um template HTML estilizado em PDF nativo no dispositivo.

### 11.2 Estrutura do PDF gerado

```
┌────────────────────────────────────────┐
│  [Logo CifraFácil]                     │
│  Artista: Roberto Carlos               │
│  Música:  Emoções                      │
│  Tom:     G  (original: Bb)            │
├────────────────────────────────────────┤
│                                        │
│  G          Em                         │
│  Quando a noite cobre o céu...         │
│                                        │
│  C          D7                         │
│  E as estrelas no azul...              │
│                                        │
│  ... [conteúdo completo da cifra] ...  │
│                                        │
└────────────────────────────────────────┘
│  Gerado por CifraFácil • vagalume.com.br│
└────────────────────────────────────────┘
```

### 11.3 Especificações técnicas do PDF

- **Tamanho:** A4 (padrão tablet)
- **Fonte:** Monospace para cifras (preservar alinhamento acorde/sílaba)
- **Tamanho de fonte padrão:** 14pt (legível em tablet sem óculos)
- **Margens:** 20mm laterais, 15mm topo/rodapé
- **Nome do arquivo:** `{Artista} - {Música} (Tom {X}).pdf`

---

## 12. Plano de Ação — Sprints

### Sprint 0 — Setup (½ dia)

- [ ] `npx create-expo-app cifra-facil --template blank-typescript`
- [ ] Instalar dependências: `chord-transposer`, `cheerio`, `react-native-html-to-pdf`, `react-native-pdf`, `expo-file-system`
- [ ] Configurar Expo Router
- [ ] Configurar `eas.json` para build Android (prioridade) e iOS
- [ ] Criar `.env` com Vagalume API key
- [ ] Estrutura de pastas conforme item 9

### Sprint 1 — Busca + Integração Vagalume (2 dias)

- [ ] Implementar `vagalume.service.ts` (busca + letra)
- [ ] Tela `/search` com SearchBar e histórico recente (AsyncStorage)
- [ ] Tela `/results` com lista de cards (título, artista)
- [ ] Tratamento de estados: loading, erro, sem resultados
- [ ] Testes manuais com repertório variado (MPB, sertanejo, rock BR)

### Sprint 2 — Scraping de Cifras + Visualização (2 dias)

- [ ] Implementar `cifraclub.service.ts` com cheerio
- [ ] Isolamento de seletores em `cifraclub-selectors.ts`
- [ ] Parser de acordes e letra em `CifraViewer.tsx`
- [ ] Renderização formatada (acorde acima da sílaba, fonte monospace)
- [ ] Integração `music.service.ts` orquestrando as duas fontes
- [ ] Fallback: exibir letra pura quando scraping falhar
- [ ] Testes com músicas de diferentes gêneros e complexidades

### Sprint 3 — Transposição de Tom (1,5 dias)

- [ ] Implementar `transposer.ts` com wrapper do `chord-transposer`
- [ ] Componente `ToneSelectorSheet.tsx` (BottomSheet com 12 tons)
- [ ] Transposição em tempo real no `CifraViewer`
- [ ] Exibir: tom original, tom atual, diferença em semitons
- [ ] Indicação de capotraste equivalente
- [ ] Validação com múltiplos gêneros (sertanejo, MPB, axé, pagode, gospel)

### Sprint 4 — Fluxo de Download + PDF (2,5 dias)

- [ ] Implementar `pdfGenerator.ts` com template HTML
- [ ] Implementar `fileSystem.ts` (listar pastas, criar, salvar)
- [ ] Modal de download com 3 steps (`DownloadModal/`)
- [ ] Lógica de verificação/criação de pasta por artista
- [ ] Geração do PDF com tom selecionado
- [ ] Nome de arquivo correto: `{Artista} - {Música} (Tom {X}).pdf`
- [ ] Botão "Abrir agora" → `/viewer`
- [ ] Botão "Voltar à Busca" → `/search`

### Sprint 5 — Visualizador + Polimento (1 dia)

- [ ] Integrar `react-native-pdf` na tela `/viewer`
- [ ] Skeleton loading em todas as telas de carregamento
- [ ] Toast notifications para erros e confirmações
- [ ] Tamanho de toque mínimo 44px em todos os botões (acessibilidade)
- [ ] Teste em tablet físico Android
- [ ] Build APK via `eas build --platform android --profile preview`

---

## 13. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Cifra Club bloquear scraping (Cloudflare) | **Alta** | Alto | User-agent de navegador real + delays entre requests (min 1s); fallback com Vagalume cifrada (`.html`); se persistir, backend intermediário (Lambda + API Gateway) |
| Mudança no HTML do Cifra Club | Alta (longo prazo) | Médio | Seletores isolados em `cifraclub-selectors.ts` — fácil atualização pontual; snapshot tests para detectar mudanças |
| `chord-transposer` não cobrir acordes BR | Baixa | Médio | Testar com repertório sertanejo/pagode/axé no Sprint 3 antes de finalizar |
| Permissões de armazenamento Android 13+ | Alta | Alto | Usar `documentDirectory` (sandboxed) no MVP — sem necessidade de permissão especial |
| Vagalume API indisponível | Baixa | Alto | Cache local das últimas buscas com AsyncStorage; mensagem de erro amigável |
| PDF com alinhamento quebrado em cifras complexas | Média | Médio | Usar fonte monospace no HTML template; testar com tablaturas |
| `react-native-html-to-pdf` incompatível com Expo SDK atual | Média | Alto | Validar no Sprint 0; alternativa: `expo-print` (`Print.printToFileAsync`) |
| Cifras com tablatura quebram o parser | Média | Médio | Detectar tablatura e renderizar como bloco de código ou avisar "Tablatura não suportada" |
| Caracteres especiais em nomes de artista quebram filesystem | Alta | Alto | `utils/sanitize.ts` normaliza nomes; nome original mantido para exibição |
| App decompilado expõe API key do Vagalume | Média | Baixo | API key é gratuita e rate-limited; para produção, rotear via backend |

---

## 14. Decisões de Armazenamento no Dispositivo

### Opção escolhida para MVP: Diretório Privado do App

**Android 13+ restringiu acesso ao armazenamento externo.** Há duas abordagens possíveis:

| | Opção A — Diretório Privado (MVP) | Opção B — Armazenamento Externo |
|---|---|---|
| Permissão necessária | ❌ Nenhuma | ✅ `MANAGE_EXTERNAL_STORAGE` |
| Complexidade | Baixa | Alta |
| Visível no explorador de arquivos | ❌ | ✅ |
| Google Play | ✅ Sem restrições | ⚠️ Restrições da política |
| Compartilhamento | Via `expo-sharing` | Acesso direto |

**Decisão:** MVP usa **Opção A** (diretório privado). O usuário acessa e organiza os PDFs dentro do próprio app. Caso haja demanda futura por acesso externo (ex: transferir para outro app de leitura), implementar `expo-sharing` como ação secundária.

---

## 15. Requisitos Não Funcionais

| Requisito | Critério de aceitação |
|---|---|
| **Performance** | Busca retorna resultados em < 2s em conexão 4G |
| **Offline parcial** | Transposição de tom funciona sem internet após cifra carregada |
| **Acessibilidade** | Todos os botões com área de toque mínima de 44×44px |
| **Legibilidade** | Fonte mínima 14pt na cifra renderizada (uso em tablet) |
| **Confiabilidade** | Fallback exibido ao usuário em qualquer falha de rede |
| **Privacidade** | Nenhum dado do usuário enviado para servidores externos |
| **Build** | APK funcional gerado via EAS Build sem necessidade de Android Studio |

---

## Apêndice A — Endpoints Vagalume API

```
Base URL: https://api.vagalume.com.br

# Busca artista + música
GET /search.artmus?q={query}&limit=10&apikey={key}

# Letra por artista e música
GET /search.php?art={artista}&mus={musica}&apikey={key}

# Letra por ID da música
GET /search.php?musid={id}&apikey={key}

# Ranking de cifras (para descoberta)
GET /rank.php?type=mus&period=month&scope=chords&limit=10&apikey={key}
```

**Exemplo de retorno do `search.php`:**
```json
{
  "type": "exact",
  "art": {
    "id": "3ade68b2g3b86eda3",
    "name": "Roberto Carlos",
    "url": "https://www.vagalume.com.br/roberto-carlos/"
  },
  "mus": [{
    "id": "3ade68b3gdb86eda3",
    "name": "Emoções",
    "url": "https://www.vagalume.com.br/roberto-carlos/emocoes.html",
    "lang": 1,
    "text": "Emoções...\nQuando a noite cobre o céu..."
  }]
}
```

---

## Apêndice B — Dependências npm

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-file-system": "~18.0.0",
    "cheerio": "^1.0.0",
    "chord-transposer": "^1.x",
    "react-native-html-to-pdf": "^0.12.0",
    "react-native-pdf": "^6.7.0",
    "@react-native-async-storage/async-storage": "^1.23.0",
    "@gorhom/bottom-sheet": "^4.6.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0"
  }
}
```

> **Nota v1.1:** Versões do Expo SDK e Router atualizadas para as mais recentes. Adicionadas dependências para BottomSheet (transposição de tom). Validar compatibilidade de `react-native-html-to-pdf` no Sprint 0 — alternativa: `expo-print`.

---

## Apêndice C — Glossário

| Termo | Definição |
|---|---|
| **Cifra** | Representação textual de uma música com acordes posicionados acima da letra |
| **Tom** | Altura musical da música. Ex: tom de C (Dó), G (Sol), Bb (Si bemol) |
| **Transposição** | Processo de alterar todos os acordes de uma música para um tom diferente |
| **Capotraste** | Dispositivo físico colocado no braço do violão para mudar o tom sem alterar a digitação |
| **Semiton** | A menor unidade de distância entre dois tons. Ex: de C para C# = 1 semitom |
| **Scraping** | Extração automatizada de dados de páginas web via análise do HTML |

---

*Documento gerado como especificação base para desenvolvimento spec-driven do CifraFácil.*  
*Qualquer alteração de requisito deve ser refletida neste documento antes de impactar o código.*

---

## 16. Cache Local de Cifras

### 16.1 Motivação

Sem cache, cada visualização de uma cifra já buscada anteriormente gera novo scraping do Cifra Club. Isso:
- Aumenta risco de bloqueio por Cloudflare
- Gasta dados móveis desnecessariamente
- Piora a experiência (loading toda vez)

### 16.2 Estratégia

```
Busca de cifra:
    ↓
Cache local existe e TTL válido?
    ├── SIM → Retorna do cache (instantâneo, sem rede)
    └── NÃO → Busca na rede → Salva no cache → Retorna
```

### 16.3 Implementação

- **Storage**: AsyncStorage (chave = `cifra:{artist}:{music}`)
- **TTL**: 30 dias (cifras raramente mudam)
- **Dados cacheados**: texto da cifra completa (acordes + letra), tom original, URL de origem
- **Invalidação**: automática por TTL; manual via "Recarregar" na tela da cifra

### 16.4 Limites

- Sem limite de entradas no MVP (volume esperado: dezenas, não milhares)
- Se necessário no futuro: LRU eviction das cifras mais antigas

---

## 17. Requisitos Funcionais — Rastreabilidade

| ID | Requisito | Prioridade | Sprint | Status |
|----|-----------|------------|--------|--------|
| FR-1 | Buscar músicas por nome/artista via Vagalume API | MUST | 1 | ✅ Done |
| FR-2 | Exibir cifra completa com acordes posicionados (scraping Cifra Club) | MUST | 2 | ⏳ Pendente |
| FR-3 | Transpor tom em tempo real (12 tons, 100% local) | MUST | 3 | ⏳ Pendente |
| FR-4 | Gerar PDF com cifra no tom selecionado | MUST | 4 | ⏳ Pendente |
| FR-5 | Salvar PDF em pasta organizada por artista | MUST | 4 | ⏳ Pendente |
| FR-6 | Visualizar PDF dentro do app | MUST | 5 | ⏳ Pendente |
| FR-7 | Biblioteca Local — navegar pastas e PDFs salvos | MUST | 5 | ⏳ Pendente |
| FR-8 | Cache local de cifras buscadas (TTL 30 dias) | SHOULD | 2 | ⏳ Pendente |
| FR-9 | Sanitização de nomes de arquivo/pasta (caracteres especiais) | MUST | 0 | ✅ Done |
| FR-10 | Tratamento de download duplicado (substituir/manter ambos) | SHOULD | 4 | ⏳ Pendente |
| FR-11 | Deletar PDFs salvos da biblioteca | SHOULD | 5 | ⏳ Pendente |
| FR-12 | Bottom navigation (Busca + Biblioteca) | MUST | 5 | ✅ Done |
| FR-13 | Fallback: exibir letra pura quando scraping falhar | MUST | 2 | ⏳ Pendente |
| FR-14 | Histórico de buscas recentes | SHOULD | 1 | ✅ Done |
| FR-15 | Exibir tom original, tom atual e diferença em semitons | MUST | 3 | ⏳ Pendente |
| FR-16 | Indicação de capotraste equivalente | SHOULD | 3 | ⏳ Pendente |

---

*Documento gerado como especificação base para desenvolvimento spec-driven do CifraFácil.*  
*Qualquer alteração de requisito deve ser refletida neste documento antes de impactar o código.*
