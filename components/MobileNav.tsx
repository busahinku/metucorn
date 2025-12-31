'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  PartyPopper, 
  Disc, 
  Library,
  User
} from 'lucide-react'

interface MobileNavProps {
  user?: any
}

export default function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/parties', label: 'Parties', icon: PartyPopper },
    { href: '/movies', label: 'Catalog', icon: Disc },
    { href: user ? '/profile' : '/login', label: user ? 'Profile' : 'Login', icon: User },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0C0C0C] border-t border-[#1A1A1A] z-50 md:hidden">
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
                ${active ? 'text-[#E5E5E5]' : 'text-[#353535]'}
              `}
            >
              <Icon 
                className={`w-5 h-5 ${active ? 'text-red-600' : 'text-[#353535]'}`} 
                strokeWidth={2} 
              />
              <span className={`text-[10px] font-medium ${active ? 'text-[#E5E5E5]' : 'text-[#353535]'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}







