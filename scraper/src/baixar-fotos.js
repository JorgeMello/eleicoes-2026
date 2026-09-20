import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { baixarFoto } from './fotos.js';

// Rebaixa fotos a partir de out/candidatos.json sem re-raspar o G1.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'out', 'candidatos.json');

const dados = JSON.parse(await readFile(OUT, 'utf8'));
let ok = 0;
for (const c of dados) {
  const local = await baixarFoto(null, c.slug, c.foto_url_original);
  c.foto_local = local;
  console.log(`${c.slug}: ${local ?? 'FALHOU'}`);
  if (local) ok++;
}
await writeFile(OUT, JSON.stringify(dados, null, 2));
console.log(`Fotos OK: ${ok}/${dados.length}`);
