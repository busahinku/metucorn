'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, Shield, LogOut } from 'lucide-react'
import SearchModal from './SearchModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  user?: any
  isAdmin?: boolean
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 md:left-[220px] right-0 h-16 md:h-20 bg-[#0C0C0C] border-b border-[#1A1A1A] flex items-center justify-between px-4 md:px-6 z-40">
      {/* Mobile View - Arrows + Admin Panel + Search Icon */}
      <div className="flex md:hidden items-center gap-3 flex-1">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-[#E5E5E5]" strokeWidth={2} />
          </button>
          <button
            onClick={() => window.history.forward()}
            className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors"
            aria-label="Go forward"
          >
            <ChevronRight className="w-5 h-5 text-[#E5E5E5]" strokeWidth={2} />
          </button>
        </div>

        {/* Admin Panel Button - Mobile */}
        {user && isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
          >
            <Shield className="w-3.5 h-3.5" strokeWidth={2} />
            Panel
          </Link>
        )}

        {/* Logout Button - Mobile */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[#A1A0A0] hover:text-[#E5E5E5] hover:bg-[#1A1A1A] rounded-lg transition-colors text-xs font-medium"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}

        {/* Search Icon Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className={`w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors ${user ? '' : 'ml-auto'}`}
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-[#E5E5E5]" strokeWidth={2} />
        </button>
      </div>

      {/* Desktop View - Arrows + Search Bar */}
      <div className="hidden md:flex items-center gap-8 flex-1">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-[#E5E5E5]" strokeWidth={2} />
          </button>
          <button 
            onClick={() => window.history.forward()}
            className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors"
            aria-label="Go forward"
          >
            <ChevronRight className="w-5 h-5 text-[#E5E5E5]" strokeWidth={2} />
          </button>
        </div>

        {/* Search Bar - Click to open modal */}
        <div className="max-w-[350px] flex-1">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-12 border border-[#202020] rounded-[15px] pl-11 pr-4 text-sm text-left text-[#919191] italic font-light hover:border-[#353535] transition-colors relative"
            style={{
              background: 'linear-gradient(89deg, rgba(217, 217, 217, 0.03) -230.14%, rgba(115, 115, 115, 0.05) 109.26%)',
            }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#919191]" strokeWidth={2} />
            Search Catalog...
          </button>
        </div>
      </div>

      {/* Step 3.0: Right Section - Desktop only */}
      <div className="hidden md:flex items-center gap-4">
        {/* Admin Panel Button */}
        {user && isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Shield className="w-4 h-4" strokeWidth={2} />
            Go to Panel
          </Link>
        )}

        {/* Auth Buttons */}
        {!user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="px-5 py-2 text-sm font-medium text-[#A1A0A0] hover:text-[#E5E5E5] transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium text-[#A1A0A0] hover:text-[#E5E5E5] transition-colors"
            >
              Log In
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#A1A0A0] hover:text-[#E5E5E5] hover:bg-[#1A1A1A] rounded-lg transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  )
}

