'use client'

import { useState } from 'react'
import { EventoSaude, TipoEvento } from '@/lib/diario/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  isOpen: boolean
  onClose: () => void
  dia: Date
  onSalvar: (evento: Partial<EventoSaude>) => void
}

const opcoes = [
  {
    tipo: 'quimio_agendada' as TipoEvento,
    label: 'Sessão de quimioterapia',
    sub: 'Agendar ou reagendar',
    cor: 'border-proud-pink',
    titulo: 'Sessão de quimioterapia',
  },
  {
    tipo: 'exame' as TipoEvento,
    label: 'Exame de sangue',
    sub: 'Hemograma, plaquetas, etc',
    cor: 'border-purple-400',
    titulo: 'Exame de sangue',
  },
  {
    tipo: 'retorno' as TipoEvento,
    label: 'Retorno médico',
    sub: 'Consulta com oncologista',
    cor: 'border-green-400',
    titulo: 'Retorno médico',
  },
]

export default function ModalEvento({ isOpen, onClose, dia, onSalvar }: Props) {
  const [expandido, setExpandido] = useState<TipoEvento | null>(null)
  const [horario, setHorario] = useState('')
  const [local, setLocal] = useState('')

  if (!isOpen) return null

  const handleClose = () => {
    setExpandido(null)
    setHorario('')
    setLocal('')
    onClose()
  }

  const handleSalvar = (tipo: TipoEvento, tituloBase: string) => {
    onSalvar({
      tipo,
      data: dia,
      titulo: tituloBase,
      horario: horario || undefined,
      local: local || undefined,
      usuarioId: 'user-1',
      createdAt: new Date(),
    })
    handleClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md">

        {/* Handle bar mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-proud-gray">Adicionar evento</p>
            <h2 className="font-heading text-base font-semibold text-proud-dark capitalize">
              {format(dia, "d 'de' MMMM", { locale: ptBR })}
            </h2>
          </div>
          <button type="button" onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Opções */}
        <div className="p-4 space-y-2 pb-[max(env(safe-area-inset-bottom),16px)]">
          <p className="text-xs text-proud-gray mb-3">O que você quer adicionar?</p>

          {opcoes.map(({ tipo, label, sub, cor, titulo }) => {
            const aberto = expandido === tipo

            return (
              <div key={tipo} className={`border-2 ${cor} rounded-xl overflow-hidden transition-all`}>
                {/* Linha principal — clique salva direto */}
                <button
                  type="button"
                  onClick={() => {
                    if (!aberto) {
                      // salva direto sem detalhes extras
                      handleSalvar(tipo, titulo)
                    }
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-proud-dark">{label}</p>
                      <p className="text-xs text-proud-gray mt-0.5">{sub}</p>
                    </div>
                    {/* Botão de detalhes opcionais */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandido(aberto ? null : tipo)
                        setHorario('')
                        setLocal('')
                      }}
                      className="text-xs text-proud-gray ml-2 whitespace-nowrap"
                    >
                      {aberto ? 'Cancelar' : '+ detalhes'}
                    </button>
                  </div>
                </button>

                {/* Campos extras — só se expandido */}
                {aberto && (
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                    <div>
                      <label className="block text-xs text-proud-gray mb-1">Horário (opcional)</label>
                      <input
                        type="time"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-proud-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-proud-gray mb-1">Local (opcional)</label>
                      <input
                        type="text"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-proud-pink"
                        placeholder="Ex: Hospital XYZ, Sala 302..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSalvar(tipo, titulo)}
                      className="w-full bg-proud-pink text-white py-2.5 rounded-xl text-sm font-medium"
                    >
                      Salvar
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
