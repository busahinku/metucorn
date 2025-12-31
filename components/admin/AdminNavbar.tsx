'use client'

import Link from 'next/link'
import { ArrowLeft, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AdminNavbarProps {
  user: any
  admin: any
}

export default function AdminNavbar({ user, admin }: AdminNavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 md:left-[260px] right-0 h-16 md:h-20 bg-[#0C0C0C] border-b border-red-900/20 flex items-center justify-between px-4 md:px-6 z-40">
      {/* Step 1.0: Left Section */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">Back to Site</span>
        </Link>
      </div>

      {/* Step 2.0: Right Section */}
      <div className="flex items-center gap-4">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 transition-colors text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  )
}


