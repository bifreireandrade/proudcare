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
}

const corPontoPorTipo: Record<string, string> = {
  quimio_feita: 'bg-proud-pink',
  quimio_agendada: 'bg-proud-pink/70',
  retorno: 'bg-green-500',
  exame: 'bg-purple-500',
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

  const baseClass = selecionado
    ? 'border-proud-dark bg-white'
    : hoje
      ? 'border-proud-pink bg-proud-pink/5'
      : 'border-gray-100 bg-white hover:bg-gray-50'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative aspect-square rounded-2xl border p-2 text-left transition ${baseClass}`}
    >
      <span className={`text-sm font-medium ${hoje ? 'text-proud-dark' : 'text-proud-dark'}`}>
        {num}
      </span>

      {temEvento && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          {tiposUnicos.slice(0, 3).map((tipo) => (
            <span
              key={tipo}
              className={`h-1.5 w-1.5 rounded-full ${corPontoPorTipo[tipo] ?? 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </button>
  )
}

function PainelDia({
  dia,
  eventos,
  onAdicionar,
  onExcluir,
  onRegistrar,
  onMarcarSessaoRealizada,
}: {
  dia: Date
  eventos: EventoSaude[]
  onAdicionar: () => void
  onExcluir?: (id: string) => void
  onRegistrar?: (evento: EventoSaude) => void
  onMarcarSessaoRealizada?: (evento: EventoSaude) => void
}) {
  const dataFormatada = format(dia, "d 'de' MMMM", { locale: ptBR })
  const hoje = isSameDay(dia, new Date())

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="text-base font-semibold capitalize text-proud-dark">{dataFormatada}</p>
          {hoje && <p className="text-xs text-proud-pink">Hoje</p>}
        </div>

        <button
          type="button"
          onClick={onAdicionar}
          className="rounded-full border border-proud-pink/30 px-3 py-1 text-xs font-medium text-proud-pink"
        >
          + Adicionar
        </button>
      </div>

      <div className="divide-y divide-gray-50">
        {eventos.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="text-sm text-proud-gray">Nenhum evento nesse dia.</p>
          </div>
        ) : (
          eventos.map((evento) => {
            const dataEvento = criarDataLocalSegura(evento.data)
            const sessaoPassadaPendente =
              evento.tipo === 'quimio_agendada' &&
              evento.id.startsWith('sessao-') &&
              isPassado(dataEvento)

            return (
              <div key={evento.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-1 items-start gap-3">
                    <div
                      className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        corPontoPorTipo[evento.tipo] ?? 'bg-gray-300'
                      }`}
                    />

                    <div className="flex-1">
                      <p className="mb-0.5 text-sm font-semibold text-proud-dark">
                        {evento.titulo}
                      </p>

                      {evento.horario && (
                        <p className="mb-0.5 text-xs text-proud-gray">{evento.horario}</p>
                      )}

                      {evento.local && (
                        <p className="mb-0.5 text-xs text-proud-gray">{evento.local}</p>
                      )}

                      {evento.tipo === 'quimio_agendada' && !sessaoPassadaPendente && (
                        <p className="mt-1.5 text-xs leading-relaxed text-proud-gray">
                          Sessão planejada. Se quiser, você pode abrir o registro quando chegar o momento.
                        </p>
                      )}

                      {evento.tipo === 'exame' && (evento as ExameSangue).jejum && (
                        <p className="mt-1 text-xs text-purple-500">Jejum necessário</p>
                      )}

                      {evento.descricao && evento.tipo !== 'quimio_agendada' && (
                        <p className="mt-1 text-xs text-proud-gray">{evento.descricao}</p>
                      )}

                      {sessaoPassadaPendente && (
                        <div className="mt-3 rounded-2xl bg-proud-pink/5 p-3">
                          <p className="text-xs font-medium text-proud-dark">
                            Essa sessão aconteceu?
                          </p>

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => onMarcarSessaoRealizada?.(evento)}
                              className="rounded-full bg-proud-pink px-3 py-1.5 text-xs font-medium text-white"
                            >
                              Sim, aconteceu
                            </button>

                            <button
                              type="button"
                              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-proud-gray"
                            >
                              Ainda não
                            </button>
                          </div>
                        </div>
                      )}

                      {(evento.tipo === 'quimio_agendada' || evento.tipo === 'quimio_feita') &&
                        onRegistrar && (
                          <button
                            type="button"
                            onClick={() => onRegistrar(evento)}
                            className="mt-2 text-xs font-medium text-proud-pink"
                          >
                            Abrir registro →
                          </button>
                        )}
                    </div>
                  </div>

                  {!evento.id.startsWith('sessao-') && onExcluir && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Excluir este evento?')) onExcluir(evento.id)
                      }}
                      className="mt-0.5 text-lg leading-none text-gray-300 transition hover:text-red-400"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function Calendario({
  eventos,
  onAdicionarEvento,
  onExcluirEvento,
  onRegistrar,
  onMarcarSessaoRealizada,
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

  const getEventosNoDia = (dia: Date) =>
    eventosOrdenados.filter((e) => isSameDay(criarDataLocalSegura(e.data), dia))

  const eventosDiaSelecionado = diaSelecionado ? getEventosNoDia(diaSelecionado) : []

  const legenda = [
    { label: 'Sessão concluída', classe: 'bg-proud-pink' },
    { label: 'Sessão agendada', classe: 'bg-proud-pink/70' },
    { label: 'Exame', classe: 'bg-purple-500' },
    { label: 'Retorno', classe: 'bg-green-500' },
  ]

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-proud-gray">
              Calendário
            </p>
            <h2 className="mt-2 font-heading text-xl font-semibold capitalize text-proud-dark">
              {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
            </h2>
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setMesAtual(subMonths(mesAtual, 1))}
              className="rounded-xl border border-gray-100 p-2 transition hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setMesAtual(addMonths(mesAtual, 1))}
              className="rounded-xl border border-gray-100 p-2 transition hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="py-1 text-center text-[11px] font-medium text-proud-gray">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
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

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {legenda.map(({ label, classe }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${classe}`} />
              <span className="text-[11px] text-proud-gray">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {diaSelecionado && (
        <PainelDia
          dia={diaSelecionado}
          eventos={eventosDiaSelecionado}
          onAdicionar={() => onAdicionarEvento?.(diaSelecionado)}
          onExcluir={onExcluirEvento}
          onRegistrar={onRegistrar}
          onMarcarSessaoRealizada={onMarcarSessaoRealizada}
        />
      )}
    </div>
  )
}