import { VAGALUME_API_KEY, VAGALUME_BASE_URL } from '../constants/keys';

export interface VagalumeSearchResult {
  id: string;
  title: string;
  artist: string;
  artistUrl: string;
  url: string;
}

export interface VagalumeLyrics {
  id: string;
  title: string;
  artist: string;
  text: string;
  translation?: string;
}

interface VagalumeArtMusResponse {
  response: { numFound: number; docs: Array<{ id: string; title: string; band: string; url: string }> };
}

interface VagalumeSearchResponse {
  type: string;
  art?: { id: string; name: string; url: string };
  mus?: Array<{ id: string; name: string; text: string; translate?: Array<{ text: string }> }>;
  badRequest?: boolean;
}

const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Busca músicas por nome/artista.
 * Endpoint: GET /search.artmus?q={query}&limit=10&apikey={key}
 */
export async function searchMusic(query: string, limit = 10): Promise<VagalumeSearchResult[]> {
  if (!query.trim()) return [];

  const url = `${VAGALUME_BASE_URL}/search.artmus?q=${encodeURIComponent(query)}&limit=${limit}&apikey=${VAGALUME_API_KEY}`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(`Vagalume API error: ${response.status}`);
  }

  const data: VagalumeArtMusResponse = await response.json();

  if (!data.response?.docs?.length) return [];

  return data.response.docs.map((doc) => {
    // URL format: /artista/musica.html — extract artist from URL
    const urlParts = doc.url?.replace(/^\//, '').split('/') ?? [];
    const artistSlug = urlParts[0] ?? '';
    const artistUrl = `${VAGALUME_BASE_URL}/${artistSlug}/`;

    return {
      id: doc.id,
      title: doc.title,
      artist: doc.band,
      artistUrl,
      url: doc.url,
    };
  });
}

/**
 * Busca letra de uma música por artista e título.
 * Endpoint: GET /search.php?art={artista}&mus={musica}&apikey={key}
 */
export async function getLyrics(artist: string, song: string): Promise<VagalumeLyrics | null> {
  const url = `${VAGALUME_BASE_URL}/search.php?art=${encodeURIComponent(artist)}&mus=${encodeURIComponent(song)}&apikey=${VAGALUME_API_KEY}`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(`Vagalume API error: ${response.status}`);
  }

  const data: VagalumeSearchResponse = await response.json();

  if (data.type === 'notfound' || data.badRequest || !data.mus?.length || !data.art) {
    return null;
  }

  const mus = data.mus[0];
  return {
    id: mus.id,
    title: mus.name,
    artist: data.art.name,
    text: mus.text,
    translation: mus.translate?.[0]?.text,
  };
}
