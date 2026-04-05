export default function Sobre() {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-3xl mx-auto px-4 py-12">
          
          <h1 className="font-heading text-3xl font-bold text-proud-dark mb-12">
            Sobre o ProudCare
          </h1>
  
          <div className="prose prose-lg max-w-none space-y-6 text-proud-gray">
            <p>
              Tudo começa com um momento que ninguém espera. O diagnóstico chega, e junto com ele vêm muitas dúvidas, medos e um silêncio que, às vezes, parece difícil de explicar. De repente, você precisa lidar com termos novos, decisões importantes e uma rotina que muda completamente, e nem sempre é fácil encontrar respostas claras ou alguém que realmente entenda o que você está sentindo.
            </p>
            
            <p>
              A gente percebeu que, nesse caminho, muitas mulheres se sentem sozinhas. Não por falta de amor ao redor, mas porque nem sempre existe um espaço seguro para buscar informação confiável, compartilhar sentimentos ou simplesmente entender o que está acontecendo, sem julgamentos e sem excesso de complexidade.
            </p>
            
            <p>
              O ProudCare nasce justamente para isso. Um lugar pensado com cuidado, onde você pode encontrar informação de verdade, organizar sua jornada no seu tempo e, principalmente, se sentir acompanhada. Aqui, você não precisa saber tudo. Você só precisa dar um passo de cada vez, a gente caminha com você.
            </p>
          </div>
  
          <div className="mt-16 bg-gradient-to-br from-proud-blue-light to-white rounded-2xl p-8 border border-proud-blue/20">
            <h2 className="font-heading text-2xl font-bold mb-6 text-proud-dark">Sobre a ProudCap</h2>
            
            <div className="space-y-4 text-proud-gray">
              <p>
                Dentro do ProudCare, existe a ProudCap, que é o nosso braço de crioterapia capilar. Ela surgiu de um desejo muito simples: ajudar mulheres a passarem por esse momento com mais autonomia sobre o próprio corpo e, se possível, preservar algo que também faz parte da sua identidade: o cabelo.
              </p>
              
              <p>
                A crioterapia capilar pode reduzir a queda durante a quimioterapia, e a ProudCap foi pensada para tornar esse processo mais acessível, seguro e acolhedor. Não é só sobre entregar um kit. É sobre orientar, estar disponível, explicar cada etapa e garantir que você se sinta tranquila para usar.
              </p>
              
              <p>
                Cada detalhe foi construído com muito cuidado. Desde o que vai no kit até a forma como a gente conversa com você. Porque sabemos que, nesse momento, não é só uma decisão prática, é emocional também. E você merece ser cuidada por inteiro.
              </p>
            </div>
  
            <div className="mt-8 flex gap-4">
              <a 
                href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre a crioterapia"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-proud-pink text-white px-6 py-3 rounded-lg font-medium hover:bg-proud-pink/90 transition inline-block"
              >
                Agendar crioterapia
              </a>
              <a 
                href="/biblioteca"
                className="border-2 border-proud-blue text-proud-blue px-6 py-3 rounded-lg font-medium hover:bg-proud-blue/10 transition inline-block"
              >
                Explorar biblioteca
              </a>
            </div>
          </div>
  
        </div>
      </div>
    )
  }