import {
  getInfoAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
  moveAsync,
  deleteAsync,
} from 'expo-file-system/legacy';
import { Paths } from 'expo-file-system/next';
import { Platform } from 'react-native';
import { buildArtistFolder, buildPdfFilename } from './sanitize';

// Paths.document funciona em native; fallback para web
const DOC_DIR = Platform.OS === 'web' ? 'file:///tmp/' : Paths.document.uri + '/';
const BASE_DIR = DOC_DIR + 'CifraFacil/';

async function ensureBaseDir(): Promise<void> {
  if (Platform.OS === 'web') return; // filesystem não funciona na web
  const info = await getInfoAsync(BASE_DIR);
  if (!info.exists) await makeDirectoryAsync(BASE_DIR, { intermediates: true });
}

export async function listArtistFolders(): Promise<{ name: string; count: number }[]> {
  if (Platform.OS === 'web') return [];
  await ensureBaseDir();
  const entries = await readDirectoryAsync(BASE_DIR);
  const folders: { name: string; count: number }[] = [];
  for (const entry of entries) {
    const info = await getInfoAsync(BASE_DIR + entry);
    if (info.isDirectory) {
      const files = await readDirectoryAsync(BASE_DIR + entry);
      folders.push({ name: entry, count: files.filter((f) => f.endsWith('.pdf')).length });
    }
  }
  return folders.sort((a, b) => a.name.localeCompare(b.name));
}

export async function listPdfs(artistFolder: string): Promise<string[]> {
  if (Platform.OS === 'web') return [];
  const dir = BASE_DIR + artistFolder + '/';
  const info = await getInfoAsync(dir);
  if (!info.exists) return [];
  const files = await readDirectoryAsync(dir);
  return files.filter((f) => f.endsWith('.pdf')).sort();
}

export async function folderExists(artist: string): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const info = await getInfoAsync(BASE_DIR + buildArtistFolder(artist) + '/');
  return info.exists;
}

export async function fileExists(artistFolder: string, filename: string): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const info = await getInfoAsync(BASE_DIR + artistFolder + '/' + filename);
  return info.exists;
}

export async function savePdf(
  tempUri: string, artist: string, song: string, key: string, keepBoth: boolean = false
): Promise<string> {
  const folder = buildArtistFolder(artist);
  const dir = BASE_DIR + folder + '/';
  await makeDirectoryAsync(dir, { intermediates: true });

  let filename = buildPdfFilename(artist, song, key);
  if (keepBoth) {
    let counter = 1;
    while (await fileExists(folder, filename)) {
      filename = buildPdfFilename(artist, song, `${key} (${counter})`);
      counter++;
    }
  }

  const destPath = dir + filename;
  await moveAsync({ from: tempUri, to: destPath });
  return destPath;
}

export async function deletePdf(artistFolder: string, filename: string): Promise<void> {
  await deleteAsync(BASE_DIR + artistFolder + '/' + filename, { idempotent: true });
}

export function getPdfUri(artistFolder: string, filename: string): string {
  return BASE_DIR + artistFolder + '/' + filename;
}
