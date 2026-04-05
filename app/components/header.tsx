'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from '@clerk/nextjs'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const getItemClasses = (path: string) => {
    const active = isActive(path)

    return `group relative block overflow-hidden rounded-2xl px-4 py-3 transition-all duration-300 ease-out ${
      active
        ? 'bg-proud-pink/10 text-proud-pink shadow-[0_6px_18px_rgba(232,71,139,0.08)]'
        : 'text-proud-dark hover:bg-proud-pink/[0.045] hover:translate-x-1'
    }`
  }

  const getTextClasses = (path: string) => {
    return isActive(path) ? 'text-proud-pink' : 'text-proud-dark'
  }

  const getSubtextClasses = (path: string) => {
    return isActive(path) ? 'text-proud-pink/70' : 'text-proud-gray/70'
  }

  return (
    <>
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm text-proud-pink font-medium hover:underline">
                  Entrar
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="bg-proud-pink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-proud-pink/90 transition">
                  Começar
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col leading-tight text-right">
                  <span className="text-xs text-proud-gray/70">Minha conta</span>
                  <span className="text-sm font-medium text-proud-dark">Meu perfil</span>
                </div>

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9',
                    },
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8">
          {/* TOPO DO MENU */}
          <div className="flex items-start justify-between mb-10">
            <button
              onClick={() => setIsOpen(false)}
              className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
              aria-label="Fechar menu"
            >
              ✕
            </button>

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 hover:opacity-90 transition"
            >
              <Image
                src="/logo-proudcare.png"
                alt="ProudCare"
                width={64}
                height={64}
                className="shrink-0"
              />
              <div className="leading-tight">
                <div className="text-xl font-bold text-proud-dark">ProudCare</div>
                <div className="text-xs text-proud-gray/70">
                  Sua jornada com mais cuidado
                </div>
              </div>
            </Link>
          </div>

          <nav className="space-y-8">
            {/* MEU DIÁRIO */}
            <Link
              href="/diario"
              onClick={() => setIsOpen(false)}
              className={`${getItemClasses('/diario')} py-4`}
            >
              <span
                className={`absolute left-0 rounded-r-full bg-proud-pink transition-all duration-300 ease-out ${
                  isActive('/diario')
                    ? 'top-2 h-[calc(100%-16px)] w-1 opacity-100'
                    : 'top-1/2 h-0 w-1 -translate-y-1/2 opacity-0 group-hover:top-2 group-hover:h-[calc(100%-16px)] group-hover:translate-y-0 group-hover:opacity-100'
                }`}
              />
              <div className={`font-bold text-base transition-colors duration-300 ${getTextClasses('/diario')}`}>
                Meu Diário
              </div>
              <div className={`text-xs mt-1 transition-colors duration-300 ${getSubtextClasses('/diario')}`}>
                Acompanhe sua quimio dia a dia
              </div>
            </Link>

            {/* SUA JORNADA */}
            <div className="space-y-2">
              <div className="px-3 text-[11px] uppercase tracking-[0.18em] text-proud-gray/45 font-semibold">
                Sua jornada
              </div>

              <Link
                href="/biblioteca/o-que-esperar"
                onClick={() => setIsOpen(false)}
                className={getItemClasses('/biblioteca/o-que-esperar')}
              >
                <span
                  className={`absolute left-0 rounded-r-full bg-proud-pink transition-all duration-300 ease-out ${
                    isActive('/biblioteca/o-que-esperar')
                      ? 'top-2 h-[calc(100%-16px)] w-1 opacity-100'
                      : 'top-1/2 h-0 w-1 -translate-y-1/2 opacity-0 group-hover:top-2 group-hover:h-[calc(100%-16px)] group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                />
                <div className={`font-semibold text-base transition-colors duration-300 ${getTextClasses('/biblioteca/o-que-esperar')}`}>
                  Entender o tratamento
                </div>
                <div className={`text-xs mt-1 transition-colors duration-300 ${getSubtextClasses('/biblioteca/o-que-esperar')}`}>
                  O que esperar em cada fase
                </div>
              </Link>

              <Link
                href="/biblioteca/nutricao"
                onClick={() => setIsOpen(false)}
                className={getItemClasses('/biblioteca/nutricao')}
              >
                <span
                  className={`absolute left-0 rounded-r-full bg-proud-pink transition-all duration-300 ease-out ${
                    isActive('/biblioteca/nutricao')
                      ? 'top-2 h-[calc(100%-16px)] w-1 opacity-100'
                      : 'top-1/2 h-0 w-1 -translate-y-1/2 opacity-0 group-hover:top-2 group-hover:h-[calc(100%-16px)] group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                />
                <div className={`font-semibold text-base transition-colors duration-300 ${getTextClasses('/biblioteca/nutricao')}`}>
                  Como se cuidar
                </div>
                <div className={`text-xs mt-1 transition-colors duration-300 ${getSubtextClasses('/biblioteca/nutricao')}`}>
                  Sintomas, alimentação e rotina
                </div>
              </Link>

              <Link
                href="/biblioteca/direitos"
                onClick={() => setIsOpen(false)}
                className={getItemClasses('/biblioteca/direitos')}
              >
                <span
                  className={`absolute left-0 rounded-r-full bg-proud-pink transition-all duration-300 ease-out ${
                    isActive('/biblioteca/direitos')
                      ? 'top-2 h-[calc(100%-16px)] w-1 opacity-100'
                      : 'top-1/2 h-0 w-1 -translate-y-1/2 opacity-0 group-hover:top-2 group-hover:h-[calc(100%-16px)] group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                />
                <div className={`font-semibold text-base transition-colors duration-300 ${getTextClasses('/biblioteca/direitos')}`}>
                  Seus direitos
                </div>
                <div className={`text-xs mt-1 transition-colors duration-300 ${getSubtextClasses('/biblioteca/direitos')}`}>
                  Auxílios, prioridades e acessos
                </div>
              </Link>
            </div>

            {/* APOIOS */}
            <div className="space-y-2">
              <div className="px-3 text-[11px] uppercase tracking-[0.18em] text-proud-gray/45 font-semibold">
                Apoios
              </div>

              <Link
                href="/sobre"
                onClick={() => setIsOpen(false)}
                className={getItemClasses('/sobre')}
              >
                <span
                  className={`absolute left-0 rounded-r-full bg-proud-pink transition-all duration-300 ease-out ${
                    isActive('/sobre')
                      ? 'top-2 h-[calc(100%-16px)] w-1 opacity-100'
                      : 'top-1/2 h-0 w-1 -translate-y-1/2 opacity-0 group-hover:top-2 group-hover:h-[calc(100%-16px)] group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                />
                <div className={`font-medium text-base transition-colors duration-300 ${getTextClasses('/sobre')}`}>
                  Preservar o cabelo
                </div>
                <div className={`text-xs mt-1 transition-colors duration-300 ${getSubtextClasses('/sobre')}`}>
                  Conheça a crioterapia
                </div>
              </Link>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-100 pt-5">
              <div className="space-y-1">
                <Link
                  href="/contato"
                  onClick={() => setIsOpen(false)}
                  className="group block py-2.5 px-3 rounded-xl text-sm text-gray-500 transition-all duration-300 hover:bg-proud-pink/[0.03] hover:text-proud-dark hover:translate-x-1"
                >
                  Fale com a gente
                </Link>

                <Link
                  href="/sobre"
                  onClick={() => setIsOpen(false)}
                  className="group block py-2.5 px-3 rounded-xl text-sm text-gray-500 transition-all duration-300 hover:bg-proud-pink/[0.03] hover:text-proud-dark hover:translate-x-1"
                >
                  Sobre a ProudCare
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  )
}