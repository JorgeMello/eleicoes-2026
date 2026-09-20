/**
 * Camada TSE (fonte oficial de VALORES).
 *
 * Estratégia: o G1 republica o TSE, então os textos/slugs/fotos vêm do G1
 * e os números (bens com valor, receitas, despesas) são enriquecidos aqui.
 *
 * Endpoints DivulgaCandContas variam por eleição; este módulo tenta os
 * padrões conhecidos e retorna `null` gracefully quando indisponível,
 * sem quebrar a coleta G1.
 *
 * Referência: https://divulgacandcontas.tse.jus.br/divulga/rest/v2/
 */

const TSE_BASES = [
  'https://divulgacandcontas.tse.jus.br/divulga/rest/v2',
  'https://divulgacandcontas.tse.jus.br/divulga/rest/v1',
];

/** Tenta buscar candidato por nome de urna na API TSE. Retorna objeto parcial ou null. */
export async function enriquecerViaTSE(request, candidato) {
  for (const base of TSE_BASES) {
    try {
      // Candidatura BR presidente 2026: eleição 280 (código pode variar — validar no README)
      const url = `${base}/candidatura/listar/2026/BR/1/1`;
      const resp = await request.get(url, { timeout: 20000 });
      if (!resp.ok()) continue;
      const data = await resp.json();
      const lista = data?.candidatos ?? data ?? [];
      const achado = Array.isArray(lista)
        ? lista.find((c) =>
            (c.nomeUrna || c.nome_urna || '').toLowerCase().includes((candidato.nome || '').toLowerCase().split(' ')[0])
          )
        : null;
      if (achado) {
        return {
          tse_encontrado: true,
          tse_base: base,
          nome_completo: achado.nomeCompleto ?? achado.nome_completo ?? null,
          genero: achado.descricaoSexo ?? achado.genero ?? null,
          patrimonio_total: achado.totalBens ?? achado.patrimonio ?? null,
          tse_id: achado.id ?? achado.sqCandidato ?? null,
        };
      }
      return { tse_encontrado: false, tse_base: base };
    } catch {
      continue;
    }
  }
  return { tse_encontrado: false, tse_base: null };
}
