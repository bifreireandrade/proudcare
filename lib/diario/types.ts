export type Usuario = {
  id: string
  nome: string
  email: string
  googleCalendarConnected: boolean
  tratamentoInicio: Date
  tratamentoTipo?: string
}

export type TipoEvento = 'quimio' | 'quimio_feita' | 'quimio_agendada' | 'exame' | 'retorno'

export type EventoSaude = {
  id: string
  usuarioId: string
  tipo: TipoEvento
  data: Date
  titulo: string
  descricao?: string
  local?: string
  horario?: string
  googleEventId?: string
  createdAt: Date
}

export type SessaoQuimio = EventoSaude & {
  tipo: 'quimio'
  numeroSessao: number
  ciclo: number
  status: 'agendada' | 'concluida' | 'cancelada'
}

export type ExameSangue = EventoSaude & {
  tipo: 'exame'
  jejum?: boolean
  resultado?: string
}

export type RetornoMedico = EventoSaude & {
  tipo: 'retorno'
  medico?: string
  especialidade?: string
}

export type RegistroDiario = {
  id: string
  usuarioId: string
  sessaoId: string
  data: Date
  diasAposSessao: number

  enjoo?: number
  cansaco?: number
  dor?: number
  apetite?: number

  humor?: number
  energia?: number
  sono?: number

  observacoes?: string
  oQueAjudou?: string

  createdAt: Date
}

export type Insight = {
  id: string
  usuarioId: string
  tipo: 'padrao_sintoma' | 'sugestao' | 'alerta'
  mensagem: string
  baseadoEm: string[]
  geradoEm: Date
}