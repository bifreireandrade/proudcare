export default function Biblioteca() {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-3xl mx-auto px-4 py-16">
          
          {/* Header mais acolhedor */}
          <div className="mb-20 text-center">
            <h1 className="font-heading text-4xl font-bold text-proud-dark mb-4">
              Você não precisa descobrir tudo sozinha
            </h1>
            <p className="text-lg text-proud-gray max-w-2xl mx-auto leading-relaxed">
              A gente organizou o que você vai precisar, na ordem em que faz sentido. Começa pelo que te ajuda a entender o momento — e vai no seu ritmo.
            </p>
          </div>
  
          {/* JORNADA GUIADA */}
          <div className="relative">
            
            {/* Linha vertical conectando tudo */}
            <div className="absolute left-6 top-12 bottom-12 w-px bg-gradient-to-b from-proud-pink via-proud-pink/40 to-proud-pink/10"></div>
  
            <div className="space-y-12 relative">
  
              {/* PASSO 1: O que esperar */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 bg-proud-pink rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  1
                </div>
                
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-proud-pink/30 hover:shadow-lg transition-all">
                  <h2 className="font-heading text-2xl font-bold mb-3 text-proud-dark">
                    O que esperar do tratamento
                  </h2>
                  <p className="text-proud-gray mb-6 leading-relaxed">
                    Saber o que pode acontecer diminui a ansiedade. Efeitos colaterais, quando aparecem, quanto tempo duram — com honestidade, sem susto.
                  </p>
                  <a 
                    href="/biblioteca/o-que-esperar"
                    className="inline-block bg-proud-pink text-white px-6 py-3 rounded-lg font-medium hover:bg-proud-pink/90 transition shadow-sm"
                  >
                    Entender o que vem
                  </a>
                </div>
              </div>
  
              {/* Transição 1→2 */}
              <div className="pl-16 -my-6">
                <p className="text-sm text-proud-gray/60 italic">
                  Agora que você já sabe o que pode acontecer, vamos ver como cuidar do seu corpo no dia a dia.
                </p>
              </div>
  
              {/* PASSO 2: Nutrição */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 bg-proud-pink/80 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  2
                </div>
                
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-proud-pink/30 hover:shadow-lg transition-all">
                  <h2 className="font-heading text-2xl font-bold mb-3 text-proud-dark">
                    Como se alimentar
                  </h2>
                  <p className="text-proud-gray mb-6 leading-relaxed">
                    Quando enjoo, paladar estranho ou boca sensível aparecem, alguns alimentos ajudam mais. Aqui tem o que funciona de verdade.
                  </p>
                  <a 
                    href="/biblioteca/nutricao"
                    className="inline-block bg-proud-pink/80 text-white px-6 py-3 rounded-lg font-medium hover:bg-proud-pink/70 transition shadow-sm"
                  >
                    Ver o que comer
                  </a>
                </div>
              </div>
  
              {/* Transição 2→3 */}
              <div className="pl-16 -my-6">
                <p className="text-sm text-proud-gray/60 italic">
                  Se você quiser tentar preservar o cabelo durante o tratamento, existe uma opção.
                </p>
              </div>
  
              {/* PASSO 3: Crioterapia */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 bg-proud-pink/60 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  3
                </div>
                
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-proud-pink/30 hover:shadow-lg transition-all">
                  <h2 className="font-heading text-2xl font-bold mb-3 text-proud-dark">
                    Crioterapia capilar
                  </h2>
                  <p className="text-proud-gray mb-6 leading-relaxed">
                    Não é garantia, mas pode reduzir a queda. A ProudCap oferece aluguel de toucas hipotérmicas com todo o suporte que você precisa.
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <a 
                      href="/sobre#proudcap"
                      className="inline-block border-2 border-proud-pink/60 text-proud-pink px-6 py-3 rounded-lg font-medium hover:bg-proud-pink/5 transition"
                    >
                      Como funciona
                    </a>
                    <a 
                      href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre crioterapia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-proud-pink/60 text-white px-6 py-3 rounded-lg font-medium hover:bg-proud-pink/50 transition shadow-sm"
                    >
                      Agendar
                    </a>
                  </div>
                </div>
              </div>
  
              {/* Transição 3→4 */}
              <div className="pl-16 -my-6">
                <p className="text-sm text-proud-gray/60 italic">
                  E tem uma coisa importante: você tem direitos que podem te apoiar agora.
                </p>
              </div>
  
              {/* PASSO 4: Direitos */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 bg-proud-pink/40 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  4
                </div>
                
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-proud-pink/30 hover:shadow-lg transition-all">
                  <h2 className="font-heading text-2xl font-bold mb-3 text-proud-dark">
                    Seus direitos
                  </h2>
                  <p className="text-proud-gray mb-6 leading-relaxed">
                    Auxílio-doença, transporte gratuito, isenção de impostos, prioridade em filas. Você pode acessar isso — e a gente te mostra como.
                  </p>
                  <a 
                    href="/biblioteca/direitos"
                    className="inline-block bg-proud-pink/40 text-white px-6 py-3 rounded-lg font-medium hover:bg-proud-pink/30 transition shadow-sm"
                  >
                    Ver meus direitos
                  </a>
                </div>
              </div>
  
            </div>
          </div>
  
          {/* Footer acolhedor */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-proud-pink-light/20 rounded-2xl px-8 py-6 max-w-2xl">
              <p className="text-sm text-proud-gray leading-relaxed">
                Você não precisa fazer tudo de uma vez. Escolhe o que faz sentido hoje e volta quando quiser.  
                <br/><br/>
                <span className="text-xs text-proud-gray/60">Essas informações não substituem orientação médica. Sempre consulte seu oncologista.</span>
              </p>
            </div>
          </div>
  
        </div>
      </div>
    )
  }