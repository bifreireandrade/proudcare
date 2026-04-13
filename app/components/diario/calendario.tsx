'use client'

import { useMemo, useState } from 'react'
import { EventoSaude, ExameSangue } from '@/lib/diario/types'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { criarDataLocalSegura, isPassado } from '@/lib/diario/utils'

type Props = {
  eventos: EventoSaude[]
  onAdicionarEvento?: (dia: Date) => void
  onExcluirEvento?: (eventoId: string) => void
  onRegistrar?: (evento: EventoSaude) => void
  onMarcarSessaoRealizada?: (evento: EventoSaude) => void
  onReagendarSessao?: (evento: EventoSaude) => void
}

const corPontoPorTipo: Record<string, string> = {
  quimio_feita: 'bg-proud-pink',
  quimio_agendada: 'bg-proud-pink/50',
  retorno: 'bg-green-500',
  exame: 'bg-purple-500',
}

const corDotHex: Record<string, string> = {
  quimio_feita: '#E879A0',
  quimio_agendada: 'rgba(232,121,160,0.5)',
  retorno: '#22C55E',
  exame: '#A855F7',
}

const ordemPrioridade = ['quimio_feita', 'quimio_agendada', 'retorno', 'exame']

function deduplicar(eventos: EventoSaude[]): EventoSaude[] {
  const sessoes = eventos.filter((e) => e.id.startsWith('sessao-'))
  const manuais = eventos.filter((e) => !e.id.startsWith('sessao-'))

  const manuaisFiltrados = manuais.filter((manual) => {
    if (
      manual.tipo === 'quimio' ||
      manual.tipo === 'quimio_agendada' ||
      manual.tipo === 'quimio_feita'
    ) {
      return !sessoes.some((s) =>
        isSameDay(criarDataLocalSegura(s.data), criarDataLocalSegura(manual.data))
      )
    }
    return true
  })

  return [...sessoes, ...manuaisFiltrados]
}

