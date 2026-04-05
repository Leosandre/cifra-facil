import { CIFRAS_API_URL, CIFRAS_BASE_URL } from '../constants/keys';
import { CIFRAS_SELECTORS, CHORDS_KEY_REGEX } from '../constants/selectors';
import { Platform } from 'react-native';
import * as cheerio from 'cheerio';

export interface CifrasSearchResult {
  id: string;
  title: string;
  artist: string;
  artistSlug: string;
  songSlug: string;
  avatar: string;
}

export interface CifraData {
  artist: string;
  song: string;
  content: string;
  originalKey: string;
  source: 'cifras' | 'cache';
  lyricsOnly: boolean;
}

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
};
const TIMEOUT_MS = 15000;

async function fetchWithTimeout(url: string, headers: Record<string, string> = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal, headers });
  } finally {
    clearTimeout(timer);
  }
}

// Proxy CORS para testes na web (não necessário em native)
function proxyUrl(url: string): string {
  if (Platform.OS === 'web') return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  return url;
}

/**
 * Busca músicas via API JSON pública do cifras.com.br
 */
export async function searchCifras(query: string): Promise<CifrasSearchResult[]> {
  if (!query.trim()) return [];

  const url = proxyUrl(`${CIFRAS_API_URL}/search?q=${encodeURIComponent(query)}`);
  const response = await fetchWithTimeout(url, HEADERS);
  if (!response.ok) throw new Error(`Search error: ${response.status}`);

  const data = await response.json();
  const songs: any[] = data?.songs ?? [];

  return songs.map((s) => ({
    id: String(s.ID_MUSICA),
    title: s.TITULO,
    artist: s.ARTISTA,
    artistSlug: s.COD_ARTISTA,
    songSlug: s.COD_TITULO,
    avatar: s.AVATAR ?? '',
  }));
}

/**
 * Busca cifra completa via scraping do HTML do cifras.com.br
 * URL: /cifra/{artista}/{musica}
 */
export async function getCifra(artistSlug: string, songSlug: string): Promise<CifraData | null> {
  const url = proxyUrl(`${CIFRAS_BASE_URL}/cifra/${artistSlug}/${songSlug}`);
  const response = await fetchWithTimeout(url, HEADERS);

  if (!response.ok) return null;

  const html = await response.text();
  const $ = cheerio.load(html);

  const preElement = $(CIFRAS_SELECTORS.cifraContent);
  if (!preElement.length) return null;

  // Extrair texto: <span data-chord="X"> vira texto puro, <B> vira texto puro
  const content = extractCifraText($, preElement);
  if (!content.trim()) return null;

  const artist = $(CIFRAS_SELECTORS.artistName).first().text().trim();
  const song = $(CIFRAS_SELECTORS.songName).first().text().trim();

  // Tom original: extrair do JS inline
  const keyMatch = html.match(CHORDS_KEY_REGEX);
  const originalKey = keyMatch?.[1] ?? '';

  return { artist: artist || artistSlug, song: song || songSlug, content, originalKey, source: 'cifras', lyricsOnly: false };
}

function extractCifraText($: cheerio.CheerioAPI, preElement: cheerio.Cheerio<any>): string {
  const clone = preElement.clone();
  // <span data-chord="X"> → texto do acorde
  clone.find('span[data-chord]').each((_, el) => {
    $(el).replaceWith($(el).text());
  });
  // <B> tags (seções como [Intro], [Refrão]) → texto puro
  clone.find('b, B').each((_, el) => {
    $(el).replaceWith($(el).text());
  });
  // Remover divs de tablatura (accordion-tabs)
  clone.find('.tabs, .component-tabs').remove();
  // Remover links
  clone.find('a').each((_, el) => {
    $(el).replaceWith($(el).text());
  });
  return clone.text().replace(/\r/g, '\n');
}
