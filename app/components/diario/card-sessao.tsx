'use client'

import { useState } from 'react'
import { SessaoQuimio, RegistroDiario } from '@/lib/diario/types'
import { formatarData } from '@/lib/diario/utils'

type Props = {
  sessao: SessaoQuimio
  registros?: RegistroDiario[]
}

const sintomas = [
  { id: 'enjoo', label: 'Enjoo' },
  { id: 'cansaco', label: 'Cansaço' },
  { id: 'dor', label: 'Dor' },
  { id: 'apetite', label: 'Apetite' },
  { id: 'humor', label: 'Humor' },
  { id: 'energia', label: 'Energia' },
  { id: 'sono', label: 'Sono' },
] as const

type SintomaId = (typeof sintomas)[number]['id']

function corBarra(id: SintomaId, valor: number) {
  const inverso = ['apetite', 'humor', 'energia', 'sono'].includes(id)
  if (inverso) {
    if (valor <= 3) return 'bg-red-400'
    if (valor <= 6) return 'bg-amber-400'
    return 'bg-green-400'
  } else {
    if (valor >= 7) return 'bg-red-400'
    if (valor >= 4) return 'bg-amber-400'
    return 'bg-green-400'
  }
}

export default function CardSessao({ sessao, registros = [] }: Props) {
  const [aberto, setAberto] = useState(false)
  const isConcluida = sessao.status === 'concluida'
  const temRegistros = registros.length > 0

  return (
    <div className={`relative pl-12 pb-6 ${!isConcluida && 'opacity-60'}`}>
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isConcluida ? 'bg-proud-pink' : 'bg-gray-300'
      }`}>
        <span className="text-white text-sm font-bold">{sessao.numeroSessao}</span>
      </div>

      <div className={`bg-white border-2 rounded-2xl p-4 transition ${
        isConcluida ? 'border-gray-100' : 'border-gray-200'
      } ${aberto ? 'shadow-md' : 'hover:shadow-sm'}`}>

        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-proud-dark">Sessão {sessao.numeroSessao}</p>
            <p className="text-sm text-proud-gray">{formatarData(sessao.data)}</p>
          </div>

          <div className="flex items-center gap-2">
            {temRegistros && (
              <span className="text-xs bg-proud-pink/10 text-proud-pink px-2 py-1 rounded-full font-medium">
                {registros.length} {registros.length === 1 ? 'registro' : 'registros'}
              </span>
            )}
            {isConcluida && (
              <button
                type="button"
                onClick={() => setAberto(!aberto)}
                className="text-sm text-proud-pink font-medium"
              >
                {aberto ? 'Fechar ↑' : 'Ver detalhes ↓'}
              </button>
            )}
          </div>
        </div>

        {aberto && (
          <div className="mt-4 space-y-5">
            {temRegistros ? (
              registros.map((reg) => (
                <div key={reg.id} className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-proud-gray mb-3">
                    {reg.diasAposSessao === 0
                      ? 'Dia da sessão'
                      : `${reg.diasAposSessao} ${reg.diasAposSessao === 1 ? 'dia' : 'dias'} após a sessão`}
                    {' · '}
                    {new Date(reg.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </p>

                  <div className="space-y-2 mb-3">
                    {sintomas.map(({ id, label }) => {
                      const valor = reg[id as keyof RegistroDiario] as number | undefined
                      if (!valor) return null
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <span className="text-xs text-proud-gray w-16 shrink-0">{label}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${corBarra(id as SintomaId, valor)}`}
                              style={{ width: `${valor * 10}%` }}
                            />
                          </div>
                          <span className="text-xs text-proud-gray w-4 text-right">{valor}</span>
                        </div>
                      )
                    })}
                  </div>

                  {reg.observacoes && (
                    <div className="bg-gray-50 rounded-xl px-3 py-2 mb-2">
                      <p className="text-xs text-proud-gray mb-0.5">Como foi</p>
                      <p className="text-sm text-proud-dark">{reg.observacoes}</p>
                    </div>
                  )}

                  {reg.oQueAjudou && (
                    <div className="bg-proud-pink/5 rounded-xl px-3 py-2">
                      <p className="text-xs text-proud-gray mb-0.5">O que ajudou</p>
                      <p className="text-sm text-proud-dark">{reg.oQueAjudou}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-proud-gray">Nenhum registro para essa sessão ainda.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
