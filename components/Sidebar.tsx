'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  Home, 
  PartyPopper, 
  Disc, 
  Library,
  Users,
  Film
} from 'lucide-react'
import LogoImage from './LogoImage'

interface SidebarProps {
  user?: any
  joinedParties?: any[]
}

export default function Sidebar({ user, joinedParties = [] }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Homepage', icon: Home },
    { href: '/parties', label: 'Upcoming Parties', icon: PartyPopper },
    { href: '/movies', label: 'All Catalog', icon: Disc },
    { href: '/my-tickets', label: 'Your Library', icon: Library },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] bg-[#0C0C0C] border-r border-[#1A1A1A] flex-col z-50">
      {/* Step 1.0: Logo Section - Larger container for bigger logo */}
      <div className="h-20 px-8 flex items-center border-b border-[#1A1A1A]">
        <Link href="/" className="flex items-center">
          <LogoImage />
        </Link>
      </div>

      {/* Step 2.0: Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="py-4">
          <div className="text-[12px] font-medium text-[#353535] tracking-wider mb-3 px-8">
            Feed
          </div>
          
          <div className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center gap-3 px-8 py-2.5 transition-colors
                    ${active 
                      ? 'text-[#E5E5E5]' 
                      : 'text-[#353535] hover:text-[#E5E5E5]'
                    }
                  `}
                >
                  {/* Red indicator bar - left aligned */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-red-600 rounded-r-full"></div>
                  )}
                  <Icon 
                    className={`w-5 h-5 ${active ? 'text-[#E5E5E5]' : 'text-[#353535]'}`} 
                    strokeWidth={2} 
                  />
                  <span className={`text-sm font-medium ${active ? 'text-[#E5E5E5]' : 'text-[#353535]'}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Step 3.0: Quick Links Section - User's Joined Parties */}
        {user && joinedParties && joinedParties.length > 0 && (
          <div className="px-4 py-4 mt-4 border-t border-[#1A1A1A]">
            <div className="text-[10px] font-medium text-[#353535] uppercase tracking-wider mb-3 px-2">
            Quick Links
          </div>
            <div className="space-y-2">
              {joinedParties.map((party: any) => {
                const participantCount = party.party_participant?.length || 0
                const scheduledDate = new Date(party.scheduled_time)
                
                return (
                  <Link
                    key={party.party_id}
                    href="/parties"
                    className="group bg-[#121212] rounded-lg overflow-hidden border border-[#1A1A1A] hover:border-red-600/50 transition-all flex"
                  >
                    {/* Thumbnail - Left Side */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {party.movie?.poster_image ? (
                        <Image
                          src={party.movie.poster_image}
                          alt={party.movie.title}
                          fill
                          className="object-cover rounded-l-lg"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center rounded-l-lg">
                          <Film className="w-4 h-4 text-[#353535]" />
                        </div>
                      )}
                    </div>

                    {/* Content - Right Side */}
                    <div className="flex-1 p-2 flex flex-col justify-between min-w-0">
                      {/* Title */}
                      <h3 className="text-white font-semibold text-[11px] line-clamp-1 mb-0.5">
                        {party.movie?.title || 'Movie Night'}
                      </h3>
                      
                      {/* Bottom Row: People & Date */}
                      <div className="flex items-center justify-between gap-1">
                        {/* People Count */}
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-400 text-[10px]">
                            {participantCount}
                          </span>
                        </div>
                        
                        {/* Date */}
                        <div className="text-gray-400 text-[10px] truncate">
                          {scheduledDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Step 4.0: User Profile Section */}
      {user && (
        <div className="border-t border-[#1A1A1A] p-4">
          <Link 
            href="/profile"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#151515] transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-sm font-semibold text-white">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#E5E5E5] truncate">
                {user.email?.split('@')[0]}
              </div>
              <div className="text-xs text-[#353535]">View profile</div>
            </div>
          </Link>
        </div>
      )}
    </aside>
  )
}

