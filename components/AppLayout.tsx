import { createClient } from '@/lib/supabase/server'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
import Footer from './Footer'

interface AppLayoutProps {
  children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is admin and fetch client data in parallel
  let isAdmin = false
  let userJoinedParties: any[] = []
  
  if (user) {
    const [
      { data: adminData },
      { data: clientData }
    ] = await Promise.all([
      supabase
        .from('admin')
        .select('admin_id')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('client')
        .select('client_id')
        .eq('user_id', user.id)
        .single()
    ])

    isAdmin = !!adminData

    // Fetch user's joined parties using a single optimized query
    if (clientData) {
      const { data: parties } = await supabase
        .from('party_participant')
        .select(`
          party:party_id (
            *,
            movie:movie_id (
              title,
              poster_image,
              duration_time
            ),
            host:host_id (
              name
            ),
            party_participant (client_id)
          )
        `)
        .eq('client_id', clientData.client_id)
        .gte('party.scheduled_time', new Date().toISOString())
        .in('party.status', ['scheduled', 'active'])
        .order('scheduled_time', { foreignTable: 'party', ascending: true })
        .limit(3)

      if (parties) {
        userJoinedParties = parties.map((p: any) => p.party).filter(Boolean)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col">
      {/* Sidebar - Desktop only */}
      <Sidebar user={user} joinedParties={userJoinedParties} />

      {/* Navbar - Top */}
      <Navbar user={user} isAdmin={isAdmin} />

      {/* Mobile Navigation - Bottom */}
      <MobileNav user={user} />
      
      {/* Main Content */}
      <main className="ml-0 md:ml-[220px] mt-16 md:mt-16 mb-16 md:mb-0 flex-1 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}

