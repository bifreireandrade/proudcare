'use client'

import { useState } from 'react'
import { SessaoQuimio } from '@/lib/diario/types'
import { getDiasAte, formatarData } from '@/lib/diario/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  sessao: SessaoQuimio
  isOpen: boolean
  onClose: () => void
  onEditar: (
    id: string,
    campos: Partial<Pick<SessaoQuimio, 'data' | 'horario' | 'local' | 'descricao'>>
  ) => void
  onReagendar: () => void
  onVerCalendario: () => void
}

export default function ModalProximaSessao({
  sessao,
  isOpen,
  onClose,
  onEditar,
  onReagendar,
  onVerCalendario,
}: Props) {
  const [editando, setEditando] = useState(false)
  const [novoHorario, setNovoHorario] = useState(sessao.horario ?? '')
  const [novoLocal, setNovoLocal] = useState(sessao.local ?? '')
  const [novaDescricao, setNovaDescricao] = useState(sessao.descricao ?? '')

  if (!isOpen) return null

  const diasAte = getDiasAte(sessao.data)

  const labelBadge = () => {
    if (diasAte === 0) return 'Hoje'
    if (diasAte === 1) return 'Amanhã'
    return `Em ${diasAte} dias`
  }

  const diaSemana = format(sessao.data, "EEEE", { locale: ptBR })
  const diaSemanaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)
  const dataFormatada = format(sessao.data, "d 'de' MMMM", { locale: ptBR })

  function handleSalvar() {
    onEditar(sessao.id, {
      horario: novoHorario || undefined,
      local: novoLocal || undefined,
      descricao: novaDescricao || undefined,
    })
    setEditando(false)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-5"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative w-full max-w-sm rounded-3xl bg-white px-5 pb-6 pt-5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-gray-200" />

        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-proud-gray">
              Próxima sessão
            </p>
            <h2 className="mt-1 text-xl font-semibold text-proud-dark">
              Sessão {sessao.numeroSessao}
            </h2>
          </div>
          <span className="rounded-full bg-proud-pink/10 px-3 py-1 text-xs font-semibold text-proud-pink">
            {labelBadge()}
          </span>
        </div>

        {!editando ? (
          <>
            {/* Detalhes */}
            <div className="mb-4 space-y-3 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <svg className="h-4 w-4 flex-shrink-0 text-proud-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-proud-dark">
                  {diaSemanaCapitalizado}, {dataFormatada}
                </p>
              </div>

              {sessao.horario && (
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 flex-shrink-0 text-proud-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-proud-dark">{sessao.horario}</p>
                </div>
              )}

              {sessao.local && (
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 flex-shrink-0 text-proud-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm text-proud-dark">{sessao.local}</p>
                </div>
              )}

              {sessao.descricao && (
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-proud-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm leading-relaxed text-proud-dark">{sessao.descricao}</p>
                </div>
              )}

              {!sessao.horario && !sessao.local && !sessao.descricao && (
                <p className="text-sm text-proud-gray">
                  Nenhum detalhe adicionado ainda.
                </p>
              )}
            </div>

            {/* Link editar */}
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="mb-5 text-xs font-medium text-proud-pink"
            >
              {sessao.horario || sessao.local ? 'Editar detalhes →' : 'Adicionar detalhes →'}
            </button>

            {/* Ações */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onVerCalendario}
                className="flex-1 rounded-2xl bg-proud-pink py-3 text-sm font-medium text-white"
              >
                Ver no calendário
              </button>
              <button
                type="button"
                onClick={onReagendar}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-proud-gray"
              >
                Reagendar
              </button>
            </div>
          </>
        ) : (
          /* Formulário de edição */
          <div className="space-y-3">
            <p className="text-sm font-medium text-proud-dark">Editar detalhes</p>

            <div>
              <label className="mb-1 block text-xs text-proud-gray">Horário</label>
              <input
                type="time"
                value={novoHorario}
                onChange={(e) => setNovoHorario(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-proud-dark outline-none focus:border-proud-pink"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-proud-gray">Local / Hospital</label>
              <input
                type="text"
                value={novoLocal}
                onChange={(e) => setNovoLocal(e.target.value)}
                placeholder="Ex: Hospital Sírio-Libanês, sala 4"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-proud-dark outline-none focus:border-proud-pink"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-proud-gray">Observações</label>
              <textarea
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                placeholder="Ex: Levar lanche leve, chegar 1h antes..."
                rows={2}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-proud-dark outline-none focus:border-proud-pink"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-medium text-proud-gray"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvar}
                className="flex-1 rounded-2xl bg-proud-pink py-3 text-sm font-medium text-white"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
