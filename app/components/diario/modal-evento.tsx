'use client'
import { useState } from 'react'
import { EventoSaude, TipoEvento } from '@/lib/diario/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getLabelTipo, getCorTextoEvento } from '@/lib/diario/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  dia: Date
  eventoExistente?: EventoSaude
  onSalvar: (evento: Partial<EventoSaude>) => void
  onExcluir?: (eventoId: string) => void
}

export default function ModalEvento({ 
  isOpen, 
  onClose, 
  dia, 
  eventoExistente,
  onSalvar,
  onExcluir
}: Props) {
  const [etapa, setEtapa] = useState<'selecionar' | 'criar'>('selecionar')
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoEvento | null>(null)
  
  const [titulo, setTitulo] = useState(eventoExistente?.titulo || '')
  const [horario, setHorario] = useState(eventoExistente?.horario || '')
  const [local, setLocal] = useState(eventoExistente?.local || '')
  const [descricao, setDescricao] = useState(eventoExistente?.descricao || '')
  
  if (!isOpen) return null
  
  const handleSelecaoTipo = (tipo: TipoEvento) => {
    setTipoSelecionado(tipo)
    setEtapa('criar')
    
    if (tipo === 'quimio') setTitulo('Sessão de quimioterapia')
    if (tipo === 'exame') setTitulo('Exame de sangue')
    if (tipo === 'retorno') setTitulo('Retorno médico')
  }
  
  const handleSalvar = () => {
    if (!tipoSelecionado) return
    
    const novoEvento: Partial<EventoSaude> = {
      tipo: tipoSelecionado,
      data: dia,
      titulo,
      horario,
      local,
      descricao,
      usuarioId: 'user-1',
      createdAt: new Date()
    }
    
    onSalvar(novoEvento)
    handleClose()
  }
  
  const handleExcluir = () => {
    if (eventoExistente && onExcluir) {
      if (confirm('Tem certeza que quer excluir este evento?')) {
        onExcluir(eventoExistente.id)
        handleClose()
      }
    }
  }
  
  const handleClose = () => {
    setEtapa('selecionar')
    setTipoSelecionado(null)
    setTitulo('')
    setHorario('')
    setLocal('')
    setDescricao('')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-proud-dark">
                {eventoExistente ? 'Detalhes do evento' : format(dia, "d 'de' MMMM", { locale: ptBR })}
              </h2>
              {eventoExistente && (
                <p className={`text-sm mt-1 ${getCorTextoEvento(eventoExistente.tipo)}`}>
                  {getLabelTipo(eventoExistente.tipo)}
                </p>
              )}
            </div>
            <button 
              type="button"
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          
          {eventoExistente && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-proud-gray mb-1">Título</p>
                <p className="font-medium text-proud-dark">{eventoExistente.titulo}</p>
              </div>
              
              {eventoExistente.horario && (
                <div>
                  <p className="text-sm text-proud-gray mb-1">Horário</p>
                  <p className="font-medium text-proud-dark">{eventoExistente.horario}</p>
                </div>
              )}
              
              {eventoExistente.local && (
                <div>
                  <p className="text-sm text-proud-gray mb-1">Local</p>
                  <p className="font-medium text-proud-dark">{eventoExistente.local}</p>
                </div>
              )}
              
              {eventoExistente.descricao && (
                <div>
                  <p className="text-sm text-proud-gray mb-1">Observações</p>
                  <p className="text-proud-dark">{eventoExistente.descricao}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={handleExcluir}
                  className="flex-1 border-2 border-red-500 text-red-500 px-4 py-3 rounded-lg font-medium hover:bg-red-50 transition"
                >
                  Excluir
                </button>
                <button 
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-proud-pink text-white px-4 py-3 rounded-lg font-medium hover:bg-proud-pink/90 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
          
          {!eventoExistente && etapa === 'selecionar' && (
            <div className="space-y-4">
              <p className="text-proud-gray mb-4">O que você quer adicionar nesse dia?</p>
              
              <button 
                type="button"
                onClick={() => handleSelecaoTipo('quimio')}
                className="w-full border-2 border-proud-pink text-left p-4 rounded-xl hover:bg-proud-pink/5 transition"
              >
                <div className="font-semibold text-proud-dark mb-1">Sessão de quimioterapia</div>
                <div className="text-sm text-proud-gray">Agendar ou reagendar uma sessão</div>
              </button>
              
              <button 
                type="button"
                onClick={() => handleSelecaoTipo('exame')}
                className="w-full border-2 border-purple-500 text-left p-4 rounded-xl hover:bg-purple-50 transition"
              >
                <div className="font-semibold text-proud-dark mb-1">Exame de sangue</div>
                <div className="text-sm text-proud-gray">Hemograma, plaquetas, etc</div>
              </button>
              
              <button 
                type="button"
                onClick={() => handleSelecaoTipo('retorno')}
                className="w-full border-2 border-green-500 text-left p-4 rounded-xl hover:bg-green-50 transition"
              >
                <div className="font-semibold text-proud-dark mb-1">Retorno médico</div>
                <div className="text-sm text-proud-gray">Consulta com oncologista ou outro médico</div>
              </button>
            </div>
          )}
          
          {!eventoExistente && etapa === 'criar' && tipoSelecionado && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-proud-dark mb-2">
                  Título
                </label>
                <input 
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-proud-pink"
                  placeholder="Ex: Sessão 5, Hemograma completo..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-proud-dark mb-2">
                  Horário (opcional)
                </label>
                <input 
                  type="time"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-proud-pink"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-proud-dark mb-2">
                  Local (opcional)
                </label>
                <input 
                  type="text"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-proud-pink"
                  placeholder="Ex: Hospital XYZ, Sala 302..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-proud-dark mb-2">
                  Observações (opcional)
                </label>
                <textarea 
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-proud-pink resize-none"
                  placeholder="Alguma observação importante..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEtapa('selecionar')}
                  className="flex-1 border-2 border-gray-300 text-proud-dark px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Voltar
                </button>
                <button 
                  type="button"
                  onClick={handleSalvar}
                  disabled={!titulo.trim()}
                  className="flex-1 bg-proud-pink text-white px-4 py-3 rounded-lg font-medium hover:bg-proud-pink/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
