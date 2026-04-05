'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    href: '/diario',
    label: 'Hoje',
    match: ['/diario'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: '/diario',
    label: 'Calendário',
    match: ['/diario'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="1.8" />
        <path strokeLinecap="round" strokeWidth="1.8" d="M8 3v4M16 3v4M3 9h18" />
      </svg>
    ),
  },
  {
    href: '/diario',
    label: 'Registrar',
    match: ['/diario'],
    icon: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-proud-pink text-white shadow-[0_8px_20px_rgba(232,71,139,0.25)]">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 5v14M5 12h14" />
        </svg>
      </div>
    ),
  },
  {
    href: '/biblioteca/o-que-esperar',
    label: 'Apoio',
    match: ['/biblioteca', '/sobre', '/contato'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s-6.5-4.35-8.5-8A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 8.5 7c-2 3.65-8.5 8-8.5 8Z" />
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (match: string[]) => {
    return match.some((path) => pathname === path || pathname.startsWith(path + '/'))
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_12px_40px_rgba(17,24,39,0.10)]">
        <div className="grid grid-cols-4 items-end px-2 py-2">
          {items.map((item) => {
            const active = isActive(item.match)
            const isCenter = item.label === 'Registrar'

            if (isCenter) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center -mt-5"
                >
                  {item.icon}
                  <span className="mt-1 text-[11px] font-medium text-proud-dark">
                    {item.label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 py-2 text-center transition"
              >
                <span
                  className={`absolute top-0 h-1.5 w-8 rounded-full bg-proud-pink transition-all duration-300 ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div
                  className={`transition-colors duration-300 ${
                    active ? 'text-proud-pink' : 'text-proud-gray'
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[11px] transition-colors duration-300 ${
                    active ? 'font-semibold text-proud-pink' : 'text-proud-gray'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}