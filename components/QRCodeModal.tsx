'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { QRCodeSVG } from 'qrcode.react'
import { X } from 'lucide-react'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  code: string
  title?: string
}

export default function QRCodeModal({ isOpen, onClose, code, title }: QRCodeModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      />

      {/* Modal */}
      <div 
        className="relative bg-[#1A1A1A] rounded-2xl max-w-md w-full border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">
              {title || 'Ticket Access Code'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">Scan to view code</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg mb-4">
            <QRCodeSVG
              value={code}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Code Text */}
          <div className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 w-full">
            <p className="text-xs text-gray-400 text-center mb-1">Access Code</p>
            <p className="font-mono text-lg text-red-500 font-bold text-center">
              {code}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition-colors text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

