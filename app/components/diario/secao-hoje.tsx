'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SessaoQuimio, RegistroDiario, EventoSaude } from '@/lib/diario/types'
import { formatarData, getDiasAte, getDiasApos } from '@/lib/diario/utils'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ProximaSessao from './proxima-sessao'
import ProgressoDaJornada from './progressodajornada'
import Calendario from './calendario'

type Props = {
  totalSessoes: number
  sessoesConcluidas: number
  proximaSessao: SessaoQuimio | null
  ultimaSessao: SessaoQuimio | null
  sessoesFuturas: SessaoQuimio[]
  diasRegistradosNoMes: number
  registrouHoje: boolean
  diasDesdeUltimo: number | null
  ultimoRegistro: RegistroDiario | null
  registrosRecentes: RegistroDiario[]
  eventos: EventoSaude[]
  onVerHistorico: () => void
  onVerProximas: () => void
  onEditarSessao: (id: string, campos: Partial<Pick<SessaoQuimio, 'data' | 'horario' | 'local' | 'descricao'>>) => void
  onAdicionarEvento: (dia: Date) => void
  onExcluirEvento: (eventoId: string) => void
  onMarcarSessaoRealizada: (evento: EventoSaude) => void
}

function saudacao(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia ☀️'
  if (hora < 18) return 'Boa tarde 🌤️'
  return 'Boa noite 🌙'
}

function estadoEntresSessoes(
  ultimaSessao: SessaoQuimio | null,
  proximaSessao: SessaoQuimio | null
): string | null {
  if (!ultimaSessao) return null
  const diasApos = getDiasApos(ultimaSessao.data)
  if (diasApos <= 0) return null
  if (diasApos === 1) return `Dia 1 após a Sessão ${ultimaSessao.numeroSessao}. O corpo está processando — vá com calma.`
  if (diasApos <= 3) return `Dia ${diasApos} após a Sessão ${ultimaSessao.numeroSessao}. Esses primeiros dias costumam ser os mais difíceis.`
  if (diasApos <= 7) return `Dia ${diasApos} após a Sessão ${ultimaSessao.numeroSessao}. Você está na fase de recuperação.`
  if (proximaSessao && getDiasAte(proximaSessao.data) <= 7) {
    return 'Você está se aproximando da próxima sessão. Aproveite os dias de mais energia.'
  }
  return null
}

function mensagemLembrete(diasDesdeUltimo: number | null, registrouHoje: boolean): string | null {
  if (registrouHoje) return null
  if (diasDesdeUltimo === null) return 'Você ainda não fez nenhum registro. Quando quiser, estamos aqui.'
  if (diasDesdeUltimo === 1) return 'Seu último registro foi ontem.'
  if (diasDesdeUltimo === 2) return 'Seu último registro foi há 2 dias.'
  if (diasDesdeUltimo <= 5) return `Seu último registro foi há ${diasDesdeUltimo} dias.`
  if (diasDesdeUltimo <= 10) return 'Faz alguns dias desde seu último registro — sem pressa, no seu tempo.'
  return 'Faz um tempinho desde seu último registro. Quando estiver bem, pode contar como foi.'
}

function labelContador(dias: number): string {
  if (dias === 0) return 'Nenhum registro esse mês'
  if (dias === 1) return '1 registro esse mês'
  return `${dias} registros esse mês`
}

function IconeContador({ dias }: { dias: number }) {
  if (dias === 0) return <span className="text-base">🌱</span>
  if (dias <= 3) return <span className="text-base">🌿</span>
  if (dias <= 7) return <span className="text-base">🌸</span>
  return <span className="text-base">🌺</span>
}

function corPonto(reg: RegistroDiario): string {
  const valor = reg.humor ?? reg.energia ?? reg.apetite
  if (valor === undefined) return 'bg-gray-200'
  if (valor <= 3) return 'bg-red-400'
  if (valor <= 6) return 'bg-amber-400'
  return 'bg-green-400'
}

// Tipo de evento no dia para o mini-calendário
const corEventoTipo: Record<string, string> = {
  quimio_feita: 'bg-proud-pink',
  quimio_agendada: 'bg-proud-blue',
  exame: 'bg-purple-400',
  retorno: 'bg-green-400',
}

