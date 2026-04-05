'use client'

import { useState } from 'react'
import { SessaoQuimio } from '@/lib/diario/types'
import { useRegistros } from '@/lib/diario/use-registros'
import { formatarData } from '@/lib/diario/utils'

type Props = {
  sessaoAtual?: SessaoQuimio | null
  onSalvo?: () => void
}

const sintomas = [
  { id: 'enjoo', label: 'Enjoo' },
  { id: 'cansaco', label: 'Cansaço' },
  { id: 'dor', label: 'Dor' },
  { id: 'apetite', label: 'Apetite' },
  { id: 'humor', label: 'Humor' },
  { id: 'energia', label: 'Energia' },
  { id: 'sono', label: 'Sono' },
] as const

type SintomaId = (typeof sintomas)[number]['id']

const escalas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const labelEscala = (id: SintomaId, valor: number) => {
  // Apetite, humor, energia e sono: maior = melhor
  // Enjoo, cansaço, dor: maior = pior
  const positivoAltoMelhor = ['apetite', 'humor', 'energia', 'sono'].includes(id)
  if (positivoAltoMelhor) {
    if (valor <= 3) return 'Ruim'
    if (valor <= 6) return 'Regular'
    return 'Bom'
  } else {
    if (valor <= 3) return 'Leve'
    if (valor <= 6) return 'Moderado'
    return 'Intenso'
  }
}

const corEscala = (id: SintomaId, valor: number) => {
  const positivoAltoMelhor = ['apetite', 'humor', 'energia', 'sono'].includes(id)
  if (positivoAltoMelhor) {
    if (valor <= 3) return 'bg-red-100 text-red-600'
    if (valor <= 6) return 'bg-amber-100 text-amber-600'
    return 'bg-green-100 text-green-600'
  } else {
    if (valor <= 3) return 'bg-green-100 text-green-600'
    if (valor <= 6) return 'bg-amber-100 text-amber-600'
    return 'bg-red-100 text-red-600'
  }
}

export default function RegistroDiarioForm({ sessaoAtual, onSalvo }: Props) {
  const { salvarRegistro } = useRegistros()
  const [valores, setValores] = useState<Partial<Record<SintomaId, number>>>({})
  const [observacoes, setObservacoes] = useState('')
  const [oQueAjudou, setOQueAjudou] = useState('')
  const [salvo, setSalvo] = useState(false)

  const handleSlider = (id: SintomaId, valor: number) => {
    setValores((prev) => ({ ...prev, [id]: valor }))
  }

  const handleSalvar = () => {
    salvarRegistro({
      usuarioId: 'user-1',
      sessaoId: sessaoAtual?.id ?? 'sem-sessao',
      data: new Date(),
      diasAposSessao: 0,
      enjoo: valores.enjoo,
      cansaco: valores.cansaco,
      dor: valores.dor,
      apetite: valores.apetite,
      humor: valores.humor,
      energia: valores.energia,
      sono: valores.sono,
      observacoes: observacoes || undefined,
      oQueAjudou: oQueAjudou || undefined,
    })
    setSalvo(true)
    setTimeout(() => {
      setSalvo(false)
      onSalvo?.()
    }, 1800)
  }

  if (salvo) {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm text-center">
        <div className="text-4xl mb-3">💗</div>
        <h2 className="font-heading text-xl font-semibold text-proud-dark mb-2">
          Registro salvo!
        </h2>
        <p className="text-sm text-proud-gray">
          Obrigada por cuidar de você. Isso faz diferença.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-proud-dark mb-1">
          Como você está hoje?
        </h2>
        <p className="text-sm text-proud-gray">
          {sessaoAtual
            ? `Registro para a Sessão ${sessaoAtual.numeroSessao} — ${formatarData(sessaoAtual.data)}`
            : `Registro de ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}`}
        </p>
      </div>

      {/* Sliders de sintomas */}
      <div className="space-y-5">
        {sintomas.map(({ id, label }) => {
          const valor = valores[id]
          return (
            <div key={id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-proud-dark">{label}</span>
                {valor && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${corEscala(id, valor)}`}>
                    {labelEscala(id, valor)}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5">
                {escalas.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleSlider(id, n)}
                    className={`flex-1 h-8 rounded-lg text-xs font-medium transition ${
                      valor === n
                        ? 'bg-proud-pink text-white'
                        : valor && n <= valor
                        ? 'bg-proud-pink/20 text-proud-pink'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-proud-dark mb-2">
          Como foi o dia? (opcional)
        </label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Escreva o que quiser — pode ser uma palavra, uma frase, o que vier..."
          rows={3}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-proud-dark outline-none focus:border-proud-pink resize-none"
        />
      </div>

      {/* O que ajudou */}
      <div>
        <label className="block text-sm font-medium text-proud-dark mb-2">
          O que ajudou? (opcional)
        </label>
        <input
          type="text"
          value={oQueAjudou}
          onChange={(e) => setOQueAjudou(e.target.value)}
          placeholder="Ex: chá de gengibre, descanso, companhia..."
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-proud-dark outline-none focus:border-proud-pink"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          type="button"
          onClick={handleSalvar}
          className="w-full bg-proud-pink text-white px-5 py-3 rounded-xl font-medium"
        >
          Salvar registro
        </button>
      </div>
    </section>
  )
}
