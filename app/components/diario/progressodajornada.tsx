type Props = {
  totalSessoes: number
  sessoesConcluidas: number
  onVerHistorico?: () => void
  onVerProximas?: () => void
}

export default function ProgressoDaJornada({
  totalSessoes,
  sessoesConcluidas,
  onVerHistorico,
  onVerProximas,
}: Props) {
  const porcentagem = totalSessoes > 0 ? Math.round((sessoesConcluidas / totalSessoes) * 100) : 0

  return (
    <section className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-semibold text-proud-dark">
            Sessão {sessoesConcluidas} de {totalSessoes}
          </span>
          <span className="text-xs text-proud-gray ml-2">{porcentagem}% concluído</span>
        </div>
        <div className="flex gap-3">
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
      </div>
      <div className="w-full h-1.5 rounded-full bg-proud-pink/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-proud-pink transition-all"
          style={{ width: `${porcentagem}%` }}
        />
      </div>
    </section>
  )
}