function MiniCalendarioSemanal({
  eventos,
  onAbrirMes,
}: {
  eventos: EventoSaude[]
  onAbrirMes: () => void
}) {
  const hoje = new Date()
  // Começa na segunda-feira da semana atual
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 })
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i))
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  return (
    <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <p className="text-xs font-medium text-proud-gray uppercase tracking-wide">
          {format(hoje, 'MMMM yyyy', { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
        </p>
        <button
          type="button"
          onClick={onAbrirMes}
          className="text-xs font-medium text-proud-pink"
        >
          Ver mês →
        </button>
      </div>

      <div className="grid grid-cols-7 px-3 pb-3 gap-1">
        {/* Labels dos dias */}
        {labels.map((label) => (
          <div key={label} className="text-center text-[10px] text-proud-gray pb-1">
            {label}
          </div>
        ))}

        {/* Dias */}
        {diasSemana.map((dia) => {
          const isHoje = isSameDay(dia, hoje)
          const eventosNoDia = eventos.filter((e) =>
            isSameDay(new Date(e.data), dia)
          )
          const tipoEvento = eventosNoDia[0]?.tipo

          return (
            <div key={dia.toISOString()} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition ${
                  isHoje
                    ? 'bg-proud-pink text-white'
                    : tipoEvento
                    ? 'bg-proud-pink/10 text-proud-pink'
                    : 'text-proud-dark'
                }`}
              >
                {format(dia, 'd')}
              </div>
              {/* Ponto indicador de evento */}
              {tipoEvento && !isHoje && (
                <div className={`w-1.5 h-1.5 rounded-full ${corEventoTipo[tipoEvento] ?? 'bg-gray-300'}`} />
              )}
              {!tipoEvento && <div className="w-1.5 h-1.5" />}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function BottomSheetCalendario({
  aberto,
  onFechar,
  eventos,
  onAdicionarEvento,
  onExcluirEvento,
  onMarcarSessaoRealizada,
  onRegistrar,
}: {
  aberto: boolean
  onFechar: () => void
  eventos: EventoSaude[]
  onAdicionarEvento: (dia: Date) => void
  onExcluirEvento: (id: string) => void
  onMarcarSessaoRealizada: (evento: EventoSaude) => void
  onRegistrar: () => void
}) {
  if (!aberto) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onFechar}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-white max-h-[90vh]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <h2 className="font-heading text-base font-semibold text-proud-dark">Calendário</h2>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg p-1.5 hover:bg-gray-100 transition"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Calendário com scroll */}
        <div className="overflow-y-auto flex-1 px-4 py-4">
          <Calendario
            eventos={eventos}
            onAdicionarEvento={onAdicionarEvento}
            onExcluirEvento={onExcluirEvento}
            onRegistrar={onRegistrar}
            onMarcarSessaoRealizada={onMarcarSessaoRealizada}
          />
        </div>
      </div>
    </>
  )
}

export default function SecaoHoje({
  totalSessoes,
  sessoesConcluidas,
  proximaSessao,
  ultimaSessao,
  sessoesFuturas,
  diasRegistradosNoMes,
  registrouHoje,
  diasDesdeUltimo,
  ultimoRegistro,
  registrosRecentes,
  eventos,
  onVerHistorico,
  onVerProximas,
  onEditarSessao,
  onAdicionarEvento,
  onExcluirEvento,
  onMarcarSessaoRealizada,
}: Props) {
  const router = useRouter()
  const [calendarioAberto, setCalendarioAberto] = useState(false)

  const lembrete = mensagemLembrete(diasDesdeUltimo, registrouHoje)
  const estadoEntre = estadoEntresSessoes(ultimaSessao, proximaSessao)

  // Próximas adicionais para mostrar no card colapsável (ainda mantemos)
  const proximasAdicional = sessoesFuturas.slice(1, 4)

  return (
    <>
      <div className="space-y-3">

        {/* Saudação */}
        <p className="text-sm font-medium text-proud-dark px-1">
          {saudacao()}
        </p>

        {/* Progresso */}
        <ProgressoDaJornada
          totalSessoes={totalSessoes}
          sessoesConcluidas={sessoesConcluidas}
          onVerHistorico={onVerHistorico}
          onVerProximas={onVerProximas}
        />

        {/* Mini-calendário semanal */}
        <MiniCalendarioSemanal
          eventos={eventos}
          onAbrirMes={() => setCalendarioAberto(true)}
        />

        {/* Estado entre sessões */}
        {estadoEntre && (
          <section className="rounded-2xl bg-proud-pink/5 border border-proud-pink/10 px-4 py-3">
            <p className="text-xs text-proud-dark leading-relaxed">{estadoEntre}</p>
          </section>
        )}

        {/* Próxima sessão */}
        {proximaSessao ? (
          <ProximaSessao
            sessao={proximaSessao}
            onEditar={onEditarSessao}
          />
        ) : totalSessoes === 0 ? (
          <section className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm text-center">
            <p className="text-sm text-proud-gray mb-3">
              Adicione suas sessões para organizar sua jornada.
            </p>
            <button
              type="button"
              onClick={onVerProximas}
              className="rounded-full bg-proud-pink px-5 py-2 text-sm font-medium text-white"
            >
              Adicionar sessões
            </button>
          </section>
        ) : (
          <section className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-proud-gray">Todas as sessões foram concluídas. 🌸</p>
          </section>
        )}

        {/* Próximas sessões — colapsável, só aparece se houver */}
        {proximasAdicional.length > 0 && (
          <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {proximasAdicional.map((sessao) => {
                const dias = getDiasAte(sessao.data)
                return (
                  <div key={sessao.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-proud-dark">
                        Sessão {sessao.numeroSessao}
                      </p>
                      <p className="text-xs text-proud-gray">{formatarData(sessao.data)}</p>
                    </div>
                    <span className="text-xs text-proud-gray">
                      {dias === 0 ? 'Hoje' : dias === 1 ? 'Amanhã' : `Em ${dias} dias`}
                    </span>
                  </div>
                )
              })}
            </div>
            <button
              type="button"
              onClick={onVerProximas}
              className="w-full px-4 py-3 text-xs font-medium text-proud-pink text-left border-t border-gray-50"
            >
              Ver todas as sessões →
            </button>
          </section>
        )}

        {/* Registro */}
        <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-proud-dark">Como você está?</h2>
            <div className="flex items-center gap-1.5">
              <IconeContador dias={diasRegistradosNoMes} />
              <span className="text-xs text-proud-gray">{labelContador(diasRegistradosNoMes)}</span>
            </div>
          </div>

          {registrosRecentes.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-proud-gray">Últimos registros</span>
              <div className="flex gap-1.5 items-center">
                {registrosRecentes.map((reg, i) => (
                  <div
                    key={reg.id}
                    title={new Date(reg.data).toLocaleDateString('pt-BR')}
                    className={`rounded-full transition-all ${corPonto(reg)} ${
                      i === registrosRecentes.length - 1 ? 'w-3 h-3' : 'w-2 h-2 opacity-60'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={onVerHistorico}
                className="text-xs text-proud-pink ml-auto"
              >
                Ver histórico →
              </button>
            </div>
          )}

          {lembrete && (
            <p className="text-xs text-proud-gray mb-3 leading-relaxed">{lembrete}</p>
          )}

          {registrouHoje && (
            <p className="text-xs text-proud-pink mb-3">✓ Você já registrou hoje.</p>
          )}

          <button
            type="button"
            onClick={() => router.push('/diario?tab=registrar')}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition ${
              registrouHoje
                ? 'bg-gray-50 text-proud-gray border border-gray-200'
                : 'bg-proud-pink text-white'
            }`}
          >
            {registrouHoje ? 'Registrar novamente' : 'Registrar como estou agora'}
          </button>
        </section>

      </div>

      {/* Bottom sheet do calendário */}
      <BottomSheetCalendario
        aberto={calendarioAberto}
        onFechar={() => setCalendarioAberto(false)}
        eventos={eventos}
        onAdicionarEvento={(dia) => {
          setCalendarioAberto(false)
          onAdicionarEvento(dia)
        }}
        onExcluirEvento={onExcluirEvento}
        onMarcarSessaoRealizada={onMarcarSessaoRealizada}
        onRegistrar={() => {
          setCalendarioAberto(false)
          router.push('/diario?tab=registrar')
        }}
      />
    </>
  )
}
