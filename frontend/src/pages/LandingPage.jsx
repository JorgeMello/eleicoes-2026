import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    // Atualiza o título e meta description da página para SEO e GEO
    document.title = 'Eleições 2026 · Software Livre, Auditoria Cívica e Dados Abertos';
    
    // Injeta marcação estruturada Schema.org JSON-LD para indexação de motores clássicos e agentes de IA
    const scriptId = 'schema-landing-civica';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareApplication',
            '@id': 'https://eleicoes2026.app/#software',
            'name': 'Plataforma Eleições 2026 · Auditoria Cívica e Dados Abertos',
            'url': 'https://eleicoes.osidosos.com.br',
            'applicationCategory': 'GovernmentApplication',
            'operatingSystem': 'Any (Web)',
            'license': 'https://opensource.org/licenses/MIT',
            'description': 'Software livre comunitário e independente para fiscalização cívica, auditoria patrimonial e inteligência de dados abertos das Eleições 2026 no Brasil.',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'BRL'
            },
            'author': {
              '@type': 'Organization',
              'name': 'Comunidade de Software Livre Eleições 2026',
              'url': 'https://github.com/JorgeMello/eleicoes-2026'
            }
          },
          {
            '@type': 'Dataset',
            '@id': 'https://eleicoes2026.app/#dataset',
            'name': 'Base Unificada de Candidaturas, Patrimônio e Financiamento Eleitoral 2026',
            'description': 'Base de dados pública consolidada com 19.088 candidatos, 69.729 bens pessoais auditados matematicamente e mais de R$ 24,8 bilhões em patrimônio público declarado perante o Tribunal Superior Eleitoral (TSE).',
            'license': 'https://creativecommons.org/publicdomain/zero/1.0/',
            'spatialCoverage': 'BR',
            'temporalCoverage': '2026',
            'creator': {
              '@type': 'Organization',
              'name': 'Tribunal Superior Eleitoral (TSE) & Receita Federal do Brasil'
            }
          },
          {
            '@type': 'FAQPage',
            '@id': 'https://eleicoes2026.app/#faq',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'O que é a plataforma Eleições 2026?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'É uma plataforma de código aberto e software livre dedicada à transparência eleitoral. Ela consolida e audita dados públicos do TSE e da Receita Federal sobre 19.088 candidatos concorrendo aos cargos de Presidente, Governador, Senador, Deputado Federal e Deputado Estadual/Distrital nas 27 unidades da federação.'
                }
              },
              {
                '@type': 'Question',
                'name': 'De onde são obtidos os dados de candidatos, bens e gastos?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': '100% dos dados são públicos e homologados, extraídos dos sistemas oficiais do Tribunal Superior Eleitoral (DivulgaCandContas), da Receita Federal do Brasil (para auditoria societária de CNPJs de fornecedores e doadores) e do IBGE.'
                }
              },
              {
                '@type': 'Question',
                'name': 'A plataforma possui viés partidário ou cobrança de acesso?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Não. O projeto é estritamente apartidário, sem fins lucrativos e livre de qualquer anúncio ou rastreador comercial. Trata-se de uma iniciativa cívica sob licença livre MIT com código-fonte aberto no GitHub.'
                }
              },
              {
                '@type': 'Question',
                'name': 'O que é o Fundo Eleitoral (FEFC) de R$ 4,96 bilhões e de onde vem esse dinheiro?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'O Fundo Especial de Financiamento de Campanha (FEFC) para as Eleições 2026 totaliza R$ 4,96 bilhões (R$ 4.961.519.777,00) oriundos do Orçamento da União, isto é, de impostos arrecadados da população. Foi criado em 2017 após o STF proibir doações de empresas privadas (ADI 5408). O TSE divide o valor entre os 30 partidos: 48% pela bancada de deputados federais, 35% pelos votos válidos na Câmara, 15% pelos senadores e 2% dividido igualmente entre todos os partidos.'
                }
              },
              {
                '@type': 'Question',
                'name': 'Como pesquisadores, jornalistas e IAs podem acessar os dados?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Os dados estão disponíveis em formatos abertos (JSON, CSV), através dos endpoints de API RESTful do backend, pelo arquivo padronizado /llms.txt e no repositório de código no GitHub.'
                }
              }
            ]
          }
        ]
      });
      document.head.appendChild(script);
    }

    return () => {
      // Limpeza opcional ao desmontar
    };
  }, []);

  const [fatiaAtiva, setFatiaAtiva] = useState('48');
  const [modoImpacto, setModoImpacto] = useState('total');
  const [duvidaAberta, setDuvidaAberta] = useState(null);

  const copiarCitacao = () => {
    const texto = `MELLO, Jorge et al. Plataforma Cívica Eleições 2026: Auditoria de Dados Abertos e Financiamento Eleitoral. Software Livre sob licença MIT. Repositório: https://github.com/JorgeMello/eleicoes-2026, 2026.`;
    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-16 py-4">
      {/* SEÇÃO 1: HERO DE IMPACTO CÍVICO & SOBERANIA DE DADOS */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/60 to-slate-100/70 p-6 sm:p-10 lg:p-14 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950">
        {/* Linhas Técnicas Sutis de Fundo (Blueprint Grid) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative mx-auto max-w-4xl text-center space-y-6">
          {/* Badge de Soberania Cívica */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50/90 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/50 dark:text-emerald-300 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="tracking-wide uppercase text-[11px] font-mono">Software Livre · Dados 100% Públicos do TSE · Licença MIT</span>
          </div>

          {/* Headline H1 Editorial de Alto Impacto */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.12]">
            A Democracia Não Pode Ser Uma Caixa Preta.
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-blue-400">
              Auditoria Cívica Aberta das Eleições 2026.
            </span>
          </h1>

          {/* Subheadline GEO & Resposta Direta O(1) */}
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Uma plataforma pública, independente e auditável que transforma gigabytes de registros burocráticos
            do <strong>Tribunal Superior Eleitoral (TSE)</strong> e da <strong>Receita Federal</strong> em
            transparência prática para mais de 215 milhões de brasileiros. Sem algoritmos enviesados, sem anúncios comerciais
            e sem dependência de intermediários corporativos.
          </p>

          {/* Botões de Ação Principal (CTAs) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/presidente"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white transition-all transform active:scale-[0.98] cursor-pointer"
            >
              <span>Explorar Candidatos & Contas</span>
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href="https://github.com/JorgeMello/eleicoes-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all shadow-2xs cursor-pointer"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Código Aberto no GitHub</span>
              <span className="text-xs text-slate-400">↗</span>
            </a>

            <Link
              to="/manual"
              className="inline-flex items-center gap-1.5 rounded-xl border border-transparent px-4 py-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              <span>Manual do Usuário</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Metrificador Cívico em Alta Densidade (4 Cartões de Estatísticas Reais) */}
        <div className="relative mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
              Candidaturas Auditadas
            </span>
            <strong className="mt-1 block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              19.088
            </strong>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              100% dos 5 cargos nas 27 UFs
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block font-mono">
              Patrimônio Mapeado
            </span>
            <strong className="mt-1 block text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
              R$ 24,8 Bi
            </strong>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Bens conferidos centavo a centavo
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block font-mono">
              Bens Discriminados
            </span>
            <strong className="mt-1 block text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-400 tabular-nums">
              69.729
            </strong>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Imóveis, cotas, contas e veículos
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block font-mono">
              Bancadas Parlamentares
            </span>
            <strong className="mt-1 block text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-400 tabular-nums">
              1.059
            </strong>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Cadeiras nas 26 Assembleias e CLDF
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: MANIFESTO DO SOFTWARE LIVRE & SOBERANIA DIGITAL */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
            Pilares Inegociáveis
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Por Que o Software Livre é Vital Para a Democracia?
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Plataformas eleitorais mantidas por entidades proprietárias ou grandes corporações de tecnologia funcionam
            como caixas-pretas: algoritmos opacos podem privilegiar certas candidaturas, ranquear nomes arbitrariamente ou coletar
            dados comportamentais dos eleitores. Nós construímos o oposto exato.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-lg font-bold">
              🔓
            </div>
            <h3 className="mt-3 font-bold text-base text-slate-900 dark:text-white">Código 100% Inspecionável</h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cada linha de código dos scrapers, das rotinas de cálculo e da interface está publicada no GitHub. Qualquer cidadão,
              jornalista ou perito pode auditar a fidelidade das fórmulas matemáticas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-lg font-bold">
              ⚖️
            </div>
            <h3 className="mt-3 font-bold text-base text-slate-900 dark:text-white">Zero Algoritmos Ocultos</h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A plataforma não classifica candidatos como "bons" ou "ruins". A organização obedece estritamente a critérios objetivos
              (ordem alfabética, número de urna, patrimônio ou receitas declaradas perante o TSE).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-lg font-bold">
              🛡️
            </div>
            <h3 className="mt-3 font-bold text-base text-slate-900 dark:text-white">Privacidade Absoluta</h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sem pixels do Facebook, sem ferramentas de rastreamento comercial e sem coleta de dados pessoais do visitante.
              Sua navegação e escolhas cívicas permanecem inteiramente anônimas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-lg font-bold">
              🏛️
            </div>
            <h3 className="mt-3 font-bold text-base text-slate-900 dark:text-white">Independência Institucional</h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Projeto mantido de forma comunitária, sem verbas governamentais, sem vínculo com partidos e protegido por licença de software livre
              reconhecida pela Free Software Foundation e Open Source Initiative.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: MATRIZ EXPLICATIVA DOS 6 GRANDES MÓDULOS (PROBLEMA VS. SOLUÇÃO) */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
            Engenharia Cívica em Ação
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Como Transformamos a Burocracia em Transparência Acessível
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Consulte como cada módulo da aplicação resolve um gargalo histórico de acesso à informação eleitoral no Brasil:
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3.5 sm:px-6 w-1/4">Módulo da Plataforma</th>
                  <th className="px-4 py-3.5 sm:px-6 w-1/3 text-rose-700 dark:text-rose-400">O Gargalo nos Sistemas Estatais</th>
                  <th className="px-4 py-3.5 sm:px-6 text-emerald-700 dark:text-emerald-400">A Solução Entregue no Software</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 sm:px-6 font-bold text-slate-900 dark:text-white">
                    1. Catálogo Nacional dos 5 Cargos
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 text-slate-600 dark:text-slate-400">
                    Dados dispersos em páginas isoladas, lentas e com filtros truncados por unidade da federação.
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 font-medium text-slate-800 dark:text-slate-200">
                    Painel nacional unificado cobrindo Presidente, Governador, Senador, Dep. Federal e Dep. Estadual com busca textual instantânea por nome ou número.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 sm:px-6 font-bold text-slate-900 dark:text-white">
                    2. Auditoria Matemática de Bens
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 text-slate-600 dark:text-slate-400">
                    Listas brutas em texto corrido, impossibilitando a soma item a item e a validação do patrimônio total.
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 font-medium text-slate-800 dark:text-slate-200">
                    Mais de 69.700 bens catalogados com ordenação por valor declaratório, soma matemática automática e selo "100% Consistente" com o TSE.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 sm:px-6 font-bold text-slate-900 dark:text-white">
                    3. Rastreio de CNPJs de Campanha
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 text-slate-600 dark:text-slate-400">
                    Documentos frios em PDF ou planilhas sem identificação societária de fornecedores e doadores.
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 font-medium text-slate-800 dark:text-slate-200">
                    Modal com cruzamento automático perante a Receita Federal, exibindo Razão Social, CNAE de atividade e quadro de sócios (QSA).
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 sm:px-6 font-bold text-slate-900 dark:text-white">
                    4. Comparador Federativo (3 Candidatos)
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 text-slate-600 dark:text-slate-400">
                    Inexistência de confronto direto; o cidadão é obrigado a abrir dezenas de abas simultaneamente.
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 font-medium text-slate-800 dark:text-slate-200">
                    Matriz comparativa lado a lado com gráficos financeiros, resumo sociodemográfico e bloqueio estrito de UF cruzada para cargos estaduais.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 sm:px-6 font-bold text-slate-900 dark:text-white">
                    5. Rankings em 4 Quadrantes
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 text-slate-600 dark:text-slate-400">
                    Ausência de panorama nacional ou estadual sobre quem concentra maior patrimônio, receita e despesas.
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 font-medium text-slate-800 dark:text-slate-200">
                    Classificação em tempo real por maior patrimônio, receitas arrecadadas, despesas contratadas e maiores doadores por estado.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 sm:px-6 font-bold text-slate-900 dark:text-white">
                    6. Paginação Padrão Ouro (Doc 87)
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 text-slate-600 dark:text-slate-400">
                    Travamento de navegador e consumo massivo de dados ao carregar mais de 1.000 deputados de uma vez.
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 font-medium text-slate-800 dark:text-slate-200">
                    Rolagem infinita contínua em lotes de 30 itens, botão de apoio com contador `pt-BR` e resposta de rede sub-milissegundo com cache HTTP ETag.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: DEEP DIVE TECNOLÓGICO & ARQUITETURA */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
            Engenharia de Software
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Stack Moderna, Resiliente e Descentralizada
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Construído para rodar em servidores leves, ambientes locais de desenvolvimento (XAMPP/Docker) e servidores web de produção (Hostinger/Apache) com zero atrito de infraestrutura:
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono block">Frontend Moderno</span>
            <strong className="mt-1 block text-base font-bold text-slate-900 dark:text-white">React 19 + Vite 8</strong>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              SPA com bundle ultracompacto (menos de 250kB gzipped), renderização em 330ms, TailwindCSS para design responsivo e Recharts para visualizações vetoriais.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono block">Backend & APIs</span>
            <strong className="mt-1 block text-base font-bold text-slate-900 dark:text-white">PHP 8.2 + CodeIgniter 4</strong>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              APIs RESTful com envelope paginado padrão ouro, headers <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 font-mono">ETag</code> e <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 font-mono">Cache-Control</code> com validação condicional de alta velocidade.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono block">Banco de Dados</span>
            <strong className="mt-1 block text-base font-bold text-slate-900 dark:text-white">MySQL / MariaDB (utf8mb4)</strong>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Estrutura normalizada com chaves estrangeiras, transações InnoDB chunked, suporte a emojis e acentuação brasileira com dump de 24.8MB para deploy direto.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono block">Pipeline de Raspagem</span>
            <strong className="mt-1 block text-base font-bold text-slate-900 dark:text-white">Scrapers HTTP Keep-Alive</strong>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Motores Node.js paralelos com 35 sockets concorrentes processando mais de 10.500 candidatos em 79 segundos (~135 requisições/segundo) com tolerância a falhas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono block">Interoperabilidade IA</span>
            <strong className="mt-1 block text-base font-bold text-slate-900 dark:text-white">Padrão Aberto /llms.txt</strong>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Documentação semântica estruturada para consumo direto por modelos de linguagem (LLMs) e agentes de pesquisa cívica autônomos.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono block">Auditoria Cívica</span>
            <strong className="mt-1 block text-base font-bold text-slate-900 dark:text-white">Comandos CLI Spark</strong>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ferramentas de linha de comando para auditoria instantânea (<code className="rounded bg-slate-100 dark:bg-slate-800 px-1 font-mono">php spark tse:auditar</code>) e reconciliação em lote.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: DADOS EM NÚMEROS — O BRASIL DAS ELEIÇÕES 2026 */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-10 dark:border-slate-800 dark:bg-slate-900/60 space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
            Raio-X Constitucional
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            A Dimensão das Eleições 2026 em Números
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Consulte a distribuição das vagas em disputa no Congresso Nacional e nas 27 Casas Legislativas Estaduais (Art. 27, 45 e 46 da CF/88):
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <strong className="block text-sm font-bold text-slate-900 dark:text-white">Câmara dos Deputados</strong>
            <p className="text-xs text-slate-500 dark:text-slate-400">Art. 45 da CF/88</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-300">Cadeiras Federais:</span>
              <strong className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">513 vagas</strong>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">De 8 (piso) a 70 vagas (São Paulo)</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <strong className="block text-sm font-bold text-slate-900 dark:text-white">Assembleias & CLDF</strong>
            <p className="text-xs text-slate-500 dark:text-slate-400">Art. 27 e 32 da CF/88</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-300">Cadeiras Estaduais:</span>
              <strong className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">1.059 vagas</strong>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">De 24 (piso) a 94 vagas (São Paulo)</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <strong className="block text-sm font-bold text-slate-900 dark:text-white">Senado Federal</strong>
            <p className="text-xs text-slate-500 dark:text-slate-400">Art. 46 da CF/88</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-300">Vagas em Disputa:</span>
              <strong className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">54 senadores</strong>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Renovação de 2/3 (2 por estado com suplentes)</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: FUNDO ELEITORAL 2026 (FEFC) — A TRILHA DO DINHEIRO PÚBLICO */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/60 p-6 sm:p-10 shadow-sm dark:border-emerald-800/50 dark:from-slate-900 dark:via-emerald-950/15 dark:to-slate-950 space-y-8">
        {/* Linha decorativa no topo */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

        {/* Cabeçalho da Seção com Badge e Cifra Global */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100/70 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="uppercase tracking-wider text-[11px]">Transparência Orçamentária · Dinheiro 100% Público</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Fundo Eleitoral: De Onde Vêm e Para Onde Vão os Quase{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-blue-400">
                R$ 5 Bilhões
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Você sabia que as campanhas eleitorais de 2026 são custeadas diretamente pelo seu trabalho? 
              O <strong>Fundo Especial de Financiamento de Campanha (FEFC)</strong> retira recursos do Orçamento Geral da União 
              arrecadados por meio dos impostos pagos pela população para financiar candidatos e partidos.
            </p>
          </div>

          {/* Calculadora de Impacto Cívico */}
          <div className="shrink-0 rounded-2xl border border-emerald-200/90 bg-white p-5 shadow-2xs dark:border-emerald-800/80 dark:bg-slate-900/90 min-w-[280px]">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Custo do Fundo 2026
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setModoImpacto('total')}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold transition cursor-pointer ${
                    modoImpacto === 'total'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                  title="Valor Total do Fundo"
                >
                  Total
                </button>
                <button
                  type="button"
                  onClick={() => setModoImpacto('habitante')}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold transition cursor-pointer ${
                    modoImpacto === 'habitante'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                  title="Custo Médio por Brasileiro"
                >
                  /Habitante
                </button>
                <button
                  type="button"
                  onClick={() => setModoImpacto('eleitor')}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold transition cursor-pointer ${
                    modoImpacto === 'eleitor'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                  title="Custo Médio por Eleitor Apto"
                >
                  /Eleitor
                </button>
              </div>
            </div>

            <div className="mt-3 text-center sm:text-right">
              {modoImpacto === 'total' && (
                <>
                  <strong className="block text-3xl sm:text-4xl font-black font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                    R$ 4,96 Bi
                  </strong>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    R$ 4.961.519.777,00 (Lei Orçamentária da União)
                  </span>
                </>
              )}
              {modoImpacto === 'habitante' && (
                <>
                  <strong className="block text-3xl sm:text-4xl font-black font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                    R$ 23,07
                  </strong>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    Por cidadão (base: 215 milhões de habitantes)
                  </span>
                </>
              )}
              {modoImpacto === 'eleitor' && (
                <>
                  <strong className="block text-3xl sm:text-4xl font-black font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                    R$ 31,80
                  </strong>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    Por eleitor apto a votar (base: 156 milhões)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* A Trilha Didática do Dinheiro (Infográfico em 3 Passos) */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-lg">
                1
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                  De Onde Vem o Dinheiro
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Orçamento da União
                </h3>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              O FEFC não é dinheiro próprio dos partidos: são recursos públicos federais recolhidos via tributos (IR, PIS/Cofins, IPI). Em anos eleitorais, essa verba é destacada no orçamento federal para financiar as campanhas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-lg">
                2
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                  Origem Histórica (2017)
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Fim das Doações de Empresas
                </h3>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Criado após o <strong>STF proibir doações de pessoas jurídicas</strong> (empresas privadas, bancos e empreiteiras) em 2015 (ADI 5408), com o objetivo de frear a influência do poder econômico privado e a corrupção eleitoral.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-lg">
                3
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                  Para Onde Vai o Gasto
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Despesas Auditadas
                </h3>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              O recurso paga comícios, viagens, publicidade na TV/rádio, redes sociais e materiais gráficos. Todo gasto precisa de NF-e, e o que não for gasto deve ser <strong>devolvido obrigatoriamente aos cofres públicos</strong>.
            </p>
          </div>
        </div>

        {/* Como o Dinheiro é Distribuído: 4 Pedaços do Bolo */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                Art. 16-D da Lei nº 9.504/1997 · TSE
              </span>
              <h3 className="mt-0.5 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Como os R$ 4,96 Bilhões São Fatiados Entre os 30 Partidos?
              </h3>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              Clique em uma fatia para ver os detalhes
            </span>
          </div>

          {/* Barra de Proporção Visual Segmentada Interativa */}
          <div className="relative h-6 w-full overflow-hidden rounded-xl flex shadow-inner border border-slate-200 dark:border-slate-800 cursor-pointer">
            <button
              type="button"
              onClick={() => setFatiaAtiva('48')}
              style={{ width: '48%' }}
              className={`h-full bg-indigo-600 hover:brightness-110 transition flex items-center justify-center text-white text-[11px] font-bold font-mono ${
                fatiaAtiva === '48' ? 'ring-2 ring-white ring-inset' : ''
              }`}
              title="48% — Bancada de Deputados Federais (~R$ 2,38 Bi)"
            >
              48%
            </button>
            <button
              type="button"
              onClick={() => setFatiaAtiva('35')}
              style={{ width: '35%' }}
              className={`h-full bg-blue-500 hover:brightness-110 transition flex items-center justify-center text-white text-[11px] font-bold font-mono ${
                fatiaAtiva === '35' ? 'ring-2 ring-white ring-inset' : ''
              }`}
              title="35% — Votos Válidos na Câmara (~R$ 1,73 Bi)"
            >
              35%
            </button>
            <button
              type="button"
              onClick={() => setFatiaAtiva('15')}
              style={{ width: '15%' }}
              className={`h-full bg-purple-500 hover:brightness-110 transition flex items-center justify-center text-white text-[11px] font-bold font-mono ${
                fatiaAtiva === '15' ? 'ring-2 ring-white ring-inset' : ''
              }`}
              title="15% — Bancada de Senadores (~R$ 744 Mi)"
            >
              15%
            </button>
            <button
              type="button"
              onClick={() => setFatiaAtiva('2')}
              style={{ width: '2%' }}
              className={`h-full bg-emerald-500 hover:brightness-110 transition flex items-center justify-center text-white text-[10px] font-bold font-mono ${
                fatiaAtiva === '2' ? 'ring-2 ring-white ring-inset' : ''
              }`}
              title="2% — Divisão Igualitária entre todos os 30 partidos (~R$ 99 Mi)"
            >
              2%
            </button>
          </div>

          {/* Grid dos 4 Cards das Fatias */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* 48% */}
            <div
              onClick={() => setFatiaAtiva('48')}
              className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                fatiaAtiva === '48'
                  ? 'border-indigo-500 bg-indigo-50/70 shadow-md dark:border-indigo-400 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  48% do Fundo
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">~R$ 2,38 Bi</span>
              </div>
              <strong className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">
                Bancada de Deputados Federais
              </strong>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dividido proporcionalmente ao número de deputados federais eleitos por cada legenda. É a maior fatia e favorece os grandes partidos.
              </p>
            </div>

            {/* 35% */}
            <div
              onClick={() => setFatiaAtiva('35')}
              className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                fatiaAtiva === '35'
                  ? 'border-blue-500 bg-blue-50/70 shadow-md dark:border-blue-400 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono">
                  35% do Fundo
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">~R$ 1,73 Bi</span>
              </div>
              <strong className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">
                Votos Válidos na Câmara
              </strong>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculado proporcionalmente aos votos que os partidos obtiveram para a Câmara dos Deputados na última eleição geral nacional.
              </p>
            </div>

            {/* 15% */}
            <div
              onClick={() => setFatiaAtiva('15')}
              className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                fatiaAtiva === '15'
                  ? 'border-purple-500 bg-purple-50/70 shadow-md dark:border-purple-400 dark:bg-purple-950/40 ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-white hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-mono">
                  15% do Fundo
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">~R$ 744 Mi</span>
              </div>
              <strong className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">
                Bancada de Senadores
              </strong>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Distribuído conforme a representação e número de senadores eleitos por cada sigla partidária na posse da legislatura.
              </p>
            </div>

            {/* 2% */}
            <div
              onClick={() => setFatiaAtiva('2')}
              className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                fatiaAtiva === '2'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-md dark:border-emerald-400 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                  2% do Fundo
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">~R$ 99 Mi</span>
              </div>
              <strong className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">
                Divisão Igualitária (30 Partidos)
              </strong>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dividido em cotas rigorosamente iguais entre os 30 partidos políticos registrados no TSE (cerca de R$ 3,3 milhões por sigla).
              </p>
            </div>
          </div>

          {/* Detalhamento da Fatia Selecionada */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 text-xs sm:text-sm">
            {fatiaAtiva === '48' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase text-[11px] block">
                    Fatia Ativa: 48% (Art. 16-D, inciso III)
                  </span>
                  <strong className="text-slate-900 dark:text-white text-base">
                    R$ 2.381.529.493,00 destinados pela bancada na Câmara dos Deputados
                  </strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Esta fatia representa quase metade do orçamento total do fundo. Ela é repartida de acordo com a proporção de cadeiras que cada legenda ocupa na Câmara dos Deputados. Partidos com bancadas expressivas concentram a maior parte desse valor.
                  </p>
                </div>
              </div>
            )}

            {fatiaAtiva === '35' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono uppercase text-[11px] block">
                    Fatia Ativa: 35% (Art. 16-D, inciso II)
                  </span>
                  <strong className="text-slate-900 dark:text-white text-base">
                    R$ 1.736.531.922,00 distribuídos pelos votos para Deputado Federal
                  </strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Premia os partidos que receberam maior número total de votos dos eleitores para a Câmara, assegurando que legendas bem votadas nas urnas recebam financiamento compatível com sua força eleitoral popular.
                  </p>
                </div>
              </div>
            )}

            {fatiaAtiva === '15' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-purple-600 dark:text-purple-400 font-mono uppercase text-[11px] block">
                    Fatia Ativa: 15% (Art. 16-D, inciso IV)
                  </span>
                  <strong className="text-slate-900 dark:text-white text-base">
                    R$ 744.227.966,00 distribuídos pela representação no Senado Federal
                  </strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    O Senado renova suas 81 cadeiras em ciclos alternados de 1/3 e 2/3. Em 2026, com 54 vagas em disputa (2/3), a força das bancadas dos partidos no Senado dita a partilha desses mais de 744 milhões de reais.
                  </p>
                </div>
              </div>
            )}

            {fatiaAtiva === '2' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase text-[11px] block">
                    Fatia Ativa: 2% (Art. 16-D, inciso I)
                  </span>
                  <strong className="text-slate-900 dark:text-white text-base">
                    R$ 99.230.395,00 divididos igualmente entre todos os 30 partidos
                  </strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cada legenda legalmente registrada perante o TSE recebe uma fração de 1/30 (cerca de R$ 3,3 milhões), viabilizando registro de candidaturas e campanha mínima mesmo para legendas sem representação parlamentar prévia.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3 Cartões de Regras & Conformidade Constitucional */}
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-lg">👩🏽‍💼</span>
            <h4 className="mt-1 font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Cota Mínima: 30% Mulheres e Negros
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Por determinação do STF e do TSE, no mínimo 30% dos recursos do fundo devem ser destinados a campanhas femininas, além de distribuição proporcional a candidaturas de pessoas negras.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-lg">🧾</span>
            <h4 className="mt-1 font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Notas Fiscais e CNPJ Auditados
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cada centavo gasto exige nota fiscal eletrônica. Nossa plataforma cruza os CNPJs dos prestadores de serviços com a Receita Federal para rastrear eventuais empresas fantasmas ou laranjas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-lg">↩️</span>
            <h4 className="mt-1 font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Sobras Devolvidas ao Tesouro
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Recursos do Fundo Eleitoral não utilizados durante a campanha eleitoral não podem ser embolsados pelos partidos: devem ser compulsoriamente recolhidos de volta aos cofres da União.
            </p>
          </div>
        </div>

        {/* Acordeão Interativo de Dúvidas Críticas */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Perguntas Cruciais Sobre o Fundo Eleitoral
          </h4>

          <div className="space-y-2">
            {[
              {
                id: 1,
                q: 'Empresas privadas ou bancos podem doar para as campanhas?',
                a: 'Não! Desde o julgamento da ADI 5408 pelo STF em 2015, empresas privadas de qualquer porte estão proibidas de doar dinheiro ou recursos estimáveis a candidatos e partidos. Apenas pessoas físicas (cidadãos) podem doar voluntariamente do próprio bolso, com limite de até 10% do rendimento bruto declarado no ano anterior à Receita Federal.',
                icon: '🚫',
              },
              {
                id: 2,
                q: 'Qual a diferença entre Fundo Eleitoral (FEFC) e Fundo Partidário?',
                a: 'O Fundo Eleitoral (FEFC) só existe em anos de eleição e tem o objetivo exclusivo de bancar os custos diretos das campanhas eleitorais. Já o Fundo Partidário é repassado mensalmente para a manutenção ordinária dos partidos políticos (aluguel de sedes, pagamento de pessoal técnico, água, luz e pesquisas).',
                icon: '🏛️',
              },
              {
                id: 3,
                q: 'O que a nossa plataforma faz com esses dados?',
                a: 'A nossa plataforma monitora e audita em tempo real as prestações de contas homologadas pelo TSE. Quando um candidato contrata um serviço de comício, publicidade ou gráfica com recursos do FEFC, nossa ferramenta exibe a nota fiscal, o valor e checa os sócios do CNPJ contratado na Receita Federal.',
                icon: '🔍',
              },
            ].map((d) => {
              const estaAberto = duvidaAberta === d.id;
              return (
                <div
                  key={d.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => setDuvidaAberta(estaAberto ? null : d.id)}
                    className="flex w-full items-center justify-between gap-3 p-3.5 text-left text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>{d.icon}</span>
                      <span>{d.q}</span>
                    </span>
                    <span className="text-xs text-slate-400">{estaAberto ? '▲' : '▼'}</span>
                  </button>
                  {estaAberto && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 leading-relaxed">
                      {d.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé com Fontes Oficiais Clicáveis */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Fontes Oficiais & Documentação Cívica:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.tse.jus.br/comunicacao/noticias/2026/Junho/tse-divulga-distribuicao-do-fundo-especial-de-financiamento-de-campanha-para-as-eleicoes-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              title="Tribunal Superior Eleitoral - Divulgação Oficial da Distribuição do FEFC 2026"
            >
              TSE (Distribuição FEFC 2026)
            </a>
            <span>·</span>
            <a
              href="https://www12.senado.leg.br/radio/1/noticia/2026/08/24/fundo-eleitoral-de-onde-vem-o-dinheiro-das-campanhas"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              title="Rádio Senado - De onde vem o dinheiro das campanhas"
            >
              Rádio Senado
            </a>
            <span>·</span>
            <a
              href="https://www.infomoney.com.br/politica/para-onde-foram-os-r-5-bilhoes-de-2026-o-mapa-do-dinheiro-eleitoral/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              title="InfoMoney - O Mapa do Dinheiro Eleitoral"
            >
              InfoMoney
            </a>
            <span>·</span>
            <a
              href="https://www.facebook.com/Poder360/videos/-entenda-de-onde-vem-o-dinheiro-das-campanhas-eleitorais-poder-explica-elei%C3%A7%C3%B5es-/1977189109802220/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              title="Poder360 - Entenda de onde vem o dinheiro das campanhas eleitorais"
            >
              Poder360
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: PERGUNTAS FREQUENTES (FAQ GEO & RESPOSTAS DIRETAS) */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
            Perguntas Frequentes
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Tudo o Que Você Precisa Saber Sobre o Projeto
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Respostas diretas sobre integridade, procedência dos dados e como utilizar a plataforma:
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              O que é esta plataforma?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              É uma iniciativa independente e de software livre para auditoria cívica e visualização comparativa dos dados das Eleições 2026.
              Ela reúne informações de 19.088 candidatos a Presidente, Governador, Senador, Deputado Federal e Deputado Estadual/Distrital.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              De onde vêm os dados exibidos?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              100% das informações são públicas, extraídas dos sistemas oficiais do Tribunal Superior Eleitoral (TSE / DivulgaCandContas),
              da Receita Federal do Brasil (para dados cadastrais de CNPJs de fornecedores e doadores) e do IBGE.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              A plataforma possui vínculo com algum partido ou governo?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Não. O projeto é estritamente comunitário, apartidário e sem fins lucrativos. Não recebe repasses públicos nem privados,
              operando sob licença aberta MIT para assegurar a autonomia cívica do eleitor.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Como pesquisadores e jornalistas podem utilizar a base?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Todos os datasets estão disponíveis em formatos abertos (JSON, SQL), com documentação no repositório GitHub e arquivo
              padronizado <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 font-mono text-xs">/llms.txt</code> para consumo por robôs e inteligência artificial.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: COMO CITAR EM ARTIGOS & REPORTAGENS (ABNT / BIBTEX) */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/60 dark:bg-blue-950/30 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Como Citar Esta Plataforma (Pesquisas Acadêmicas & Jornalismo de Dados)
            </h3>
          </div>
          <button
            type="button"
            onClick={copiarCitacao}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-2xs transition cursor-pointer"
          >
            {copiado ? '✓ Citação Copiada!' : 'Copiar Citação ABNT'}
          </button>
        </div>
        <p className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed select-all">
          MELLO, Jorge et al. <strong>Plataforma Cívica Eleições 2026: Auditoria de Dados Abertos e Financiamento Eleitoral</strong>. Software Livre sob licença MIT. Repositório aberto: https://github.com/JorgeMello/eleicoes-2026, 2026.
        </p>
      </section>

      {/* SEÇÃO 8: CALL TO ACTION FINAL & NAVEGAÇÃO RÁPIDA */}
      <section className="text-center rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 text-white space-y-6 shadow-md dark:border-slate-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          O Voto Consciente Começa na Informação Livre.
        </h2>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
          Escolha um cargo para começar sua auditoria ou aprofunde-se no nosso manual pedagógico:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link
            to="/presidente"
            className="rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-100 shadow-2xs transition"
          >
            Presidente
          </Link>
          <Link
            to="/governador"
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition"
          >
            Governador
          </Link>
          <Link
            to="/senador"
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition"
          >
            Senador
          </Link>
          <Link
            to="/deputado-federal"
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition"
          >
            Deputado Federal
          </Link>
          <Link
            to="/deputado-estadual"
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition"
          >
            Deputado Estadual
          </Link>
          <Link
            to="/presidente/rankings"
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition"
          >
            Rankings
          </Link>
          <Link
            to="/manual"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 shadow-2xs transition"
          >
            Manual do Usuário
          </Link>
        </div>
      </section>
    </div>
  );
}
