'use client'

import { useRouter } from 'next/navigation'
import { SessaoQuimio, RegistroDiario } from '@/lib/diario/types'
import { formatarData, getDiasAte } from '@/lib/diario/utils'
import ProximaSessao from './proxima-sessao'
import ProgressoDaJornada from './progressodajornada'

type Props = {
  totalSessoes: number
  sessoesConcluidas: number
  proximaSessao: SessaoQuimio | null
  sessoesFuturas: SessaoQuimio[]
  diasRegistradosNoMes: number
  registrouHoje: boolean
  diasDesdeUltimo: number | null
  ultimoRegistro: RegistroDiario | null
  onVerHistorico: () => void
  onVerProximas: () => void
}

function mensagemLembrete(diasDesdeUltimo: number | null, registrouHoje: boolean): string | null {
  if (registrouHoje) return null
  if (diasDesdeUltimo === null) return 'Você ainda não fez nenhum registro. Quando quiser, estamos aqui.'
  if (diasDesdeUltimo === 1) return 'Seu último registro foi ontem.'
  if (diasDesdeUltimo === 2) return 'Seu último registro foi há 2 dias.'
  if (diasDesdeUltimo <= 5) return `Seu último registro foi há ${diasDesdeUltimo} dias.`
  if (diasDesdeUltimo <= 10) return 'Faz alguns dias desde seu último registro — sem pressa, no seu tempo.'
  return 'Faz um tempinho desde seu último registro. Quando estiver bem, pode contar como foi.'
}

function labelContador(dias: number): string {
  if (dias === 0) return 'Nenhum registro esse mês'
  if (dias === 1) return '1 registro esse mês'
  return `${dias} registros esse mês`
}

function IconeContador({ dias }: { dias: number }) {
  if (dias === 0) return <span className="text-base">🌱</span>
  if (dias <= 3) return <span className="text-base">🌿</span>
  if (dias <= 7) return <span className="text-base">🌸</span>
  return <span className="text-base">🌺</span>
}

export default function SecaoHoje({
  totalSessoes,
  sessoesConcluidas,
  proximaSessao,
  sessoesFuturas,
  diasRegistradosNoMes,
  registrouHoje,
  diasDesdeUltimo,
  ultimoRegistro,
  onVerHistorico,
  onVerProximas,
}: Props) {
  const router = useRouter()
  const proximasAdicional = sessoesFuturas.slice(1, 4)
  const lembrete = mensagemLembrete(diasDesdeUltimo, registrouHoje)

  return (
    <div className="space-y-3">

      {/* Progresso */}
      <ProgressoDaJornada
        totalSessoes={totalSessoes}
        sessoesConcluidas={sessoesConcluidas}
        onVerHistorico={onVerHistorico}
        onVerProximas={onVerProximas}
      />

      {/* Próxima sessão */}
      {proximaSessao ? (
        <ProximaSessao
          sessao={proximaSessao}
          onRegistrar={() => router.push('/diario?tab=registrar')}
        />
      ) : totalSessoes === 0 ? (
        <section className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm text-center">
          <p className="text-sm text-proud-gray mb-3">
            Adicione suas sessões para organizar sua jornada.
          </p>
          <button
            type="button"
            onClick={onVerProximas}
            className="rounded-full bg-proud-pink px-5 py-2 text-sm font-medium text-white"
          >
            Adicionar sessões
          </button>
        </section>
      ) : (
        <section className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-proud-gray">Todas as sessões foram concluídas. 🌸</p>
        </section>
      )}

      {/* Preview das próximas */}
      {proximasAdicional.length > 0 && (
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-2">
            <p className="text-xs font-medium text-proud-gray uppercase tracking-wide">
              Próximas sessões
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {proximasAdicional.map((sessao) => {
              const dias = getDiasAte(sessao.data)
              return (
                <div key={sessao.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-proud-dark">
                      Sessão {sessao.numeroSessao}
                    </p>
                    <p className="text-xs text-proud-gray">{formatarData(sessao.data)}</p>
                  </div>
                  <span className="text-xs text-proud-gray">
                    {dias === 0 ? 'Hoje' : dias === 1 ? 'Amanhã' : `Em ${dias} dias`}
                  </span>
                </div>
              )
            })}
          </div>
          <button
            type="button"
            onClick={onVerProximas}
            className="w-full px-4 py-3 text-xs font-medium text-proud-pink text-left border-t border-gray-50"
          >
            Ver todas as sessões →
          </button>
        </section>
      )}

      {/* Registro — menor, sem pressão */}
      <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-proud-dark">Como você está?</h2>
          <div className="flex items-center gap-1.5">
            <IconeContador dias={diasRegistradosNoMes} />
            <span className="text-xs text-proud-gray">{labelContador(diasRegistradosNoMes)}</span>
          </div>
        </div>

        {lembrete && (
          <p className="text-xs text-proud-gray mb-3 leading-relaxed">{lembrete}</p>
        )}

        {registrouHoje && (
          <p className="text-xs text-proud-pink mb-3">✓ Você já registrou hoje.</p>
        )}

        <button
          type="button"
          onClick={() => router.push('/diario?tab=registrar')}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition ${
            registrouHoje
              ? 'bg-gray-50 text-proud-gray border border-gray-200'
              : 'bg-proud-pink text-white'
          }`}
        >
          {registrouHoje ? 'Registrar novamente' : 'Registrar como estou agora'}
        </button>
      </section>

    </div>
  )
}
