'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Film,
  Users,
  BarChart3,
  PartyPopper,
  Star
} from 'lucide-react'
import LogoImage from '../LogoImage'

interface AdminSidebarProps {
  admin: any
}

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/movies', label: 'Movies', icon: Film },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/parties', label: 'Parties', icon: PartyPopper },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] bg-[#0C0C0C] border-r border-red-900/20 flex-col z-50">
      {/* Step 1.0: Admin Logo */}
      <div className="h-20 px-6 flex items-center border-b border-red-900/20">
        <Link href="/admin" className="flex items-center gap-3">
          <div>
            <LogoImage />
          </div>
        </Link>
      </div>

      {/* Step 2.0: Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${active 
                    ? 'bg-red-600/10 text-red-400 border border-red-600/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Step 3.0: Admin Info */}
      <div className="border-t border-red-900/20 p-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-red-600/5 border border-red-600/10">
          <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {admin.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {admin.username}
            </div>
            <div className="text-xs text-red-400">{admin.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

