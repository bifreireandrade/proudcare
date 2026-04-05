'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs'

export default function Header() {
  const pathname = usePathname()

  // Título dinâmico baseado na rota
  const titulo = () => {
    if (pathname.startsWith('/diario')) return 'Meu Diário'
    if (pathname.startsWith('/biblioteca')) return 'Apoio'
    if (pathname.startsWith('/sobre')) return 'Sobre'
    if (pathname.startsWith('/contato')) return 'Contato'
    return null
  }

  const tituloAtual = titulo()

  return (
    <header className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 h-14">

        {/* Esquerda: logo ou título da página */}
        {tituloAtual ? (
          <span className="font-heading text-base font-semibold text-proud-dark">
            {tituloAtual}
          </span>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-proudcare.png"
              alt="ProudCare"
              width={32}
              height={32}
              className="shrink-0"
            />
            <span className="font-heading text-base font-semibold text-proud-dark">
              ProudCare
            </span>
          </Link>
        )}

        {/* Direita: autenticação */}
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm text-proud-pink font-medium">
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-proud-pink text-white px-3 py-1.5 rounded-full text-sm font-medium">
                Começar
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: { avatarBox: 'w-8 h-8' },
              }}
            />
          </Show>
        </div>
      </div>
    </header>
  )
}
