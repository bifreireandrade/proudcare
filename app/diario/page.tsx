'use client'

import { useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SecaoHoje from '../components/diario/secao-hoje'
import CardSessao from '../components/diario/card-sessao'
import CardProximaSessao from '../components/diario/card-proxima-sessao'
import Calendario from '../components/diario/calendario'
import ModalEvento from '../components/diario/modal-evento'
import OnboardingSessoes from '../components/diario/onboarding-sessoes'
import RegistroDiarioForm from '../components/diario/registro-diario'
import InsightIA from '../components/diario/insight-ia'
import SecaoRelatorio from '../components/diario/secao-relatorio'
import { useSessoes } from '@/lib/diario/use-sessoes'
import { useRegistros } from '@/lib/diario/use-registros'
import { useEventosManuais } from '@/lib/diario/use-eventos-manuais'
import { getProximaSessao, getUltimaSessaoConcluida } from '@/lib/diario/utils'
import { EventoSaude, SessaoQuimio } from '@/lib/diario/types'

const validTabs = ['hoje', 'calendario', 'jornada', 'relatorio', 'registrar'] as const
type TabId = (typeof validTabs)[number]

const desktopTabs = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'calendario', label: 'Calendário' },
  { id: 'jornada', label: 'Jornada' },
  { id: 'relatorio', label: 'Relatório' },
] as const

function adicionarDias(data: Date, dias: number) {
  const novaData = new Date(data)
  novaData.setDate(novaData.getDate() + dias)
  return novaData
}

function renumerarPorData(sessoes: SessaoQuimio[]): SessaoQuimio[] {
  const ordenadas = [...sessoes].sort((a, b) => a.data.getTime() - b.data.getTime())
  return ordenadas.map((s, index) => ({ ...s, numeroSessao: index + 1 }))
}

