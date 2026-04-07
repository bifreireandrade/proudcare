'use client'

import { SessaoQuimio, RegistroDiario, EventoSaude } from '@/lib/diario/types'
import { getDiasAte, getDiasApos } from '@/lib/diario/utils'
import ProximaSessao from './proxima-sessao'

type Props = {
  totalSessoes: number
  sessoesConcluidas: number
  proximaSessao: SessaoQuimio | null
  ultimaSessao: SessaoQuimio | null
  sessoesFuturas: SessaoQuimio[]
  diasRegistradosNoMes: number
  registrouHoje: boolean
  diasDesdeUltimo: number | null
  ultimoRegistro: RegistroDiario | null
  registrosRecentes: RegistroDiario[]
  eventos: EventoSaude[]
  onVerHistorico: () => void
  onVerProximas: () => void
  onVerCalendario: () => void
  onRegistrar: () => void
  onEditarSessao: (
    id: string,
    campos: Partial<Pick<SessaoQuimio, 'data' | 'horario' | 'local' | 'descricao'>>
  ) => void
  onAdicionarEvento: (dia: Date) => void
  onExcluirEvento: (eventoId: string) => void
  onMarcarSessaoRealizada: (evento: EventoSaude) => void
}

function saudacao(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

function contextoDaJornada(
  ultimaSessao: SessaoQuimio | null,
  proximaSessao: SessaoQuimio | null
): string {
  if (proximaSessao) {
    const diasAte = getDiasAte(proximaSessao.data)
    if (diasAte === 0) return 'Sua próxima sessão é hoje.'
    if (diasAte === 1) return 'Falta 1 dia para sua próxima sessão.'
    return `Faltam ${diasAte} dias para sua próxima sessão.`
  }

  if (ultimaSessao) {
    const diasApos = getDiasApos(ultimaSessao.data)
    if (diasApos <= 0) return 'Hoje é o dia da sua sessão.'
    if (diasApos === 1) return 'Hoje é o dia 1 após sua última sessão.'
    return `Hoje é o dia ${diasApos} após sua última sessão.`
  }

  return 'Vamos organizar sua jornada com calma.'
}

function tituloMomentoAtual(
  ultimaSessao: SessaoQuimio | null,
  proximaSessao: SessaoQuimio | null
): string {
  if (proximaSessao) {
    const diasAte = getDiasAte(proximaSessao.data)
    if (diasAte === 0) return 'Hoje é dia de sessão'
    if (diasAte === 1) return 'Você está a 1 dia da sessão'
    if (diasAte <= 3) return `Você está a ${diasAte} dias da sessão`
    return 'Você está entre sessões'
  }

  if (ultimaSessao) {
    const diasApos = getDiasApos(ultimaSessao.data)
    if (diasApos <= 0) return 'Hoje é um dia importante'
    if (diasApos <= 2) return 'Seu corpo está em fase mais sensível'
    if (diasApos <= 5) return 'Você está em recuperação'
    return 'Você está em uma fase de intervalo'
  }

  return 'Seu momento agora'
}

function descricaoMomentoAtual(
  ultimaSessao: SessaoQuimio | null,
  proximaSessao: SessaoQuimio | null
): string {
  if (proximaSessao) {
    const diasAte = getDiasAte(proximaSessao.data)

    if (diasAte === 0) {
      return 'Tente manter o dia o mais simples possível. Foque no que precisa ser feito agora.'
    }

    if (diasAte === 1) {
      return 'Vale se preparar com calma hoje, separando o que você vai levar e reduzindo exigências.'
    }

    if (diasAte <= 3) {
      return 'Esse costuma ser um momento de antecipação. Pode ajudar organizar os próximos dias e preservar energia.'
    }

    return 'Você ainda tem um pequeno intervalo. Pode ser um bom momento para observar como está e registrar isso.'
  }

  if (ultimaSessao) {
    const diasApos = getDiasApos(ultimaSessao.data)

    if (diasApos <= 0) {
      return 'Hoje pede mais presença e menos cobrança. Vá no seu ritmo.'
    }

    if (diasApos <= 2) {
      return 'Esses primeiros dias costumam pedir mais cuidado com o corpo, descanso e observação dos sintomas.'
    }

    if (diasApos <= 5) {
      return 'Seu corpo está processando a sessão. Vale observar sinais de melhora e o que ajuda no seu dia.'
    }

    return 'Você está em um intervalo entre sessões. Esse é um bom momento para acompanhar padrões com mais clareza.'
  }

  return 'Seu app vai te ajudar a acompanhar a jornada com mais clareza ao longo do tempo.'
}

function labelContador(dias: number): string {
  if (dias === 0) return 'Nenhum registro neste mês'
  if (dias === 1) return '1 registro neste mês'
  return `${dias} registros neste mês`
}

function textoProgresso(totalSessoes: number, sessoesConcluidas: number): string {
  if (totalSessoes === 0) return 'Sua jornada ainda não foi organizada no app.'
  if (sessoesConcluidas === 0) return 'Sua jornada está começando.'
  if (sessoesConcluidas >= totalSessoes) return 'Você concluiu todas as sessões planejadas.'
  if (sessoesConcluidas / totalSessoes >= 0.5) {
    return 'Você já passou da metade das sessões planejadas.'
  }
  return 'Você já deu os primeiros passos da sua jornada.'
}

function gerarInsight(
  registrosRecentes: RegistroDiario[],
  ultimoRegistro: RegistroDiario | null
): { titulo: string; descricao: string } | null {
  const registros = [...registrosRecentes].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  )

  if (registros.length >= 2) {
    const enjooOrdenado = registros.filter(
      (r) => typeof r.enjoo === 'number' && typeof r.diasAposSessao === 'number'
    )

    if (enjooOrdenado.length >= 2) {
      const picoEnjoo = [...enjooOrdenado].sort(
        (a, b) => (b.enjoo ?? 0) - (a.enjoo ?? 0)
      )[0]
      const ultimoEnjoo = enjooOrdenado[enjooOrdenado.length - 1].enjoo ?? 0

      if (typeof picoEnjoo.enjoo === 'number' && picoEnjoo.enjoo >= 6) {
        const descricaoBase =
          picoEnjoo.diasAposSessao === 0
            ? 'Nos seus registros recentes, o enjoo apareceu com mais intensidade no próprio dia da sessão.'
            : `Nos seus registros recentes, o enjoo apareceu com mais intensidade ${
                picoEnjoo.diasAposSessao === 1
                  ? 'no dia seguinte à sessão'
                  : `${picoEnjoo.diasAposSessao} dias após a sessão`
              }.`

        const fechamento =
          ultimoEnjoo < (picoEnjoo.enjoo ?? 0)
            ? 'Depois disso, houve sinais de melhora.'
            : 'Vale continuar observando como ele evolui nos próximos dias.'

        return {
          titulo: 'Padrão observado',
          descricao: `${descricaoBase} ${fechamento}`,
        }
      }
    }

    const energiaOrdenada = registros.filter(
      (r) => typeof r.energia === 'number' && typeof r.diasAposSessao === 'number'
    )

    if (energiaOrdenada.length >= 2) {
      const piorEnergia = [...energiaOrdenada].sort(
        (a, b) => (a.energia ?? 10) - (b.energia ?? 10)
      )[0]
      const ultimaEnergia = energiaOrdenada[energiaOrdenada.length - 1].energia ?? 0

      if (
        typeof piorEnergia.energia === 'number' &&
        piorEnergia.energia <= 4 &&
        ultimaEnergia > piorEnergia.energia
      ) {
        return {
          titulo: 'Sinal de recuperação',
          descricao:
            piorEnergia.diasAposSessao === 0
              ? 'Sua energia ficou mais baixa no dia da sessão e melhorou nos registros seguintes.'
              : `Sua energia ficou mais baixa ${
                  piorEnergia.diasAposSessao === 1
                    ? 'no dia seguinte à sessão'
                    : `${piorEnergia.diasAposSessao} dias após a sessão`
                } e melhorou nos registros seguintes.`,
        }
      }
    }
  }

  if (ultimoRegistro?.oQueAjudou) {
    return {
      titulo: 'O que te ajudou antes',
      descricao: `No seu último registro, você anotou que isto ajudou: ${ultimoRegistro.oQueAjudou}.`,
    }
  }

  if (ultimoRegistro) {
    return {
      titulo: 'Seu histórico está começando',
      descricao:
        'Conforme você registrar mais dias, vamos conseguir mostrar padrões da sua jornada com mais clareza.',
    }
  }

  return null
}

