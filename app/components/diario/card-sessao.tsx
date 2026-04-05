import { SessaoQuimio } from '@/lib/diario/types'
import { formatarData } from '@/lib/diario/utils'

type Props = {
  sessao: SessaoQuimio
  temRegistros?: boolean
}

export default function CardSessao({ sessao, temRegistros = false }: Props) {
  const isConcluida = sessao.status === 'concluida'
  
  return (
    <div className={`relative pl-12 pb-8 ${!isConcluida && 'opacity-60'}`}>
      
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isConcluida ? 'bg-proud-pink' : 'bg-gray-300'
      }`}>
        <span className="text-white text-sm font-bold">{sessao.numeroSessao}</span>
      </div>
      
      <div className={`bg-white border-2 rounded-xl p-4 hover:shadow-md transition ${
        isConcluida ? 'border-gray-100' : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-proud-dark">Sessão {sessao.numeroSessao}</p>
            <p className="text-sm text-proud-gray">{formatarData(sessao.data)}</p>
          </div>
          
          {temRegistros && (
            <span className="text-xs bg-proud-pink/10 text-proud-pink px-2 py-1 rounded-full font-medium">
              {isConcluida ? 'Com registros' : 'Agendada'}
            </span>
          )}
        </div>
        
        {isConcluida && (
          <button type="button" className="text-sm text-proud-pink font-medium hover:underline mt-2">
            Ver detalhes →
          </button>
        )}
      </div>
    </div>
  )
}
