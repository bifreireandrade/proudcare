'use client'

import { useState } from 'react'
import { SessaoQuimio, RegistroDiario, EventoSaude, TipoHumor } from '@/lib/diario/types'
import { getDiasAte, getDiasApos } from '@/lib/diario/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ModalProximaSessao from './proxima-sessao'

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

function gerarInsight(
  registrosRecentes: RegistroDiario[],
  ultimoRegistro: RegistroDiario | null
): { titulo: string; descricao: string } | null {
  const registros = [...registrosRecentes].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  )

  if (registros.length >= 2) {
    const comEnjoo = registros.filter(
      (r) => typeof r.enjoo === 'number' && typeof r.diasAposSessao === 'number'
    )
    if (comEnjoo.length >= 2) {
      const pico = [...comEnjoo].sort((a, b) => (b.enjoo ?? 0) - (a.enjoo ?? 0))[0]
      const ultimo = comEnjoo[comEnjoo.length - 1].enjoo ?? 0
      if (typeof pico.enjoo === 'number' && pico.enjoo >= 6) {
        const base =
          pico.diasAposSessao === 0
            ? 'O enjoo apareceu com mais intensidade no próprio dia da sessão.'
            : pico.diasAposSessao === 1
              ? 'O enjoo apareceu com mais intensidade no dia seguinte à sessão.'
              : `O enjoo foi mais intenso ${pico.diasAposSessao} dias após a sessão.`
        const fechamento =
          ultimo < (pico.enjoo ?? 0)
            ? 'Depois disso, houve sinais de melhora.'
            : 'Vale continuar observando nos próximos dias.'
        return { titulo: 'Padrão observado', descricao: `${base} ${fechamento}` }
      }
    }

    const comEnergia = registros.filter(
      (r) => typeof r.energia === 'number' && typeof r.diasAposSessao === 'number'
    )
    if (comEnergia.length >= 2) {
      const pior = [...comEnergia].sort((a, b) => (a.energia ?? 10) - (b.energia ?? 10))[0]
      const ultimaEnergia = comEnergia[comEnergia.length - 1].energia ?? 0
      if (typeof pior.energia === 'number' && pior.energia <= 4 && ultimaEnergia > pior.energia) {
        return {
          titulo: 'Sinal de recuperação',
          descricao:
            pior.diasAposSessao === 1
              ? 'Sua energia ficou mais baixa no dia seguinte à sessão e melhorou nos registros seguintes.'
              : `Sua energia ficou baixa ${pior.diasAposSessao} dias após a sessão e melhorou depois.`,
        }
      }
    }
  }

  if (ultimoRegistro?.oQueAjudou) {
    return {
      titulo: 'O que te ajudou antes',
      descricao: `No seu último registro, você anotou: ${ultimoRegistro.oQueAjudou}.`,
    }
  }

  if (ultimoRegistro) {
    return {
      titulo: 'Seu histórico está crescendo',
      descricao: 'Conforme você registrar mais dias, vamos mostrar padrões da sua jornada com mais clareza.',
    }
  }

  return null
}

