import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// ../backend/public/uploads/candidatos (download local — sem hotlink)
export const DEST_DIR = path.resolve(__dirname, '..', '..', 'backend', 'public', 'uploads', 'candidatos');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  Referer: 'https://g1.globo.com/',
};

/**
 * Baixa a foto original para o disco local. Retorna o caminho público (foto_local).
 * Usa fetch nativo (provado contra s2-g1.glbimg.com) em vez de page.request.
 */
export async function baixarFoto(_request, slug, fotoUrl) {
  if (!fotoUrl) return null;
  await mkdir(DEST_DIR, { recursive: true });
  const ext = fotoUrl.split('?')[0].match(/\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase() ?? 'jpeg';
  const arquivo = `${slug}.${ext === 'jpeg' ? 'jpeg' : ext}`;
  const destino = path.join(DEST_DIR, arquivo);

  try {
    const resp = await fetch(fotoUrl, { headers: HEADERS });
    if (!resp.ok) return null;
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length < 1000) return null;
    await writeFile(destino, buf);
    return `/uploads/candidatos/${arquivo}`;
  } catch {
    return null;
  }
}
