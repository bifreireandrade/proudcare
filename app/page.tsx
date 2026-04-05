import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-proud-pink-light to-proud-blue-light">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-proudcare.png"
            alt="ProudCare"
            width={100}
            height={100}
            priority
            className="drop-shadow-lg"
          />
        </div>
        
        <h1 className="font-heading text-5xl font-bold text-proud-dark mb-6">
          ProudCare
        </h1>
        
        <p className="text-2xl text-proud-gray mb-4">
          Você não está sozinha nessa jornada!
        </p>
        
        <p className="text-lg text-proud-gray mb-8">
          Acolhimento, informação confiável e organização para a sua jornada oncológica
        </p>
        
        <div className="flex gap-4 justify-center">
          <button className="bg-proud-pink text-white px-6 py-3 rounded-xl font-medium hover:bg-proud-pink/90">
            Começar agora
          </button>
          
          <button className="border-2 border-proud-blue text-proud-blue px-6 py-3 rounded-xl font-medium hover:bg-proud-blue/10">
            Conhecer a ProudCap
          </button>
        </div>
      </div>
    </div>
  )
}