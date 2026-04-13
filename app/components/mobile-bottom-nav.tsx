'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const items = [
  {
    href: '/diario?tab=hoje',
    label: 'Hoje',
    matchPath: '/diario',
    matchTab: 'hoje',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    href: '/diario?tab=calendario',
    label: 'Calendário',
    matchPath: '/diario',
    matchTab: 'calendario',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    href: '/diario?tab=jornada',
    label: 'Jornada',
    matchPath: '/diario',
    matchTab: 'jornada',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zm12-3c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2z"
        />
      </svg>
    ),
  },
  {
    href: '/diario?tab=relatorio',
    label: 'Relatório',
    matchPath: '/diario',
    matchTab: 'relatorio',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    href: '/biblioteca',
    label: 'Apoio',
    matchPath: '/biblioteca',
    matchTab: null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabAtiva = searchParams.get('tab') ?? 'hoje'

  const isActive = (item: typeof items[number]) => {
    if (!pathname.startsWith(item.matchPath)) return false
    if (item.matchTab === null) return true
    return tabAtiva === item.matchTab
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
      <div className="grid grid-cols-5 items-center">
        {items.map((item) => {
          const active = isActive(item)

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1"
            >
              <div
                className={`transition-colors ${
                  active ? 'text-proud-pink' : 'text-gray-400'
                }`}
              >
                {item.icon}
              </div>

              <span
                className={`text-[10px] transition-colors ${
                  active ? 'font-semibold text-proud-pink' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
