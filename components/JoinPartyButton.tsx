'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'

interface JoinPartyButtonProps {
  partyId: string
  partyCode: string
  movieId: string
}

export default function JoinPartyButton({ partyId, partyCode, movieId }: JoinPartyButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleJoin = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Step 1.0: Get client profile
      const { data: client } = await supabase
        .from('client')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (!client) throw new Error('Client profile not found')

      // Step 2.0: Check if user has a ticket for this movie
      const { data: ticket } = await supabase
        .from('ticket')
        .select('ticket_id')
        .eq('client_id', client.client_id)
        .eq('movie_id', movieId)
        .eq('is_active', true)
        .single()

      if (!ticket) {
        alert('You need to purchase a ticket for this movie first!')
        router.push(`/movies/${movieId}`)
        return
      }

      // Step 3.0: Check if already joined
      const { data: existingParticipant } = await supabase
        .from('party_participant')
        .select('participant_id')
        .eq('party_id', partyId)
        .eq('client_id', client.client_id)
        .single()

      if (existingParticipant) {
        router.push(`/watch/${movieId}?party=${partyCode}`)
        return
      }

      // Step 4.0: Join party
      const { error } = await supabase
        .from('party_participant')
        .insert({
          party_id: partyId,
          client_id: client.client_id,
        })

      if (error) throw error

      router.push(`/watch/${movieId}?party=${partyCode}`)
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Failed to join party')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition"
    >
      <Users className="w-5 h-5" />
      {loading ? 'Joining...' : 'Join Party'}
    </button>
  )
}














