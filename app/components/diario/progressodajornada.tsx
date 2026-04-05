type Props = {
    totalSessoes: number
    sessoesConcluidas: number
    proximaSessaoTexto?: string
    onVerHistorico?: () => void
    onVerProximas?: () => void
  }
  
  export default function ProgressoDaJornada({
    totalSessoes,
    sessoesConcluidas,
    proximaSessaoTexto,
    onVerHistorico,
    onVerProximas,
  }: Props) {
    const porcentagem =
      totalSessoes > 0 ? Math.round((sessoesConcluidas / totalSessoes) * 100) : 0
  
    const sessoesRestantes = Math.max(totalSessoes - sessoesConcluidas, 0)
  
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-proud-gray mb-2">Sua jornada</p>
  
        <h2 className="font-heading text-xl font-semibold text-proud-dark mb-1">
          {sessoesConcluidas} de {totalSessoes} sessões concluídas
        </h2>
  
        <p className="text-sm text-proud-gray mb-4">
          {porcentagem}% do caminho percorrido
        </p>
  
        <div className="w-full h-3 rounded-full bg-proud-pink/10 overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-proud-pink transition-all"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
  
        <p className="text-sm text-proud-gray leading-relaxed mb-5">
          Faltam {sessoesRestantes} sessões.
          {proximaSessaoTexto ? ` ${proximaSessaoTexto}` : ''}
        </p>
  
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onVerHistorico}
            className="w-full rounded-xl border border-proud-pink/20 bg-white px-4 py-3 text-sm font-medium text-proud-pink transition hover:bg-proud-pink/5"
          >
            Ver histórico de sessões
          </button>
  
          <button
            type="button"
            onClick={onVerProximas}
            className="w-full rounded-xl bg-proud-pink text-white px-4 py-3 text-sm font-medium transition hover:opacity-90"
          >
            Ver próximas sessões
          </button>
        </div>
      </section>
    )
  }