const opcoesHumor: {
  valor: TipoHumor
  label: string
  bg: string
  circulo: string
  texto: string
  icone: React.ReactNode
}[] = [
  {
    valor: 'bem',
    label: 'Bem',
    bg: 'bg-green-50',
    circulo: 'bg-green-500',
    texto: 'text-green-700',
    icone: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="6.5" r="1" fill="white" />
        <circle cx="10.5" cy="6.5" r="1" fill="white" />
        <path d="M5 10c.8 1.2 2 1.8 3 1.8s2.2-.6 3-1.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    valor: 'cansada',
    label: 'Cansada',
    bg: 'bg-amber-50',
    circulo: 'bg-amber-400',
    texto: 'text-amber-800',
    icone: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="6.5" r="1" fill="white" />
        <circle cx="10.5" cy="6.5" r="1" fill="white" />
        <path d="M5.5 10.5h5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    valor: 'enjoada',
    label: 'Enjoada',
    bg: 'bg-purple-50',
    circulo: 'bg-purple-500',
    texto: 'text-purple-800',
    icone: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="6.5" r="1" fill="white" />
        <circle cx="10.5" cy="6.5" r="1" fill="white" />
        <path d="M5 11c.8-1.2 2-1.8 3-1.8s2.2.6 3 1.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    valor: 'com_dor',
    label: 'Com dor',
    bg: 'bg-red-50',
    circulo: 'bg-red-500',
    texto: 'text-red-800',
    icone: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="6" r="1" fill="white" />
        <circle cx="10.5" cy="6" r="1" fill="white" />
        <path d="M5 10.5c.8-1 2-1.5 3-1.5s2.2.5 3 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function SecaoHoje({
  totalSessoes,
  sessoesConcluidas,
  proximaSessao,
  ultimaSessao,
  registrosRecentes,
  ultimoRegistro,
  registrouHoje,
  onVerHistorico,
  onVerCalendario,
  onRegistrar,
  onEditarSessao,
}: Props) {
  const [modalSessaoAberto, setModalSessaoAberto] = useState(false)
  const [humorSelecionado, setHumorSelecionado] = useState<TipoHumor | null>(null)
  const [humorRegistrado, setHumorRegistrado] = useState(false)

  const insight = gerarInsight(registrosRecentes, ultimoRegistro)
  const progressoPercentual =
    totalSessoes > 0 ? Math.round((sessoesConcluidas / totalSessoes) * 100) : 0

  const labelProximaSessao = () => {
    if (!proximaSessao) return null
    const diasAte = getDiasAte(proximaSessao.data)
    const diaSemana = format(proximaSessao.data, 'EEE', { locale: ptBR })
    const diaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)
    const dataFormatada = format(proximaSessao.data, "d 'de' MMMM", { locale: ptBR })

    if (diasAte === 0) return `Hoje · ${dataFormatada}`
    if (diasAte === 1) return `Amanhã · ${dataFormatada}`
    return `${diaCapitalizado} · ${dataFormatada} · em ${diasAte} dias`
  }

  const textoProgresso = () => {
    if (totalSessoes === 0) return 'Sua jornada ainda não foi organizada no app.'
    if (sessoesConcluidas >= totalSessoes) return 'Você concluiu todas as sessões planejadas.'
    const restam = totalSessoes - sessoesConcluidas
    if (progressoPercentual >= 50) return `Reta final — ${restam === 1 ? 'falta só 1 sessão' : `faltam só ${restam} sessões`}.`
    return 'Você já deu os primeiros passos da sua jornada.'
  }

  return (
    <div className="space-y-3">

      {/* Card humor — fundo rosa suave, borda rosa */}
      <section className="rounded-3xl border border-proud-pink/20 bg-proud-pink/5 p-5">
        <p className="text-xs text-proud-pink mb-1">
          {saudacao()}{ultimaSessao || proximaSessao ? ', Maria' : ''}
        </p>
        <h1 className="text-xl font-semibold text-proud-dark leading-snug mb-5">
          {registrouHoje || humorRegistrado
            ? 'Como você está se sentindo hoje?'
            : 'Como você está\nse sentindo hoje?'}
        </h1>

        {!registrouHoje && !humorRegistrado ? (
          <>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {opcoesHumor.map((opcao) => (
                <button
                  key={opcao.valor}
                  type="button"
                  onClick={() => {
                    setHumorSelecionado(opcao.valor)
                    setHumorRegistrado(true)
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-white py-3 px-1 transition border border-proud-pink/20 hover:border-proud-pink/40"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${opcao.circulo}`}>
                    {opcao.icone}
                  </div>
                  <span className={`text-[11px] font-medium ${opcao.texto}`}>
                    {opcao.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-proud-gray">
              ou{' '}
              <button type="button" onClick={onRegistrar} className="font-medium text-proud-pink">
                registrar com mais detalhes →
              </button>
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-proud-dark">
                  {humorRegistrado && humorSelecionado
                    ? `Registrado: ${opcoesHumor.find(o => o.valor === humorSelecionado)?.label}`
                    : 'Registro salvo'}
                </p>
                <button type="button" onClick={onRegistrar} className="text-xs text-proud-pink font-medium">
                  Adicionar detalhes →
                </button>
              </div>
            </div>
            {humorRegistrado && (
              <button
                type="button"
                onClick={() => { setHumorRegistrado(false); setHumorSelecionado(null) }}
                className="text-xs text-proud-gray"
              >
                Alterar
              </button>
            )}
          </div>
        )}
      </section>

      {/* Card próxima sessão */}
      {proximaSessao && (
        <button
          type="button"
          onClick={() => setModalSessaoAberto(true)}
          className="flex w-full items-center gap-3 rounded-3xl border border-proud-pink/20 bg-white px-5 py-4 text-left transition hover:bg-proud-pink/5"
        >
          <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-proud-pink/40" />
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-proud-pink mb-0.5">
              Próxima sessão
            </p>
            <p className="text-sm font-semibold text-proud-dark">
              Sessão {proximaSessao.numeroSessao}
            </p>
            <p className="text-xs text-proud-gray">{labelProximaSessao()}</p>
          </div>
          <svg className="h-4 w-4 flex-shrink-0 text-proud-pink/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Card insight */}
      {insight && (
        <div className="flex items-start gap-3 rounded-3xl border border-proud-pink/20 bg-white px-5 py-4">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-proud-pink/10">
            <svg className="h-3.5 w-3.5 text-proud-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-proud-dark">{insight.titulo}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-proud-gray">{insight.descricao}</p>
          </div>
        </div>
      )}

      {/* Card progresso */}
      {totalSessoes > 0 && (
        <div className="rounded-3xl border border-proud-pink/20 bg-white px-5 py-5">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <p className="text-base font-semibold text-proud-dark">
                {sessoesConcluidas} de {totalSessoes} sessões concluídas
              </p>
              <p className="mt-1 text-xs text-proud-gray">{textoProgresso()}</p>
            </div>
            <p className="text-2xl font-semibold text-proud-pink">{progressoPercentual}%</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-proud-pink/10">
            <div
              className="h-full rounded-full bg-proud-pink transition-all"
              style={{ width: `${progressoPercentual}%` }}
            />
          </div>
          <button type="button" onClick={onVerHistorico} className="mt-3 text-xs font-medium text-proud-pink">
            Ver jornada →
          </button>
        </div>
      )}

      {/* Estado vazio */}
      {totalSessoes === 0 && (
        <div className="rounded-3xl border border-proud-pink/20 bg-white px-5 py-5">
          <p className="text-sm font-medium text-proud-dark mb-1">Vamos organizar sua jornada</p>
          <p className="text-xs leading-relaxed text-proud-gray mb-3">
            Adicione suas sessões para acompanhar o tratamento com mais clareza.
          </p>
          <button type="button" onClick={onVerHistorico} className="rounded-2xl bg-proud-pink px-4 py-2 text-xs font-medium text-white">
            Organizar jornada
          </button>
        </div>
      )}


      {/* Modal da próxima sessão */}
      {proximaSessao && (
        <ModalProximaSessao
          sessao={proximaSessao}
          isOpen={modalSessaoAberto}
          onClose={() => setModalSessaoAberto(false)}
          onEditar={onEditarSessao}
          onReagendar={() => {
            setModalSessaoAberto(false)
          }}
          onVerCalendario={() => {
            setModalSessaoAberto(false)
            onVerCalendario()
          }}
        />
      )}
    </div>
  )
}
