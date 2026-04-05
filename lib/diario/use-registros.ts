'use client'

import { useState, useEffect } from 'react'
import { RegistroDiario } from './types'
import { registrosMock } from './mock-data'

const CHAVE = 'proudcare:registros'

export function useRegistros() {
  const [registros, setRegistrosState] = useState<RegistroDiario[]>([])
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE)
      if (salvo) {
        const parsed = JSON.parse(salvo).map((r: RegistroDiario) => ({
          ...r,
          data: new Date(r.data),
          createdAt: new Date(r.createdAt),
        }))
        setRegistrosState(parsed)
      } else {
        setRegistrosState(registrosMock)
        localStorage.setItem(CHAVE, JSON.stringify(registrosMock))
      }
    } catch {
      setRegistrosState(registrosMock)
    }
    setCarregado(true)
  }, [])

  function salvarRegistro(novoRegistro: Omit<RegistroDiario, 'id' | 'createdAt'>) {
    const registro: RegistroDiario = {
      ...novoRegistro,
      id: `reg-${Date.now()}`,
      createdAt: new Date(),
    }
    setRegistrosState((atual) => {
      const atualizado = [...atual, registro]
      localStorage.setItem(CHAVE, JSON.stringify(atualizado))
      return atualizado
    })
    return registro
  }

  function getRegistrosDaSessao(sessaoId: string) {
    return registros.filter((r) => r.sessaoId === sessaoId)
  }

  function getUltimoRegistro() {
    return [...registros].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0] ?? null
  }

  return { registros, salvarRegistro, getRegistrosDaSessao, getUltimoRegistro, carregado }
}