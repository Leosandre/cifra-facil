import { transpose as chordTranspose } from 'chord-transposer';

// 12 tons cromáticos na ordem padrão
export const ALL_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'] as const;
export type MusicalKey = (typeof ALL_KEYS)[number];

/**
 * Transpõe o texto completo da cifra de um tom para outro.
 * Preserva formatação (espaços, quebras de linha, alinhamento acorde/sílaba).
 */
export function transposeCifra(text: string, fromKey: string, toKey: string): string {
  if (!fromKey || !toKey || fromKey === toKey) return text;
  try {
    return chordTranspose(text).fromKey(fromKey).toKey(toKey).toString();
  } catch {
    return text; // Se falhar, retorna original sem quebrar
  }
}

/**
 * Calcula a diferença em semitons entre dois tons.
 * Positivo = subiu, negativo = desceu.
 */
export function getSemitonesDiff(fromKey: string, toKey: string): number {
  const fromIdx = getKeyIndex(fromKey);
  const toIdx = getKeyIndex(toKey);
  if (fromIdx === -1 || toIdx === -1) return 0;
  let diff = toIdx - fromIdx;
  if (diff > 6) diff -= 12;
  if (diff < -6) diff += 12;
  return diff;
}

/**
 * Calcula a posição do capotraste equivalente.
 * Se o tom desejado é mais alto que o original, o capotraste
 * permite tocar as mesmas formas de acorde do tom original.
 * Retorna 0 se não precisa de capotraste.
 */
export function getCapoPosition(originalKey: string, currentKey: string): number {
  const diff = getSemitonesDiff(originalKey, currentKey);
  if (diff <= 0) return 0;
  return diff; // Capotraste na casa = número de semitons acima
}

/**
 * Formata a diferença de semitons para exibição.
 * Ex: +3, -2, 0
 */
export function formatSemitones(diff: number): string {
  if (diff === 0) return '0';
  return diff > 0 ? `+${diff}` : `${diff}`;
}

function getKeyIndex(key: string): number {
  // Normalizar variações comuns
  const normalized = normalizeKey(key);
  return ALL_KEYS.indexOf(normalized as MusicalKey);
}

function normalizeKey(key: string): string {
  const map: Record<string, string> = {
    'C#': 'Db', 'D#': 'Eb', 'Gb': 'F#', 'G#': 'Ab', 'A#': 'Bb', 'Cb': 'B', 'Fb': 'E',
  };
  return map[key] ?? key;
}
