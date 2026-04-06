'use client'

import { useState, useEffect } from 'react'
import { RegistroDiario } from './types'
import { registrosMock } from './mock-data'
import { differenceInCalendarDays, isSameDay, startOfMonth } from 'date-fns'

const CHAVE = 'proudcare:registros'

export function useRegistros() {
  const [registros, setRegistrosState] = useState<RegistroDiario[]>([])
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
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
    })
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

  function getEstatisticasRegistro() {
    const hoje = new Date()
    const inicioMes = startOfMonth(hoje)

    const diasUnicosNoMes = new Set(
      registros
        .filter((r) => new Date(r.data) >= inicioMes)
        .map((r) => {
          const d = new Date(r.data)
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        })
    )
    const diasRegistradosNoMes = diasUnicosNoMes.size
    const registrouHoje = registros.some((r) => isSameDay(new Date(r.data), hoje))
    const ultimo = getUltimoRegistro()
    const diasDesdeUltimo = ultimo
      ? differenceInCalendarDays(hoje, new Date(ultimo.data))
      : null

    return { diasRegistradosNoMes, registrouHoje, diasDesdeUltimo, ultimoRegistro: ultimo }
  }

  return {
    registros,
    salvarRegistro,
    getRegistrosDaSessao,
    getUltimoRegistro,
    getEstatisticasRegistro,
    carregado,
  }
}