'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Users, X } from 'lucide-react'

interface Participant {
  client_id: string
  client: {
    name: string
  }
}

interface PartyParticipantsProps {
  participants: Participant[]
  hostName: string
}

export default function PartyParticipants({ participants, hostName }: PartyParticipantsProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 text-xs text-[#A1A0A0] hover:text-[#E5E5E5] transition-colors px-2 py-1 rounded hover:bg-white/5"
      >
        <Users className="w-3.5 h-3.5" />
        <span>{participants.length} {participants.length === 1 ? 'participant' : 'participants'}</span>
      </button>

      {/* Participants Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Blurry Background Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#E5E5E5]" />
                  <h2 className="text-lg font-bold text-[#E5E5E5]">Participants</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#A1A0A0] hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Participants List */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {participants.length > 0 ? (
                  <div className="space-y-2">
                    {participants.map((participant, index) => (
                      <div
                        key={participant.client_id}
                        className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-semibold text-sm">
                          {participant.client?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#E5E5E5]">
                            {participant.client?.name || 'Unknown'}
                          </p>
                          {participant.client?.name === hostName && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-semibold rounded">
                              HOST
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-[#353535] mx-auto mb-3" />
                    <p className="text-sm text-[#707070]">No participants yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
