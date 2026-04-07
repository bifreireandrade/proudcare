'use client'

import { useState } from 'react'
import { SessaoQuimio } from '@/lib/diario/types'
import { getDiasAte, formatarData } from '@/lib/diario/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  sessao: SessaoQuimio
  onEditar: (id: string, campos: Partial<Pick<SessaoQuimio, 'data' | 'horario' | 'local' | 'descricao'>>) => void
}

function dataParaInput(data: Date): string {
  const d = new Date(data)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function labelBadge(diasAte: number, data: Date): string {
  const diaSemana = format(data, 'EEE', { locale: ptBR }) // seg, ter, qua...
  const diaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)

  if (diasAte === 0) return 'Hoje'
  if (diasAte === 1) return `Amanhã · ${diaCapitalizado}`
  return `${diaCapitalizado} · Em ${diasAte} dias`
}

export default function ProximaSessao({ sessao, onEditar }: Props) {
  const diasAte = getDiasAte(sessao.data)
  const [detalhesAbertos, setDetalhesAbertos] = useState(false)
  const [editandoDetalhes, setEditandoDetalhes] = useState(false)

  const [novoHorario, setNovoHorario] = useState(sessao.horario ?? '')
  const [novoLocal, setNovoLocal] = useState(sessao.local ?? '')
  const [novaDescricao, setNovaDescricao] = useState(sessao.descricao ?? '')

  const temDetalhes = sessao.horario || sessao.local || sessao.descricao

  const mensagemContexto = () => {
    if (diasAte === 0) return 'Sua sessão é hoje. Vá com calma, você não está sozinha.'
    if (diasAte === 1) return 'Sua sessão é amanhã. Que tal se preparar com carinho hoje?'
    if (diasAte <= 3) return 'Sua próxima sessão está chegando.'
    return 'Ainda tem um tempinho até a próxima sessão.'
  }

  function handleSalvarDetalhes() {
    onEditar(sessao.id, {
      horario: novoHorario || undefined,
      local: novoLocal || undefined,
      descricao: novaDescricao || undefined,
    })
    setEditandoDetalhes(false)
  }

  return (
    <div className="bg-gradient-to-br from-proud-pink-light to-proud-blue-light rounded-2xl p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-proud-gray mb-1">Próxima sessão</p>
          <h2 className="font-heading text-2xl font-semibold text-proud-dark">
            Sessão {sessao.numeroSessao}
          </h2>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm">
          <p className="text-xs font-semibold text-proud-pink">
            {labelBadge(diasAte, sessao.data)}
          </p>
        </div>
      </div>

      <p className="text-base text-proud-dark mb-2">{formatarData(sessao.data)}</p>
      <p className="text-sm text-proud-gray mb-4 leading-relaxed">{mensagemContexto()}</p>

      {/* Painel de detalhes */}
      {detalhesAbertos && (
        <div className="bg-white/70 rounded-xl p-4 mb-4">
          {!editandoDetalhes ? (
            <>
              {temDetalhes ? (
                <div className="space-y-2 mb-3">
                  {sessao.horario && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-proud-gray w-20 shrink-0">Horário</span>
                      <span className="text-sm font-medium text-proud-dark">{sessao.horario}</span>
                    </div>
                  )}
                  {sessao.local && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-proud-gray w-20 shrink-0">Local</span>
                      <span className="text-sm font-medium text-proud-dark">{sessao.local}</span>
                    </div>
                  )}
                  {sessao.descricao && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-proud-gray w-20 shrink-0 mt-0.5">Observações</span>
                      <span className="text-sm text-proud-dark leading-relaxed">{sessao.descricao}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-3">
                  <p className="text-xs text-proud-gray mb-2 leading-relaxed">
                    Nenhum detalhe cadastrado ainda. Quer adicionar horário, local ou observações?
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setEditandoDetalhes(true)}
                className="text-xs font-medium text-proud-pink"
              >
                {temDetalhes ? 'Editar detalhes →' : 'Adicionar detalhes →'}
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-proud-dark mb-1">Detalhes da sessão</p>

              <div>
                <label className="mb-1 block text-xs text-proud-gray">Horário</label>
                <input
                  type="time"
                  value={novoHorario}
                  onChange={(e) => setNovoHorario(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-proud-dark outline-none focus:border-proud-pink"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-proud-gray">Local / Hospital</label>
                <input
                  type="text"
                  value={novoLocal}
                  onChange={(e) => setNovoLocal(e.target.value)}
                  placeholder="Ex: Hospital Sírio-Libanês, sala 4..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-proud-dark outline-none focus:border-proud-pink"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-proud-gray">Observações</label>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Ex: Levar lanche leve, chegar 1h antes..."
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-proud-dark outline-none focus:border-proud-pink resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditandoDetalhes(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2 text-xs font-medium text-proud-gray"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSalvarDetalhes}
                  className="flex-1 rounded-xl bg-proud-pink py-2 text-xs font-medium text-white"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Só o botão de detalhes — registrar foi para o card embaixo */}
      <button
        type="button"
        onClick={() => {
          setDetalhesAbertos((v) => !v)
          if (detalhesAbertos) setEditandoDetalhes(false)
        }}
        className="w-full bg-white text-proud-pink border border-proud-pink/30 py-3 rounded-lg font-medium hover:bg-proud-pink/5 transition"
      >
        {detalhesAbertos ? 'Fechar detalhes ↑' : 'Ver detalhes da sessão ↓'}
      </button>
    </div>
  )
}
