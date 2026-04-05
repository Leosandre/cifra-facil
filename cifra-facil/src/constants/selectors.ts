// Seletores CSS para scraping do cifras.com.br — isolados para fácil atualização

export const CIFRAS_SELECTORS = {
  // Cifra: dentro de <pre> no componente song-chord
  cifraContent: 'song-chord pre',
  // Acordes: <span data-chord="X">
  chords: 'span[data-chord]',
  // Tom original: extraído do JS inline (CHORDS_KEY)
  // Metadados
  songName: 'h1',
  artistName: 'h2 a',
} as const;

// Regex para extrair CHORDS_KEY do JavaScript inline
export const CHORDS_KEY_REGEX = /CHORDS_KEY:\s*'([^']+)'/;
