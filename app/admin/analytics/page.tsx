import { createClient } from '@/lib/supabase/server'
import { TrendingUp, DollarSign, Ticket, Star, Eye } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  // Step 1.0: Fetch comprehensive analytics
  const [
    { data: tickets },
    { data: payments },
    { data: ratings },
    { data: watchHistory }
  ] = await Promise.all([
    supabase.from('ticket').select('*, movie:movie_id(title, price)'),
    supabase.from('payment').select('*'),
    supabase.from('rating').select('*, movie:movie_id(title)'),
    supabase.from('watch_history').select('history_id')
  ])

  // Step 2.0: Calculate metrics
  const totalRevenue = payments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
  const activeTickets = tickets?.filter(t => t.is_active).length || 0
  const avgRating = ratings && ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + (r.score || 0), 0) / ratings.length).toFixed(2)
    : '0.00'

  // Step 3.0: Top movies by tickets sold
  const movieTicketCounts = tickets?.reduce((acc: any, ticket: any) => {
    const movieId = ticket.movie_id
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: ticket.movie,
        count: 0,
        revenue: 0
      }
    }
    acc[movieId].count++
    // Use purchase_price if available, otherwise use movie's current price
    const ticketPrice = ticket.purchase_price || ticket.movie?.price || 0
    acc[movieId].revenue += Number(ticketPrice)
    return acc
  }, {})

  const topMovies = Object.values(movieTicketCounts || {})
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)

  // Step 4.0: Top rated movies
  const movieRatings = ratings?.reduce((acc: any, rating: any) => {
    const movieId = rating.movie_id
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: rating.movie,
        ratings: [],
        count: 0
      }
    }
    const ratingValue = Number(rating.score)
    if (!isNaN(ratingValue)) {
      acc[movieId].ratings.push(ratingValue)
      acc[movieId].count++
    }
    return acc
  }, {})

  const topRatedMovies = Object.entries(movieRatings || {})
    .map(([_movieId, data]: [string, any]) => {
      if (!data.ratings || data.ratings.length === 0) {
        return {
          movie: data.movie,
          avgRating: '0.00',
          count: 0
        }
      }
      const sum = data.ratings.reduce((sum: number, r: number) => sum + r, 0)
      const avg = sum / data.ratings.length
      return {
        movie: data.movie,
        avgRating: avg.toFixed(2),
        count: data.count
      }
    })
    .filter((item: any) => item.count > 0)
    .sort((a: any, b: any) => parseFloat(b.avgRating) - parseFloat(a.avgRating))
    .slice(0, 5)

  return (
    <div className="max-w-7xl space-y-6">
      {/* Step 5.0: Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Detailed insights and statistics</p>
      </div>

      {/* Step 6.0: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">${totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Total Revenue</div>
        </div>

        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{activeTickets}</div>
          <div className="text-sm text-gray-400">Active Tickets</div>
        </div>

        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-600/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{avgRating}</div>
          <div className="text-sm text-gray-400">Avg Rating</div>
        </div>

        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{watchHistory?.length || 0}</div>
          <div className="text-sm text-gray-400">Total Views</div>
        </div>
      </div>

      {/* Step 7.0: Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movies by Sales */}
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            Top Movies by Sales
          </h2>
          <div className="space-y-3">
            {topMovies && topMovies.length > 0 ? (
              topMovies.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center text-sm font-bold text-red-400">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.movie?.title || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{item.count} tickets sold</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green-400">
                    ${item.revenue.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>
        </div>

        {/* Top Rated Movies */}
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Top Rated Movies
          </h2>
          <div className="space-y-3">
            {topRatedMovies && topRatedMovies.length > 0 ? (
              topRatedMovies.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center text-sm font-bold text-yellow-400">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.movie?.title || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{item.count} ratings</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-white">{item.avgRating}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No ratings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

