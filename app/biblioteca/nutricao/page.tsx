export default function Nutricao() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/biblioteca" className="text-proud-pink hover:underline mb-6 inline-block">
          ← Voltar para Biblioteca
        </a>

        <h1 className="font-heading text-3xl font-bold text-proud-dark mb-3">
          Nutrição durante o tratamento
        </h1>

        <p className="text-lg text-proud-gray mb-12">O que comer quando é difícil comer</p>

        <div className="prose prose-lg max-w-none space-y-8 text-proud-gray">
          <p>
            Se alimentar durante a quimioterapia nem sempre é simples. Tem dia que o enjoo vem forte, o gosto da comida muda, a boca fica sensível… e só de pensar em comer já dá um desânimo. E tudo bem sentir isso. Aqui, a ideia não é &quot;comer perfeito&quot;, nem forçar nada. É encontrar jeitos mais leves de se alimentar, respeitando o seu corpo no ritmo dele.
          </p>

          <div className="bg-proud-pink-light/30 rounded-xl p-6 my-8">
            <h2 className="font-heading text-xl font-semibold mb-4 text-proud-dark">Quando o enjoo aparece</h2>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Biscoito água e sal:</strong> É leve, seco e fácil de digerir. Ajuda a &quot;assentar&quot; o estômago, principalmente logo ao acordar.
              </p>
              <p>
                <strong>Banana:</strong> Tem sabor suave, é fácil de mastigar e fornece energia rápida sem pesar.
              </p>
              <p>
                <strong>Arroz branco:</strong> Simples, neutro e confortável pro estômago. Funciona bem quando quase nada desce.
              </p>
              <p>
                <strong>Caldo de legumes ou canja:</strong> Quentinho, hidratante e nutritivo sem ser pesado.
              </p>
              <p>
                <strong>Gelatina:</strong> Refrescante, fácil de consumir e ajuda na hidratação.
              </p>
              <p>
                <strong>Maçã cozida ou raspada:</strong> Fica mais suave pro estômago e menos ácida.
              </p>
              <p>
                <strong>Gengibre:</strong> Ajuda a reduzir o enjoo naturalmente.
              </p>
            </div>
          </div>

          <div className="bg-proud-blue-light/30 rounded-xl p-6 my-8">
            <h2 className="font-heading text-xl font-semibold mb-4 text-proud-dark">O que evitar</h2>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Alimentos muito gordurosos:</strong> Pesam no estômago e podem aumentar o enjoo.
              </p>
              <p>
                <strong>Cheiros fortes:</strong> Às vezes o cheiro incomoda mais do que o sabor.
              </p>
              <p>
                <strong>Comidas muito doces:</strong> Podem dar mais náusea.
              </p>
              <p>
                <strong>Temperaturas extremas:</strong> Muito gelado ou quente pode irritar.
              </p>
              <p>
                <strong>Grandes quantidades:</strong> Melhor ir aos poucos ao longo do dia.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-semibold mb-6 text-proud-dark">Receitas simples</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-proud-pink pl-4">
                <h3 className="font-heading text-lg font-semibold mb-2">Creminho de banana com aveia</h3>
                <p className="text-sm mb-2">
                  <strong>Ingredientes:</strong> 1 banana amassada, 1 colher de aveia, água ou leite
                </p>
                <p className="text-sm">Misture tudo e leve ao micro-ondas por 1-2 minutos. Fica macio e fácil de comer.</p>
              </div>

              <div className="border-l-4 border-proud-blue pl-4">
                <h3 className="font-heading text-lg font-semibold mb-2">Sopa rápida de legumes</h3>
                <p className="text-sm mb-2">
                  <strong>Ingredientes:</strong> cenoura, batata, abobrinha, água, azeite e sal
                </p>
                <p className="text-sm">Cozinhe até ficar macio. Se quiser, amasse ou bata pra ficar cremosa.</p>
              </div>

              <div className="border-l-4 border-proud-pink pl-4">
                <h3 className="font-heading text-lg font-semibold mb-2">Purê simples de batata</h3>
                <p className="text-sm mb-2">
                  <strong>Ingredientes:</strong> 1 batata cozida, leite ou água, sal
                </p>
                <p className="text-sm">Amasse a batata quente, misture o líquido aos poucos. Leve e confortável.</p>
              </div>
            </div>
          </div>

          <p className="italic text-center mt-12">
            No fim, o mais importante: coma o que for possível naquele dia. Mesmo que seja pouco. Mesmo que seja repetido. Seu corpo está fazendo algo muito grande — e qualquer cuidado já é suficiente.
          </p>
        </div>
      </div>
    </div>
  )
}
