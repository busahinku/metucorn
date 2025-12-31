'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Film, Play, Users, QrCode } from 'lucide-react'
import { format } from 'date-fns'
import QRCodeModal from './QRCodeModal'

interface TicketCardProps {
  ticket: {
    ticket_id: string
    movie_id: string
    access_code: string
    purchase_date: string
    movie?: {
      title: string
      poster_image?: string
    }
  }
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const [showQR, setShowQR] = useState(false)

  return (
    <>
      <Link
        href={`/movies/${ticket.movie_id}`}
        className="bg-[#121212] rounded-lg overflow-hidden border border-[#1A1A1A] hover:border-[#252525] transition-all group flex flex-col block"
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-[#1A1A1A]">
          {ticket.movie?.poster_image ? (
            <Image
              src={ticket.movie.poster_image}
              alt={ticket.movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 150px, 200px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-8 h-8 md:w-10 md:h-10 text-[#353535]" />
            </div>
          )}
          
          {/* Overlay - Always visible on mobile, Hover on desktop */}
          <div className="absolute inset-0 bg-black/40 md:bg-black/60 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Link
              href={`/watch/${ticket.movie_id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-black p-2 md:p-2.5 rounded-full transition-opacity shadow-lg z-10 hover:opacity-90"
              title="Watch Now"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-black" />
            </Link>
            <Link
              href={`/parties/create?movie=${ticket.movie_id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-red-600 text-white p-2 md:p-2.5 rounded-full transition-opacity shadow-lg z-10 hover:opacity-90"
              title="Create Party"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>

          {/* Status Badge */}
          <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 pointer-events-none z-10">
            <span className="px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold bg-green-500/90 backdrop-blur-sm text-white shadow-lg">
              OWNED
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 md:p-3 flex flex-col flex-1">
          <div className="text-xs md:text-sm font-bold text-[#E5E5E5] line-clamp-2 mb-2">
            {ticket.movie?.title}
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-[#A1A0A0] mb-2 md:mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(ticket.purchase_date), 'MMM dd')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5 mb-2" onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/watch/${ticket.movie_id}`}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs px-2 py-1.5 rounded text-center transition-colors font-medium"
            >
              Watch
            </Link>
          </div>

          {/* Ticket Code - Clickable with QR icon */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowQR(true)
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="mt-auto bg-[#1A1A1A] border border-[#252525] rounded px-2 py-1 md:py-1.5 flex items-center justify-between group-hover:border-red-500/30 hover:border-red-500/50 transition-colors cursor-pointer w-full relative z-10"
          >
            <span className="text-[8px] md:text-[9px] text-[#707070] font-medium uppercase tracking-wider hidden sm:inline">
              Code
            </span>
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
              <span className="font-mono text-[9px] md:text-[10px] text-red-500 font-bold">
                {ticket.access_code}
              </span>
              <QrCode className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500/70" />
            </div>
          </button>
        </div>
      </Link>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        code={ticket.access_code}
        title={ticket.movie?.title}
      />
    </>
  )
}

