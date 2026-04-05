'use client'

import { useMemo, useState } from 'react'
import ProximaSessao from '../components/diario/proxima-sessao'
import CardSessao from '../components/diario/card-sessao'
import Calendario from '../components/diario/calendario'
import ModalEvento from '../components/diario/modal-evento'
import ResumoDoDia from '../components/diario/resumododia'
import ProgressoDaJornada from '../components/diario/progressodajornada'
import OnboardingSessoes from '../components/diario/onboarding-sessoes'
import { sessoesMock, registrosMock, todosEventosMock } from '@/lib/diario/mock-data'
import { formatarData, getProximaSessao } from '@/lib/diario/utils'
import { EventoSaude, SessaoQuimio } from '@/lib/diario/types'

const sintomasRapidos = [
  'Enjoo',
  'Cansaço',
  'Dor',
  'Sono',
  'Apetite',
  'Boca sensível',
]

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
  const [sessoes, setSessoes] = useState<SessaoQuimio[]>(sessoesMock)
  const [eventosManuais, setEventosManuais] = useState<EventoSaude[]>(todosEventosMock)
  const [modalAberto, setModalAberto] = useState(false)
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null)
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoSaude | undefined>()
  const [sintomaSelecionado, setSintomaSelecionado] = useState<string | null>(null)
  const [tabAtiva, setTabAtiva] = useState<TabId>('hoje')
  const [mostrarOnboarding, setMostrarOnboarding] = useState(sessoesMock.length === 0)

  const proximaSessao = getProximaSessao(sessoes)
  const totalSessoes = sessoes.length
  const sessoesConcluidas = sessoes.filter((s) => s.status === 'concluida').length

  const eventosDeSessao = useMemo<EventoSaude[]>(
    () =>
      sessoes.map((sessao) => ({
        id: `sessao-${sessao.id}`,
        usuarioId: 'user-1',
        tipo: sessao.status === 'concluida' ? 'quimio_feita' : 'quimio_agendada',
        data: sessao.data,
        titulo: `Sessão ${sessao.numeroSessao}`,
        descricao:
          sessao.status === 'concluida'
            ? 'Sessão de quimioterapia realizada.'
            : 'Sessão de quimioterapia agendada.',
        createdAt: sessao.data,
      })),
    [sessoes]
  )

  const eventos = useMemo(() => {
    const idsDeSessao = new Set(eventosDeSessao.map((evento) => evento.id))
    const outrosEventos = eventosManuais.filter((evento) => !idsDeSessao.has(evento.id))

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

  const ultimoRegistro = useMemo(() => {
    return [...registrosMock].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
  }, [])

  const handleDiaClick = (dia: Date, evento?: EventoSaude) => {
    setDiaSelecionado(dia)
    setEventoSelecionado(evento)
    setModalAberto(true)
  }

  const handleSalvarEvento = (novoEvento: Partial<EventoSaude>) => {
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

    setEventosManuais([...eventosManuais, eventoCompleto])
  }

  const handleExcluirEvento = (eventoId: string) => {
    setEventosManuais(eventosManuais.filter((e) => e.id !== eventoId))
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
    const ultimoNumeroSessao =
      sessoes.length > 0
        ? Math.max(...sessoes.map((sessao) => sessao.numeroSessao))
        : 0

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const novasSessoes: SessaoQuimio[] = Array.from(
      { length: quantidadeSessoes },
      (_, index) => {
        const dataSessao = adicionarDias(dataPrimeiraSessao, index * intervaloDias)
        const dataNormalizada = new Date(dataSessao)
        dataNormalizada.setHours(0, 0, 0, 0)

        const status =
          marcarPassadasComoConcluidas && dataNormalizada < hoje
            ? 'concluida'
            : 'agendada'

        return {
          id: `sessao-${Date.now()}-${index}`,
          numeroSessao: ultimoNumeroSessao + index + 1,
          data: dataSessao,
          status,
        }
      }
    )

    setSessoes((estadoAtual) =>
      [...estadoAtual, ...novasSessoes].sort(
        (a, b) => a.data.getTime() - b.data.getTime()
      )
    )

    setMostrarOnboarding(false)
    setTabAtiva('proximas')
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-proud-dark mb-2">
                Meu Diário
              </h1>
              <p className="text-proud-gray text-base md:text-lg">
                Um espaço para acompanhar como você está, um dia de cada vez
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMostrarOnboarding(true)}
              className="hidden md:inline-flex rounded-full border border-proud-pink/20 bg-white px-4 py-2 text-sm font-medium text-proud-pink transition hover:bg-proud-pink/5"
            >
              Adicionar sessões
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto mt-5">
            {tabs.map((tab) => {
              const ativa = tabAtiva === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setTabAtiva(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                    ativa
                      ? 'bg-proud-pink text-white'
                      : 'bg-proud-pink/[0.05] text-proud-dark'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {tabAtiva === 'hoje' && (
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
            <div className="space-y-6">
              <ResumoDoDia
                proximaSessaoTexto={
                  proximaSessao
                    ? `Sua próxima sessão é ${formatarData(proximaSessao.data)}.`
                    : 'Quando você adicionar suas próximas sessões, eu organizo tudo por aqui.'
                }
              />

              <ProgressoDaJornada
                totalSessoes={totalSessoes}
                sessoesConcluidas={sessoesConcluidas}
                proximaSessaoTexto={
                  proximaSessao
                    ? `Sua próxima sessão é ${formatarData(proximaSessao.data)}.`
                    : undefined
                }
                onVerHistorico={() => setTabAtiva('historico')}
                onVerProximas={() => setTabAtiva('proximas')}
              />

              <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="font-heading text-xl font-semibold text-proud-dark mb-2">
                  Como você está hoje?
                </h2>

                <p className="text-sm text-proud-gray mb-5">
                  Você pode registrar rapidinho, só o essencial já ajuda 💗
                </p>

                <div className="flex flex-wrap gap-3 mb-5">
                  {sintomasRapidos.map((sintoma) => {
                    const selecionado = sintomaSelecionado === sintoma

                    return (
                      <button
                        key={sintoma}
                        onClick={() =>
                          setSintomaSelecionado(selecionado ? null : sintoma)
                        }
                        className={`rounded-full border px-4 py-2 text-sm ${
                          selecionado
                            ? 'border-proud-pink bg-proud-pink/10 text-proud-pink'
                            : 'border-gray-200 text-proud-dark'
                        }`}
                      >
                        {sintoma}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setTabAtiva('registrar')}
                  className="w-full bg-proud-pink text-white py-3 rounded-xl font-medium"
                >
                  Registrar como estou hoje
                </button>
              </section>

              {proximaSessao && <ProximaSessao sessao={proximaSessao} />}

              <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="text-sm text-proud-gray mb-2">
                  Último registro
                </div>

                <div className="text-base font-semibold text-proud-dark mb-1">
                  {ultimoRegistro
                    ? `Registro — ${formatarData(ultimoRegistro.data)}`
                    : 'Sem registro recente'}
                </div>

                <p className="text-sm text-proud-gray">
                  {ultimoRegistro?.observacoes ||
                    'Quando você registrar como está hoje, seu resumo aparece aqui.'}
                </p>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-proud-dark mb-2">
                      Calendário
                    </h2>

                    <p className="text-sm text-proud-gray">
                      Um apoio visual, sem precisar organizar tudo agora.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMostrarOnboarding(true)}
                    className="rounded-full border border-proud-pink/20 bg-white px-3 py-1.5 text-xs font-medium text-proud-pink transition hover:bg-proud-pink/5 md:hidden"
                  >
                    Sessões
                  </button>
                </div>

                <Calendario eventos={eventos} onDiaClick={handleDiaClick} />
              </section>
            </div>
          </div>
        )}

        {tabAtiva === 'calendario' && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-heading text-2xl font-semibold text-proud-dark mb-2">
                Calendário
              </h2>

              <p className="text-sm text-proud-gray mb-4">
                Veja sessões, exames e registros com mais contexto.
              </p>

              <Calendario eventos={eventos} onDiaClick={handleDiaClick} />
            </section>
          </div>
        )}

        {tabAtiva === 'registrar' && (
          <div className="max-w-3xl">
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-2xl font-semibold text-proud-dark mb-2">
                Registrar hoje
              </h2>

              <p className="text-sm text-proud-gray mb-5">
                Faça um registro simples de como você está se sentindo hoje.
              </p>

              <div className="flex flex-wrap gap-3 mb-5">
                {sintomasRapidos.map((sintoma) => {
                  const selecionado = sintomaSelecionado === sintoma

                  return (
                    <button
                      key={sintoma}
                      onClick={() =>
                        setSintomaSelecionado(selecionado ? null : sintoma)
                      }
                      className={`rounded-full border px-4 py-2 text-sm ${
                        selecionado
                          ? 'border-proud-pink bg-proud-pink/10 text-proud-pink'
                          : 'border-gray-200 text-proud-dark'
                      }`}
                    >
                      {sintoma}
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="w-full sm:w-auto bg-proud-pink text-white px-5 py-3 rounded-xl font-medium">
                  Salvar registro
                </button>

                <button
                  onClick={() => setTabAtiva('hoje')}
                  className="w-full sm:w-auto rounded-xl border border-gray-200 px-5 py-3 text-sm text-proud-dark"
                >
                  Voltar para hoje
                </button>
              </div>
            </section>
          </div>
        )}

        {tabAtiva === 'historico' && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-heading text-2xl font-semibold text-proud-dark mb-2">
                Histórico de sessões
              </h2>

              <p className="text-sm text-proud-gray">
                Revise as sessões anteriores e acompanhe sua jornada com mais clareza.
              </p>
            </section>

            <section>
              <div className="space-y-4">
                {sessoesPassadas.length > 0 ? (
                  sessoesPassadas.map((sessao) => {
                    const temRegistros = registrosMock.some(
                      (r) => r.sessaoId === sessao.id
                    )

                    return (
                      <CardSessao
                        key={sessao.id}
                        sessao={sessao}
                        temRegistros={temRegistros}
                      />
                    )
                  })
                ) : (
                  <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-proud-gray">
                      Você ainda não tem sessões concluídas por aqui.
                    </p>
                  </section>
                )}
              </div>
            </section>
          </div>
        )}

        {tabAtiva === 'proximas' && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-proud-dark mb-2">
                    Próximas sessões
                  </h2>

                  <p className="text-sm text-proud-gray">
                    Veja o que ainda está por vir para se organizar com mais calma.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarOnboarding(true)}
                  className="rounded-full border border-proud-pink/20 bg-white px-4 py-2 text-sm font-medium text-proud-pink transition hover:bg-proud-pink/5"
                >
                  Adicionar sessões
                </button>
              </div>
            </section>

            <section className="space-y-4">
              {sessoesFuturas.length > 0 ? (
                sessoesFuturas.map((sessao) => (
                  <section
                    key={sessao.id}
                    className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-proud-gray mb-1">Sessão agendada</p>
                        <h3 className="font-heading text-xl font-semibold text-proud-dark mb-1">
                          Sessão {sessao.numeroSessao}
                        </h3>
                        <p className="text-sm text-proud-gray">
                          {formatarData(sessao.data)}
                        </p>
                      </div>

                      <span className="rounded-full bg-proud-pink/10 px-3 py-1 text-xs font-medium text-proud-pink">
                        Próxima etapa
                      </span>
                    </div>
                  </section>
                ))
              ) : (
                <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-proud-gray mb-4">
                    Você ainda não tem próximas sessões cadastradas.
                  </p>

                  <button
                    type="button"
                    onClick={() => setMostrarOnboarding(true)}
                    className="rounded-xl bg-proud-pink px-4 py-3 text-sm font-medium text-white"
                  >
                    Adicionar sessões
                  </button>
                </section>
              )}
            </section>
          </div>
        )}
      </div>

      <OnboardingSessoes
        isOpen={mostrarOnboarding}
        onClose={() => setMostrarOnboarding(false)}
        onConfirm={handleCriarSessoes}
        podeFechar={sessoes.length > 0}
      />

      {diaSelecionado && (
        <ModalEvento
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          dia={diaSelecionado}
          eventoExistente={eventoSelecionado}
          onSalvar={handleSalvarEvento}
          onExcluir={handleExcluirEvento}
        />
      )}
    </div>
  )
}