export default function Contato() {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-2xl mx-auto px-4 py-12">
          
          <h1 className="font-heading text-3xl font-bold text-proud-dark mb-3">
            Fale com a gente
          </h1>
          
          <p className="text-lg text-proud-gray mb-12">
            Dúvidas sobre crioterapia? Quer conhecer a ProudCap?
          </p>
  
          {/* Formulário */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <form className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-proud-dark mb-2">
                  Seu nome
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-proud-pink"
                  placeholder="Como você gostaria de ser chamada?"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-proud-dark mb-2">
                  Email
                </label>
                <input 
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-proud-pink"
                  placeholder="seu@email.com"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-proud-dark mb-2">
                  Telefone (opcional)
                </label>
                <input 
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-proud-pink"
                  placeholder="(00) 00000-0000"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-proud-dark mb-2">
                  Mensagem
                </label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-proud-pink resize-none"
                  placeholder="Como podemos ajudar?"
                />
              </div>
  
              <button 
                type="submit"
                className="w-full bg-proud-pink text-white py-3 rounded-lg font-medium hover:bg-proud-pink/90 transition"
              >
                Enviar mensagem
              </button>
  
            </form>
          </div>
  
          {/* Outras formas de contato */}
          <div className="bg-proud-pink-light/30 rounded-xl p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Outras formas de contato</h3>
            
            <div className="space-y-3 text-sm text-proud-gray">
              <p>📱 <strong>WhatsApp:</strong> [Seu WhatsApp]</p>
              <p>📧 <strong>Email:</strong> [Seu email]</p>
              <p>📍 <strong>Endereço:</strong> [Endereço da ProudCap]</p>
            </div>
          </div>
  
        </div>
      </div>
    )
  }