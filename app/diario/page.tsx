'use client'

import { useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProximaSessao from '../components/diario/proxima-sessao'
import CardSessao from '../components/diario/card-sessao'
import Calendario from '../components/diario/calendario'
import ModalEvento from '../components/diario/modal-evento'
import ProgressoDaJornada from '../components/diario/progressodajornada'
import OnboardingSessoes from '../components/diario/onboarding-sessoes'
import RegistroDiarioForm from '../components/diario/registro-diario'
import InsightIA from '../components/diario/insight-ia'
import { useSessoes } from '@/lib/diario/use-sessoes'
import { useRegistros } from '@/lib/diario/use-registros'
import { useEventosManuais } from '@/lib/diario/use-eventos-manuais'
import { formatarData, getProximaSessao } from '@/lib/diario/utils'
import { EventoSaude, SessaoQuimio } from '@/lib/diario/types'

const tabs = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'calendario', label: 'Calendário' },
  { id: 'registrar', label: 'Registrar' },
  { id: 'historico', label: 'Histórico' },
  { id: 'proximas', label: 'Próximas' },
] as const

type TabId = (typeof tabs)[number]['id']

function adicionarDias(data: Date, dias: number) {
  const novaData = new Date(data)
  novaData.setDate(novaData.getDate() + dias)
  return novaData
}

