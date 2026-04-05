import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CifraData } from './cifras.service';

const CACHE_PREFIX = 'cifra:';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

interface CacheEntry {
  data: CifraData;
  timestamp: number;
}

export async function getCachedCifra(artistSlug: string, songSlug: string): Promise<CifraData | null> {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${artistSlug}:${songSlug}`);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > TTL_MS) return null;
    return { ...entry.data, source: 'cache' };
  } catch {
    return null;
  }
}

export async function cacheCifra(artistSlug: string, songSlug: string, data: CifraData): Promise<void> {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(`${CACHE_PREFIX}${artistSlug}:${songSlug}`, JSON.stringify(entry));
  } catch {
    // Silently fail — cache is best-effort
  }
}