export default function Diario() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    sessoes,
    setSessoes,
    marcarComoRealizada,
    editarSessao,
    excluirSessao,
    carregado: sessoesCarregadas,
  } = useSessoes()

  const {
    registros,
    getRegistrosDaSessao,
    salvarRegistro,
    getEstatisticasRegistro,
  } = useRegistros()

  const {
    eventosManuais,
    setEventosManuais,
    carregado: eventosCarregados,
  } = useEventosManuais()

  const [modalAberto, setModalAberto] = useState(false)
  const [diaSelecionadoModal, setDiaSelecionadoModal] = useState<Date | null>(null)
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false)
  const [reagendarEvento, setReagendarEvento] = useState<EventoSaude | null>(null)

  const tabParam = searchParams.get('tab') as TabId | null
  const tabAtiva: TabId = tabParam && validTabs.includes(tabParam) ? tabParam : 'hoje'
  const setTabAtiva = (tab: TabId) => router.push(`/diario?tab=${tab}`)

  const proximaSessao = getProximaSessao(sessoes)
  const ultimaSessao = getUltimaSessaoConcluida(sessoes)
  const totalSessoes = sessoes.length
  const sessoesConcluidas = sessoes.filter((s) => s.status === 'concluida').length

  const { diasRegistradosNoMes, registrouHoje, diasDesdeUltimo, ultimoRegistro } =
    getEstatisticasRegistro()

  const registrosRecentes = useMemo(
    () =>
      [...registros]
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
        .slice(-4),
    [registros]
  )

  const eventosDeSessao = useMemo<EventoSaude[]>(
    () =>
      sessoes.map((sessao) => ({
        id: `sessao-${sessao.id}`,
        usuarioId: 'user-1',
        tipo: sessao.status === 'concluida' ? 'quimio_feita' : 'quimio_agendada',
        data: sessao.data,
        titulo: `Sessão ${sessao.numeroSessao}`,
        descricao: sessao.status === 'concluida' ? 'Sessão realizada.' : 'Sessão agendada.',
        horario: sessao.horario,
        local: sessao.local,
        createdAt: sessao.createdAt ?? sessao.data,
      })),
    [sessoes]
  )

  const eventos = useMemo(() => {
    const idsDeSessao = new Set(eventosDeSessao.map((e) => e.id))
    const outrosEventos = eventosManuais.filter((e) => !idsDeSessao.has(e.id))
    return [...eventosDeSessao, ...outrosEventos].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    )
  }, [eventosDeSessao, eventosManuais])

  const sessoesPassadas = useMemo(
    () =>
      sessoes
        .filter((s) => s.status === 'concluida')
        .sort((a, b) => b.data.getTime() - a.data.getTime()),
    [sessoes]
  )

  const sessoesFuturas = useMemo(
    () =>
      sessoes
        .filter((s) => s.status !== 'concluida')
        .sort((a, b) => a.data.getTime() - b.data.getTime()),
    [sessoes]
  )

  const handleAdicionarEvento = (dia: Date) => {
    setDiaSelecionadoModal(dia)
    setModalAberto(true)
  }

  const handleReagendarSessao = (evento: EventoSaude) => {
    setReagendarEvento(evento)
    setDiaSelecionadoModal(new Date())
    setModalAberto(true)
  }

  const handleSalvarEvento = (novoEvento: Partial<EventoSaude>) => {
    // se estamos reagendando uma sessão existente
    if (reagendarEvento && novoEvento.data) {
      const sessaoId = reagendarEvento.id.replace(/^sessao-/, '')
      setSessoes((atual) =>
        renumerarPorData(
          atual.map((s) =>
            s.id === sessaoId ? { ...s, data: novoEvento.data! } : s
          )
        )
      )
      setReagendarEvento(null)
      return
    }

    if (novoEvento.tipo === 'quimio_agendada') {
      const novaSessao: SessaoQuimio = {
        id: `sessao-${Date.now()}`,
        usuarioId: 'user-1',
        tipo: 'quimio',
        data: novoEvento.data!,
        titulo: novoEvento.titulo ?? 'Sessão de quimioterapia',
        numeroSessao: 0,
        ciclo: 1,
        status: 'agendada',
        horario: novoEvento.horario,
        local: novoEvento.local,
        descricao: novoEvento.descricao,
        createdAt: new Date(),
      }
      setSessoes((atual) => renumerarPorData([...atual, novaSessao]))
      return
    }

    const eventoCompleto: EventoSaude = {
      id: `evento-${Date.now()}`,
      usuarioId: novoEvento.usuarioId || 'user-1',
      tipo: novoEvento.tipo!,
      data: novoEvento.data!,
      titulo: novoEvento.titulo!,
      descricao: novoEvento.descricao,
      local: novoEvento.local,
      horario: novoEvento.horario,
      createdAt: new Date(),
    }
    setEventosManuais((prev) => [...prev, eventoCompleto])
  }

  const handleExcluirEvento = (eventoId: string) => {
    setEventosManuais((prev) => prev.filter((e) => e.id !== eventoId))
  }

  const handleCriarSessoes = ({
    dataPrimeiraSessao,
    quantidadeSessoes,
    intervaloDias,
    marcarPassadasComoConcluidas,
  }: {
    dataPrimeiraSessao: Date
    quantidadeSessoes: number
    intervaloDias: number
    marcarPassadasComoConcluidas: boolean
  }) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const baseTs = Date.now()

    const novasSessoes: SessaoQuimio[] = Array.from(
      { length: quantidadeSessoes },
      (_, index) => {
        const dataSessao = adicionarDias(dataPrimeiraSessao, index * intervaloDias)
        const dataNormalizada = new Date(dataSessao)
        dataNormalizada.setHours(0, 0, 0, 0)
        const status =
          marcarPassadasComoConcluidas && dataNormalizada < hoje ? 'concluida' : 'agendada'

        return {
          id: `sessao-${baseTs}-${index}`,
          usuarioId: 'user-1',
          tipo: 'quimio' as const,
          data: dataSessao,
          titulo: 'Sessão de quimioterapia',
          numeroSessao: 0,
          ciclo: 1,
          status,
          createdAt: new Date(),
        }
      }
    )

    setSessoes((atual) => renumerarPorData([...atual, ...novasSessoes]))
    setMostrarOnboarding(false)
    setTabAtiva('jornada')
  }

  if (!sessoesCarregadas || !eventosCarregados) return null

  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-24 md:pt-20 md:pb-0">
      <div className="mx-auto max-w-2xl px-4 py-4 md:py-10">
        <div className="mb-8 hidden flex-wrap gap-2 md:flex">
          {desktopTabs.map((tab) => {
            const ativa = tabAtiva === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setTabAtiva(tab.id)}
                className={`rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition ${
                  ativa
                    ? 'bg-proud-pink text-white'
                    : 'bg-white text-proud-gray border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {tabAtiva === 'hoje' && (
          <SecaoHoje
            totalSessoes={totalSessoes}
            sessoesConcluidas={sessoesConcluidas}
            proximaSessao={proximaSessao}
            ultimaSessao={ultimaSessao}
            sessoesFuturas={sessoesFuturas}
            diasRegistradosNoMes={diasRegistradosNoMes}
            registrouHoje={registrouHoje}
            diasDesdeUltimo={diasDesdeUltimo}
            ultimoRegistro={ultimoRegistro}
            registrosRecentes={registrosRecentes}
            eventos={eventos}
            onVerHistorico={() => setTabAtiva('jornada')}
            onVerProximas={() => setTabAtiva('jornada')}
            onVerCalendario={() => setTabAtiva('calendario')}
            onRegistrar={() => setTabAtiva('registrar')}
            onEditarSessao={editarSessao}
            onAdicionarEvento={handleAdicionarEvento}
            onExcluirEvento={handleExcluirEvento}
            onMarcarSessaoRealizada={(evento) => {
              const sessaoId = evento.id.replace(/^sessao-/, '')
              marcarComoRealizada(sessaoId)
            }}
          />
        )}

        {tabAtiva === 'calendario' && (
          <Calendario
            eventos={eventos}
            onAdicionarEvento={handleAdicionarEvento}
            onExcluirEvento={handleExcluirEvento}
            onRegistrar={() => setTabAtiva('registrar')}
            onMarcarSessaoRealizada={(evento) => {
              const sessaoId = evento.id.replace(/^sessao-/, '')
              marcarComoRealizada(sessaoId)
            }}
            onReagendarSessao={handleReagendarSessao}
          />
        )}

        {tabAtiva === 'registrar' && (
          <RegistroDiarioForm
            sessaoAtual={proximaSessao ?? ultimaSessao}
            salvarRegistro={salvarRegistro}
            onSalvo={() => router.push('/diario?tab=hoje')}
          />
        )}

        {tabAtiva === 'jornada' && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-proud-gray">
                    Sua jornada
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-proud-dark">
                    {sessoesConcluidas} de {totalSessoes} sessões concluídas
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-proud-gray">
                    Aqui você acompanha o que já passou e o que ainda vem pela frente.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarOnboarding(true)}
                  className="rounded-full border border-proud-pink/30 px-3 py-1 text-xs font-medium text-proud-pink"
                >
                  + Adicionar
                </button>
              </div>
            </section>

            <InsightIA registros={registros} />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-proud-dark">Próximas sessões</p>
              </div>

              {sessoesFuturas.length > 0 ? (
                sessoesFuturas.map((sessao) => (
                  <CardProximaSessao
                    key={sessao.id}
                    sessao={sessao}
                    onMarcarRealizada={marcarComoRealizada}
                    onEditar={editarSessao}
                    onExcluir={excluirSessao}
                  />
                ))
              ) : (
                <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <p className="text-sm text-proud-gray">
                    Nenhuma sessão futura cadastrada no momento.
                  </p>
                </section>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-proud-dark">Sessões concluídas</p>

              {sessoesPassadas.length > 0 ? (
                sessoesPassadas.map((sessao) => (
                  <CardSessao
                    key={sessao.id}
                    sessao={sessao}
                    registros={getRegistrosDaSessao(sessao.id)}
                  />
                ))
              ) : (
                <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <p className="text-sm text-proud-gray">
                    Você ainda não tem sessões concluídas.
                  </p>
                </section>
              )}
            </div>
          </div>
        )}

        {tabAtiva === 'relatorio' && (
          <SecaoRelatorio
            eventos={eventos}
            sessoes={sessoes}
            registros={registros}
          />
        )}
      </div>

      <OnboardingSessoes
        isOpen={mostrarOnboarding}
        onClose={() => setMostrarOnboarding(false)}
        onConfirm={handleCriarSessoes}
        podeFechar={sessoes.length > 0}
      />

      {diaSelecionadoModal && (
        <ModalEvento
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false)
            setDiaSelecionadoModal(null)
            setReagendarEvento(null)
          }}
          dia={diaSelecionadoModal}
          onSalvar={handleSalvarEvento}
        />
      )}
    </div>
  )
}
