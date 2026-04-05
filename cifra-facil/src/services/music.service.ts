import { getCifra, type CifraData } from './cifras.service';
import { getCachedCifra, cacheCifra } from './cache.service';

/**
 * Orquestra busca de cifra: cache → cifras.com.br
 * Retorna cifra completa ou null se não encontrar.
 */
export async function fetchCifra(artistSlug: string, songSlug: string): Promise<CifraData | null> {
  // 1. Cache local
  const cached = await getCachedCifra(artistSlug, songSlug);
  if (cached) return cached;

  // 2. cifras.com.br (scraping)
  const cifra = await getCifra(artistSlug, songSlug);
  if (cifra) {
    await cacheCifra(artistSlug, songSlug, cifra);
    return cifra;
  }

  return null;
}
