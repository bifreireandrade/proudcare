# 🩺 ProudCare — Roadmap de Produto

## 🎯 Norte do Produto

A ProudCare é um app de acompanhamento da jornada oncológica, com foco no dia a dia da quimioterapia.

Não é apenas:
- biblioteca
- calendário
- ou vitrine da ProudCap

É um sistema que ajuda a paciente a:
- entender seu corpo
- organizar sua rotina
- se sentir mais no controle

---

## 🧠 Centro do Produto

O núcleo do app é:

👉 **Meu Diário / Hoje**

Porque:
- gera uso recorrente
- cria vínculo
- aumenta valor percebido
- organiza todo o resto

---

# 🧱 Estrutura do Produto

## 1. Núcleo (core do app)

### 🟣 Hoje
- próxima sessão
- check-in do dia
- resumo recente
- lembretes

### 🟡 Calendário
- sessões
- exames
- registros
- visão temporal

### 🟢 Registrar
- sintomas
- humor
- energia
- apetite
- sono
- observações

### 🔵 Análise (futuro próximo)
- padrões entre ciclos
- tendências
- leitura do histórico

---

## 2. Camada de apoio

### 📚 Conteúdo
- entender tratamento
- como se cuidar
- direitos

### 🤝 Apoio
- crioterapia (ProudCap)
- contato

---

## 3. Camada operacional

### 🔐 Autenticação
- Clerk
- perfil do usuário

### 💾 Dados
- sessões
- registros
- eventos
- preferências

### 🔗 Integrações (futuro)
- Google Agenda
- notificações
- OCR

---

# 🗂 Estrutura do Projeto (Front-end)

## 📁 app/
- diario/
- biblioteca/
- components/
- layout.tsx

## 📁 components/
- header
- mobile nav
- componentes globais

## 📁 components/diario/
- proxima-sessao
- card-sessao
- calendario
- modal-evento

👉 Próximo passo: quebrar mais:

- tabs-diario.tsx
- secao-hoje.tsx
- secao-calendario.tsx
- secao-registrar.tsx
- card-checkin.tsx
- card-resumo.tsx

---

## 📁 lib/diario/
- types.ts
- mock-data.ts
- utils.ts

---

# 🚀 Roadmap de Produto

## 🔹 Fase 1 — Consolidar experiência principal

### Objetivo:
Fazer o diário parecer um produto real

### Entregas:
- [ ] Refinar `ProximaSessao`
- [ ] Refinar `CardSessao`
- [ ] Melhorar seção “Registrar”
- [ ] Melhorar mobile
- [ ] Integrar melhor com bottom nav

### Resultado esperado:
👉 “Isso realmente me ajuda”

---

## 🔹 Fase 2 — Tornar o registro útil

### Objetivo:
Criar valor real com dados

### Entregas:
- [ ] Sintomas com intensidade
- [ ] Humor / energia / apetite / sono
- [ ] Campo de observação
- [ ] Salvar registros
- [ ] Associar com dias/sessões

### Resultado esperado:
👉 histórico útil e pessoal

---

## 🔹 Fase 3 — Inteligência

### Objetivo:
Gerar insights

### Entregas:
- [ ] Tela de análise
- [ ] Padrões de sintomas
- [ ] Tempo de recuperação
- [ ] Resumo por ciclo

### Resultado esperado:
👉 “entendo meu corpo melhor”

---

## 🔹 Fase 4 — Automação

### Objetivo:
Reduzir esforço manual

### Entregas:
- [ ] Google Agenda
- [ ] Importação de sessões
- [ ] Lembretes

---

## 🔹 Fase 5 — Diferenciais

### Ideias:
- [ ] OCR de protocolo
- [ ] Insights mais inteligentes
- [ ] Fluxo contextual ProudCap
- [ ] Plano de cuidados

---

# 📌 Prioridades

## P0 — agora
- [ ] ProximaSessao
- [ ] CardSessao
- [ ] Registrar melhor
- [ ] Mobile refinado

## P1 — depois
- [ ] Persistência de dados
- [ ] Análise básica
- [ ] Calendário mais forte

## P2 — futuro
- [ ] Google Agenda
- [ ] OCR
- [ ] Notificações

---

# 🚫 O que NÃO fazer agora

- ❌ Focar em Google Agenda
- ❌ Investir em OCR
- ❌ Polir demais páginas institucionais
- ❌ Sofisticar análise sem dados reais

---

# 🧭 Plano de Execução

## Ordem sugerida

1. Refatorar `ProximaSessao`
2. Refatorar `CardSessao`
3. Evoluir “Registrar”
4. Estruturar dados reais
5. Melhorar navegação mobile

---

# ▶️ Próximo passo (amanhã)

👉 Começar por:

**Refatorar `ProximaSessao`**

Porque:
- é o card mais importante
- define percepção de valor
- ancora a experiência do app

---

# 💬 Observação final

Construir esse app não é sobre adicionar features.

É sobre:
👉 organizar a experiência da paciente  
👉 reduzir ansiedade  
👉 dar sensação de controle  

Se isso estiver acontecendo, estamos no caminho certo.