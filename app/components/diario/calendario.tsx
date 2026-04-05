'use client'

import { useMemo, useState } from 'react'
import { EventoSaude } from '@/lib/diario/types'
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  format, isSameDay, addMonths, subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  eventos: EventoSaude[]
  onAdicionarEvento?: (dia: Date) => void
  onExcluirEvento?: (eventoId: string) => void
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

function eventoPrincipal(eventos: EventoSaude[]): EventoSaude | null {
  for (const tipo of ordemPrioridade) {
    const found = eventos.find((e) => e.tipo === tipo)
    if (found) return found
  }
  return eventos[0] ?? null
}

// Remove eventos manuais de quimio quando já existe sessão no mesmo dia
function deduplicar(eventos: EventoSaude[]): EventoSaude[] {
  const sessoes = eventos.filter(e => e.id.startsWith('sessao-'))
  const manuais = eventos.filter(e => !e.id.startsWith('sessao-'))

  const manuaisFiltrados = manuais.filter(manual => {
    // Se for quimio manual e já existe sessão no mesmo dia, remove
    if (manual.tipo === 'quimio' || manual.tipo === 'quimio_agendada' || manual.tipo === 'quimio_feita') {
      return !sessoes.some(s => isSameDay(new Date(s.data), new Date(manual.data)))
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
  const principal = eventoPrincipal(eventos)

  // Tipos únicos por prioridade
  const tiposUnicos = [...new Set(eventos.map(e => e.tipo))]
    .sort((a, b) => ordemPrioridade.indexOf(a) - ordemPrioridade.indexOf(b))

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
        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs text-proud-dark hover:bg-gray-100 transition relative ${ringClass}`}
      >
        <span>{num}</span>
        {hoje && (
          <span className="absolute bottom-1 w-1 h-1 bg-proud-pink rounded-full" />
        )}
      </button>
    )
  }

  // Dia com 2 tipos: dividido diagonalmente
  if (cor2) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`aspect-square rounded-lg overflow-hidden relative text-xs font-bold text-white transition ${ringClass}`}
        style={{
          background: `linear-gradient(135deg, ${cor1} 50%, ${cor2} 50%)`,
        }}
      >
        <span className="relative z-10 drop-shadow-sm">{num}</span>
      </button>
    )
  }

  // Dia com 1 tipo: cor sólida
  return (
    <button
      type="button"
      onClick={onClick}
      className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold text-white transition ${corBgPorTipo[tiposUnicos[0]] ?? 'bg-gray-300'} ${ringClass}`}
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
}: {
  dia: Date
  eventos: EventoSaude[]
  onAdicionar: () => void
  onExcluir?: (id: string) => void
  onRegistrar?: () => void
}) {
  const dataFormatada = format(dia, "d 'de' MMMM", { locale: ptBR })
  const hoje = isSameDay(dia, new Date())

  return (
    <div className="mt-3 rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-proud-pink/5 border-b border-gray-100">
        <div>
          <p className="text-sm font-semibold text-proud-dark capitalize">{dataFormatada}</p>
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
          eventos.map((evento) => (
            <div key={evento.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: corHexPorTipo[evento.tipo] ?? '#ccc' }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-proud-dark mb-0.5">{evento.titulo}</p>

                    {evento.horario && (
                      <p className="text-xs text-proud-gray mb-0.5">{evento.horario}</p>
                    )}
                    {evento.local && (
                      <p className="text-xs text-proud-gray mb-0.5">{evento.local}</p>
                    )}

                    {/* Dica para quimio agendada */}
                    {evento.tipo === 'quimio_agendada' && (
                      <p className="text-xs text-proud-blue mt-1.5 leading-relaxed">
                        Chegue 1h antes para iniciar o resfriamento. Leve lanche leve e agasalho.
                      </p>
                    )}

                    {/* Jejum para exame */}
                    {evento.tipo === 'exame' && (evento as any).jejum && (
                      <p className="text-xs text-purple-500 mt-1">Jejum necessário</p>
                    )}

                    {evento.descricao && evento.tipo !== 'quimio_agendada' && (
                      <p className="text-xs text-proud-gray mt-1">{evento.descricao}</p>
                    )}

                    {(evento.tipo === 'quimio_agendada' || evento.tipo === 'quimio_feita') && onRegistrar && (
                      <button
                        type="button"
                        onClick={onRegistrar}
                        className="mt-2 text-xs text-proud-pink font-medium"
                      >
                        Registrar como estou →
                      </button>
                    )}
                  </div>
                </div>

                {/* Excluir só eventos manuais */}
                {!evento.id.startsWith('sessao-') && onExcluir && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Excluir este evento?')) onExcluir(evento.id)
                    }}
                    className="text-gray-300 hover:text-red-400 transition text-lg leading-none mt-0.5"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function Calendario({ eventos, onAdicionarEvento, onExcluirEvento }: Props) {
  const [mesAtual, setMesAtual] = useState(new Date())
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null)

  const inicioDoMes = startOfMonth(mesAtual)
  const fimDoMes = endOfMonth(mesAtual)
  const diasDoMes = eachDayOfInterval({ start: inicioDoMes, end: fimDoMes })

  const primeiroDiaSemana = inicioDoMes.getDay()
  const diasVaziosAntes = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1

  const eventosDeduplicados = useMemo(() => deduplicar(eventos), [eventos])

  const eventosOrdenados = useMemo(() =>
    [...eventosDeduplicados].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()),
    [eventosDeduplicados]
  )

  const getEventosNoDia = (dia: Date) =>
    eventosOrdenados.filter((e) => isSameDay(new Date(e.data), dia))

  const eventosDiaSelecionado = diaSelecionado ? getEventosNoDia(diaSelecionado) : []

  const handleDiaClick = (dia: Date) => {
    if (diaSelecionado && isSameDay(dia, diaSelecionado)) {
      setDiaSelecionado(null)
    } else {
      setDiaSelecionado(dia)
    }
  }

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-base font-semibold text-proud-dark capitalize">
            {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="flex gap-1">
            <button type="button" onClick={() => setMesAtual(subMonths(mesAtual, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button type="button" onClick={() => setMesAtual(addMonths(mesAtual, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 mb-1">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-proud-gray py-1">{d}</div>
          ))}
        </div>

        {/* Grid */}
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
                key={dia.toISOString()}
                dia={dia}
                eventos={eventosNoDia}
                hoje={hoje}
                selecionado={selecionado}
                onClick={() => handleDiaClick(dia)}
              />
            )
          })}
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          {[
            { cor: '#D6188F', label: 'Quimio feita' },
            { cor: '#4DD4E8', label: 'Quimio agendada' },
            { cor: '#a855f7', label: 'Exame' },
            { cor: '#22c55e', label: 'Retorno' },
          ].map(({ cor, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: cor }} />
              <span className="text-[10px] text-proud-gray">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Painel inline */}
      {diaSelecionado && (
        <PainelDia
          dia={diaSelecionado}
          eventos={eventosDiaSelecionado}
          onAdicionar={() => onAdicionarEvento?.(diaSelecionado)}
          onExcluir={onExcluirEvento}
          onRegistrar={() => { window.location.href = '/diario?tab=registrar' }}
        />
      )}
    </div>
  )
}
