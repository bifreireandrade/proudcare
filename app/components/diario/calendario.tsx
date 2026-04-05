'use client'

import { useState } from 'react'
import { EventoSaude, SessaoQuimio } from '@/lib/diario/types'
import { getCorEvento } from '@/lib/diario/utils'
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

function isSessaoQuimio(e: EventoSaude): e is SessaoQuimio {
  return e.tipo === 'quimio'
}

export default function Calendario({ eventos, onDiaClick }: Props) {
  const [mesAtual, setMesAtual] = useState(new Date())

  const inicioDoMes = startOfMonth(mesAtual)
  const fimDoMes = endOfMonth(mesAtual)

  const diasDoMes = eachDayOfInterval({ start: inicioDoMes, end: fimDoMes })

  const primeiroDiaSemana = inicioDoMes.getDay()
  const diasVaziosAntes = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1

  const getEventosNoDia = (dia: Date) => {
    return eventos.filter((e) => isSameDay(e.data, dia))
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

    const primeiro = lista[0]
    if (isSessaoQuimio(primeiro)) {
      const bg = getCorEvento('quimio', primeiro.status === 'concluida')
      return `${base} ${bg} text-white hover:opacity-90`
    }
    const bg = getCorEvento(primeiro.tipo)
    return `${base} ${bg} text-white hover:opacity-90`
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={proximoMes}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Próximo mês"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
          const noDia = getEventosNoDia(dia)
          const principal = noDia[0]
          const hoje = isSameDay(dia, new Date())

          return (
            <button
              key={dia.toISOString()}
              type="button"
              onClick={() => onDiaClick?.(dia, principal)}
              className={cellClassForDay(dia, noDia)}
            >
              <span className={noDia.length ? 'font-bold' : ''}>{format(dia, 'd')}</span>

              {principal && isSessaoQuimio(principal) && (
                <span className="text-[10px] opacity-90 leading-none">S{principal.numeroSessao}</span>
              )}

              {principal && !isSessaoQuimio(principal) && (
                <span className="text-[10px] opacity-90 leading-none">●</span>
              )}

              {noDia.length > 1 && (
                <span className="text-[9px] opacity-90 leading-none">+{noDia.length - 1}</span>
              )}

              {hoje && noDia.length === 0 && (
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
