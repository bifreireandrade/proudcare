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

const corHexPorTipo: Record<string, string> = {
  quimio_feita: '#D6188F',
  quimio_agendada: '#4DD4E8',
  retorno: '#22c55e',
  exame: '#a855f7',
}

const corBgPorTipo: Record<string, string> = {
  quimio_feita: 'bg-proud-pink',
  quimio_agendada: 'bg-proud-blue',
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
      return !sessoes.some((s) => isSameDay(criarDataLocalSegura(s.data), criarDataLocalSegura(manual.data)))
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
  const temEvento = eventos.length > 0

  const tiposUnicos = [...new Set(eventos.map((e) => e.tipo))].sort(
    (a, b) => ordemPrioridade.indexOf(a) - ordemPrioridade.indexOf(b)
  )

  const cor1 = tiposUnicos[0] ? corHexPorTipo[tiposUnicos[0]] : null
  const cor2 = tiposUnicos[1] ? corHexPorTipo[tiposUnicos[1]] : null

  const ringClass = selecionado
    ? 'ring-2 ring-proud-dark ring-offset-1'
    : hoje && !temEvento
      ? 'ring-2 ring-proud-pink'
      : hoje && temEvento
        ? 'ring-2 ring-proud-pink ring-offset-1'
        : ''

  if (!temEvento) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative aspect-square rounded-lg text-xs text-proud-dark transition hover:bg-gray-100 ${ringClass} flex items-center justify-center`}
      >
        <span>{num}</span>
        {hoje && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-proud-pink" />}
      </button>
    )
  }

  if (cor2) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative aspect-square overflow-hidden rounded-lg text-xs font-bold text-white transition ${ringClass}`}
        style={{
          background: `linear-gradient(135deg, ${cor1} 50%, ${cor2} 50%)`,
        }}
      >
        <span className="relative z-10 drop-shadow-sm">{num}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`aspect-square rounded-lg text-xs font-bold text-white transition ${corBgPorTipo[tiposUnicos[0]] ?? 'bg-gray-300'} ${ringClass} flex items-center justify-center`}
    >
      {num}
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
    <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 bg-proud-pink/5 px-4 py-3">
        <div>
          <p className="text-sm font-semibold capitalize text-proud-dark">{dataFormatada}</p>
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
          <div className="px-4 py-5 text-center">
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
              <div key={evento.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-1 items-start gap-3">
                    <div
                      className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ background: corHexPorTipo[evento.tipo] ?? '#ccc' }}
                    />

                    <div className="flex-1">
                      <p className="mb-0.5 text-sm font-semibold text-proud-dark">{evento.titulo}</p>

                      {evento.horario && (
                        <p className="mb-0.5 text-xs text-proud-gray">{evento.horario}</p>
                      )}

                      {evento.local && (
                        <p className="mb-0.5 text-xs text-proud-gray">{evento.local}</p>
                      )}

                      {evento.tipo === 'quimio_agendada' && !sessaoPassadaPendente && (
                        <p className="mt-1.5 text-xs leading-relaxed text-proud-blue">
                          Chegue 1h antes para iniciar o resfriamento. Leve um lanche leve e um agasalho.
                        </p>
                      )}

                      {evento.tipo === 'exame' && (evento as ExameSangue).jejum && (
                        <p className="mt-1 text-xs text-purple-500">Jejum necessário</p>
                      )}

                      {evento.descricao && evento.tipo !== 'quimio_agendada' && (
                        <p className="mt-1 text-xs text-proud-gray">{evento.descricao}</p>
                      )}

                      {sessaoPassadaPendente && (
                        <div className="mt-3 rounded-xl bg-proud-pink/5 p-3">
                          <p className="text-xs font-medium text-proud-dark">
                            Essa sessão aconteceu?
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-proud-gray">
                            Se aconteceu, você pode marcar como realizada e depois registrar como se sentiu.
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

                      {(evento.tipo === 'quimio_agendada' || evento.tipo === 'quimio_feita') && onRegistrar && (
                        <button
                          type="button"
                          onClick={() => onRegistrar(evento)}
                          className="mt-2 text-xs font-medium text-proud-pink"
                        >
                          Registrar como estou →
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
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null)

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

  const handleDiaClick = (dia: Date) => {
    if (diaSelecionado && isSameDay(dia, diaSelecionado)) {
      setDiaSelecionado(null)
      return
    }

    setDiaSelecionado(dia)
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-base font-semibold capitalize text-proud-dark">
            {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
          </h3>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setMesAtual(subMonths(mesAtual, 1))}
              className="rounded-lg p-1.5 transition hover:bg-gray-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setMesAtual(addMonths(mesAtual, 1))}
              className="rounded-lg p-1.5 transition hover:bg-gray-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-1 grid grid-cols-7">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="py-1 text-center text-[11px] font-medium text-proud-gray">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
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
                onClick={() => handleDiaClick(dia)}
              />
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {[
            { cor: '#D6188F', label: 'Quimio feita' },
            { cor: '#4DD4E8', label: 'Quimio agendada' },
            { cor: '#a855f7', label: 'Exame' },
            { cor: '#22c55e', label: 'Retorno' },
          ].map(({ cor, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: cor }} />
              <span className="text-[10px] text-proud-gray">{label}</span>
            </div>
          ))}
        </div>
      </div>

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