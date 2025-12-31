import Link from 'next/link'
import Image from 'next/image'
import { Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-white/5 bg-[#0C0C0C] mt-auto">
      <div className="px-4 md:px-16 lg:px-16 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <div className="w-20 h-20 md:w-24 md:h-24 relative flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="metucorn"
                  width={96}
                  height={96}
                  className="rounded-lg object-contain w-full h-full"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Your ticket party platform. Buy movie tickets, create watch parties, and enjoy films with friends in real-time.
            </p>
            <p className="text-gray-500 text-xs mt-3">
              Educational Purposes - STAT311 Project
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  All Catalog
                </Link>
              </li>
              <li>
                <Link href="/parties" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Watch Parties
                </Link>
              </li>
              <li>
                <Link href="/my-tickets" className="text-gray-400 hover:text-white text-sm transition-colors">
                  My Tickets
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@metucorn.com" 
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  Contact
                  <Mail className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} metucorn. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs">Made with ❤️ for learning</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
