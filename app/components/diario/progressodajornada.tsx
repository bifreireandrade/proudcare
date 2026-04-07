type Props = {
  totalSessoes: number
  sessoesConcluidas: number
  onVerHistorico?: () => void
  onVerProximas?: () => void
}

function mensagemProgresso(concluidas: number, total: number): string {
  if (total === 0) return ''
  const pct = Math.round((concluidas / total) * 100)
  if (concluidas === 0) return 'Sua jornada está começando. Um passo de cada vez.'
  if (pct <= 25) return 'Você está no início. Cada sessão conta.'
  if (pct <= 50) return 'Você já passou por muito. Continue.'
  if (pct < 75) return 'Você está na metade da jornada. Já percorreu muito caminho.'
  if (pct < 100) return 'Reta final. Você chegou longe.'
  return 'Todas as sessões concluídas. 🌸'
}

function corBarra(pct: number): string {
  if (pct <= 25) return 'bg-proud-blue'
  if (pct <= 50) return 'bg-proud-pink/70'
  if (pct < 100) return 'bg-proud-pink'
  return 'bg-proud-pink'
}

export default function ProgressoDaJornada({
  totalSessoes,
  sessoesConcluidas,
  onVerHistorico,
  onVerProximas,
}: Props) {
  const porcentagem = totalSessoes > 0 ? Math.round((sessoesConcluidas / totalSessoes) * 100) : 0
  const mensagem = mensagemProgresso(sessoesConcluidas, totalSessoes)

  return (
    <section className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-proud-dark">
          {sessoesConcluidas} de {totalSessoes} concluídas
        </span>
        <span className="text-xs font-medium text-proud-pink">{porcentagem}%</span>
      </div>

      {mensagem && (
        <p className="text-xs text-proud-gray mb-3 leading-relaxed">{mensagem}</p>
      )}

      {/* Barra maior e com cor progressiva */}
      <div className="w-full h-2.5 rounded-full bg-proud-pink/10 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${corBarra(porcentagem)}`}
          style={{ width: `${porcentagem}%` }}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onVerHistorico}
          className="text-xs text-proud-gray"
        >
          Histórico
        </button>
        <button
          type="button"
          onClick={onVerProximas}
          className="text-xs text-proud-pink font-medium"
        >
          Próximas →
        </button>
      </div>
    </section>
  )
}
