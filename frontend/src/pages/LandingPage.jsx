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

      {/* SEÇÃO 6: PERGUNTAS FREQUENTES (FAQ GEO & RESPOSTAS DIRETAS) */}
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
