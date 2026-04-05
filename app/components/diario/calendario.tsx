'use client'

import { useMemo, useState } from 'react'
import { EventoSaude } from '@/lib/diario/types'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  eventos: EventoSaude[]
  onDiaClick?: (data: Date, evento?: EventoSaude) => void
}

function getClasseCorEvento(tipo: EventoSaude['tipo']) {
  switch (tipo) {
    case 'quimio_feita':
      return 'bg-proud-pink'
    case 'quimio_agendada':
      return 'bg-proud-blue'
    case 'exame':
      return 'bg-purple-500'
    case 'retorno':
      return 'bg-green-500'
    default:
      return 'bg-gray-300'
  }
}

function isQuimio(tipo: EventoSaude['tipo']) {
  return tipo === 'quimio_feita' || tipo === 'quimio_agendada'
}

export default function Calendario({ eventos, onDiaClick }: Props) {
  const [mesAtual, setMesAtual] = useState(new Date())

  const inicioDoMes = startOfMonth(mesAtual)
  const fimDoMes = endOfMonth(mesAtual)

  const diasDoMes = eachDayOfInterval({
    start: inicioDoMes,
    end: fimDoMes,
  })

  const primeiroDiaSemana = inicioDoMes.getDay()
  const diasVaziosAntes = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1

  const eventosOrdenados = useMemo(() => {
    return [...eventos].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    )
  }, [eventos])

  const getEventosNoDia = (dia: Date) => {
    return eventosOrdenados.filter((evento) => isSameDay(new Date(evento.data), dia))
  }

  const mesAnterior = () => setMesAtual(subMonths(mesAtual, 1))
  const proximoMes = () => setMesAtual(addMonths(mesAtual, 1))

  const cellClassForDay = (dia: Date, lista: EventoSaude[]) => {
    const hoje = isSameDay(dia, new Date())
    const base =
      'aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition relative p-1'

    if (lista.length === 0) {
      return `${base} hover:bg-gray-100 text-proud-dark ${hoje ? 'ring-2 ring-proud-pink' : ''}`
    }

    const primeiroEvento = lista[0]
    const classeCor = getClasseCorEvento(primeiroEvento.tipo)

    return `${base} ${classeCor} text-white hover:opacity-90 ${hoje ? 'ring-2 ring-proud-pink ring-offset-2' : ''}`
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-semibold text-proud-dark capitalize">
          {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
        </h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={mesAnterior}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Mês anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            onClick={proximoMes}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Próximo mês"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((dia) => (
          <div key={dia} className="text-center text-xs font-medium text-proud-gray py-2">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: diasVaziosAntes }).map((_, i) => (
          <div key={`vazio-${i}`} className="aspect-square" />
        ))}

        {diasDoMes.map((dia) => {
          const eventosNoDia = getEventosNoDia(dia)
          const principal = eventosNoDia[0]
          const hoje = isSameDay(dia, new Date())

          return (
            <button
              key={dia.toISOString()}
              type="button"
              onClick={() => onDiaClick?.(dia, principal)}
              className={cellClassForDay(dia, eventosNoDia)}
            >
              <span className={eventosNoDia.length ? 'font-bold' : ''}>{format(dia, 'd')}</span>

              {principal && isQuimio(principal.tipo) && (
                <span className="text-[10px] opacity-90 leading-none">●</span>
              )}

              {principal && !isQuimio(principal.tipo) && (
                <span className="text-[10px] opacity-90 leading-none">●</span>
              )}

              {eventosNoDia.length > 1 && (
                <span className="text-[9px] opacity-90 leading-none">
                  +{eventosNoDia.length - 1}
                </span>
              )}

              {hoje && eventosNoDia.length === 0 && (
                <span className="absolute bottom-1 w-1 h-1 bg-proud-pink rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-proud-gray">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-proud-pink rounded" />
          <span>Quimio (feita)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-proud-blue rounded" />
          <span>Quimio (agendada)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded" />
          <span>Exame</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>Retorno</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-proud-pink rounded" />
          <span>Hoje</span>
        </div>
      </div>
    </div>
  )
}