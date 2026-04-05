import { SessaoQuimio } from '@/lib/diario/types'
import { getDiasAte, formatarData } from '@/lib/diario/utils'

type Props = {
  sessao: SessaoQuimio
}

export default function ProximaSessao({ sessao }: Props) {
  const diasAte = getDiasAte(sessao.data)

  const labelTempo = () => {
    if (diasAte === 0) return 'Hoje'
    if (diasAte === 1) return 'Amanhã'
    return `Em ${diasAte} dias`
  }

  const mensagemContexto = () => {
    if (diasAte === 0) return 'Sua sessão é hoje. Vá com calma, você não está sozinha.'
    if (diasAte === 1) return 'Sua sessão é amanhã. Que tal se preparar com carinho hoje?'
    if (diasAte <= 3) return 'Sua próxima sessão está chegando.'
    return 'Ainda tem um tempinho até a próxima sessão.'
  }

  return (
    <div className="bg-gradient-to-br from-proud-pink-light to-proud-blue-light rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-proud-gray mb-1">Próxima sessão</p>
          <h2 className="font-heading text-2xl font-semibold text-proud-dark">
            Sessão {sessao.numeroSessao}
          </h2>
        </div>

        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm">
          <p className="text-xs font-semibold text-proud-pink">
            {labelTempo()}
          </p>
        </div>
      </div>

      <p className="text-base text-proud-dark mb-3">
        {formatarData(sessao.data)}
      </p>

      <p className="text-sm text-proud-gray mb-6 leading-relaxed">
        {mensagemContexto()}
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="w-full bg-proud-pink text-white py-3 rounded-lg font-medium hover:bg-proud-pink/90 transition shadow-sm"
        >
          Registrar como estou me sentindo
        </button>

        <button
          type="button"
          className="w-full bg-white text-proud-pink border border-proud-pink/30 py-3 rounded-lg font-medium hover:bg-proud-pink/5 transition"
        >
          Ver detalhes da sessão
        </button>
      </div>
    </div>
  )
}