'use client'

import { useState } from 'react'
import { SessaoQuimio } from '@/lib/diario/types'
import { formatarData } from '@/lib/diario/utils'

type Props = {
  sessao: SessaoQuimio
  onMarcarRealizada: (id: string) => void
  onEditar: (id: string, campos: Partial<Pick<SessaoQuimio, 'data' | 'horario' | 'local'>>) => void
  onExcluir: (id: string) => void
}

function dataParaInput(data: Date): string {
  const d = new Date(data)
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export default function CardProximaSessao({ sessao, onMarcarRealizada, onEditar, onExcluir }: Props) {
  const [aberto, setAberto] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [editando, setEditando] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  const [novaData, setNovaData] = useState(dataParaInput(sessao.data))
  const [novoHorario, setNovoHorario] = useState(sessao.horario ?? '')
  const [novoLocal, setNovoLocal] = useState(sessao.local ?? '')

  const temDetalhes = sessao.horario || sessao.local

  function handleSalvarEdicao() {
    onEditar(sessao.id, {
      data: new Date(`${novaData}T12:00:00`),
      horario: novoHorario || undefined,
      local: novoLocal || undefined,
    })
    setEditando(false)
  }

  function handleCancelarEdicao() {
    setNovaData(dataParaInput(sessao.data))
    setNovoHorario(sessao.horario ?? '')
    setNovoLocal(sessao.local ?? '')
    setEditando(false)
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">

      {/* Cabeçalho clicável */}
      <button
        type="button"
        onClick={() => {
          setAberto((v) => !v)
          if (aberto) {
            setEditando(false)
            setConfirmando(false)
            setConfirmandoExclusao(false)
          }
        }}
        className="w-full text-left px-4 py-4 flex items-center justify-between"
      >
        <div>
          <p className="text-xs text-proud-gray mb-0.5">Sessão agendada</p>
          <h3 className="font-heading text-base font-semibold text-proud-dark">
            Sessão {sessao.numeroSessao}
          </h3>
          <p className="text-xs text-proud-gray mt-0.5">{formatarData(sessao.data)}</p>
        </div>
        <span className="text-xs text-proud-gray ml-3">{aberto ? '↑' : '↓'}</span>
      </button>

      {aberto && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">

          {!editando && (
            <>
              {/* Detalhes */}
              {temDetalhes ? (
                <div className="space-y-2">
                  {sessao.horario && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-proud-gray w-14 shrink-0">Horário</span>
                      <span className="text-sm font-medium text-proud-dark">{sessao.horario}</span>
                    </div>
                  )}
                  {sessao.local && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-proud-gray w-14 shrink-0">Local</span>
                      <span className="text-sm font-medium text-proud-dark">{sessao.local}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-proud-gray">
                  Nenhum detalhe cadastrado para essa sessão.
                </p>
              )}

              {/* Ações principais */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditando(true)
                    setConfirmando(false)
                    setConfirmandoExclusao(false)
                  }}
                  className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium text-proud-gray hover:bg-gray-50 transition"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmando(true)
                    setConfirmandoExclusao(false)
                  }}
                  className="flex-1 rounded-full border border-proud-pink/30 py-2 text-xs font-medium text-proud-pink hover:bg-proud-pink/5 transition"
                >
                  Já foi realizada?
                </button>
              </div>

              {/* Confirmação de realização */}
              {confirmando && (
                <div className="rounded-xl bg-proud-pink/5 p-3 space-y-2">
                  <p className="text-xs font-medium text-proud-dark text-center">
                    Confirmar que a Sessão {sessao.numeroSessao} foi realizada?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onMarcarRealizada(sessao.id)}
                      className="flex-1 rounded-full bg-proud-pink py-2 text-xs font-medium text-white"
                    >
                      Sim, foi realizada
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmando(false)}
                      className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium text-proud-gray"
                    >
                      Não
                    </button>
                  </div>
                </div>
              )}

              {/* Excluir */}
              {!confirmandoExclusao ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmandoExclusao(true)
                    setConfirmando(false)
                  }}
                  className="w-full text-center text-xs text-gray-300 hover:text-red-400 transition pt-1"
                >
                  Excluir sessão
                </button>
              ) : (
                <div className="rounded-xl bg-red-50 p-3 space-y-2">
                  <p className="text-xs font-medium text-red-600 text-center">
                    Excluir a Sessão {sessao.numeroSessao}? Isso não pode ser desfeito.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onExcluir(sessao.id)}
                      className="flex-1 rounded-full bg-red-500 py-2 text-xs font-medium text-white"
                    >
                      Excluir
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmandoExclusao(false)}
                      className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium text-proud-gray"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modo edição */}
          {editando && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-proud-dark">Editar Sessão {sessao.numeroSessao}</p>

              <div>
                <label className="mb-1 block text-xs text-proud-gray">Data</label>
                <input
                  type="date"
                  value={novaData}
                  onChange={(e) => setNovaData(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-proud-dark outline-none focus:border-proud-pink"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-proud-gray">Horário (opcional)</label>
                <input
                  type="time"
                  value={novoHorario}
                  onChange={(e) => setNovoHorario(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-proud-dark outline-none focus:border-proud-pink"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-proud-gray">Local (opcional)</label>
                <input
                  type="text"
                  value={novoLocal}
                  onChange={(e) => setNovoLocal(e.target.value)}
                  placeholder="Ex: Hospital, clínica..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-proud-dark outline-none focus:border-proud-pink"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancelarEdicao}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-proud-gray"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSalvarEdicao}
                  disabled={!novaData}
                  className="flex-1 rounded-xl bg-proud-pink py-2.5 text-sm font-medium text-white disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
