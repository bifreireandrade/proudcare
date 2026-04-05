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

  const resetarCampos = () => {
    setExpandido(null)
    setHorario('')
    setLocal('')
  }

  const handleClose = () => {
    resetarCampos()
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
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-white sm:rounded-2xl">
        <div className="flex justify-center pb-1 pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-xs text-proud-gray">Adicionar evento</p>
            <h2 className="font-heading text-base font-semibold capitalize text-proud-dark">
              {format(dia, "d 'de' MMMM", { locale: ptBR })}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 transition hover:bg-gray-100"
            aria-label="Fechar modal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2 p-4 pb-[max(env(safe-area-inset-bottom),16px)]">
          <p className="mb-3 text-xs text-proud-gray">O que você quer adicionar?</p>

          {opcoes.map(({ tipo, label, sub, cor, titulo }) => {
            const aberto = expandido === tipo

            return (
              <div
                key={tipo}
                className={`overflow-hidden rounded-xl border-2 ${cor} transition-all`}
              >
                <div className="flex items-start justify-between gap-3 px-4 py-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSalvar(tipo, titulo)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSalvar(tipo, titulo)
                      }
                    }}
                    className="flex-1 cursor-pointer text-left"
                  >
                    <p className="text-sm font-semibold text-proud-dark">{label}</p>
                    <p className="mt-0.5 text-xs text-proud-gray">{sub}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setExpandido(aberto ? null : tipo)
                      setHorario('')
                      setLocal('')
                    }}
                    className="whitespace-nowrap text-xs text-proud-gray"
                  >
                    {aberto ? 'Cancelar' : '+ detalhes'}
                  </button>
                </div>

                {aberto && (
                  <div className="space-y-3 border-t border-gray-100 px-4 pb-4 pt-3">
                    <div>
                      <label className="mb-1 block text-xs text-proud-gray">Horário (opcional)</label>
                      <input
                        type="time"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-proud-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-proud-gray">Local (opcional)</label>
                      <input
                        type="text"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-proud-pink focus:outline-none"
                        placeholder="Ex: Hospital, clínica, consultório..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSalvar(tipo, titulo)}
                      className="w-full rounded-xl bg-proud-pink py-2.5 text-sm font-medium text-white"
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