export default function Diario() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { sessoes, setSessoes, marcarComoRealizada, carregado: sessoesCarregadas } = useSessoes()
  const { registros, getRegistrosDaSessao, getUltimoRegistro, salvarRegistro } = useRegistros()
  const { eventosManuais, setEventosManuais, carregado: eventosCarregados } = useEventosManuais()
  const [modalAberto, setModalAberto] = useState(false)
  const [diaSelecionadoModal, setDiaSelecionadoModal] = useState<Date | null>(null)
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false)

  const tabParam = searchParams.get('tab') as TabId | null
  const tabAtiva: TabId = tabParam && tabs.some(t => t.id === tabParam) ? tabParam : 'hoje'
  const setTabAtiva = (tab: TabId) => router.push(`/diario?tab=${tab}`)

  const proximaSessao = getProximaSessao(sessoes)
  const totalSessoes = sessoes.length
  const sessoesConcluidas = sessoes.filter((s) => s.status === 'concluida').length
  const ultimoRegistro = getUltimoRegistro()

  const eventosDeSessao = useMemo<EventoSaude[]>(
    () => sessoes.map((sessao) => ({
      id: `sessao-${sessao.id}`,
      usuarioId: 'user-1',
      tipo: sessao.status === 'concluida' ? 'quimio_feita' : 'quimio_agendada',
      data: sessao.data,
      titulo: `Sessão ${sessao.numeroSessao}`,
      descricao: sessao.status === 'concluida' ? 'Sessão realizada.' : 'Sessão agendada.',
      createdAt: sessao.data,
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
    () => sessoes.filter((s) => s.status === 'concluida').sort((a, b) => b.data.getTime() - a.data.getTime()),
    [sessoes]
  )

  const sessoesFuturas = useMemo(
    () => sessoes.filter((s) => s.status !== 'concluida').sort((a, b) => a.data.getTime() - b.data.getTime()),
    [sessoes]
  )

  const handleAdicionarEvento = (dia: Date) => {
    setDiaSelecionadoModal(dia)
    setModalAberto(true)
  }

  const handleSalvarEvento = (novoEvento: Partial<EventoSaude>) => {
    // Sessão de quimio entra no estado de sessões — aparece em Próximas e no progresso
    if (novoEvento.tipo === 'quimio_agendada') {
      const ultimoNumero = sessoes.length > 0
        ? Math.max(...sessoes.map((s) => s.numeroSessao))
        : 0
      const novaSessao: SessaoQuimio = {
        id: `sessao-${Date.now()}`,
        usuarioId: 'user-1',
        tipo: 'quimio',
        data: novoEvento.data!,
        titulo: novoEvento.titulo ?? 'Sessão de quimioterapia',
        numeroSessao: ultimoNumero + 1,
        ciclo: 1,
        status: 'agendada',
        horario: novoEvento.horario,
        local: novoEvento.local,
        createdAt: new Date(),
      }
      setSessoes((atual) =>
        [...atual, novaSessao].sort((a, b) => a.data.getTime() - b.data.getTime())
      )
      return
    }

    // Exame e retorno vão para eventosManuais
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
    dataPrimeiraSessao, quantidadeSessoes, intervaloDias, marcarPassadasComoConcluidas,
  }: {
    dataPrimeiraSessao: Date
    quantidadeSessoes: number
    intervaloDias: number
    marcarPassadasComoConcluidas: boolean
  }) => {
    const ultimoNumeroSessao = sessoes.length > 0
      ? Math.max(...sessoes.map((s) => s.numeroSessao)) : 0
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const baseTs = Date.now()
    const novasSessoes: SessaoQuimio[] = Array.from({ length: quantidadeSessoes }, (_, index) => {
      const dataSessao = adicionarDias(dataPrimeiraSessao, index * intervaloDias)
      const dataNormalizada = new Date(dataSessao)
      dataNormalizada.setHours(0, 0, 0, 0)
      const status = marcarPassadasComoConcluidas && dataNormalizada < hoje ? 'concluida' : 'agendada'
      const n = ultimoNumeroSessao + index + 1
      return {
        id: `sessao-${baseTs}-${index}`,
        usuarioId: 'user-1',
        tipo: 'quimio' as const,
        data: dataSessao,
        titulo: `Sessão ${n} — Quimioterapia`,
        numeroSessao: n,
        ciclo: 1,
        status,
        createdAt: new Date(),
      }
    })

    setSessoes((atual) =>
      [...atual, ...novasSessoes].sort((a, b) => a.data.getTime() - b.data.getTime())
    )
    setMostrarOnboarding(false)
    setTabAtiva('proximas')
  }

  if (!sessoesCarregadas || !eventosCarregados) return null

  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-24 md:pt-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-10">

        {/* Tabs — só desktop */}
        <div className="hidden md:flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => {
            const ativa = tabAtiva === tab.id
            return (
              <button key={tab.id} onClick={() => setTabAtiva(tab.id)}
                className={`rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition ${
                  ativa ? 'bg-proud-pink text-white' : 'bg-white text-proud-gray border border-gray-200'
                }`}>
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ABA: HOJE */}
        {tabAtiva === 'hoje' && (
          <div className="space-y-3">
            <ProgressoDaJornada
              totalSessoes={totalSessoes}
              sessoesConcluidas={sessoesConcluidas}
              onVerHistorico={() => setTabAtiva('historico')}
              onVerProximas={() => setTabAtiva('proximas')}
            />

            {proximaSessao && <ProximaSessao sessao={proximaSessao} />}

            <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <h2 className="font-heading text-base font-semibold text-proud-dark mb-1">
                Como você está hoje?
              </h2>
              <p className="text-xs text-proud-gray mb-3">
                {ultimoRegistro
                  ? `Último registro: ${formatarData(new Date(ultimoRegistro.data))}`
                  : 'Você ainda não fez nenhum registro.'}
              </p>
              <button
                onClick={() => router.push('/diario?tab=registrar')}
                className="w-full bg-proud-pink text-white py-3 rounded-xl text-sm font-medium"
              >
                Registrar como estou agora
              </button>
            </section>

            {totalSessoes === 0 && (
              <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm text-center">
                <p className="text-sm text-proud-gray mb-3">
                  Adicione suas sessões para organizar sua jornada.
                </p>
                <button type="button" onClick={() => setMostrarOnboarding(true)}
                  className="rounded-full bg-proud-pink px-5 py-2 text-sm font-medium text-white">
                  Adicionar sessões
                </button>
              </section>
            )}
          </div>
        )}

        {/* ABA: CALENDÁRIO */}
        {tabAtiva === 'calendario' && (
          <Calendario
            eventos={eventos}
            onAdicionarEvento={handleAdicionarEvento}
            onExcluirEvento={handleExcluirEvento}
            onRegistrar={() => router.push('/diario?tab=registrar')}
            onMarcarSessaoRealizada={(evento) => {
              const sessaoId = evento.id.replace(/^sessao-/, '')
              marcarComoRealizada(sessaoId)
            }}
          />
        )}

        {/* ABA: REGISTRAR */}
        {tabAtiva === 'registrar' && (
          <RegistroDiarioForm
            sessaoAtual={proximaSessao}
            salvarRegistro={salvarRegistro}
            onSalvo={() => router.push('/diario?tab=hoje')}
          />
        )}

        {/* ABA: HISTÓRICO */}
        {tabAtiva === 'historico' && (
          <div className="space-y-4">
            <InsightIA registros={registros} />
            <div className="space-y-3">
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
                  <p className="text-sm text-proud-gray">Você ainda não tem sessões concluídas.</p>
                </section>
              )}
            </div>
          </div>
        )}

        {/* ABA: PRÓXIMAS — só desktop */}
        {tabAtiva === 'proximas' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-proud-gray">
                {sessoesFuturas.length > 0
                  ? `${sessoesFuturas.length} sessões agendadas`
                  : 'Nenhuma sessão agendada ainda'}
              </p>
              <button type="button" onClick={() => setMostrarOnboarding(true)}
                className="rounded-full border border-proud-pink/30 px-3 py-1 text-xs font-medium text-proud-pink">
                + Adicionar
              </button>
            </div>

            {sessoesFuturas.length > 0 ? (
              sessoesFuturas.map((sessao) => (
                <section key={sessao.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-proud-gray mb-0.5">Sessão agendada</p>
                      <h3 className="font-heading text-base font-semibold text-proud-dark">
                        Sessão {sessao.numeroSessao}
                      </h3>
                      <p className="text-xs text-proud-gray mt-0.5">{formatarData(sessao.data)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Marcar Sessão ${sessao.numeroSessao} como realizada?`)) {
                          marcarComoRealizada(sessao.id)
                        }
                      }}
                      className="rounded-full bg-proud-pink/10 px-3 py-1.5 text-xs font-medium text-proud-pink hover:bg-proud-pink hover:text-white transition"
                    >
                      Realizada
                    </button>
                  </div>
                </section>
              ))
            ) : (
              <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-sm text-proud-gray mb-3">Nenhuma sessão cadastrada ainda.</p>
                <button type="button" onClick={() => setMostrarOnboarding(true)}
                  className="rounded-xl bg-proud-pink px-4 py-2.5 text-sm font-medium text-white">
                  Adicionar sessões
                </button>
              </section>
            )}
          </div>
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
          onClose={() => { setModalAberto(false); setDiaSelecionadoModal(null) }}
          dia={diaSelecionadoModal}
          onSalvar={handleSalvarEvento}
        />
      )}
    </div>
  )
}
