import { SessaoQuimio, TipoEvento } from './types'
import { differenceInDays, format, isFuture } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function getProximaSessao(sessoes: SessaoQuimio[]): SessaoQuimio | null {
  const futuras = sessoes
    .filter((s) => s.status === 'agendada' && isFuture(s.data))
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
  return differenceInDays(data, new Date())
}

export function formatarData(data: Date): string {
  return format(data, "d 'de' MMMM", { locale: ptBR })
}

export function formatarDataCompleta(data: Date): string {
  return format(data, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function getStatusMensagem(diasAte: number): string {
  if (diasAte === 0) return 'Hoje'
  if (diasAte === 1) return 'Amanhã'
  if (diasAte > 1 && diasAte <= 7) return `Em ${diasAte} dias`
  if (diasAte > 7) return formatarData(new Date(Date.now() + diasAte * 24 * 60 * 60 * 1000))
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