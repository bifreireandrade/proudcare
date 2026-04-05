'use client'
import { useMemo, useState } from 'react'
import ProximaSessao from '../components/diario/proxima-sessao'
import CardSessao from '../components/diario/card-sessao'
import Calendario from '../components/diario/calendario'
import ModalEvento from '../components/diario/modal-evento'
import { sessoesMock, registrosMock, todosEventosMock } from '@/lib/diario/mock-data'
import { getProximaSessao } from '@/lib/diario/utils'
import { EventoSaude } from '@/lib/diario/types'

const sintomasRapidos = [
  'Enjoo',
  'Cansaço',
  'Dor',
  'Sono',
  'Apetite',
  'Boca sensível',
]

export default function Diario() {
  const [eventos, setEventos] = useState<EventoSaude[]>(todosEventosMock)
  const [modalAberto, setModalAberto] = useState(false)
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null)
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoSaude | undefined>()
  const [sintomaSelecionado, setSintomaSelecionado] = useState<string | null>(null)

  const proximaSessao = getProximaSessao(sessoesMock)

  const sessoesPassadas = useMemo(
    () =>
      sessoesMock
        .filter((s) => s.status === 'concluida')
        .sort((a, b) => b.data.getTime() - a.data.getTime())
        .slice(0, 3),
    []
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

    setEventos([...eventos, eventoCompleto])
    console.log('Evento salvo:', eventoCompleto)
  }

  const handleExcluirEvento = (eventoId: string) => {
    setEventos(eventos.filter((e) => e.id !== eventoId))
    console.log('Evento excluído:', eventoId)
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-proud-dark mb-2">
            Meu Diário
          </h1>
          <p className="text-proud-gray text-base md:text-lg">
            Acompanhe sua jornada com mais clareza, um dia de cada vez
          </p>
        </div>

        {/* Área principal */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 mb-12">
          {/* Coluna esquerda */}
          <div className="space-y-6">
            {proximaSessao && <ProximaSessao sessao={proximaSessao} />}

            {/* Como você está hoje */}
            <section className="rounded-3xl border border-gray-100 bg-white p-5 md:p-6 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-proud-dark mb-1">
                    Como você está hoje?
                  </h2>
                  <p className="text-sm text-proud-gray">
                    Faça um registro rápido do seu dia. Você não precisa preencher tudo.
                  </p>
                </div>

                <div className="hidden md:flex items-center rounded-full bg-proud-pink/[0.06] px-3 py-1 text-xs font-medium text-proud-pink">
                  Registro rápido
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-5">
                {sintomasRapidos.map((sintoma) => {
                  const selecionado = sintomaSelecionado === sintoma

                  return (
                    <button
                      key={sintoma}
                      onClick={() =>
                        setSintomaSelecionado(selecionado ? null : sintoma)
                      }
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        selecionado
                          ? 'border-proud-pink bg-proud-pink/10 text-proud-pink shadow-[0_6px_18px_rgba(232,71,139,0.10)]'
                          : 'border-gray-200 text-proud-dark hover:border-proud-pink/40 hover:bg-proud-pink/[0.04] hover:text-proud-pink'
                      }`}
                    >
                      {sintoma}
                    </button>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className="rounded-2xl bg-proud-pink text-white px-5 py-3.5 text-sm font-semibold transition hover:opacity-90">
                  Registrar como estou hoje
                </button>

                <button className="rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-proud-dark transition hover:border-proud-blue/30 hover:bg-proud-blue/[0.04] hover:text-proud-blue">
                  Escrever observação
                </button>
              </div>
            </section>

            {/* Resumo curto */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
                <div className="text-sm text-proud-gray mb-2">Último registro</div>
                <div className="text-base font-semibold text-proud-dark mb-1">
                  {ultimoRegistro?.titulo || 'Sem registro recente'}
                </div>
                <p className="text-sm text-proud-gray">
                  {ultimoRegistro?.descricao ||
                    'Quando você registrar como está hoje, seu resumo vai aparecer aqui.'}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-proud-blue/[0.05] to-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
                <div className="text-sm text-proud-gray mb-2">Sincronização</div>
                <div className="text-base font-semibold text-proud-dark mb-1">
                  Google Agenda
                </div>
                <p className="text-sm text-proud-gray mb-4">
                  Use a agenda para importar sessões e manter tudo organizado, sem precisar cadastrar manualmente.
                </p>
                <button className="text-sm font-medium text-proud-blue transition hover:underline">
                  Conectar agenda
                </button>
              </div>
            </section>
          </div>

          {/* Coluna direita */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-5 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-proud-dark">
                    Calendário
                  </h2>
                  <p className="text-sm text-proud-gray">
                    Veja sessões, exames e registros por data
                  </p>
                </div>

                <button className="hidden md:inline-flex rounded-full border border-gray-200 px-3 py-1.5 text-sm text-proud-gray transition hover:border-proud-pink/30 hover:text-proud-pink">
                  Hoje
                </button>
              </div>

              <Calendario eventos={eventos} onDiaClick={handleDiaClick} />
            </section>
          </div>
        </div>

        {/* Sessões anteriores */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-proud-dark">
                Sessões anteriores
              </h2>
              <p className="text-sm text-proud-gray mt-1">
                Revise como foi cada ciclo e seus registros mais recentes
              </p>
            </div>

            <button className="text-sm text-proud-pink font-medium hover:underline">
              Ver todas →
            </button>
          </div>

          <div className="relative max-w-3xl">
            <div className="absolute left-4 top-4 bottom-8 w-px bg-gray-200"></div>

            <div className="space-y-4">
              {sessoesPassadas.map((sessao) => {
                const temRegistros = registrosMock.some((r) => r.sessaoId === sessao.id)

                return (
                  <CardSessao
                    key={sessao.id}
                    sessao={sessao}
                    temRegistros={temRegistros}
                  />
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Modal de evento */}
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