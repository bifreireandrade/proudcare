'use client'

import { useEffect, useState } from 'react'
import { sessoesMock } from './mock-data'
import { SessaoQuimio } from './types'
import { criarDataLocalSegura, normalizarParaMeioDia } from './utils'

const CHAVE = 'proudcare:sessoes'

function hidratarSessao(s: SessaoQuimio): SessaoQuimio {
  return {
    ...s,
    data: criarDataLocalSegura(s.data),
    createdAt: criarDataLocalSegura(s.createdAt),
  }
}

function hidratarLista(lista: SessaoQuimio[]): SessaoQuimio[] {
  return lista
    .map(hidratarSessao)
    .sort((a, b) => a.data.getTime() - b.data.getTime())
}

function renumerarPorData(sessoes: SessaoQuimio[]): SessaoQuimio[] {
  const ordenadas = [...sessoes].sort((a, b) => a.data.getTime() - b.data.getTime())
  return ordenadas.map((s, index) => ({ ...s, numeroSessao: index + 1 }))
}

export function useSessoes() {
  const [sessoes, setSessoesState] = useState<SessaoQuimio[]>([])
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const salvo = localStorage.getItem(CHAVE)

        if (salvo) {
          const parsed = JSON.parse(salvo) as SessaoQuimio[]
          setSessoesState(hidratarLista(parsed))
        } else {
          const mocksNormalizados = hidratarLista(
            sessoesMock.map((sessao) => ({
              ...sessao,
              data: normalizarParaMeioDia(new Date(sessao.data)),
              createdAt: normalizarParaMeioDia(new Date(sessao.createdAt)),
            }))
          )
          setSessoesState(mocksNormalizados)
          localStorage.setItem(CHAVE, JSON.stringify(mocksNormalizados))
        }
      } catch {
        const mocksNormalizados = hidratarLista(
          sessoesMock.map((sessao) => ({
            ...sessao,
            data: normalizarParaMeioDia(new Date(sessao.data)),
            createdAt: normalizarParaMeioDia(new Date(sessao.createdAt)),
          }))
        )
        setSessoesState(mocksNormalizados)
      }

      setCarregado(true)
    })
  }, [])

  function setSessoes(
    novas: SessaoQuimio[] | ((atual: SessaoQuimio[]) => SessaoQuimio[])
  ) {
    setSessoesState((atual) => {
      const resultadoBruto = typeof novas === 'function' ? novas(atual) : novas
      const resultado = hidratarLista(resultadoBruto)
      localStorage.setItem(CHAVE, JSON.stringify(resultado))
      return resultado
    })
  }

  function marcarComoRealizada(id: string) {
    setSessoes((atual) =>
      atual.map((s) => (s.id === id ? { ...s, status: 'concluida' } : s))
    )
  }

  function editarSessao(
    id: string,
    campos: Partial<Pick<SessaoQuimio, 'data' | 'horario' | 'local' | 'status'>>
  ) {
    setSessoesState((atual) => {
      const atualizado = atual.map((s) =>
        s.id === id ? hidratarSessao({ ...s, ...campos }) : s
      )
      const resultado = renumerarPorData(atualizado)
      localStorage.setItem(CHAVE, JSON.stringify(resultado))
      return resultado
    })
  }

  function excluirSessao(id: string) {
    setSessoesState((atual) => {
      const filtrado = atual.filter((s) => s.id !== id)
      const resultado = renumerarPorData(filtrado)
      localStorage.setItem(CHAVE, JSON.stringify(resultado))
      return resultado
    })
  }

  function limparTudo() {
    localStorage.removeItem(CHAVE)
    const mocksNormalizados = hidratarLista(
      sessoesMock.map((sessao) => ({
        ...sessao,
        data: normalizarParaMeioDia(new Date(sessao.data)),
        createdAt: normalizarParaMeioDia(new Date(sessao.createdAt)),
      }))
    )
    setSessoesState(mocksNormalizados)
  }

  return { sessoes, setSessoes, marcarComoRealizada, editarSessao, excluirSessao, limparTudo, carregado }
}