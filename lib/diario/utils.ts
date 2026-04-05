import { SessaoQuimio, TipoEvento } from './types'
import { differenceInCalendarDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function normalizarParaMeioDia(data: Date): Date {
  const novaData = new Date(data)
  novaData.setHours(12, 0, 0, 0)
  return novaData
}

export function inicioDoDiaLocal(data: Date): Date {
  const novaData = new Date(data)
  novaData.setHours(0, 0, 0, 0)
  return novaData
}

export function criarDataLocalSegura(data: Date | string): Date {
  if (data instanceof Date) {
    return normalizarParaMeioDia(data)
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split('-').map(Number)
    return new Date(ano, mes - 1, dia, 12, 0, 0, 0)
  }

  return normalizarParaMeioDia(new Date(data))
}

export function isHojeOuFuturo(data: Date): boolean {
  return inicioDoDiaLocal(data).getTime() >= inicioDoDiaLocal(new Date()).getTime()
}

export function isPassado(data: Date): boolean {
  return inicioDoDiaLocal(data).getTime() < inicioDoDiaLocal(new Date()).getTime()
}

export function getProximaSessao(sessoes: SessaoQuimio[]): SessaoQuimio | null {
  const futuras = sessoes
    .filter((s) => s.status === 'agendada' && isHojeOuFuturo(s.data))
    .sort((a, b) => a.data.getTime() - b.data.getTime())

  return futuras[0] || null
}

export function getUltimaSessaoConcluida(sessoes: SessaoQuimio[]): SessaoQuimio | null {
  const concluidas = sessoes
    .filter((s) => s.status === 'concluida')
    .sort((a, b) => b.data.getTime() - a.data.getTime())

  return concluidas[0] || null
}

export function getDiasAte(data: Date): number {
  return differenceInCalendarDays(inicioDoDiaLocal(data), inicioDoDiaLocal(new Date()))
}

export function getDiasApos(data: Date): number {
  return differenceInCalendarDays(inicioDoDiaLocal(new Date()), inicioDoDiaLocal(data))
}

export function formatarData(data: Date): string {
  return format(criarDataLocalSegura(data), "d 'de' MMMM", { locale: ptBR })
}

export function formatarDataCompleta(data: Date): string {
  return format(criarDataLocalSegura(data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatarHorario(horario?: string): string | null {
  if (!horario) return null
  return horario
}

export function getStatusMensagem(diasAte: number): string {
  if (diasAte === 0) return 'Hoje'
  if (diasAte === 1) return 'Amanhã'
  if (diasAte > 1 && diasAte <= 7) return `Em ${diasAte} dias`
  if (diasAte > 7) return 'Mais adiante'
  return 'Passado'
}

export function getCorEvento(tipo: TipoEvento, concluida: boolean = false): string {
  if (tipo === 'quimio') {
    return concluida ? 'bg-proud-pink' : 'bg-proud-blue'
  }
  if (tipo === 'exame') {
    return 'bg-purple-500'
  }
  if (tipo === 'retorno') {
    return 'bg-green-500'
  }
  return 'bg-gray-400'
}

export function getCorTextoEvento(tipo: TipoEvento): string {
  if (tipo === 'quimio') return 'text-proud-pink'
  if (tipo === 'exame') return 'text-purple-500'
  if (tipo === 'retorno') return 'text-green-500'
  return 'text-gray-500'
}

export function getLabelTipo(tipo: TipoEvento): string {
  if (tipo === 'quimio') return 'Quimioterapia'
  if (tipo === 'exame') return 'Exame'
  if (tipo === 'retorno') return 'Retorno'
  return 'Evento'
}