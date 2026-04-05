/**
 * Sanitiza nomes de artistas/músicas para uso seguro no filesystem.
 * Mantém legibilidade enquanto remove caracteres problemáticos.
 */
export function sanitizeForFilesystem(name: string): string {
  return name
    .replace(/[\/\\:*?"<>|]/g, '') // Remove caracteres proibidos em filesystems
    .replace(/\s+/g, ' ')          // Normaliza espaços múltiplos
    .trim();
}

/**
 * Gera o nome do arquivo PDF seguindo a convenção:
 * "{Artista} - {Música} (Tom {X}).pdf"
 */
export function buildPdfFilename(artist: string, song: string, key: string): string {
  const safeArtist = sanitizeForFilesystem(artist);
  const safeSong = sanitizeForFilesystem(song);
  return `${safeArtist} - ${safeSong} (Tom ${key}).pdf`;
}

/**
 * Gera nome de pasta sanitizado para o artista.
 */
export function buildArtistFolder(artist: string): string {
  return sanitizeForFilesystem(artist);
}
