/**
 * Extrai o perfil completo de um candidato no G1.
 * Campos G1 (slugs/fotos/textos) + placeholders numéricos que a etapa TSE preenche.
 */
export async function coletarPerfil(page, item) {
  await page.goto(item.perfil_g1_url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);

  const dados = await page.evaluate(() => {
    const txt = (sel) => document.querySelector(sel)?.innerText?.replace(/\s+/g, ' ').trim() ?? null;
    const todos = (sel) => [...document.querySelectorAll(sel)].map((el) => el.innerText?.replace(/\s+/g, ' ').trim());

    const body = document.body.innerText || '';
    const getCampo = (rotulo) => {
      const m = body.match(new RegExp(rotulo + '\\s*\\n?\\s*([^\\n]+)', 'i'));
      return m ? m[1].trim() : null;
    };

    // Nome principal (h2 — h1 é o título da seção "Dados do candidato") + partido/número no <main>
    const mainTxt = document.querySelector('main')?.innerText || '';
    const escopo = mainTxt.length > 200 ? mainTxt : body;
    const nome = txt('main h2') || txt('h2');
    const partidoNum = escopo.match(/([A-ZÇÃÕÉ]{2,15})\s*(\d{1,3})/);
    const plano = document.querySelector('a[href*="divulgacandcontas"]')?.href ?? null;

    // Histórico: linhas "2022 Presidente PT Eleito"
    const historico = [];
    const histBloco = [...document.querySelectorAll('*')].find((el) =>
      /Candidaturas anteriores/i.test(el.innerText || '')
    );
    const histTxt = histBloco ? histBloco.innerText : '';
    const re = /(\d{4})\s+([A-Za-zÀ-ú .]+?)\s+([A-ZÇÃÕÉ]{2,15})\s+(Eleito|Eleita|Não eleito|Não eleita|Inapto|Inapta|Suplente|2º turno|1º turno)/g;
    let mh;
    while ((mh = re.exec(histTxt)) !== null) {
      historico.push({ ano: parseInt(mh[1], 10), cargo: mh[2].trim(), partido: mh[3].trim(), resultado: mh[4].trim() });
    }

    // Bens: somente <li> dentro da seção "Lista de bens" (evita menus/rodapé)
    const tituloBens = [...document.querySelectorAll('h1,h2,h3,h4,strong,b')].find((el) =>
      /^\s*Lista de bens\s*$/i.test(el.innerText || '')
    );
    const secaoBens = tituloBens
      ? (tituloBens.closest('section') || tituloBens.parentElement?.parentElement || document)
      : document;
    const bensLis = [...secaoBens.querySelectorAll('li')]
      .map((li) => li.innerText?.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .filter((t) => t.length > 3 && t.length < 300 && !/Ver perfil|Ver mais|Destaques|Pesquisas/i.test(t));

    // Vice
    let vice_nome = null;
    let vice_partido = null;
    const viceM = body.match(/Vice-presidente\s+([A-Za-zÀ-ú .]+?)\s+([A-ZÇÃÕÉ]{2,15})/);
    if (viceM) {
      vice_nome = viceM[1].trim();
      vice_partido = viceM[2].trim();
    }

    // Rankings: bloco "Nome [quebra] CNPJ/CPF [quebra] R$ valor (pct%)"
    const ranking = (titulo) => {
      const out = [];
      const idx = body.indexOf(titulo);
      const trecho = idx >= 0 ? body.slice(idx, idx + 6000) : body;
      const re2 = /([\s\S]+?)\s*R\$\s*[\d.,]+\s*\((\d+(?:[.,]\d+)?)%\)/g;
      let m2;
      while ((m2 = re2.exec(trecho)) !== null) {
        const linhas = m2[1]
          .split('\n').map((s) => s.trim()).filter(Boolean)
          .filter((l) => !/^(CNPJ|CPF)\b/i.test(l) && !/^R\$/i.test(l) && !/ranking|ordenar|maior valor|menor valor/i.test(l));
        const nome = (linhas.pop() || '').replace(/\|+$/, '').trim();
        if (nome.length < 3) continue;
        out.push({ nome, percentual: parseFloat(m2[2].replace(',', '.')) });
      }
      return out.slice(0, 15);
    };

    // Foto do candidato: DIV com background-image (200x200) dentro do <main>
    const bgDiv = [...document.querySelectorAll('main [style*="background"]')].find((el) =>
      /internal_photos/.test(el.style?.backgroundImage || '')
    );
    const bgUrl = (bgDiv?.style?.backgroundImage || '').match(/url\("?(.+?)"?\)\s*$/)?.[1] ?? null;
    const foto = bgUrl
      ?? document.querySelector('img[src*="internal_photos"]')?.src
      ?? document.querySelector('img[srcset*="internal_photos"]')?.srcset?.split(' ')?.[0]
      ?? [...document.querySelectorAll('main img')].find((i) => (i.alt || '').length > 2)?.src
      ?? document.querySelector('main img[src*="glbimg"]')?.src
      ?? null;

    const atualizado = (body.match(/Atualizado às?\s*([0-9/\s:h]+)/i) || [])[1]?.trim()
      ?? (escopo.match(/(\d{2}\/\d{2}\/\d{4}[^\\n]{0,30})/) || [])[1]?.trim()
      ?? null;

    const parseReal = (s) => {
      if (!s) return null;
      const m = s.match(/R\$\s*([\d.,]+)/);
      if (!m) return null;
      return parseFloat(m[1].replace(/\./g, '').replace(',', '.'));
    };
    const receitas_total = parseReal((body.match(/Receitas\s*R\$[^\n]+/i) || [])[0]);
    const despesas_total = parseReal((body.match(/Total de despesas\s*R\$[^\n]+/i) || [])[0]);
    const limite_gastos = parseReal((body.match(/Limite de gastos\s*R\$[^\n]+/i) || [])[0]);

    return {
      nome_pagina: nome,
      partido_pagina: partidoNum ? partidoNum[1] : null,
      numero_pagina: partidoNum ? parseInt(partidoNum[2], 10) : null,
      profissao: getCampo('Profiss[ãa]o'),
      cor_etnia: getCampo('Etnia') || getCampo('Cor'),
      grau_instrucao: getCampo('Grau de instru[çc][ãa]o'),
      plano_governo_url: plano,
      foto_url_original: foto,
      historico,
      bens_brutos: bensLis.slice(0, 60),
      vice_nome,
      vice_partido,
      receitas_total,
      despesas_total,
      limite_gastos,
      doadores: ranking('Ranking de doadores'),
      gastos: ranking('Ranking de gastos'),
      fonte_atualizado_em: atualizado,
    };
  });

  // Normaliza bens: "Tipo R$ 94.571,25 descricao" -> { tipo, descricao, valor }
  const bens = (dados.bens_brutos || []).map((t) => {
    const vm = t.match(/R\$\s*([\d.,]+)/);
    const valor = vm ? parseFloat(vm[1].replace(/\./g, '').replace(',', '.')) : null;
    const semValor = t.replace(/R\$\s*[\d.,]+/, '').replace(/\s+/g, ' ').trim();
    const partes = semValor.split(/(?<=[a-z)])\s+(?=[A-Z0-9])| — | - /);
    const tipo = (partes[0] || t).slice(0, 120);
    return { tipo, descricao: semValor || t, valor };
  });
  const patrimonio_total = bens.reduce((s, b) => s + (b.valor || 0), 0) || null;

  return {
    slug: item.slug,
    nome: dados.nome_pagina || item.nome_sugerido || item.slug,
    partido: dados.partido_pagina || item.partido_sugerido || null,
    numero: dados.numero_pagina ?? item.numero ?? null,
    cargo: 'presidente',
    uf: 'BR',
    foto_url_original: dados.foto_url_original || item.foto_url_original || null,
    perfil_g1_url: item.perfil_g1_url,
    profissao: dados.profissao,
    cor_etnia: dados.cor_etnia,
    grau_instrucao: dados.grau_instrucao,
    plano_governo_url: dados.plano_governo_url,
    vice_nome: dados.vice_nome,
    vice_partido: dados.vice_partido,
    patrimonio_total, // soma dos bens (G1); TSE pode refinar via enriquecimento
    receitas_total: dados.receitas_total,
    despesas_total: dados.despesas_total,
    limite_gastos: dados.limite_gastos,
    fonte_atualizado_em: dados.fonte_atualizado_em,
    bens,
    historico: dados.historico,
    doadores: dados.doadores,
    gastos: dados.gastos,
    raw: dados,
  };
}
