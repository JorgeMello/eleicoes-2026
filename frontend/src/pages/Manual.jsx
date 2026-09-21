import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Manual() {
  const [secaoAtiva, setSecaoAtiva] = useState('passo-a-passo');

  const abas = [
    { id: 'passo-a-passo', rotulo: 'Passo a Passo dos Módulos', icone: '🧭' },
    { id: 'alta-volumetria', rotulo: 'Alta Performance & Paginação', icone: '⚡' },
    { id: 'auditoria-tse', rotulo: 'Auditoria & Dados do TSE', icone: '🛡️' },
    { id: 'filtros-insights', rotulo: 'Engenharia de Filtros', icone: '🔍' },
    { id: 'dicas-ouro', rotulo: 'Dicas de Ouro & Insights', icone: '💡' },
    { id: 'legislacao', rotulo: 'Regras Eleitorais & CF/88', icone: '⚖️' },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Manual */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              📖 Guia Completo de Inteligência Eleitoral & Transparência Cívica
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-slate-900 dark:text-white">
              Manual do Usuário · Eleições 2026
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Guia oficial para dominar todas as ferramentas da plataforma: catálogo nacional dos 5 cargos
              em disputa, paginação de alta performance, auditoria de 69.700+ bens do TSE (~R$ 24,8 bilhões),
              filtros sociodemográficos, comparador federativo e inteligência contábil de campanha.
            </p>
          </div>

          {/* Atalhos Rápidos para os Módulos */}
          <div className="flex flex-wrap gap-1.5 text-xs shrink-0 max-w-md">
            <Link
              to="/presidente"
              className="rounded-lg bg-emerald-600 px-2.5 py-1.5 font-semibold text-white hover:bg-emerald-500 shadow-2xs transition"
            >
              Presidente
            </Link>
            <Link
              to="/governador"
              className="rounded-lg bg-slate-800 px-2.5 py-1.5 font-semibold text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
            >
              Governador
            </Link>
            <Link
              to="/senador"
              className="rounded-lg bg-slate-800 px-2.5 py-1.5 font-semibold text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
            >
              Senador
            </Link>
            <Link
              to="/deputado-federal"
              className="rounded-lg bg-blue-600 px-2.5 py-1.5 font-semibold text-white hover:bg-blue-500 shadow-2xs transition"
            >
              Dep. Federal
            </Link>
            <Link
              to="/deputado-estadual"
              className="rounded-lg bg-indigo-600 px-2.5 py-1.5 font-semibold text-white hover:bg-indigo-500 shadow-2xs transition"
            >
              Dep. Estadual
            </Link>
            <Link
              to="/presidente/rankings"
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              Rankings
            </Link>
            <Link
              to="/presidente/comparar"
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              Comparador
            </Link>
          </div>
        </div>

        {/* Abas de Navegação Interna */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-800">
          {abas.map((a) => (
            <button
              key={a.id}
              onClick={() => setSecaoAtiva(a.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                secaoAtiva === a.id
                  ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                  : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <span>{a.icone}</span>
              <span>{a.rotulo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SEÇÃO 1: PASSO A PASSO DOS MÓDULOS */}
      {secaoAtiva === 'passo-a-passo' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Módulo 1: Catálogo Nacional dos 5 Cargos */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold">Catálogo Nacional dos 5 Cargos</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">19.088 candidaturas em 27 UFs</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Cobertura Completa:</strong> Acesse Presidente (13), Governador (192), Senador (308), Deputado Federal (7.393) e Deputado Estadual/Distrital (11.182).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Cards Padrão Ouro:</strong> Foto oficial preservada, partido, número de urna (2 a 5 dígitos), cargo, estado, profissão e grau de instrução declarados.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Selo Verificado TSE:</strong> Etiqueta esmeralda indicando deferimento jurídico formal junto ao sistema DivulgaCandContas da Justiça Eleitoral.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Bancadas Constitucionais:</strong> O seletor de estados exibe a quantidade exata de vagas parlamentares de cada unidade federativa.</span>
                </li>
              </ul>
            </div>

            {/* Módulo 2: Comparador Federativo */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                  2
                </span>
                <div>
                  <h2 className="text-base font-bold">Comparador Triplo Federativo</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Confronto direto de até 3 candidatos</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Rigor Federativo:</strong> Para cargos estaduais e distritais, a plataforma assegura a comparação exclusiva entre candidatos que disputam a mesma UF.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Gráficos Comparativos:</strong> Barras comparativas de patrimônio declarado, receitas arrecadadas e despesas contratadas formatadas em Reais.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Matriz de Critérios:</strong> Tabela detalhada com profissão, grau de instrução, idade, partido e percentuais de concentração de recursos.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Síntese em Palavras:</strong> Assistente contextual que explica em linguagem natural quem lidera cada métrica e a proporção da diferença.</span>
                </li>
              </ul>
            </div>

            {/* Módulo 3: Rankings Analíticos em 4 Quadrantes */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold">Rankings em 4 Quadrantes por Estado</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Patrimônio, Receitas, Gastos e Doadores</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">●</span>
                  <span><strong>Maior Patrimônio Declarado:</strong> Os maiores patrimônios pessoais informados ao TSE em cada cargo e estado.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">●</span>
                  <span><strong>Maiores Receitas:</strong> Campanhas que mais arrecadaram recursos públicos (FEFC/Fundo Partidário) e doações privadas.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 font-bold">●</span>
                  <span><strong>Maiores Despesas:</strong> Candidaturas com maior volume de gastos operacionais e contratos executados.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">●</span>
                  <span><strong>Maiores Doadores:</strong> Identificação das principais legendas e pessoas físicas financiadoras da disputa.</span>
                </li>
              </ul>
            </div>

            {/* Módulo 4: Perfil Completo do Candidato */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 font-bold text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                  4
                </span>
                <div>
                  <h2 className="text-base font-bold">Perfil Cívico & Auditoria Pessoal</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dossiê transparente do postulante</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Dados Pessoais:</strong> Profissão, cor/etnia autodeclarada, grau de instrução e gênero oficial.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Bens Auditados:</strong> Lista item a item dos bens do candidato com ordenação por valor declaratório.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Controle de Fornecedores & Doadores:</strong> Cruzamento de percentuais de repasse e gastos contratados.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Chapa & Suplências:</strong> Visualização da composição majoritária (Vice) ou dos dois suplentes ao Senado.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Destaque: Controle de Dados de Empresas */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-800/80 dark:bg-blue-950/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏢</span>
              <div>
                <h3 className="font-bold text-base text-blue-950 dark:text-blue-200">
                  Recurso Especial: Auditoria Cadastral de Empresas Fornecedoras
                </h3>
                <p className="mt-1 text-sm text-blue-900/90 dark:text-blue-300 leading-relaxed">
                  Na aba <strong>Contas</strong> do perfil de qualquer candidato, clique sobre o nome de qualquer empresa fornecedora.
                  A plataforma consulta a base cadastral oficial da Receita Federal exibindo CNPJ, Razão Social, CNAE principal de atividade,
                  situação perante o fisco e o quadro societário (QSA), permitindo rastrear possíveis conflitos de interesse e triangulações contratuais.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 2: ALTA PERFORMANCE & PAGINAÇÃO OURO */}
      {secaoAtiva === 'alta-volumetria' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-blue-50/50 to-white p-6 dark:border-indigo-800/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm dark:bg-indigo-500 text-lg">
                ⚡
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Arquitetura de Alta Performance & Paginação Padrão Ouro
                </h2>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  Como a plataforma processa fluidamente mais de 18.500 deputados sem travamento de navegador
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Com mais de 11.000 deputados estaduais e 7.300 deputados federais distribuídos pelo país — incluindo colégios eleitorais
              gigantescos como São Paulo, que possui mais de 1.350 candidatos —, implementamos a especificação normativa do
              <strong> Padrão Ouro de Paginação</strong> (Doc 87), garantindo navegação instantânea, consumo reduzido de dados móveis e estabilidade total de memória.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔄</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Rolagem Contínua Inteligente</h3>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Utiliza a API nativa <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">IntersectionObserver</code> com
                sentinela de 300px antes do rodapé. Conforme você rola a página, o próximo lote de 30 candidatos é carregado de forma transparente e imperceptível.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔘</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Botão de Apoio Acessível</h3>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Abaixo dos cards, um botão com contagem contextual em padrão brasileiro (ex.: <em>"Carregar mais 30 candidatos (30 de 1.355)"</em>)
                oferece controle deliberado para navegação via teclado, leitores de tela e conexões móveis lentas.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏁</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Feedback de Conclusão</h3>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Ao alcançar o último registro da bancada, a plataforma exibe um badge elegante confirmando que 100% dos candidatos
                daquele estado e cargo foram visualizados, eliminando a incerteza de dados pendentes.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>🚀 Cache e Otimizações de Rede do Backend</span>
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              O backend CodeIgniter 4 responde com headers de performance <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">Cache-Control: public, max-age=180, stale-while-revalidate=300</code> e
              geração de <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">ETag</code> baseada no conteúdo, reduzindo em mais de 90% a latência das requisições subsequentes.
            </p>
          </div>
        </div>
      )}

      {/* SEÇÃO 3: AUDITORIA OFICIAL DO TSE & DADOS PESSOAIS */}
      {secaoAtiva === 'auditoria-tse' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-6 dark:border-emerald-800/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm dark:bg-emerald-500 text-lg">
                🛡️
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Auditoria Oficial do TSE & Dados Pessoais
                </h2>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  Como a plataforma audita, reconcilia e certifica os dados fiscais e patrimoniais com a Justiça Eleitoral (DivulgaCandContas)
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Todas as 19.088 candidaturas passam por um rigoroso pipeline de reconciliação contábil em conformidade com as resoluções vigentes do Tribunal Superior Eleitoral.
              Ao navegar pela aplicação, o cidadão conta com indicadores claros para verificar a legalidade, o patrimônio e a consistência das contas de campanha.
            </p>
          </div>

          {/* Grid dos Pilares da Auditoria */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Pilar 1: Selo Verificado TSE */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">O Selo "Verificado TSE · Deferido"</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Certificação nos cards e no perfil</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A etiqueta verde posicionada nos cards e no perfil atesta que a candidatura possui registro formal homologado junto ao sistema DivulgaCandContas do TSE, com certidões validadas e dados públicos conferidos.
              </p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">O que a etiqueta valida:</span>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                  <li>Registro deferido perante a Justiça Eleitoral.</li>
                  <li>Inscrição ativa no CNPJ Eleitoral da Receita Federal.</li>
                  <li>Protocolo autêntico do Plano de Governo (para cargos do Executivo).</li>
                </ul>
              </div>
            </div>

            {/* Pilar 2: Auditoria Matemática de Bens */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  ⚖️
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Patrimônio Nacional: 69.700+ Bens Catalogados</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">R$ 24,8 bilhões em patrimônio público declarado</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A base de dados abriga mais de 69.700 itens declarados: imóveis, empresas, cotas de capital, veículos e aplicações financeiras.
                O motor soma cada bem individual e audita a equivalência exata com o patrimônio consolidado.
              </p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                <span className="font-semibold text-blue-700 dark:text-blue-400">Transparência Integral:</span>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Candidatos com declaração de R$ 0,00 declaram formalmente não possuir bens em seu nome à época do registro, enquanto declarações de grande porte permitem acompanhar a evolução econômica do homem público.
                </p>
              </div>
            </div>

            {/* Pilar 3: Perfil Sociodemográfico & Dados Pessoais */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  👤
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Dados Pessoais & Representatividade</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Profissão, Cor/Etnia, Instrução e Gênero</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Cada candidato traz em seu card e perfil os dados sociodemográficos oficiais declarados:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                <li><strong>Profissão:</strong> Carreira profissional de origem ou ocupação atual.</li>
                <li><strong>Cor/Etnia:</strong> Autodeclaração para auditoria de representatividade e cotas.</li>
                <li><strong>Grau de Instrução:</strong> Escolaridade declarada (Ensino Fundamental ao Superior).</li>
                <li><strong>Gênero:</strong> Mapeamento do perfil de gênero nas bancadas.</li>
              </ul>
            </div>

            {/* Pilar 4: Teto Legal de Gastos de Campanha */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  💰
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Fiscalização do Teto Legal de Gastos</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Limites fixados pela Justiça Eleitoral</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                O TSE fixa tetos estritos de despesas para cada cargo e unidade federativa (ex.: R$ 88,9 mi para Presidente no 1º turno;
                limites específicos por estado para Governador, Senador, Dep. Federal e Dep. Estadual).
                A extrapolação sujeita a campanha a multa equivalente a 100% do excedente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 4: ENGENHARIA DE FILTROS & BUSCA EFICIENTE */}
      {secaoAtiva === 'filtros-insights' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Como Dominar os Filtros para Encontrar Padrões Ocultos
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              A barra de filtros permite combinações simultâneas. Veja as estratégias mais eficazes:
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Filtro Geográfico & Bancadas</span>
                <h3 className="mt-1 font-semibold text-sm">Seleção de Estado (27 UFs)</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Para Governador, Senador, Deputado Federal e Deputado Estadual, selecione o estado para filtrar instantaneamente candidatos, comparações e rankings daquela bancada.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Filtro Socioeconômico</span>
                <h3 className="mt-1 font-semibold text-sm">Patrimônio Mínimo e Máximo</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Defina faixas patrimoniais (ex.: a partir de R$ 5.000.000 ou até R$ 100.000) para isolar perfis de alta renda ou candidaturas de perfil popular.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Diversidade e Perfil</span>
                <h3 className="mt-1 font-semibold text-sm">Cor/Etnia & Instrução</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Filtre por autodeclaração de cor/etnia e nível de escolaridade para auditar o cumprimento de cotas financeiras de partidos e a representatividade de grupos sociais no poder.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Alinhamento Partidário</span>
                <h3 className="mt-1 font-semibold text-sm">Partido & Federações</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Isole uma única sigla partidária para verificar a distribuição interna de recursos: o partido está concentrando todo o Fundo Eleitoral em um único nome ou pulverizando a verba?
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Busca Textual Instantânea</span>
                <h3 className="mt-1 font-semibold text-sm">Busca por Nome ou Número</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Digite parte do nome do candidato ou os dígitos de urna (2 dígitos para Presidente/Governador, 3 para Senador, 4 para Dep. Federal, 5 para Dep. Estadual) para filtragem instantânea.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Ordenação Flexível</span>
                <h3 className="mt-1 font-semibold text-sm">Critérios de Ordenação</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Alterne entre ordem alfabética de nomes, número crescente de urna ou patrimônio do maior para o menor para identificar os extremos da disputa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 5: DICAS DE OURO & INSIGHTS ESTRATÉGICOS */}
      {secaoAtiva === 'dicas-ouro' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Insight 1 · Dependência Partidária
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                Quem Realmente Financia a Campanha?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Ao consultar a aba de contas, examine a lista de doadores. Se mais de 90% dos recursos vêm do
                <strong> Diretório Nacional</strong>, a candidatura é prioritária para a cúpula partidária com verba do Fundo Eleitoral.
                Muitos doadores pessoas físicas ou financiamento coletivo (*vaquinha*) sinalizam mobilização popular e capilaridade eleitoral.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-l-rose-500 border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                Insight 2 · Risco de Caixa
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                Despesas Maiores que as Receitas?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Durante o período eleitoral, serviços são contratados antecipadamente. Se o valor de
                <strong> Despesas Total</strong> for maior que as <strong>Receitas Total</strong>, a campanha contraiu compromissos
                que devem ser cobertos por repasses futuros ou formalmente assumidos pela executiva do partido ao final do pleito (restos a pagar).
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-l-blue-500 border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Insight 3 · Rastreio de Fornecedores
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                Empresas Contratadas por Vários Candidatos
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Ao clicar no CNPJ de produtoras, agências de marketing e gráficas, verifique o histórico. É comum que
                grandes empresas prestem serviço para múltiplos postulantes da mesma coligação ou federação, revelando a rede corporativa da eleição.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-l-amber-500 border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Insight 4 · Evolução Patrimonial
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                Crescimento de Bens vs. Mandatos
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Compare a aba <strong>Bens</strong> com o histórico na aba <strong>Histórico</strong>. Candidatos de carreira política longa
                apresentam trajetórias de declaração de bens ao longo de 10 a 20 anos, possibilitando ao cidadão avaliar a consistência da
                evolução financeira em relação aos subsídios públicos recebidos.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-l-purple-500 border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                Insight 5 · O "Puxador de Votos" no Legislativo
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                Como Funciona o Voto Proporcional (Deputados)
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Para Deputado Federal e Deputado Estadual, o voto no candidato também computa para a legenda/federação.
                Candidatos com votações expressivas ("puxadores") ajudam o partido a atingir o Quociente Eleitoral, elegendo outros
                colegas de chapa que obtiveram votações individuais menores.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-l-indigo-500 border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                Insight 6 · Representatividade e Cotas
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                Distribuição Efetiva de Recursos para Mulheres e Negros
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A legislação exige um percentual mínimo de recursos públicos destinados a candidaturas femininas (mínimo 30%) e de pessoas negras.
                Usando os filtros combinados de <em>Gênero</em> e <em>Cor/Etnia</em>, o eleitor pode verificar se o partido está repassando verbas proporcionais.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 6: REGRAS ELEITORAIS & CF/88 */}
      {secaoAtiva === 'legislacao' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Regras Constitucionais e Legislação Vigente (Eleições 2026)
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Parâmetros jurídicos e constitucionais que estruturam as regras do jogo eleitoral brasileiro:
            </p>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">🏛️ Composição das Assembleias Legislativas (Art. 27 da CF/88)</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  O número de Deputados Estaduais corresponde ao <strong>triplo da representação do Estado na Câmara dos Deputados</strong> até 36 vagas;
                  atingido esse número, é acrescido de tantos deputados quantos forem os deputados federais acima de doze.
                  O piso constitucional é de 24 deputados (estados com 8 federais) e o teto é de 94 deputados (São Paulo, com 70 federais).
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">⚖️ Suplência no Senado Federal (Art. 46, § 3º da CF/88)</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Cada Senador é eleito conjuntamente com <strong>dois suplentes</strong> registrados na mesma chapa eleitoral. Em 2026,
                  estão em disputa duas vagas por Estado (renovação de 2/3 da Casa). O voto no número do titular estende-se automaticamente a ambos os suplentes.
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">🚫 Vedação Absoluta a Doações de Pessoas Jurídicas (STF - ADI 4650)</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Pessoas jurídicas (empresas privadas, ONGs, entidades corporativas) são terminantemente proibidas de doar para candidatos ou partidos.
                  Toda receita provém exclusivamente do Fundo Especial de Financiamento de Campanha (FEFC), do Fundo Partidário e de pessoas físicas.
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">👤 Limite Legal de Doações por Pessoas Físicas</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Cidadãos podem realizar doações financeiras limitadas a até <strong>10% dos seus rendimentos brutos</strong> declarados
                  à Receita Federal no ano-calendário anterior. O cruzamento entre o TSE e a Receita Federal aplica multas automáticas aos doadores que ultrapassarem esse teto.
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">📅 Prestação de Contas e Homologação Final</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Durante a campanha, os relatórios financeiros de receitas e despesas são parciais. A prestação final é homologada
                  pelo TSE após o 2º turno das eleições, momento no qual eventuais sobras de campanha são devolvidas e penalidades por descumprimento são julgadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
