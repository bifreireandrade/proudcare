'use client'

import { useMemo, useRef, useState } from 'react'
import { format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { addMonths, subMonths } from 'date-fns'
import { EventoSaude, RegistroDiario, SessaoQuimio, TipoHumor } from '@/lib/diario/types'
import { criarDataLocalSegura } from '@/lib/diario/utils'

type Props = {
  eventos: EventoSaude[]
  sessoes: SessaoQuimio[]
  registros: RegistroDiario[]
}

const corPorTipo: Record<string, string> = {
  quimio_feita: 'bg-proud-pink',
  quimio_agendada: 'bg-proud-pink/40',
  exame: 'bg-purple-500',
  retorno: 'bg-green-500',
}

const labelPorTipo: Record<string, string> = {
  quimio_feita: 'Sessão concluída',
  quimio_agendada: 'Sessão agendada',
  exame: 'Exame',
  retorno: 'Retorno',
}

const humores: { valor: TipoHumor; emoji: string; label: string }[] = [
  { valor: 'bem', emoji: '🙂', label: 'Bem' },
  { valor: 'cansada', emoji: '😴', label: 'Cansada' },
  { valor: 'enjoada', emoji: '🤢', label: 'Enjoada' },
  { valor: 'com_dor', emoji: '😣', label: 'Com dor' },
]

function badgeHumor(humor: TipoHumor) {
  const cores: Record<TipoHumor, string> = {
    bem: 'bg-green-50 text-green-700',
    cansada: 'bg-amber-50 text-amber-700',
    enjoada: 'bg-purple-50 text-purple-700',
    com_dor: 'bg-red-50 text-red-700',
  }
  const h = humores.find((h) => h.valor === humor)
  return (
    <span
      key={humor}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${cores[humor]}`}
    >
      {h?.label}
    </span>
  )
}

export default function SecaoRelatorio({ eventos, sessoes, registros }: Props) {
  const [mesAtual, setMesAtual] = useState(new Date())
  const [exportando, setExportando] = useState(false)
  const relatorioRef = useRef<HTMLDivElement>(null)

  const inicioMes = startOfMonth(mesAtual)
  const fimMes = endOfMonth(mesAtual)

  const eventosMes = useMemo(
    () =>
      eventos
        .filter((e) => {
          const d = criarDataLocalSegura(e.data)
          return d >= inicioMes && d <= fimMes
        })
        .sort(
          (a, b) =>
            criarDataLocalSegura(a.data).getTime() - criarDataLocalSegura(b.data).getTime()
        ),
    [eventos, mesAtual]
  )

  const sessoesMes = useMemo(
    () => eventosMes.filter((e) => e.tipo === 'quimio_feita' || e.tipo === 'quimio_agendada'),
    [eventosMes]
  )

  const examesMes = useMemo(
    () => eventosMes.filter((e) => e.tipo === 'exame'),
    [eventosMes]
  )

  const retornosMes = useMemo(
    () => eventosMes.filter((e) => e.tipo === 'retorno'),
    [eventosMes]
  )

  // humores do mês a partir dos registros
  const humoresMes = useMemo(() => {
    return registros
      .filter((r) => {
        const d = criarDataLocalSegura(r.data)
        return d >= inicioMes && d <= fimMes
      })
      .map((r) => {
        if ((r.enjoo ?? 0) >= 7) return 'enjoada' as TipoHumor
        if ((r.cansaco ?? 0) >= 7) return 'cansada' as TipoHumor
        if ((r.dor ?? 0) >= 7) return 'com_dor' as TipoHumor
        return 'bem' as TipoHumor
      })
  }, [registros, mesAtual])

  const sessaoDaSessao = (evento: EventoSaude): SessaoQuimio | undefined => {
    const id = evento.id.replace(/^sessao-/, '')
    return sessoes.find((s) => s.id === id)
  }

  const handleExportar = async () => {
    setExportando(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const elemento = relatorioRef.current
      if (!elemento) return

      const nomeMes = format(mesAtual, 'MMMM-yyyy', { locale: ptBR })

      await html2pdf()
        .set({
          margin: 0,
          filename: `proudcare-relatorio-${nomeMes}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(elemento)
        .save()
    } finally {
      setExportando(false)
    }
  }

  const nomeMesFormatado = format(mesAtual, 'MMMM yyyy', { locale: ptBR })

  return (
    <div className="space-y-4">
      {/* Header da seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMesAtual(subMonths(mesAtual, 1))}
            className="rounded-xl border border-gray-100 p-2 transition hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-semibold capitalize text-proud-dark">{nomeMesFormatado}</h2>
          <button
            type="button"
            onClick={() => setMesAtual(addMonths(mesAtual, 1))}
            className="rounded-xl border border-gray-100 p-2 transition hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={handleExportar}
          disabled={exportando}
          className="flex items-center gap-1.5 rounded-full bg-proud-pink px-4 py-1.5 text-xs font-medium text-white transition hover:bg-proud-pink/90 disabled:opacity-60"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {exportando ? 'Gerando...' : 'Exportar PDF'}
        </button>
      </div>

      {/* Conteúdo do relatório — este div é capturado pelo html2pdf */}
      <div ref={relatorioRef} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

        {/* Cabeçalho com cor */}
        <div className="bg-proud-pink px-6 py-6">
          <div className="mb-4 flex items-center gap-3">
            {/* Logo mark */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="10" r="5" fill="rgba(255,255,255,0.9)" />
              <circle cx="22.5" cy="14" r="4" fill="rgba(255,255,255,0.65)" />
              <circle cx="22.5" cy="21" r="4" fill="rgba(255,255,255,0.45)" />
              <circle cx="16" cy="25" r="4" fill="rgba(255,255,255,0.65)" />
              <circle cx="9.5" cy="21" r="4" fill="rgba(255,255,255,0.45)" />
              <circle cx="9.5" cy="14" r="4" fill="rgba(255,255,255,0.65)" />
              <circle cx="16" cy="17" r="4" fill="rgba(255,255,255,0.95)" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-white">ProudCare</p>
              <p className="text-xs text-white/70">relatório de tratamento</p>
            </div>
          </div>

          <p className="text-2xl font-semibold capitalize text-white">{nomeMesFormatado}</p>
          <p className="mt-1 text-xs text-white/70">
            gerado em {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        {/* Resumo rápido */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          <div className="px-4 py-4 text-center">
            <p className="text-2xl font-semibold text-proud-pink">{sessoesMes.length}</p>
            <p className="mt-1 text-xs text-proud-gray">sessões</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="text-2xl font-semibold text-purple-500">{examesMes.length}</p>
            <p className="mt-1 text-xs text-proud-gray">exames</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="text-2xl font-semibold text-green-500">{retornosMes.length}</p>
            <p className="mt-1 text-xs text-proud-gray">retornos</p>
          </div>
        </div>

        {/* Corpo */}
        <div className="px-5 py-5 space-y-6">

          {/* Linha do tempo de eventos */}
          {eventosMes.length > 0 ? (
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-proud-gray">
                Eventos do mês
              </p>
              <div className="space-y-2">
                {eventosMes.map((evento) => {
                  const sessao = sessaoDaSessao(evento)
                  const dataFormatada = format(criarDataLocalSegura(evento.data), "dd/MM", { locale: ptBR })
                  const concluido =
                    evento.tipo === 'quimio_feita' ||
                    (evento.tipo !== 'quimio_agendada' &&
                      criarDataLocalSegura(evento.data) < new Date())

                  return (
                    <div key={evento.id} className="flex items-center gap-3">
                      <span className="w-10 flex-shrink-0 text-right text-xs text-proud-gray">
                        {dataFormatada}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${corPorTipo[evento.tipo] ?? 'bg-gray-300'}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-proud-dark truncate">
                          {evento.titulo}
                        </p>
                        <p className="text-xs text-proud-gray">
                          {[evento.horario, evento.local, sessao?.acompanhante ? `acompanhada por ${sessao.acompanhante}` : null]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      </div>
                      <span
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${
                          concluido ? 'bg-green-400' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-proud-gray">
              Nenhum evento registrado nesse mês.
            </p>
          )}

          {/* Como me senti */}
          {humoresMes.length > 0 && (
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-proud-gray">
                Como me senti
              </p>
              <div className="flex flex-wrap gap-2">
                {humoresMes.map((humor, i) => (
                  <span key={i}>{badgeHumor(humor)}</span>
                ))}
              </div>
            </div>
          )}

          {/* Legenda */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex flex-wrap gap-3">
              {Object.entries(labelPorTipo).map(([tipo, label]) => (
                <div key={tipo} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${corPorTipo[tipo]}`} />
                  <span className="text-[11px] text-proud-gray">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-[11px] text-gray-300">proudcare.com.br</p>
          <p className="text-[11px] text-gray-300">documento confidencial</p>
        </div>
      </div>
    </div>
  )
}
