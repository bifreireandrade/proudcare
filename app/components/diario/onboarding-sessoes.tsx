'use client'

import { useMemo, useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: {
    dataPrimeiraSessao: Date
    quantidadeSessoes: number
    intervaloDias: number
    marcarPassadasComoConcluidas: boolean
  }) => void
  podeFechar?: boolean
}

const opcoesPeriodicidade = [
  { id: '7', label: 'Semanal', dias: 7 },
  { id: '14', label: 'Quinzenal', dias: 14 },
  { id: '21', label: 'A cada 21 dias', dias: 21 },
  { id: 'personalizado', label: 'Outro intervalo', dias: null },
] as const

export default function OnboardingSessoes({
  isOpen,
  onClose,
  onConfirm,
  podeFechar = true,
}: Props) {
  const [etapa, setEtapa] = useState(1)
  const [dataPrimeiraSessao, setDataPrimeiraSessao] = useState('')
  const [periodicidadeSelecionada, setPeriodicidadeSelecionada] = useState<
    '7' | '14' | '21' | 'personalizado' | null
  >(null)
  const [intervaloPersonalizado, setIntervaloPersonalizado] = useState('')
  const [quantidadeSessoes, setQuantidadeSessoes] = useState('')
  const [marcarPassadasComoConcluidas, setMarcarPassadasComoConcluidas] = useState(false)

  const intervaloDias = useMemo(() => {
    if (!periodicidadeSelecionada) return null
    if (periodicidadeSelecionada === 'personalizado') {
      const valor = Number(intervaloPersonalizado)
      return Number.isFinite(valor) && valor > 0 ? valor : null
    }
    return Number(periodicidadeSelecionada)
  }, [periodicidadeSelecionada, intervaloPersonalizado])

  const existeDataPassada = useMemo(() => {
    if (!dataPrimeiraSessao) return false
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const primeiraData = new Date(`${dataPrimeiraSessao}T12:00:00`)
    return primeiraData < hoje
  }, [dataPrimeiraSessao])

  // Calcula quais datas geradas já passaram
  const datasPassadas = useMemo(() => {
    if (!dataPrimeiraSessao || !intervaloDias || !quantidadeSessoes) return []
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const total = Number(quantidadeSessoes)
    const passadas: string[] = []

    for (let i = 0; i < total; i++) {
      const data = new Date(`${dataPrimeiraSessao}T12:00:00`)
      data.setDate(data.getDate() + i * intervaloDias)
      data.setHours(0, 0, 0, 0)
      if (data < hoje) {
        passadas.push(data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }))
      }
    }
    return passadas
  }, [dataPrimeiraSessao, intervaloDias, quantidadeSessoes])

  const podeAvancarEtapa1 = Boolean(dataPrimeiraSessao)
  const podeAvancarEtapa2 = Boolean(intervaloDias)
  const podeAvancarEtapa3 = Boolean(Number(quantidadeSessoes) > 0)
  const podeFinalizar = Boolean(
    dataPrimeiraSessao && intervaloDias && Number(quantidadeSessoes) > 0
  )

  const textoResumo = useMemo(() => {
    if (!dataPrimeiraSessao || !intervaloDias || !quantidadeSessoes) return null
    return `Vamos organizar ${quantidadeSessoes} sessões, começando em ${new Date(
      `${dataPrimeiraSessao}T12:00:00`
    ).toLocaleDateString('pt-BR')} e repetindo a cada ${intervaloDias} dias.`
  }, [dataPrimeiraSessao, intervaloDias, quantidadeSessoes])

  const handleConfirmar = () => {
    if (!podeFinalizar || !intervaloDias) return
    onConfirm({
      dataPrimeiraSessao: new Date(`${dataPrimeiraSessao}T12:00:00`),
      quantidadeSessoes: Number(quantidadeSessoes),
      intervaloDias,
      marcarPassadasComoConcluidas,
    })
    setEtapa(1)
    setDataPrimeiraSessao('')
    setPeriodicidadeSelecionada(null)
    setIntervaloPersonalizado('')
    setQuantidadeSessoes('')
    setMarcarPassadasComoConcluidas(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-sm text-proud-gray">Vamos começar</p>
              <h2 className="font-heading text-2xl font-semibold text-proud-dark">
                Organize suas sessões
              </h2>
            </div>
            {podeFechar && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-proud-gray"
              >
                Fechar
              </button>
            )}
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="mb-5">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((numero) => {
                const ativa = etapa === numero
                const concluida = etapa > numero
                return (
                  <div
                    key={numero}
                    className={`h-2 flex-1 rounded-full ${
                      ativa || concluida ? 'bg-proud-pink' : 'bg-proud-pink/10'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          {etapa === 1 && (
            <div>
              <h3 className="mb-2 font-heading text-xl font-semibold text-proud-dark">
                Quando é a primeira sessão que você quer organizar?
              </h3>
              <p className="mb-5 text-sm text-proud-gray">
                Pode ser a primeira do tratamento ou a próxima etapa que você acabou de receber.
              </p>
              <input
                type="date"
                value={dataPrimeiraSessao}
                onChange={(e) => setDataPrimeiraSessao(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-proud-dark outline-none focus:border-proud-pink"
              />
              <div className="mt-6 flex gap-3">
                {podeFechar && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-proud-dark"
                  >
                    Agora não
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEtapa(2)}
                  disabled={!podeAvancarEtapa1}
                  className="w-full rounded-2xl bg-proud-pink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {etapa === 2 && (
            <div>
              <h3 className="mb-2 font-heading text-xl font-semibold text-proud-dark">
                Com que frequência essas sessões acontecem?
              </h3>
              <p className="mb-5 text-sm text-proud-gray">
                Escolha a opção que mais se aproxima do seu tratamento.
              </p>
              <div className="space-y-3">
                {opcoesPeriodicidade.map((opcao) => {
                  const ativa = periodicidadeSelecionada === opcao.id
                  return (
                    <button
                      key={opcao.id}
                      type="button"
                      onClick={() => setPeriodicidadeSelecionada(opcao.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        ativa
                          ? 'border-proud-pink bg-proud-pink/10 text-proud-pink'
                          : 'border-gray-200 text-proud-dark'
                      }`}
                    >
                      {opcao.label}
                    </button>
                  )
                })}
              </div>
              {periodicidadeSelecionada === 'personalizado' && (
                <div className="mt-4">
                  <label className="mb-2 block text-sm text-proud-gray">
                    Intervalo em dias
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={intervaloPersonalizado}
                    onChange={(e) => setIntervaloPersonalizado(e.target.value)}
                    placeholder="Ex: 10"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-proud-dark outline-none focus:border-proud-pink"
                  />
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEtapa(1)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-proud-dark"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setEtapa(3)}
                  disabled={!podeAvancarEtapa2}
                  className="w-full rounded-2xl bg-proud-pink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div>
              <h3 className="mb-2 font-heading text-xl font-semibold text-proud-dark">
                Quantas sessões você quer adicionar agora?
              </h3>
              <p className="mb-5 text-sm text-proud-gray">
                Você pode ajustar isso depois, se o plano mudar.
              </p>
              <input
                type="number"
                min={1}
                value={quantidadeSessoes}
                onChange={(e) => setQuantidadeSessoes(e.target.value)}
                placeholder="Ex: 3"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-proud-dark outline-none focus:border-proud-pink"
              />
              {textoResumo && (
                <div className="mt-4 rounded-2xl bg-proud-pink/5 p-4">
                  <p className="text-sm leading-relaxed text-proud-gray">
                    {textoResumo}
                  </p>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEtapa(2)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-proud-dark"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!existeDataPassada) {
                      handleConfirmar()
                    } else {
                      setEtapa(4)
                    }
                  }}
                  disabled={!podeAvancarEtapa3}
                  className="w-full rounded-2xl bg-proud-pink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {etapa === 4 && (
            <div>
              <h3 className="mb-2 font-heading text-xl font-semibold text-proud-dark">
                Algumas sessões já aconteceram?
              </h3>

              <p className="mb-3 text-sm text-proud-gray">
                Identificamos {datasPassadas.length}{' '}
                {datasPassadas.length === 1 ? 'sessão que já passou' : 'sessões que já passaram'}:
              </p>

              {/* Lista das datas passadas */}
              <div className="mb-4 rounded-2xl bg-proud-pink/5 px-4 py-3 space-y-1">
                {datasPassadas.map((data) => (
                  <p key={data} className="text-sm text-proud-pink font-medium">
                    • {data}
                  </p>
                ))}
              </div>

              <p className="mb-4 text-sm text-proud-gray">
                Quer marcar essas datas como sessões já realizadas?
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setMarcarPassadasComoConcluidas(true)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    marcarPassadasComoConcluidas
                      ? 'border-proud-pink bg-proud-pink/10 text-proud-pink'
                      : 'border-gray-200 text-proud-dark'
                  }`}
                >
                  Sim, marcar como realizadas
                </button>
                <button
                  type="button"
                  onClick={() => setMarcarPassadasComoConcluidas(false)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    !marcarPassadasComoConcluidas
                      ? 'border-proud-pink bg-proud-pink/10 text-proud-pink'
                      : 'border-gray-200 text-proud-dark'
                  }`}
                >
                  Não, deixar tudo como planejado
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEtapa(3)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-proud-dark"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmar}
                  disabled={!podeFinalizar}
                  className="w-full rounded-2xl bg-proud-pink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Criar sessões
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
