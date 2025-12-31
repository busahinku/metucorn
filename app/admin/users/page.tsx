import { createClient } from '@/lib/supabase/server'
import { Users as UsersIcon, Mail, Phone, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Step 1.0: Fetch all users with ticket count
  const { data: users } = await supabase
    .from('client')
    .select(`
      *,
      tickets:ticket(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl space-y-6">
      {/* Step 2.0: Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
        <p className="text-gray-400">Manage all registered users</p>
      </div>

      {/* Step 3.0: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{users?.length || 0}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4.0: Users Table */}
      <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">User</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Phone</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Tickets</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users && users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user.client_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name || 'No name'}</div>
                          <div className="text-xs text-gray-400">ID: {user.client_id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {user.phone || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-green-600/10 text-green-400 text-sm rounded-full font-medium">
                        {user.tickets?.[0]?.count || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : '-'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No users found
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

