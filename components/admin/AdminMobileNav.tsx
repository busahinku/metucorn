'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Film,
  Users,
  BarChart3,
  PartyPopper
} from 'lucide-react'

interface AdminMobileNavProps {
  admin?: any
}

export default function AdminMobileNav({ admin }: AdminMobileNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/movies', label: 'Movies', icon: Film },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/parties', label: 'Parties', icon: PartyPopper },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0C0C0C] border-t border-red-900/20 z-50 md:hidden">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] transition-colors
                ${active ? 'text-white' : 'text-gray-500'}
              `}
            >
              <Icon
                className={`w-5 h-5 ${active ? 'text-red-500' : 'text-gray-500'}`}
                strokeWidth={2}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
