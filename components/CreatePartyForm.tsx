'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, Film, Clock, Check } from 'lucide-react'

export default function CreatePartyForm() {
  const [movies, setMovies] = useState<any[]>([])
  const [selectedMovie, setSelectedMovie] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [description, setDescription] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(50)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Step 1.0: Fetch user's tickets
    async function fetchMovies() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: client } = await supabase
        .from('client')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (!client) return

      const { data: tickets } = await supabase
        .from('ticket')
        .select(`
          movie_id,
          movie:movie_id (movie_id, title, poster_image)
        `)
        .eq('client_id', client.client_id)
        .eq('is_active', true)

      if (tickets) {
        const uniqueMovies = tickets.reduce((acc: any[], ticket: any) => {
          if (!acc.find(m => m.movie_id === ticket.movie?.movie_id)) {
            acc.push(ticket.movie)
          }
          return acc
        }, [])
        setMovies(uniqueMovies)

        // Set default movie from query param
        const movieParam = searchParams.get('movie')
        if (movieParam && uniqueMovies.find((m: any) => m.movie_id === movieParam)) {
          setSelectedMovie(movieParam)
        }
      }
    }

    fetchMovies()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate movie selection
      if (!selectedMovie) {
        throw new Error('Please select a movie')
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: client } = await supabase
        .from('client')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (!client) throw new Error('Client profile not found')

      // Step 2.0: Generate party code
      const partyCode = Math.random().toString(36).substring(2, 10).toUpperCase()

      // Step 3.0: Create watch party
      const { data: party, error: partyError } = await supabase
        .from('watch_party')
        .insert({
          host_id: client.client_id,
          movie_id: selectedMovie,
          scheduled_time: scheduledTime,
          party_code: partyCode,
          status: 'scheduled',
          max_participants: maxParticipants,
          description: description || null,
        })
        .select()
        .single()

      if (partyError) throw partyError

      // Step 4.0: Auto-join host
      await supabase
        .from('party_participant')
        .insert({
          party_id: party.party_id,
          client_id: client.client_id,
        })

      router.push('/parties')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#121212] border border-[#1A1A1A] rounded-xl p-6 md:p-8">
      <form onSubmit={handleCreate} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* No Tickets Warning */}
        {movies.length === 0 ? (
          <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 text-center">
            <Film className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-yellow-400 mb-3">
              You need to purchase a ticket first to create a watch party.
            </p>
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Browse Movies →
            </Link>
          </div>
        ) : (
          <>
            {/* Select Movie */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#E5E5E5] mb-3">
                <Film className="w-4 h-4 text-[#707070]" />
                Select Movie
              </label>

              {!selectedMovie && (
                <p className="text-xs text-[#707070] mb-3">Click on a movie poster to select it</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {movies.map((movie: any) => (
                  <button
                    key={movie.movie_id}
                    type="button"
                    onClick={() => setSelectedMovie(movie.movie_id)}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                      selectedMovie === movie.movie_id
                        ? 'border-red-500 ring-2 ring-red-500/50'
                        : 'border-[#252525] hover:border-[#353535]'
                    }`}
                  >
                    {/* Movie Poster */}
                    <div className="relative w-full aspect-[2/3] bg-[#1A1A1A]">
                      {movie.poster_image ? (
                        <Image
                          src={movie.poster_image}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 150px, 200px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-12 h-12 text-[#353535]" />
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
                        selectedMovie === movie.movie_id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {selectedMovie === movie.movie_id ? (
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                              <Check className="w-7 h-7 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="text-center px-2">
                              <p className="text-white text-xs font-medium line-clamp-2">
                                {movie.title}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selected indicator at bottom */}
                    {selectedMovie === movie.movie_id && (
                      <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[10px] font-bold text-center py-1">
                        SELECTED
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedMovie && (
                <div className="mt-3 text-sm text-[#A1A0A0]">
                  Selected: <span className="text-[#E5E5E5] font-medium">
                    {movies.find(m => m.movie_id === selectedMovie)?.title}
                  </span>
                </div>
              )}
            </div>

            {/* Scheduled Time */}
            <div>
              <label htmlFor="scheduled_time" className="flex items-center gap-2 text-sm font-medium text-[#E5E5E5] mb-3">
                <Clock className="w-4 h-4 text-[#707070]" />
                Scheduled Time
              </label>
              <input
                id="scheduled_time"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#252525] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-[#E5E5E5] mb-3">
                <Calendar className="w-4 h-4 text-[#707070]" />
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#252525] rounded-lg text-[#E5E5E5] placeholder:text-[#707070] focus:outline-none focus:border-red-500 transition-colors resize-none"
                placeholder="Tell others about this watch party..."
              />
            </div>

            {/* Max Participants */}
            <div>
              <label htmlFor="max_participants" className="flex items-center gap-2 text-sm font-medium text-[#E5E5E5] mb-3">
                <Users className="w-4 h-4 text-[#707070]" />
                Max Participants
              </label>
              <input
                id="max_participants"
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                min={2}
                max={100}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#252525] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-red-500 transition-colors"
              />
              <p className="text-xs text-[#707070] mt-2">Between 2 and 100 participants</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || movies.length === 0 || !selectedMovie}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-[#252525] disabled:to-[#252525] disabled:cursor-not-allowed py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 disabled:shadow-none text-white"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Party...
                </span>
              ) : !selectedMovie ? (
                'Select a Movie First'
              ) : (
                'Create Watch Party'
              )}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
