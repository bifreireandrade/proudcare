'use client'

import { useCallback, useEffect, useState } from 'react'
import { EventoSaude } from './types'
import { examesMock, retornosMock } from './mock-data'

const CHAVE = 'proudcare:eventos-manuais'

function hidratar(e: EventoSaude): EventoSaude {
  return {
    ...e,
    data: new Date(e.data),
    createdAt: new Date(e.createdAt),
  }
}

const seedInicial: EventoSaude[] = [...examesMock, ...retornosMock]

export function useEventosManuais() {
  const [eventosManuais, setEventosManuaisState] = useState<EventoSaude[]>([])
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const salvo = localStorage.getItem(CHAVE)
        if (salvo) {
          const parsed = JSON.parse(salvo) as EventoSaude[]
          setEventosManuaisState(parsed.map(hidratar))
        } else {
          setEventosManuaisState(seedInicial.map(hidratar))
          localStorage.setItem(CHAVE, JSON.stringify(seedInicial))
        }
      } catch {
        setEventosManuaisState(seedInicial.map(hidratar))
      }
      setCarregado(true)
    })
  }, [])

  const setEventosManuais = useCallback(
    (atualizacao: EventoSaude[] | ((prev: EventoSaude[]) => EventoSaude[])) => {
      setEventosManuaisState((prev) => {
        const next = typeof atualizacao === 'function' ? atualizacao(prev) : atualizacao
        localStorage.setItem(CHAVE, JSON.stringify(next))
        return next
      })
    },
    []
  )

  return { eventosManuais, setEventosManuais, carregado }
}
