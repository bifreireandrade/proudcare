'use client'

import { useState, useEffect } from 'react'
import { SessaoQuimio } from './types'
import { sessoesMock } from './mock-data'

const CHAVE = 'proudcare:sessoes'

export function useSessoes() {
  const [sessoes, setSessoesState] = useState<SessaoQuimio[]>([])
  const [carregado, setCarregado] = useState(false)

  // Carrega do localStorage na primeira vez
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE)
      if (salvo) {
        const parsed = JSON.parse(salvo).map((s: SessaoQuimio) => ({
          ...s,
          data: new Date(s.data),
          createdAt: new Date(s.createdAt),
        }))
        setSessoesState(parsed)
      } else {
        // Primeira vez: usa mock como ponto de partida
        setSessoesState(sessoesMock)
        localStorage.setItem(CHAVE, JSON.stringify(sessoesMock))
      }
    } catch {
      setSessoesState(sessoesMock)
    }
    setCarregado(true)
  }, [])

  // Salva sempre que sessoes mudar
  function setSessoes(novas: SessaoQuimio[] | ((atual: SessaoQuimio[]) => SessaoQuimio[])) {
    setSessoesState((atual) => {
      const resultado = typeof novas === 'function' ? novas(atual) : novas
      localStorage.setItem(CHAVE, JSON.stringify(resultado))
      return resultado
    })
  }

  function marcarComoRealizada(id: string) {
    setSessoes((atual) =>
      atual.map((s) => (s.id === id ? { ...s, status: 'concluida' } : s))
    )
  }

  function limparTudo() {
    localStorage.removeItem(CHAVE)
    setSessoesState(sessoesMock)
  }

  return { sessoes, setSessoes, marcarComoRealizada, limparTudo, carregado }
}