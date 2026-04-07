'use client'

import { useRouter } from 'next/navigation'
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
  if (hora < 12) return 'Bom dia ☀️'
  if (hora < 18) return 'Boa tarde 🌤️'
  return 'Boa noite 🌙'
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

function mensagemContextual(
  ultimaSessao: SessaoQuimio | null,
  proximaSessao: SessaoQuimio | null
): string | null {
  if (proximaSessao) {
    const diasAte = getDiasAte(proximaSessao.data)

    if (diasAte === 0) {
      return 'Hoje é um dia importante. Respire no seu tempo e foque só no próximo passo.'
    }

    if (diasAte === 1) {
      return 'Sua sessão é amanhã. Pode ser um bom momento para separar o que você vai precisar e deixar o dia mais leve.'
    }

    if (diasAte <= 3) {
      return 'Sua próxima sessão está chegando. Tente preservar sua energia e manter o que te ajuda a se sentir mais preparada.'
    }

    return 'Ainda há um pequeno intervalo até a próxima sessão. Aproveite este tempo para se observar com calma.'
  }

  if (ultimaSessao) {
    const diasApos = getDiasApos(ultimaSessao.data)

    if (diasApos <= 0) return null

    if (diasApos <= 2) {
      return 'Esses primeiros dias depois da sessão costumam exigir mais cuidado com o corpo e com o ritmo.'
    }

    if (diasApos <= 5) {
      return 'Você está atravessando a fase de recuperação. Vale observar o que melhora e o que ainda pede atenção.'
    }

    return 'Seu corpo já avançou alguns dias desde a última sessão. Registrar como você está pode ajudar a entender seus padrões com mais clareza.'
  }

  return 'Registrar como você está pode ajudar a acompanhar sua jornada com mais clareza.'
}

function mensagemLembrete(
  diasDesdeUltimo: number | null,
  registrouHoje: boolean
): string | null {
  if (registrouHoje) return 'Seu registro de hoje já foi salvo.'
  if (diasDesdeUltimo === null) {
    return 'Você ainda não fez nenhum registro. Quando quiser, pode começar por aqui.'
  }
  if (diasDesdeUltimo === 1) return 'Seu último registro foi ontem.'
  if (diasDesdeUltimo <= 4) return `Seu último registro foi há ${diasDesdeUltimo} dias.`
  return 'Faz alguns dias desde o último registro. Quando estiver bem, vale anotar como você está hoje.'
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
            ? 'Nos seus registros mais recentes, o enjoo apareceu com mais intensidade no próprio dia da sessão.'
            : `Nos seus registros mais recentes, o enjoo apareceu com mais intensidade ${
                picoEnjoo.diasAposSessao === 1
                  ? 'no dia seguinte à sessão'
                  : `${picoEnjoo.diasAposSessao} dias após a sessão`
              }.`

        const fechamento =
          ultimoEnjoo < (picoEnjoo.enjoo ?? 0)
            ? 'Depois disso, ele mostrou sinal de redução.'
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
  diasDesdeUltimo,
  ultimoRegistro,
  registrosRecentes,
  onVerHistorico,
  onVerProximas,
  onEditarSessao,
}: Props) {
  const router = useRouter()

  const contexto = contextoDaJornada(ultimaSessao, proximaSessao)
  const mensagem = mensagemContextual(ultimaSessao, proximaSessao)
  const lembrete = mensagemLembrete(diasDesdeUltimo, registrouHoje)
  const insight = gerarInsight(registrosRecentes, ultimoRegistro)

  const progressoPercentual =
    totalSessoes > 0
      ? Math.min((sessoesConcluidas / totalSessoes) * 100, 100)
      : 0

  return (
    <div className="space-y-4">
      <section className="px-1 pt-1">
        <p className="text-sm font-medium text-proud-dark">{saudacao()}</p>
        <p className="mt-1 text-sm text-proud-gray">{contexto}</p>
      </section>

      {proximaSessao ? (
        <ProximaSessao sessao={proximaSessao} onEditar={onEditarSessao} />
      ) : totalSessoes === 0 ? (
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-base font-semibold text-proud-dark">
            Vamos começar pela sua organização
          </p>
          <p className="mt-2 text-sm leading-relaxed text-proud-gray">
            Você ainda não adicionou suas sessões no app. Quando quiser, podemos
            organizar isso com calma.
          </p>
          <button
            type="button"
            onClick={onVerProximas}
            className="mt-4 rounded-xl bg-proud-pink px-4 py-3 text-sm font-medium text-white"
          >
            Adicionar sessões
          </button>
        </section>
      ) : (
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-base font-semibold text-proud-dark">
            Suas sessões planejadas foram concluídas
          </p>
          <p className="mt-2 text-sm leading-relaxed text-proud-gray">
            Sua jornada registrada no app chegou ao fim. Você ainda pode consultar
            seu histórico quando quiser.
          </p>
          <button
            type="button"
            onClick={onVerHistorico}
            className="mt-4 text-sm font-medium text-proud-pink"
          >
            Ver histórico →
          </button>
        </section>
      )}

      {mensagem && (
        <section className="rounded-3xl border border-proud-pink/10 bg-proud-pink/5 px-5 py-4">
          <p className="text-sm leading-relaxed text-proud-dark">{mensagem}</p>
        </section>
      )}

      {insight && (
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-proud-gray">
            Insight
          </p>
          <h2 className="mt-2 text-base font-semibold text-proud-dark">
            {insight.titulo}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-proud-gray">
            {insight.descricao}
          </p>
        </section>
      )}

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-proud-dark">
              Como você está hoje?
            </h2>
            {lembrete && (
              <p className="mt-2 text-sm leading-relaxed text-proud-gray">
                {lembrete}
              </p>
            )}
          </div>

          <div className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-proud-gray">
            {labelContador(diasRegistradosNoMes)}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push('/diario?tab=registrar')}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
              registrouHoje
                ? 'border border-gray-200 bg-gray-50 text-proud-dark'
                : 'bg-proud-pink text-white'
            }`}
          >
            {registrouHoje ? 'Registrar novamente' : 'Registrar como estou agora'}
          </button>

          <button
            type="button"
            onClick={onVerHistorico}
            className="text-sm font-medium text-proud-pink"
          >
            Ver histórico →
          </button>
        </div>
      </section>

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
              onClick={onVerProximas}
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