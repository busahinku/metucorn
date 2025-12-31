import { createClient } from '@/lib/supabase/server'
import { Users, Film, Ticket, DollarSign, PartyPopper, Star } from 'lucide-react'
import DashboardCharts from '@/components/admin/DashboardCharts'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Calculate date 30 days ago for filtering
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

  // Step 1.0: Fetch all stats in parallel
  const [
    { count: totalUsers },
    { count: totalMovies },
    { count: totalTickets },
    { data: payments },
    { count: activeParties },
    { count: totalRatings },
    { data: recentTickets },
    { data: recentUsers },
    { data: allTickets },
    { data: allPayments },
    { data: allUsers },
    { data: allParties }
  ] = await Promise.all([
    supabase.from('client').select('*', { count: 'exact', head: true }),
    supabase.from('movie').select('*', { count: 'exact', head: true }),
    supabase.from('ticket').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('payment').select('amount, payment_date').eq('status', 'completed'),
    supabase.from('watch_party').select('*', { count: 'exact', head: true }).in('status', ['scheduled', 'active']),
    supabase.from('rating').select('*', { count: 'exact', head: true }),
    supabase.from('ticket').select('*, client:client_id(name, email), movie:movie_id(title)').order('created_at', { ascending: false }).limit(5),
    supabase.from('client').select('*').order('created_at', { ascending: false }).limit(5),
    // Only fetch last 30 days for chart data
    supabase.from('ticket').select('created_at, price').eq('is_active', true).gte('created_at', thirtyDaysAgoISO).order('created_at', { ascending: true }),
    supabase.from('payment').select('amount, payment_date').eq('status', 'completed').gte('payment_date', thirtyDaysAgoISO).order('payment_date', { ascending: true }),
    supabase.from('client').select('created_at').gte('created_at', thirtyDaysAgoISO).order('created_at', { ascending: true }),
    supabase.from('watch_party').select('created_at, status').gte('created_at', thirtyDaysAgoISO).order('created_at', { ascending: true })
  ])

  const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  // Step 2.0: Prepare chart data
  // Revenue over time (last 30 days)
  const getLast30Days = () => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0]
      })
    }
    return days
  }

  const last30Days = getLast30Days()
  
  // Revenue chart data
  const revenueData = last30Days.map(day => {
    const dayRevenue = allPayments?.filter((p: any) => {
      if (!p.payment_date) return false
      const paymentDate = new Date(p.payment_date).toISOString().split('T')[0]
      return paymentDate === day.fullDate
    }).reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0
    
    return {
      date: day.date,
      revenue: Number(dayRevenue.toFixed(2))
    }
  })

  // Tickets sold over time (last 30 days)
  const ticketsData = last30Days.map(day => {
    const dayTickets = allTickets?.filter((t: any) => {
      if (!t.created_at) return false
      const ticketDate = new Date(t.created_at).toISOString().split('T')[0]
      return ticketDate === day.fullDate
    }).length || 0
    
    return {
      date: day.date,
      tickets: dayTickets
    }
  })

  // User growth (last 30 days)
  const usersData = last30Days.map(day => {
    const dayUsers = allUsers?.filter((u: any) => {
      if (!u.created_at) return false
      const userDate = new Date(u.created_at).toISOString().split('T')[0]
      return userDate === day.fullDate
    }).length || 0
    
    return {
      date: day.date,
      users: dayUsers
    }
  })

  // Parties created (last 30 days)
  const partiesData = last30Days.map(day => {
    const dayParties = allParties?.filter((p: any) => {
      if (!p.created_at) return false
      const partyDate = new Date(p.created_at).toISOString().split('T')[0]
      return partyDate === day.fullDate
    }).length || 0
    
    return {
      date: day.date,
      parties: dayParties
    }
  })

  const stats = [
    { label: 'Users', value: totalUsers || 0, icon: Users, color: 'blue' },
    { label: 'Movies', value: totalMovies || 0, icon: Film, color: 'purple' },
    { label: 'Tickets', value: totalTickets || 0, icon: Ticket, color: 'green' },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'yellow' },
    { label: 'Parties', value: activeParties || 0, icon: PartyPopper, color: 'pink' },
    { label: 'Ratings', value: totalRatings || 0, icon: Star, color: 'orange' },
  ]

  return (
    <div className="max-w-7xl space-y-4">
      {/* Step 2.0: Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-gray-400">Overview of your platform</p>
      </div>

      {/* Step 3.0: Stats Grid - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-500/10 text-blue-400',
            purple: 'bg-purple-500/10 text-purple-400',
            green: 'bg-green-500/10 text-green-400',
            yellow: 'bg-yellow-500/10 text-yellow-400',
            pink: 'bg-pink-500/10 text-pink-400',
            orange: 'bg-orange-500/10 text-orange-400',
          }
          return (
            <div
              key={stat.label}
              className="bg-[#121212] border border-[#1A1A1A] rounded-lg p-3 hover:border-red-600/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold text-white truncate">{stat.value}</div>
                  <div className="text-[10px] text-gray-400 truncate">{stat.label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Step 4.0: Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Tickets */}
        <div className="bg-[#121212] border border-[#1A1A1A] rounded-lg p-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-red-500" />
            Recent Tickets
          </h2>
          <div className="space-y-2">
            {recentTickets && recentTickets.length > 0 ? (
              recentTickets.map((ticket: any) => (
                <div key={ticket.ticket_id} className="flex items-center justify-between p-2 bg-[#1A1A1A] rounded text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="text-white truncate font-medium">
                      {ticket.movie?.title}
                    </div>
                    <div className="text-gray-400 truncate">{ticket.client?.name || ticket.client?.email}</div>
                  </div>
                  <div className="text-green-400 font-medium ml-2">
                    ${ticket.price || ticket.purchase_price || '0.00'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No recent tickets</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-[#121212] border border-[#1A1A1A] rounded-lg p-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-red-500" />
            Recent Users
          </h2>
          <div className="space-y-2">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((user: any) => (
                <div key={user.client_id} className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded text-xs">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white truncate font-medium">{user.name || 'No name'}</div>
                    <div className="text-gray-400 truncate">{user.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No recent users</p>
            )}
          </div>
        </div>
      </div>

      {/* Step 5.0: Analytics Charts */}
      <DashboardCharts 
        revenueData={revenueData}
        ticketsData={ticketsData}
        usersData={usersData}
        partiesData={partiesData}
      />
    </div>
  )
}

