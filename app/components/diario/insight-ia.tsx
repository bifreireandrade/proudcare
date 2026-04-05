import { RegistroDiario } from '@/lib/diario/types'

type Props = {
  registros: RegistroDiario[]
}

export default function InsightIA({ registros }: Props) {
  return (
    <div className="flex items-center gap-2 px-1 py-2">
      <span className="text-base">✨</span>
      <p className="text-xs text-proud-gray">
        {registros.length >= 2
          ? 'Análise de padrões em breve — continue registrando!'
          : 'Faça pelo menos 2 registros para ver análises.'}
      </p>
    </div>
  )
}
