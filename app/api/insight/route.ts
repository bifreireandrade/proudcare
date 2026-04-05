import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { registros } = await req.json()

  const prompt = `Você é uma assistente gentil e acolhedora do app ProudCare, voltado para mulheres em tratamento de quimioterapia.
Analise os registros de sintomas da paciente e gere uma observação humana, calorosa e encorajadora sobre os padrões que você identifica.

Regras:
- Fale como uma amiga atenta, não como um médico
- Máximo 3 observações curtas
- Termine com algo encorajador
- Responda em português do Brasil
- Máximo 4 frases

Registros: ${JSON.stringify(registros)}`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500 },
        }),
      }
    )

    const data = await response.json()
    console.log('Gemini response:', JSON.stringify(data, null, 2))

    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!texto) {
      return NextResponse.json({ erro: 'Sem resposta', debug: data }, { status: 500 })
    }

    return NextResponse.json({ insight: texto })
  } catch (err) {
    console.error('Erro ao chamar Gemini:', err)
    return NextResponse.json({ erro: String(err) }, { status: 500 })
  }
}