function DiaCell({
  dia,
  eventos,
  hoje,
  selecionado,
  onClick,
}: {
  dia: Date
  eventos: EventoSaude[]
  hoje: boolean
  selecionado: boolean
  onClick: () => void
}) {
  const num = format(dia, 'd')
  const tiposUnicos = [...new Set(eventos.map((e) => e.tipo))].sort(
    (a, b) => ordemPrioridade.indexOf(a) - ordemPrioridade.indexOf(b)
  )

  const temEvento = tiposUnicos.length > 0

  const circuloBg = selecionado
    ? 'bg-proud-pink text-white'
    : hoje
      ? 'bg-proud-pink/10 text-proud-pink'
      : 'text-proud-dark'

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 py-0.5"
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition ${circuloBg}`}
      >
        {num}
      </div>

      <div className="flex h-1.5 items-center gap-0.5">
        {temEvento
          ? tiposUnicos.slice(0, 3).map((tipo) => (
              <span
                key={tipo}
                className={`h-1.5 w-1.5 rounded-full ${corPontoPorTipo[tipo] ?? 'bg-gray-300'}`}
              />
            ))
          : null}
      </div>
    </button>
  )
}

function EventoCard({
  evento,
  onRegistrar,
  onExcluir,
  onMarcarSessaoRealizada,
  onReagendarSessao,
}: {
  evento: EventoSaude
  onRegistrar?: (evento: EventoSaude) => void
  onExcluir?: (id: string) => void
  onMarcarSessaoRealizada?: (evento: EventoSaude) => void
  onReagendarSessao?: (evento: EventoSaude) => void
}) {
  const [expandido, setExpandido] = useState(false)
  const dataEvento = criarDataLocalSegura(evento.data)
  const sessaoPassadaPendente =
    evento.tipo === 'quimio_agendada' &&
    evento.id.startsWith('sessao-') &&
    isPassado(dataEvento)

  const dotColor = corDotHex[evento.tipo] ?? '#ccc'

  return (
    <div className="rounded-2xl bg-gray-50 p-3">
      <button
        type="button"
        className="flex w-full items-center gap-3 text-left"
        onClick={() => setExpandido((v) => !v)}
      >
        <span
          className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ background: dotColor }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-proud-dark truncate">{evento.titulo}</p>
          {(evento.horario || evento.local) && (
            <p className="text-xs text-proud-gray mt-0.5">
              {[evento.horario, evento.local].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-proud-gray flex-shrink-0 transition-transform ${expandido ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expandido && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
          {evento.tipo === 'exame' && (evento as ExameSangue).jejum && (
            <p className="text-xs text-purple-500 font-medium">Jejum necessário</p>
          )}

          {evento.descricao && evento.tipo !== 'quimio_agendada' && (
            <p className="text-xs text-proud-gray">{evento.descricao}</p>
          )}

          {sessaoPassadaPendente && (
            <div className="rounded-xl bg-proud-pink/5 p-3">
              <p className="text-xs font-medium text-proud-dark">Essa sessão aconteceu?</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => onMarcarSessaoRealizada?.(evento)}
                  className="rounded-full bg-proud-pink px-3 py-1.5 text-xs font-medium text-white"
                >
                  Sim, aconteceu
                </button>
                <button
                  type="button"
                  onClick={() => onReagendarSessao?.(evento)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-proud-gray"
                >
                  Reagendar
                </button>
              </div>
            </div>
          )}

          {(evento.tipo === 'quimio_agendada' || evento.tipo === 'quimio_feita') &&
            !sessaoPassadaPendente &&
            onRegistrar && (
              <button
                type="button"
                onClick={() => onRegistrar(evento)}
                className="text-xs font-medium text-proud-pink"
              >
                Abrir registro →
              </button>
            )}

          {!evento.id.startsWith('sessao-') && onExcluir && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Excluir este evento?')) onExcluir(evento.id)
              }}
              className="text-xs text-red-400 font-medium"
            >
              Excluir evento
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Calendario({
  eventos,
  onAdicionarEvento,
  onExcluirEvento,
  onRegistrar,
  onMarcarSessaoRealizada,
  onReagendarSessao,
}: Props) {
  const [mesAtual, setMesAtual] = useState(new Date())
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(new Date())

  const inicioDoMes = startOfMonth(mesAtual)
  const fimDoMes = endOfMonth(mesAtual)
  const diasDoMes = eachDayOfInterval({ start: inicioDoMes, end: fimDoMes })

  const primeiroDiaSemana = inicioDoMes.getDay()
  const diasVaziosAntes = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1

  const eventosDeduplicados = useMemo(() => deduplicar(eventos), [eventos])

  const eventosOrdenados = useMemo(
    () =>
      [...eventosDeduplicados].sort(
        (a, b) => criarDataLocalSegura(a.data).getTime() - criarDataLocalSegura(b.data).getTime()
      ),
    [eventosDeduplicados]
  )

  // próxima sessão futura
  const proximaSessao = useMemo(() => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return eventosOrdenados.find((e) => {
      const d = criarDataLocalSegura(e.data)
      d.setHours(0, 0, 0, 0)
      return (
        d >= hoje &&
        (e.tipo === 'quimio_agendada' || e.tipo === 'quimio_feita')
      )
    })
  }, [eventosOrdenados])

  const diasAteProxima = useMemo(() => {
    if (!proximaSessao) return null
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const data = criarDataLocalSegura(proximaSessao.data)
    data.setHours(0, 0, 0, 0)
    const diff = Math.round((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }, [proximaSessao])

  const getEventosNoDia = (dia: Date) =>
    eventosOrdenados.filter((e) => isSameDay(criarDataLocalSegura(e.data), dia))

  const eventosDiaSelecionado = diaSelecionado ? getEventosNoDia(diaSelecionado) : []

  const legenda = [
    { label: 'Sessão concluída', classe: 'bg-proud-pink' },
    { label: 'Sessão agendada', classe: 'bg-proud-pink/50' },
    { label: 'Exame', classe: 'bg-purple-500' },
    { label: 'Retorno', classe: 'bg-green-500' },
  ]

  return (
    <div className="space-y-0">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">

        {/* Banner próxima sessão */}
        {proximaSessao && diasAteProxima !== null && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-proud-pink/5 px-4 py-3">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-proud-pink" />
            <p className="text-xs text-proud-dark">
              <span className="font-semibold">Próxima sessão</span>
              {diasAteProxima === 0
                ? ' — hoje'
                : diasAteProxima === 1
                  ? ' — amanhã'
                  : ` — em ${diasAteProxima} dias`}
              {' · '}
              {format(criarDataLocalSegura(proximaSessao.data), "d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        )}

        {/* Header mês */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold capitalize text-proud-dark">
            {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
          </h2>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setMesAtual(subMonths(mesAtual, 1))}
              className="rounded-xl border border-gray-100 p-2 transition hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setMesAtual(addMonths(mesAtual, 1))}
              className="rounded-xl border border-gray-100 p-2 transition hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cabeçalho dias da semana */}
        <div className="mb-1 grid grid-cols-7">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="py-1 text-center text-[11px] font-medium text-proud-gray">
              {d}
            </div>
          ))}
        </div>

        {/* Grid de dias */}
        <div className="grid grid-cols-7">
          {Array.from({ length: diasVaziosAntes }).map((_, i) => (
            <div key={`vazio-${i}`} className="aspect-square" />
          ))}

          {diasDoMes.map((dia) => {
            const eventosNoDia = getEventosNoDia(dia)
            const hoje = isSameDay(dia, new Date())
            const selecionado = diaSelecionado ? isSameDay(dia, diaSelecionado) : false

            return (
              <DiaCell
                key={`${dia.getFullYear()}-${dia.getMonth()}-${dia.getDate()}`}
                dia={dia}
                eventos={eventosNoDia}
                hoje={hoje}
                selecionado={selecionado}
                onClick={() => setDiaSelecionado(dia)}
              />
            )
          })}
        </div>

        {/* Legenda */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {legenda.map(({ label, classe }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${classe}`} />
              <span className="text-[11px] text-proud-gray">{label}</span>
            </div>
          ))}
        </div>

        {/* Separador */}
        {diaSelecionado && (
          <div className="mt-5 border-t border-gray-100" />
        )}

        {/* Painel do dia — integrado */}
        {diaSelecionado && (
          <div className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold capitalize text-proud-dark">
                  {format(diaSelecionado, "d 'de' MMMM", { locale: ptBR })}
                </p>
                {isSameDay(diaSelecionado, new Date()) && (
                  <p className="text-xs text-proud-pink">Hoje</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onAdicionarEvento?.(diaSelecionado)}
                className="rounded-full border border-proud-pink/30 px-3 py-1 text-xs font-medium text-proud-pink"
              >
                + Adicionar
              </button>
            </div>

            {eventosDiaSelecionado.length === 0 ? (
              <p className="py-4 text-center text-sm text-proud-gray">
                Nenhum evento nesse dia.
              </p>
            ) : (
              <div className="space-y-2">
                {eventosDiaSelecionado.map((evento) => (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    onRegistrar={onRegistrar}
                    onExcluir={onExcluirEvento}
                    onMarcarSessaoRealizada={onMarcarSessaoRealizada}
                    onReagendarSessao={onReagendarSessao}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
