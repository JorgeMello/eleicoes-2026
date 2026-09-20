import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Manual() {
  const [secaoAtiva, setSecaoAtiva] = useState('passo-a-passo');

  const abas = [
    { id: 'passo-a-passo', rotulo: 'Passo a Passo dos Módulos', icone: '🧭' },
    { id: 'auditoria-tse', rotulo: 'Auditoria & Selo TSE', icone: '🛡️' },
    { id: 'filtros-insights', rotulo: 'Engenharia de Filtros', icone: '🔍' },
    { id: 'dicas-ouro', rotulo: 'Dicas de Ouro & Insights', icone: '💡' },
    { id: 'legislacao', rotulo: 'Regras Eleitorais & TSE', icone: '⚖️' },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Manual */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              📖 Guia de Utilização & Inteligência Eleitoral
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-slate-900 dark:text-white">
              Manual do Usuário · Eleições 2026
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Aprenda a explorar todas as ferramentas da plataforma, dominar os filtros avançados, cruzar
              dados de prestação de contas do TSE e extrair análises estratégicas para o voto consciente.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs shrink-0">
            <Link
              to="/presidente"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 font-semibold text-white hover:bg-emerald-500 shadow-sm transition-all"
            >
              <span>Ir para Candidatos</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/presidente/rankings"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <span>Ver Rankings</span>
            </Link>
          </div>
        </div>

        {/* Abas de Navegação Interna */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-800">
          {abas.map((a) => (
            <button
              key={a.id}
              onClick={() => setSecaoAtiva(a.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
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
            {/* Módulo 1: Catálogo de Candidatos */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold">Catálogo de Candidatos</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Página inicial de cada cargo</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Visualização em cards:</strong> cada card traz a foto oficial preservada localmente, partido, número de urna, vice e resumo de patrimônio e receitas.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Selo Verificado TSE:</strong> cada card traz a etiqueta verde de validação oficial logo abaixo do nome, indicando que a candidatura e suas declarações foram homologadas pelo TSE.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Acesso ao Perfil:</strong> basta clicar no card do candidato para abrir a tela com plano de governo, histórico eleitoral, selo oficial e detalhamento de contas.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Alternância de Cargos:</strong> use a barra superior secundária para navegar entre Presidente, Governador, Senador e Deputados.</span>
                </li>
              </ul>
            </div>

            {/* Módulo 2: Comparador Triplo */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                  2
                </span>
                <div>
                  <h2 className="text-base font-bold">Comparador Triplo</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Até 3 candidatos lado a lado</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Seleção rápida:</strong> escolha os candidatos nos seletores A, B e C para montar a matriz comparativa.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Gráficos Comparativos:</strong> visualize barras de receitas, despesas e patrimônio com formatação em milhões de reais (ex.: R$ 41,5 milhões).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Análise Interpretativa ("Em Palavras"):</strong> clique nos botões de interrogação para ler a síntese de quem lidera e a diferença percentual.</span>
                </li>
              </ul>
            </div>

            {/* Módulo 3: Rankings Analíticos */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold">Rankings em 4 Quadrantes</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Patrimônio, Receitas, Gastos e Doadores</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-purple-500 font-bold">●</span>
                  <span><strong>Maior patrimônio:</strong> candidatos que declararam os maiores valores em bens pessoais ao TSE.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">●</span>
                  <span><strong>Maiores receitas:</strong> campanhas com maior arrecadação financeira (Fundo Eleitoral + doações).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 font-bold">●</span>
                  <span><strong>Maiores gastos:</strong> candidaturas com mais contratos e despesas pagas.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">●</span>
                  <span><strong>Maiores doadores:</strong> ranking dos principais financiadores e repasses registrados.</span>
                </li>
              </ul>
            </div>

            {/* Módulo 4: Pesquisas Eleitorais */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 font-bold text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                  4
                </span>
                <div>
                  <h2 className="text-base font-bold">Pesquisas & Tendências</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Agregador oficial registrado no TSE</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Múltiplos Institutos:</strong> acompanhe levantamentos do Datafolha, Quaest, Paraná Pesquisas e outros.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Evolução Temporal:</strong> gráficos de linhas mostrando tendências de subida, queda e estabilidade dos pré-candidatos.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Transparência metodológica:</strong> dados de registro oficial no TSE, margem de erro e período de coleta.</span>
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
                  Recurso Especial: Controle dos Dados de Fornecedores e Doadores
                </h3>
                <p className="mt-1 text-sm text-blue-900/90 dark:text-blue-300 leading-relaxed">
                  Na página do perfil de qualquer candidato, acesse a aba <strong>Contas</strong> e clique sobre
                  qualquer empresa fornecedora ou instituição doadora. A plataforma abre um modal de auditoria exibindo a
                  porcentagem do dinheiro de campanha movimentado e consulta automaticamente os dados cadastrais da
                  Receita Federal (CNPJ, Razão Social, CNAE principal, situação cadastral e quadro de sócios/QSA).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 2: AUDITORIA OFICIAL DO TSE & SELO DE VALIDAÇÃO */}
      {secaoAtiva === 'auditoria-tse' && (
        <div className="space-y-6">
          {/* Banner de Introdução da Seção */}
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-6 dark:border-emerald-800/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm dark:bg-emerald-500 text-lg">
                🛡️
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Auditoria Oficial do TSE & Selo de Validação
                </h2>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  Como a plataforma audita, reconcilia e certifica os dados fiscais e patrimoniais com a Justiça Eleitoral (DivulgaCandContas)
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Todas as candidaturas exibidas nesta plataforma passam por um rigoroso pipeline de reconciliação contábil em conformidade com as resoluções vigentes do Tribunal Superior Eleitoral. Ao navegar pela aplicação, o cidadão conta com indicadores claros para verificar a legalidade e a consistência das contas de campanha.
            </p>
          </div>

          {/* Grid dos 4 Pilares da Auditoria */}
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
                A etiqueta verde posicionada <strong>imediatamente abaixo do nome do candidato</strong> nos cards de listagem e no cabeçalho do perfil atesta que a candidatura possui registro formal homologado junto ao sistema DivulgaCandContas do TSE, com certidões validadas e dados públicos conferidos.
              </p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">O que a etiqueta valida:</span>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                  <li>Registro deferido perante a Justiça Eleitoral.</li>
                  <li>Inscrição no Cadastro Nacional da Pessoa Jurídica (CNPJ Eleitoral).</li>
                  <li>Protocolo autêntico do Plano de Governo no repositório oficial.</li>
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Auditoria Matemática dos Bens</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Cruzamento item a item vs. Total</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                O motor de reconciliação da plataforma audita cada declaração de bens individualmente: soma cada item (imóveis, veículos, contas bancárias, quotas empresariais e fundos) e compara com o valor consolidado informado pelo candidato.
              </p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                <span className="font-semibold text-blue-700 dark:text-blue-400">Indicador no Painel:</span>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Quando aparece <strong>"100% Consistente"</strong>, a soma dos bens bate centavo a centavo com o patrimônio declarado (tolerância zero a desvios). Na eleição presidencial de 2026, 143 bens totalizando mais de R$ 1,03 bilhão foram auditados sem divergências.
                </p>
              </div>
            </div>

            {/* Pilar 3: Teto Legal de Gastos de Campanha */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  💰
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Fiscalização do Teto Legal de Gastos</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Limite oficial fixado pelo TSE</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                O TSE fixa um limite máximo intransponível de contratações para cada cargo. Para o 1º turno de Presidente, o teto é de <strong>R$ 88.944.030,80</strong>. O painel do perfil exibe uma barra de progresso em tempo real mostrando o percentual consumido pela candidatura.
              </p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                <span className="font-semibold text-amber-700 dark:text-amber-400">Cores da Barra de Teto:</span>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  <strong>Verde:</strong> Campanha com gastos regulares abaixo de 90% do teto. <br />
                  <strong>Âmbar:</strong> Alerta de aproximação do teto legal (acima de 90%), exigindo contenção de despesas sob risco de sanção legal.
                </p>
              </div>
            </div>

            {/* Pilar 4: CNPJ de Campanha e Processo PJe */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  📑
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">CNPJ Eleitoral & Processo no PJe</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Autenticidade e rastreabilidade documental</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                O banner de auditoria no perfil disponibiliza o CNPJ Eleitoral com botão de cópia instantânea (para conferência na Receita Federal) e o número do Processo Judicial Eletrônico (PJe) no TSE, acompanhado do link direto para a consulta no portal DivulgaCandContas.
              </p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                <span className="font-semibold text-purple-700 dark:text-purple-400">Transparência Ativa:</span>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  O cidadão pode conferir diretamente na fonte primária da Justiça Eleitoral se houve impugnações, recursos ou julgamentos pendentes sobre a elegibilidade da candidatura.
                </p>
              </div>
            </div>
          </div>

          {/* Validação na Aba Contas do Perfil */}
          <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white p-5 shadow-sm dark:border-blue-900/60 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm dark:bg-blue-500">
                📊
              </span>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Validação Oficial TSE na Aba "Contas" do Perfil
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Novo Recurso
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ao acessar a aba <strong>Contas</strong> no perfil do candidato, o usuário visualiza o <strong>Banner Oficial de Prestação de Contas do TSE</strong>, integrando os dados homologados do sistema DivulgaCandContas:
                </p>
                <div className="grid gap-3 pt-1 sm:grid-cols-3 text-xs">
                  <div className="rounded-lg bg-white p-3 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                    <strong className="text-blue-700 dark:text-blue-400 block mb-1">🏛️ Banner Consolidado TSE</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Painel com receitas arrecadadas, despesas contratadas, saldo de campanha, teto legal com barra de progresso, CNPJ Eleitoral com cópia em 1 clique e botão com link direto para o DivulgaCandContas.
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                    <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">✓ Selo por Lançamento</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Cada doador e fornecedor listado exibe o selo <code>✓ TSE</code> e a tipificação do documento (CNPJ de Pessoa Jurídica/Partido ou CPF de Pessoa Física) cadastrado no sistema eleitoral.
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                    <strong className="text-purple-700 dark:text-purple-400 block mb-1">🔍 Controle dos Dados Integrado</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Ao clicar em qualquer despesa ou receita, o modal de controle dos dados exibe a certificação do TSE e link externo direto para conferência na base oficial da Justiça Eleitoral.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloco Educativo: Balanço de Campanha (Superávit vs. Déficit) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>💡 Como Entender o Balanço de Campanha (Receitas vs. Despesas)</span>
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ao analisar as contas de uma candidatura, você poderá se deparar com duas situações contábeis:
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900 dark:bg-emerald-950/40">
                <strong className="text-emerald-800 dark:text-emerald-300 block text-sm">Superávit ou Saldo Neutro:</strong>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  Ocorre quando as <strong>Receitas Arrecadadas</strong> são maiores ou iguais às <strong>Despesas Contratadas</strong>. A campanha possui caixa suficiente para cobrir todos os contratos firmados até o momento.
                </p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                <strong className="text-amber-800 dark:text-amber-300 block text-sm">Déficit Temporário de Campanha:</strong>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  Ocorre quando as <strong>Despesas Contratadas</strong> superam temporariamente as receitas já recebidas. Trata-se de prática prevista na Lei das Eleições (Lei 9.504/1997), onde as contratações são lançadas na prestação parcial, devendo ser cobertas por futuros repasses do Fundo Partidário ou assumidas pelo partido ao final do pleito sob a forma de restos a pagar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 3: ENGENHARIA DE FILTROS & BUSCA EFICIENTE */}
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
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Filtro Socioeconômico</span>
                <h3 className="mt-1 font-semibold text-sm">Patrimônio Mínimo e Máximo</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Digite valores nos campos <em>Patrimônio mín.</em> e <em>máx.</em> (ex.: a partir de R$ 5.000.000) para isolar candidaturas de alta renda ou candidaturas de perfil popular (até R$ 50.000).
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Filtro Geográfico</span>
                <h3 className="mt-1 font-semibold text-sm">Seleção por UF</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Para Governador, Senador e Deputados, selecione o estado desejado (ex.: RS, SP, MG) para restringir os candidatos, comparações e rankings exclusivamente àquela unidade da federação.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Diversidade e Cotas</span>
                <h3 className="mt-1 font-semibold text-sm">Cor/Etnia & Grau de Instrução</h3>
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
                  Digite parte do nome do candidato ou os dígitos de urna (ex.: "13", "22", "12") no campo de pesquisa para filtragem instantânea sem recarregar a página.
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

      {/* SEÇÃO 3: DICAS DE OURO & INSIGHTS ESTRATÉGICOS */}
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
                <strong> Diretório Nacional</strong>, a candidatura é totalmente bancada pela cúpula do partido com verba do Fundo Eleitoral.
                Se houver muitos doadores pessoas físicas ou financiamento coletivo (*vaquinha*), isso sinaliza mobilização popular descentralizada.
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
                Durante o período eleitoral, muitos candidatos contratam serviços antecipadamente. Se o valor de
                <strong> Despesas Total</strong> for expressivamente maior que as <strong>Receitas Total</strong>, a campanha contraiu dívidas
                que deverão ser quitadas até o pleito ou formalmente assumidas pelo diretório partidário perante a Justiça Eleitoral.
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
                Ao clicar no CNPJ de agências de publicidade, produtoras de vídeo ou gráficas, veja o histórico da empresa. É comum que
                grandes empresas de marketing prestem serviço para múltiplos candidatos da mesma coligação partidária, permitindo
                enxergar a rede de conexões empresariais da eleição.
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
          </div>
        </div>
      )}

      {/* SEÇÃO 4: REGRAS ELEITORAIS & LEGISLAÇÃO */}
      {secaoAtiva === 'legislacao' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Regras do TSE e Legislação Vigente para as Eleições 2026
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Entenda os parâmetros legais que norteiam os dados exibidos nesta plataforma:
            </p>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">🚫 Proibição de Doações por Empresas (Pessoas Jurídicas)</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Desde a decisão do STF (ADI 4650) e da reforma eleitoral, pessoas jurídicas são estritamente proibidas de doar para
                  campanhas políticas. Toda receita declarada provém de repasses partidários (FEFC/Fundo Partidário), pessoas físicas ou financiamento coletivo.
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">👤 Limite para Doações de Pessoas Físicas</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Pessoas físicas podem doar até <strong>10% dos rendimentos brutos</strong> declarados à Receita Federal no ano-calendário
                  anterior à eleição. O cruzamento entre TSE e Receita Federal identifica e multa doações acima do teto.
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">💰 Teto de Gastos de Campanha</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  O TSE fixa limites máximos de gastos para cada cargo em disputa. O desrespeito ao limite legal sujeita o infrator a
                  pagamento de multa no valor equivalente a 100% da quantia que ultrapassar o teto e possível cassação de mandato.
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">📅 Calendário e Prazos de Prestação de Contas</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Os dados de receitas e despesas são preliminares durante o período de campanha, atualizados gradualmente em prestações parciais,
                  e homologados definitivamente pela Justiça Eleitoral após o 2º turno das eleições (25/10/2026).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
