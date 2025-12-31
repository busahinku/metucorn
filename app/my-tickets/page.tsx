import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Ticket as TicketIcon } from 'lucide-react'
import TicketCard from '@/components/TicketCard'

export default async function MyTicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Step 1.0: Get client profile
  const { data: client } = await supabase
    .from('client')
    .select('client_id')
    .eq('user_id', user.id)
    .single()

  if (!client) {
    redirect('/login')
  }

  // Step 2.0: Fetch tickets
  const { data: tickets } = await supabase
    .from('ticket')
    .select(`
      *,
      movie:movie_id (title, poster_image, duration_time),
      payment (amount, method, payment_date, status)
    `)
    .eq('client_id', client.client_id)
    .order('purchase_date', { ascending: false })

  return (
    <div className="px-4 md:px-16 lg:px-28 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-[#E5E5E5]">My Library</h1>
          <p className="text-[#A1A0A0] text-xs md:text-sm">Movies you own and can watch anytime</p>
        </div>

        {tickets && tickets.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {tickets.map((ticket: any) => (
              <TicketCard key={ticket.ticket_id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-20 px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
              <TicketIcon className="w-6 h-6 md:w-8 md:h-8 text-[#353535]" />
            </div>
            <h2 className="text-lg md:text-xl font-bold mb-2 text-[#E5E5E5]">No tickets yet</h2>
            <p className="text-[#707070] text-xs md:text-sm mb-6 max-w-sm mx-auto">
              Purchase movie tickets to build your personal collection
            </p>
            <Link 
              href="/movies"
              className="inline-block bg-red-600 hover:bg-red-700 px-5 py-2 md:px-6 md:py-2.5 rounded-lg transition font-medium text-xs md:text-sm"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
  )
}