export default function SecaoHoje({
  totalSessoes,
  sessoesConcluidas,
  proximaSessao,
  ultimaSessao,
  diasRegistradosNoMes,
  registrouHoje,
  ultimoRegistro,
  registrosRecentes,
  onVerHistorico,
  onVerCalendario,
  onRegistrar,
  onEditarSessao,
}: Props) {
  const contexto = contextoDaJornada(ultimaSessao, proximaSessao)
  const insight = gerarInsight(registrosRecentes, ultimoRegistro)

  const progressoPercentual =
    totalSessoes > 0 ? Math.min((sessoesConcluidas / totalSessoes) * 100, 100) : 0

  const textoRegistro = registrouHoje
    ? 'Seu registro de hoje já foi salvo.'
    : 'Se fizer sentido hoje, vale registrar como você está.'

  return (
    <div className="space-y-4">
      <section className="px-1 pt-1">
        <p className="text-sm font-medium text-proud-dark">{saudacao()}.</p>
        <p className="mt-1 text-sm text-proud-gray">{contexto}</p>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-proud-gray">
          Seu ciclo atual
        </p>

        <h2 className="mt-2 text-xl font-semibold text-proud-dark">
          {tituloMomentoAtual(ultimaSessao, proximaSessao)}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-proud-gray">
          {descricaoMomentoAtual(ultimaSessao, proximaSessao)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRegistrar}
            className="rounded-xl bg-proud-pink px-4 py-2.5 text-sm font-medium text-white"
          >
            Registrar como estou
          </button>

          <button
            type="button"
            onClick={onVerCalendario}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-proud-dark"
          >
            Ver calendário
          </button>
        </div>
      </section>

      {proximaSessao ? (
        <ProximaSessao sessao={proximaSessao} onEditar={onEditarSessao} />
      ) : totalSessoes === 0 ? (
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-base font-semibold text-proud-dark">
            Vamos começar pela sua organização
          </p>
          <p className="mt-2 text-sm leading-relaxed text-proud-gray">
            Você ainda não adicionou suas sessões no app. Quando quiser, podemos organizar
            isso com calma.
          </p>
          <button
            type="button"
            onClick={onVerHistorico}
            className="mt-4 rounded-xl bg-proud-pink px-4 py-3 text-sm font-medium text-white"
          >
            Organizar jornada
          </button>
        </section>
      ) : (
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-base font-semibold text-proud-dark">
            Suas sessões planejadas foram concluídas
          </p>
          <p className="mt-2 text-sm leading-relaxed text-proud-gray">
            Sua jornada registrada no app chegou ao fim. Você ainda pode consultar seu
            histórico quando quiser.
          </p>
          <button
            type="button"
            onClick={onVerHistorico}
            className="mt-4 text-sm font-medium text-proud-pink"
          >
            Ver jornada →
          </button>
        </section>
      )}

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-proud-dark">Como você está hoje?</h2>
            <p className="mt-2 text-sm leading-relaxed text-proud-gray">{textoRegistro}</p>
          </div>

          <div className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-proud-gray">
            {labelContador(diasRegistradosNoMes)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRegistrar}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
              registrouHoje
                ? 'border border-gray-200 bg-gray-50 text-proud-dark'
                : 'bg-proud-pink text-white'
            }`}
          >
            {registrouHoje ? 'Atualizar registro de hoje' : 'Registrar agora'}
          </button>

          <button
            type="button"
            onClick={onVerHistorico}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-proud-dark"
          >
            Ver jornada
          </button>
        </div>
      </section>

      {insight && (
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-proud-gray">
            Insight
          </p>
          <h2 className="mt-2 text-base font-semibold text-proud-dark">{insight.titulo}</h2>
          <p className="mt-2 text-sm leading-relaxed text-proud-gray">{insight.descricao}</p>
        </section>
      )}

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-proud-gray">
              Sua jornada
            </p>
            <h2 className="mt-2 text-base font-semibold text-proud-dark">
              {totalSessoes > 0
                ? `${sessoesConcluidas} de ${totalSessoes} sessões concluídas`
                : 'Sessões ainda não cadastradas'}
            </h2>
          </div>

          {totalSessoes > 0 && (
            <button
              type="button"
              onClick={onVerHistorico}
              className="text-sm font-medium text-proud-pink"
            >
              Ver jornada →
            </button>
          )}
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-proud-pink transition-all"
            style={{ width: `${progressoPercentual}%` }}
          />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-proud-gray">
          {textoProgresso(totalSessoes, sessoesConcluidas)}
        </p>
      </section>
    </div>
  )
}