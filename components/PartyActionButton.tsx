'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Users, LogOut, Eye, Clock } from 'lucide-react'

interface PartyActionButtonProps {
  partyId: string
  partyCode: string
  movieId: string
  scheduledTime: string
  userId: string | undefined
}

export default function PartyActionButton({ 
  partyId, 
  partyCode, 
  movieId, 
  scheduledTime,
  userId 
}: PartyActionButtonProps) {
  const [loading, setLoading] = useState(false)
  const [isParticipant, setIsParticipant] = useState(false)
  const [hasTicket, setHasTicket] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const isTimeToWatch = new Date(scheduledTime) <= new Date()

  useEffect(() => {
    async function checkStatus() {
      if (!userId) return

      const { data: client } = await supabase
        .from('client')
        .select('client_id')
        .eq('user_id', userId)
        .maybeSingle()

      if (!client) return

      setClientId(client.client_id)

      // Check if has ticket
      const { data: ticket } = await supabase
        .from('ticket')
        .select('ticket_id')
        .eq('client_id', client.client_id)
        .eq('movie_id', movieId)
        .eq('is_active', true)
        .maybeSingle()

      setHasTicket(!!ticket)

      // Check if already participant
      const { data: participant } = await supabase
        .from('party_participant')
        .select('participant_id')
        .eq('party_id', partyId)
        .eq('client_id', client.client_id)
        .maybeSingle()

      setIsParticipant(!!participant)
    }

    checkStatus()
  }, [userId, partyId, movieId])

  const handleJoin = async () => {
    setLoading(true)

    try {
      if (!clientId) throw new Error('Client profile not found')

      if (!hasTicket) {
        alert('You need to purchase a ticket for this movie first!')
        router.push(`/movies/${movieId}`)
        return
      }

      const { error } = await supabase
        .from('party_participant')
        .insert({
          party_id: partyId,
          client_id: clientId,
        })

      if (error) throw error

      setIsParticipant(true)
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Failed to join party')
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this party?')) {
      return
    }

    setLoading(true)

    try {
      if (!clientId) {
        throw new Error('Client profile not found')
      }

      // Call the database function that handles everything
      const { data, error } = await supabase.rpc('leave_party', {
        p_party_id: partyId,
        p_client_id: clientId
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to leave party')
      }

      // Update local state
      setIsParticipant(false)

      // Show appropriate message
      if (data.party_deleted) {
        alert('Party ended - you were the last participant')
      } else if (data.was_host) {
        alert('You left the party and ownership was transferred')
      } else {
        alert('You left the party successfully')
      }

      // Refresh the page
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Failed to leave party. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleWatch = () => {
    router.push(`/watch/${movieId}?party=${partyCode}`)
  }

  if (!userId) {
    return null
  }

  if (!hasTicket) {
    return (
      <button
        onClick={() => router.push(`/movies/${movieId}`)}
        className="w-full flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 px-2 py-1.5 rounded-md text-[10px] font-semibold transition text-white"
      >
        Get Ticket
      </button>
    )
  }

  if (isParticipant && isTimeToWatch) {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <button
          onClick={handleWatch}
          className="w-full flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 px-2 py-1.5 rounded-md text-[10px] font-semibold transition text-white"
        >
          <Eye className="w-3 h-3" />
          Watch
        </button>
        <button
          onClick={handleLeave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-1 bg-[#1A1A1A] hover:bg-[#252525] px-2 py-1 rounded text-[9px] transition text-[#707070] hover:text-[#A1A0A0]"
        >
          <LogOut className="w-2.5 h-2.5" />
          Leave
        </button>
      </div>
    )
  }

  if (isParticipant) {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="w-full flex items-center justify-center gap-1 bg-green-500/10 text-green-400 px-2 py-1.5 rounded-md text-[10px] border border-green-500/20 font-medium">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          Joined
        </div>
        <button
          onClick={handleLeave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-1 bg-[#1A1A1A] hover:bg-[#252525] px-2 py-1 rounded text-[9px] transition text-[#707070] hover:text-[#A1A0A0]"
        >
          <LogOut className="w-2.5 h-2.5" />
          {loading ? 'Leaving...' : 'Leave'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-2 py-1.5 rounded-md text-[10px] font-semibold transition text-white"
    >
      <Users className="w-3 h-3" />
      {loading ? 'Joining...' : 'Join'}
    </button>
  )
}

