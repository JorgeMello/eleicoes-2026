const INSTITUTOS = ['Datafolha', 'Quaest', 'AtlasIntel', 'Ipec', 'Paraná Pesquisas', 'Real Time Big Data', 'Futura', 'Ipespe', 'CNT', 'PoderData'];

const IGNORAR = /branco|nulo|nenhum|indecis|n[aã]o sabe|qualquer um|rejeita todos|n[aã]o votaria em nenhum|n[aã]o rejeita/i;

const MESES = {
  janeiro: '01', fevereiro: '02', marco: '03', março: '03', abril: '04', maio: '05', junho: '06',
  julho: '07', agosto: '08', setembro: '09', outubro: '10', novembro: '11', dezembro: '12',
};

/**
 * Extrai cenários de pesquisa do texto de uma matéria do G1.
 * Retorna [{ tipo, resultados: [{ nome, partido, percentual }] }] + metodologia.
 */
export async function coletarMateria(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);

  const bruto = await page.evaluate(() => ({
    titulo: document.title,
    texto: document.querySelector('article')?.innerText ?? document.body.innerText,
  }));

  const ano = (url.match(/\/noticia\/(\d{4})\//) || [])[1] ?? '2026';
  const { titulo, texto } = bruto;

  const instituto =
    INSTITUTOS.find((i) => new RegExp(i, 'i').test(titulo.slice(0, 120))) ??
    INSTITUTOS.find((i) => new RegExp(i, 'i').test(texto.slice(0, 600))) ??
    null;

  // Metodologia
  const amostraM = texto.match(/(?:ouviu|entrevistou)\s+([\d.]+)\s+pessoas/i);
  const amostra = amostraM ? parseInt(amostraM[1].replace(/\./g, ''), 10) : null;
  const margemM = texto.match(/margem de erro[^.\n]*?(\d+(?:[.,]\d+)?)\s*pontos?/i)
    ?? texto.match(/margem de erro[^.\n]*?(dois|tr[eê]s|quatro|cinco|um|uma)\s+pontos?/i);
  let margem_erro = margemM ? parseFloat(margemM[1].replace(',', '.')) : null;
  if (margemM && isNaN(margem_erro)) {
    margem_erro = { um: 1, uma: 1, dois: 2, tres: 3, três: 3, quatro: 4, cinco: 5 }[margemM[1].toLowerCase()] ?? null;
  }
  const regM = texto.match(/registr\w*\s+no TSE[^A-Z0-9]*([A-Z]{2}-\d+\/\d{4})/i)
    ?? texto.match(/sob o n[úu]mero\s+([A-Z]{2}-\d+\/\d{4})/i);
  const registro_tse = regM ? regM[1].toUpperCase() : null;

  let data_inicio = null;
  let data_fim = null;
  const dataM = texto.match(/entre os dias\s+(\d{1,2})\s+e\s+(\d{1,2})\s+de\s+([a-zç]+)/i);
  if (dataM) {
    const mes = MESES[dataM[3].toLowerCase()] ?? '01';
    data_inicio = `${ano}-${mes}-${dataM[1].padStart(2, '0')}`;
    data_fim = `${ano}-${mes}-${dataM[2].padStart(2, '0')}`;
  }

  // Cenários: percorre linhas; cabeçalho de cenário troca o tipo corrente.
  // No 2º turno, "A x B" abre sub-cenário (confronto) para não misturar simulações.
  const linhas = texto.split('\n').map((s) => s.trim()).filter(Boolean);
  const cenarios = [];
  let atual = null;
  const novoCenario = (tipo, confronto = null) => {
    atual = { tipo, confronto, resultados: [] };
    cenarios.push(atual);
  };

  for (const linha of linhas) {
    const cab = linha.match(/^(.*?)(1º turno|2º turno|segundo turno|rejei[çc][ãa]o|espont[âa]nea)/i);
    const pareceTitulo = linha.length < 80 || /:$/.test(linha)
      || /^(datafolha|quaest|atlas|ipese?c|índices?|números|veja|cenário|pesquisa)/i.test(linha);
    if (cab && pareceTitulo) {
      const t = cab[2].toLowerCase();
      const semM = linha.match(/sem\s+([A-Za-zÀ-ú. ]{3,40}?)\s*[:.]/);
      const confronto = semM ? `sem ${semM[1].trim()}` : null;
      novoCenario(t.includes('2') || t.includes('segundo') ? '2-turno' : t.includes('rejei') ? 'rejeicao' : t.includes('espont') ? 'espontanea' : '1-turno', confronto);
      continue;
    }
    const duelo = linha.match(/^([A-ZÀ-ú][A-Za-zÀ-ú. ]{2,50}?)\s+x\s+([A-ZÀ-ú][A-Za-zÀ-ú. ]{2,50})$/);
    if (duelo && atual && atual.tipo === '2-turno') {
      novoCenario('2-turno', `${duelo[1].trim()} x ${duelo[2].trim()}`);
      continue;
    }
    const m = linha.match(/^(.+?)\s*\(([A-Za-zÇÃÕÉçãõé]{2,15})\)\s*:\s*(\d+)\s*%?(?:\s|$)/)
      ?? linha.match(/^(.+?)\s*:\s*([A-Za-zÇÃÕÉçãõé]{2,15})\s*:\s*(\d+)\s*%?(?:\s|$)/);
    if (m && atual && !IGNORAR.test(m[1]) && m[1].length < 80) {
      atual.resultados.push({ nome: m[1].trim(), partido: m[2].toUpperCase(), percentual: parseInt(m[3], 10) });
    }
  }

  const validos = cenarios.filter((c) => c.resultados.length > 0);

  return {
    instituto,
    cargo: 'presidente',
    uf: 'BR',
    data_inicio,
    data_fim,
    margem_erro,
    amostra,
    registro_tse,
    fonte_url: url,
    cenarios: validos,
    confianca: {
      instituto: !!instituto,
      registro: !!registro_tse,
      metodologia: amostra !== null && margem_erro !== null,
    },
    coletado_em: new Date().toISOString(),
  };
}
