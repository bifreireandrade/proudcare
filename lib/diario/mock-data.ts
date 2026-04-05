import { SessaoQuimio, ExameSangue, RetornoMedico, RegistroDiario, Usuario, EventoSaude } from './types'

export const usuarioMock: Usuario = {
  id: 'user-1',
  nome: 'Maria',
  email: 'maria@example.com',
  googleCalendarConnected: false,
  tratamentoInicio: new Date('2025-01-15')
}

export const sessoesMock: SessaoQuimio[] = [
  {
    id: 'sessao-1',
    usuarioId: 'user-1',
    tipo: 'quimio',
    data: new Date('2025-01-15'),
    titulo: 'Sessão 1 - Quimioterapia',
    numeroSessao: 1,
    ciclo: 1,
    status: 'concluida',
    createdAt: new Date('2025-01-10')
  },
  {
    id: 'sessao-2',
    usuarioId: 'user-1',
    tipo: 'quimio',
    data: new Date('2025-02-05'),
    titulo: 'Sessão 2 - Quimioterapia',
    numeroSessao: 2,
    ciclo: 1,
    status: 'concluida',
    createdAt: new Date('2025-01-10')
  },
  {
    id: 'sessao-3',
    usuarioId: 'user-1',
    tipo: 'quimio',
    data: new Date('2025-02-26'),
    titulo: 'Sessão 3 - Quimioterapia',
    numeroSessao: 3,
    ciclo: 2,
    status: 'concluida',
    createdAt: new Date('2025-01-10')
  },
  {
    id: 'sessao-4',
    usuarioId: 'user-1',
    tipo: 'quimio',
    data: new Date('2025-03-19'),
    titulo: 'Sessão 4 - Quimioterapia',
    numeroSessao: 4,
    ciclo: 2,
    status: 'concluida',
    createdAt: new Date('2025-01-10')
  },
  {
    id: 'sessao-5',
    usuarioId: 'user-1',
    tipo: 'quimio',
    data: new Date('2025-04-09'),
    titulo: 'Sessão 5 - Quimioterapia',
    numeroSessao: 5,
    ciclo: 3,
    status: 'agendada',
    createdAt: new Date('2025-01-10')
  },
  {
    id: 'sessao-6',
    usuarioId: 'user-1',
    tipo: 'quimio',
    data: new Date('2025-04-30'),
    titulo: 'Sessão 6 - Quimioterapia',
    numeroSessao: 6,
    ciclo: 3,
    status: 'agendada',
    createdAt: new Date('2025-01-10')
  }
]

export const examesMock: ExameSangue[] = [
  {
    id: 'exame-1',
    usuarioId: 'user-1',
    tipo: 'exame',
    data: new Date('2025-04-07'),
    titulo: 'Hemograma completo',
    descricao: 'Exame pré-quimio',
    horario: '08:00',
    jejum: true,
    createdAt: new Date('2025-03-20')
  },
  {
    id: 'exame-2',
    usuarioId: 'user-1',
    tipo: 'exame',
    data: new Date('2025-04-28'),
    titulo: 'Exame de sangue',
    horario: '07:30',
    jejum: true,
    createdAt: new Date('2025-03-20')
  }
]

export const retornosMock: RetornoMedico[] = [
  {
    id: 'retorno-1',
    usuarioId: 'user-1',
    tipo: 'retorno',
    data: new Date('2025-04-15'),
    titulo: 'Retorno com oncologista',
    medico: 'Dra. Ana Silva',
    especialidade: 'Oncologia',
    horario: '14:00',
    local: 'Hospital XYZ - Sala 302',
    createdAt: new Date('2025-03-20')
  }
]

// Combina todos os eventos
export const todosEventosMock: EventoSaude[] = [
  ...sessoesMock,
  ...examesMock,
  ...retornosMock
]

export const registrosMock: RegistroDiario[] = [
  {
    id: 'reg-1',
    usuarioId: 'user-1',
    sessaoId: 'sessao-4',
    data: new Date('2025-03-19'),
    diasAposSessao: 0,
    enjoo: 6,
    cansaco: 7,
    apetite: 4,
    humor: 3,
    energia: 2,
    observacoes: 'Dia da sessão. Cansaço bateu forte à tarde.',
    createdAt: new Date('2025-03-19')
  },
  {
    id: 'reg-2',
    usuarioId: 'user-1',
    sessaoId: 'sessao-4',
    data: new Date('2025-03-20'),
    diasAposSessao: 1,
    enjoo: 8,
    cansaco: 8,
    apetite: 2,
    humor: 2,
    energia: 1,
    observacoes: 'Enjoo forte. Consegui comer só torrada.',
    oQueAjudou: 'Chá de gengibre',
    createdAt: new Date('2025-03-20')
  },
  {
    id: 'reg-3',
    usuarioId: 'user-1',
    sessaoId: 'sessao-4',
    data: new Date('2025-03-21'),
    diasAposSessao: 2,
    enjoo: 7,
    cansaco: 7,
    apetite: 3,
    humor: 3,
    energia: 2,
    observacoes: 'Enjoo ainda presente, mas um pouco melhor.',
    createdAt: new Date('2025-03-21')
  },
  {
    id: 'reg-4',
    usuarioId: 'user-1',
    sessaoId: 'sessao-4',
    data: new Date('2025-03-23'),
    diasAposSessao: 4,
    enjoo: 4,
    cansaco: 5,
    apetite: 6,
    humor: 4,
    energia: 4,
    observacoes: 'Melhorando. Consegui sair de casa.',
    createdAt: new Date('2025-03-23')
  }
]