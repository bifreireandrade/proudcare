export default function OQueEsperar() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/biblioteca" className="text-proud-pink hover:underline mb-6 inline-block">
          ← Voltar para Biblioteca
        </a>

        <h1 className="font-heading text-3xl font-bold text-proud-dark mb-3">O que esperar do tratamento</h1>

        <p className="text-lg text-proud-gray mb-12">Cada corpo reage de um jeito. Mas saber o que pode acontecer ajuda.</p>

        <div className="prose prose-lg max-w-none space-y-8 text-proud-gray">
          <p>
            Cada corpo reage de um jeito à quimioterapia. Tem gente que sente mais, outras menos. E isso pode mudar até de uma sessão pra outra. Mas saber o que pode acontecer ajuda a diminuir a ansiedade e te dá mais controle sobre o que você está vivendo. A ideia aqui não é te assustar — é te preparar, com cuidado.
          </p>

          <div className="bg-proud-pink-light/30 rounded-xl p-6 my-8">
            <h2 className="font-heading text-xl font-semibold mb-4 text-proud-dark">Primeiros dias após a sessão</h2>

            <p className="mb-4 text-sm">
              É comum sentir enjoo, cansaço e uma sensação de &quot;corpo mais pesado&quot;. Algumas pessoas também têm dor de cabeça, tontura ou mais sensibilidade a cheiros.
            </p>

            <p className="text-sm">
              <strong>O que costuma ajudar:</strong> Comer pequenas quantidades ao longo do dia (sem forçar), beber líquidos em goles pequenos, descansar sem culpa e evitar cheiros fortes. Se o médico prescreveu remédio para enjoo, use certinho — não precisa esperar piorar para tomar.
            </p>
          </div>

          <div className="bg-proud-blue-light/30 rounded-xl p-6 my-8">
            <h2 className="font-heading text-xl font-semibold mb-4 text-proud-dark">Primeira semana</h2>

            <p className="mb-4 text-sm">
              Algumas mudanças começam a aparecer com mais clareza. A queda de cabelo, quando acontece, geralmente começa entre 10 e 20 dias após a primeira sessão — às vezes antes, às vezes depois.
            </p>

            <p className="mb-4 text-sm">
              O paladar também pode mudar: comidas que você gostava podem ficar estranhas, metálicas ou sem gosto. Aqui, vale testar sem pressão. Comer o que desce melhor naquele dia já é suficiente.
            </p>

            <p className="text-sm">
              Se a boca estiver sensível, prefira alimentos mais macios, frios ou mornos, e evite coisas muito ácidas ou duras.
            </p>
          </div>

          <div className="bg-proud-pink-light/30 rounded-xl p-6 my-8">
            <h2 className="font-heading text-xl font-semibold mb-4 text-proud-dark">Ao longo do tratamento</h2>

            <p className="mb-4 text-sm">
              Um ponto importante é a imunidade, que pode ficar mais baixa. Isso significa que o corpo fica mais vulnerável a infecções.
            </p>

            <p className="text-sm">
              <strong>Alguns cuidados ajudam:</strong> Lavar bem as mãos, evitar lugares muito cheios quando possível, ter atenção com alimentos crus e ficar de olho em qualquer sinal diferente no corpo. Não é sobre viver com medo — é só um cuidado a mais enquanto o corpo está mais sensível.
            </p>
          </div>

          <div className="border-2 border-proud-pink rounded-xl p-6 my-8">
            <h2 className="font-heading text-xl font-semibold mb-4 text-proud-dark">⚠️ Sinais de alerta - quando ligar pro médico</h2>

            <div className="space-y-2 text-sm">
              <p>• Febre (geralmente acima de 37,8°C ou conforme orientação do seu médico)</p>
              <p>• Calafrios ou sensação de infecção</p>
              <p>• Vômitos ou diarreia persistentes</p>
              <p>• Dificuldade para respirar</p>
              <p>• Dor forte ou diferente do habitual</p>
              <p>• Feridas na boca que impedem de comer ou beber</p>
              <p>• Sangramentos ou manchas roxas sem motivo aparente</p>
            </div>

            <p className="mt-4 text-sm italic">
              Se algo parecer fora do normal pra você, mesmo que não esteja nessa lista, confia na sua percepção e busca orientação.
            </p>
          </div>

          <p className="text-center italic mt-12">
            Você não precisa dar conta de tudo sozinha. Aos poucos, você vai entendendo como seu corpo reage — e vai encontrando o que funciona pra você.
          </p>
        </div>
      </div>
    </div>
  )
}
