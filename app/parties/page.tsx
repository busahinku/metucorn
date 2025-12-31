import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Calendar, Clock, Film } from 'lucide-react'
import { format } from 'date-fns'
import PartyActionButton from '@/components/PartyActionButton'
import PartyParticipants from '@/components/PartyParticipants'

// Revalidate parties page every 30 seconds (parties change frequently)
export const revalidate = 30

export default async function PartiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Step 1.0: Fetch active watch parties with participant details
  const { data: parties } = await supabase
    .from('watch_party')
    .select(`
      *,
      movie:movie_id (title, poster_image, duration_time),
      host:host_id (name),
      party_participant (
        client_id,
        joined_at,
        client:client_id (name)
      )
    `)
    .in('status', ['scheduled', 'active'])
    .gte('scheduled_time', new Date().toISOString())
    .order('scheduled_time', { ascending: true })

  return (
    <div className="px-4 md:px-10 lg:px-10 py-4 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#E5E5E5]">Watch Parties</h1>
            <p className="text-[#A1A0A0] text-xs md:text-sm mt-1">Join friends and watch together</p>
          </div>
          {user && (
            <Link
              href="/parties/create"
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition text-xs md:text-sm whitespace-nowrap self-start sm:self-auto"
            >
              Create Party
            </Link>
          )}
        </div>

        {parties && parties.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {parties.map((party: any) => {
              const participantCount = party.party_participant?.length || 0
              const scheduledDate = new Date(party.scheduled_time)
              const isPast = scheduledDate <= new Date()

              return (
                <div
                  key={party.party_id}
                  className="bg-[#121212] rounded-lg border border-[#1A1A1A] hover:border-[#252525] transition-all overflow-hidden flex flex-col group"
                >
                  {/* Poster */}
                  <div className="relative w-full aspect-[2/3] bg-[#1A1A1A] overflow-hidden">
                    {party.movie?.poster_image ? (
                      <Image
                        src={party.movie.poster_image}
                        alt={party.movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-8 h-8 text-[#353535]" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    {/* Movie Title */}
                    <Link
                      href={`/movies/${party.movie_id}`}
                      className="text-sm font-bold text-[#E5E5E5] hover:text-red-400 transition line-clamp-2"
                    >
                      {party.movie?.title}
                    </Link>

                    {/* Host */}
                    <p className="text-[10px] text-[#707070] line-clamp-1">
                      by <span className="text-[#A1A0A0] font-medium">{party.host?.name}</span>
                    </p>

                    {/* Stats */}
                    <div className="flex flex-col gap-1 text-[10px] text-[#A1A0A0]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#707070]" />
                        <span>{format(scheduledDate, 'MMM dd')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#707070]" />
                        <span>{format(scheduledDate, 'HH:mm')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#707070]" />
                        <span>{participantCount}/{party.max_participants || 50}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto pt-2">
                      {user ? (
                        <PartyActionButton
                          partyId={party.party_id}
                          partyCode={party.party_code}
                          movieId={party.movie_id}
                          scheduledTime={party.scheduled_time}
                          userId={user.id}
                        />
                      ) : (
                        <Link
                          href="/login"
                          className="block text-center bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-[10px] font-medium transition"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#353535]" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-[#E5E5E5]">No Active Parties</h2>
            <p className="text-[#707070] text-sm mb-6 max-w-sm mx-auto">
              Be the first to create a watch party and invite your friends!
            </p>
            {user && (
              <Link 
                href="/parties/create"
                className="inline-block bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-lg transition font-medium text-sm"
              >
                Create Your First Party
              </Link>
            )}
          </div>
        )}
      </div>
  )
}
