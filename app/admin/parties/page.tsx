import { createClient } from '@/lib/supabase/server'
import { PartyPopper, Calendar, Users, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import DeletePartyButton from '@/components/admin/DeletePartyButton'

export default async function AdminPartiesPage() {
  const supabase = await createClient()

  // Step 1.0: Fetch all parties
  const { data: parties } = await supabase
    .from('watch_party')
    .select(`
      *,
      movie:movie_id (title, poster_image),
      host:host_id (name, email),
      participants:party_participant(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl space-y-6">
      {/* Step 2.0: Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Watch Parties</h1>
        <p className="text-gray-400">Monitor all watch parties</p>
      </div>

      {/* Step 3.0: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-600/10 flex items-center justify-center">
              <PartyPopper className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{parties?.length || 0}</div>
              <div className="text-sm text-gray-400">Total Parties</div>
            </div>
          </div>
        </div>
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {parties?.filter(p => p.status === 'scheduled').length || 0}
              </div>
              <div className="text-sm text-gray-400">Scheduled</div>
            </div>
          </div>
        </div>
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {parties?.reduce((sum, p) => sum + (p.participants?.[0]?.count || 0), 0) || 0}
              </div>
              <div className="text-sm text-gray-400">Total Participants</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4.0: Parties List */}
      <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Movie</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Host</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Scheduled</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Participants</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {parties && parties.length > 0 ? (
                parties.map((party: any) => (
                  <tr key={party.party_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {party.movie?.poster_image ? (
                          <Image
                            src={party.movie.poster_image}
                            alt={party.movie.title}
                            width={40}
                            height={60}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-white/5 rounded"></div>
                        )}
                        <div className="font-medium text-white">{party.movie?.title}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {party.host?.name || party.host?.email || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {party.scheduled_time ? format(new Date(party.scheduled_time), 'MMM d, h:mm a') : '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">{party.participants?.[0]?.count || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        party.status === 'scheduled' ? 'bg-blue-600/10 text-blue-400' :
                        party.status === 'active' ? 'bg-green-600/10 text-green-400' :
                        party.status === 'completed' ? 'bg-gray-600/10 text-gray-400' :
                        'bg-red-600/10 text-red-400'
                      }`}>
                        {party.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end">
                        <DeletePartyButton partyId={party.party_id} movieTitle={party.movie?.title || 'Unknown'} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No parties found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

