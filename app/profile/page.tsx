import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let { data: client } = await supabase
    .from('client')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If no client profile exists, create one (failsafe for OAuth users)
  if (!client) {
    const { error: insertError } = await supabase
      .from('client')
      .insert({
        user_id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || ''
      })
      .select()
      .single()

    if (!insertError) {
      // Fetch the newly created client
      const { data: newClient } = await supabase
        .from('client')
        .select('*')
        .eq('user_id', user.id)
        .single()

      client = newClient
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-[#E5E5E5]">Profile</h1>

        {!client ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
            <p className="font-semibold mb-2">Profile not found</p>
            <p className="text-sm">Please contact support or try signing out and back in.</p>
          </div>
        ) : (
          <div className="bg-[#0C0C0C] border border-[#1A1A1A] rounded-xl p-8 space-y-6">
            <div>
              <label className="block text-sm text-[#A1A0A0] mb-1">Name</label>
              <div className="text-lg font-semibold text-[#E5E5E5]">{client.name || 'Not provided'}</div>
            </div>

            <div>
              <label className="block text-sm text-[#A1A0A0] mb-1">Email</label>
              <div className="text-lg text-[#E5E5E5]">{client.email || user.email}</div>
            </div>

            {client.phone && (
              <div>
                <label className="block text-sm text-[#A1A0A0] mb-1">Phone</label>
                <div className="text-lg text-[#E5E5E5]">{client.phone}</div>
              </div>
            )}

            <div>
              <label className="block text-sm text-[#A1A0A0] mb-1">Member Since</label>
              <div className="text-lg text-[#E5E5E5]">
                {client.created_at ? new Date(client.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Recently joined'}
              </div>
            </div>

            <div className="pt-6 border-t border-[#1A1A1A]">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
  )
}


