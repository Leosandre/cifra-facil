import * as Print from 'expo-print';

interface PdfParams {
  artist: string;
  song: string;
  content: string;
  originalKey: string;
  currentKey: string;
}

/**
 * Gera PDF a partir da cifra transposta. Retorna URI do arquivo temporário.
 */
export async function generatePdf(params: PdfParams): Promise<string> {
  const html = buildHtml(params);
  const { uri } = await Print.printToFileAsync({ html, width: 595, height: 842 }); // A4
  return uri;
}

function buildHtml({ artist, song, content, originalKey, currentKey }: PdfParams): string {
  const escapedContent = escapeHtml(content);
  const keyInfo = originalKey && currentKey !== originalKey
    ? `${currentKey} (original: ${originalKey})`
    : currentKey || originalKey || '—';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @page { margin: 15mm 20mm; size: A4; }
  body { font-family: 'Courier New', monospace; font-size: 14pt; line-height: 1.5; color: #1a1a1a; margin: 0; }
  .header { border-bottom: 2px solid #6c5ce7; padding-bottom: 10px; margin-bottom: 16px; }
  .header h1 { font-size: 18pt; margin: 0 0 2px; color: #1a1a2e; }
  .header h2 { font-size: 13pt; margin: 0 0 4px; color: #636e72; font-weight: normal; }
  .header .key { font-size: 12pt; color: #6c5ce7; font-weight: bold; }
  pre { white-space: pre-wrap; word-wrap: break-word; font-family: 'Courier New', monospace; font-size: 14pt; line-height: 1.5; margin: 0; }
  .footer { border-top: 1px solid #ddd; padding-top: 8px; margin-top: 20px; font-size: 9pt; color: #999; text-align: center; }
</style></head><body>
  <div class="header">
    <h2>${escapeHtml(artist)}</h2>
    <h1>${escapeHtml(song)}</h1>
    <span class="key">Tom: ${escapeHtml(keyInfo)}</span>
  </div>
  <pre>${escapedContent}</pre>
  <div class="footer">Gerado por CifraFácil • cifras.com.br</div>
</body></html>`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
