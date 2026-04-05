import { SessaoQuimio } from '@/lib/diario/types'
import { getDiasAte, formatarData } from '@/lib/diario/utils'

type Props = {
  sessao: SessaoQuimio
}

export default function ProximaSessao({ sessao }: Props) {
  const diasAte = getDiasAte(sessao.data)
  
  return (
    <div className="bg-gradient-to-br from-proud-pink-light to-proud-blue-light rounded-2xl p-8 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-proud-gray mb-1">Próxima sessão</p>
          <h2 className="font-heading text-3xl font-bold text-proud-dark">
            Sessão {sessao.numeroSessao}
          </h2>
        </div>
        
        <div className="text-right">
          <div className="inline-block bg-white px-4 py-2 rounded-full shadow-sm">
            <p className="text-sm font-semibold text-proud-pink">
              {diasAte === 0 && 'Hoje'}
              {diasAte === 1 && 'Amanhã'}
              {diasAte > 1 && `Em ${diasAte} dias`}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-lg text-proud-dark mb-6">
        {formatarData(sessao.data)}
      </p>
      
      <div className="flex gap-3">
        <button type="button" className="bg-proud-pink text-white px-6 py-3 rounded-lg font-medium hover:bg-proud-pink/90 transition shadow-sm">
          Como estou me sentindo
        </button>
        <button type="button" className="bg-white text-proud-pink border-2 border-proud-pink px-6 py-3 rounded-lg font-medium hover:bg-proud-pink/5 transition">
          Ver detalhes
        </button>
      </div>
    </div>
  )
}
