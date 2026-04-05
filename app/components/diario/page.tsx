'use client'
import { useState } from 'react'
import ProximaSessao from '../components/diario/ProximaSessao'
import CardSessao from '../components/diario/CardSessao'
import Calendario from '../components/diario/Calendario'
import ModalEvento from '../components/diario/ModalEvento'
import { sessoesMock, registrosMock, todosEventosMock } from '@/lib/diario/mock-data'
import { getProximaSessao } from '@/lib/diario/utils'
import { EventoSaude } from '@/lib/diario/types'

export default function Diario() {
  const [eventos, setEventos] = useState<EventoSaude[]>(todosEventosMock)
  const [modalAberto, setModalAberto] = useState(false)
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null)
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoSaude | undefined>()
  
  const proximaSessao = getProximaSessao(sessoesMock)
  
  const sessoesPassadas = sessoesMock
    .filter(s => s.status === 'concluida')
    .sort((a, b) => b.data.getTime() - a.data.getTime())
    .slice(0, 3)
  
  const handleDiaClick = (dia: Date, evento?: EventoSaude) => {
    setDiaSelecionado(dia)
    setEventoSelecionado(evento)
    setModalAberto(true)
  }
  
  const handleSalvarEvento = (novoEvento: Partial<EventoSaude>) => {
    const eventoCompleto: EventoSaude = {
      id: `evento-${Date.now()}`,
      usuarioId: novoEvento.usuarioId || 'user-1',
      tipo: novoEvento.tipo!,
      data: novoEvento.data!,
      titulo: novoEvento.titulo!,
      descricao: novoEvento.descricao,
      local: novoEvento.local,
      horario: novoEvento.horario,
      createdAt: new Date()
    }
    
    setEventos([...eventos, eventoCompleto])
    console.log('Evento salvo:', eventoCompleto)
  }
  
  const handleExcluirEvento = (eventoId: string) => {
    setEventos(eventos.filter(e => e.id !== eventoId))
    console.log('Evento excluído:', eventoId)
  }
  
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold text-proud-dark mb-2">
            Meu Diário
          </h1>
          <p className="text-proud-gray">
            Acompanhe sua jornada, uma sessão de cada vez
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Coluna esquerda */}
          <div className="space-y-8">
            {/* Próxima sessão */}
            {proximaSessao && <ProximaSessao sessao={proximaSessao} />}
            
            {/* CTA conexão Google */}
            <div className="bg-proud-blue-light/20 rounded-xl p-6 text-center">
              <p className="text-sm text-proud-gray mb-4">
                Conecte sua agenda do Google para importar suas sessões automaticamente
              </p>
              <button className="bg-white border-2 border-proud-blue text-proud-blue px-6 py-3 rounded-lg font-medium hover:bg-proud-blue/5 transition">
                Conectar Google Agenda
              </button>
            </div>
          </div>
          
          {/* Coluna direita: Calendário */}
          <div>
            <Calendario 
              eventos={eventos}
              onDiaClick={handleDiaClick}
            />
          </div>
          
        </div>

        {/* Últimas sessões */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-semibold text-proud-dark">
              Sessões anteriores
            </h2>
            <button className="text-sm text-proud-pink font-medium hover:underline">
              Ver todas →
            </button>
          </div>
          
          {/* Timeline */}
          <div className="relative max-w-2xl">
            <div className="absolute left-4 top-4 bottom-8 w-px bg-gray-200"></div>
            
            <div>
              {sessoesPassadas.map(sessao => {
                const temRegistros = registrosMock.some(r => r.sessaoId === sessao.id)
                return (
                  <CardSessao 
                    key={sessao.id} 
                    sessao={sessao}
                    temRegistros={temRegistros}
                  />
                )
              })}
            </div>
          </div>
        </div>

      </div>
      
      {/* Modal de evento */}
      {diaSelecionado && (
        <ModalEvento 
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          dia={diaSelecionado}
          eventoExistente={eventoSelecionado}
          onSalvar={handleSalvarEvento}
          onExcluir={handleExcluirEvento}
        />
      )}
      
    </div>
  )
}