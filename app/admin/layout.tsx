import { requireAdmin } from '@/lib/admin/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminNavbar from '@/components/admin/AdminNavbar'
import AdminMobileNav from '@/components/admin/AdminMobileNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Step 1.0: Verify admin access (will redirect if not admin)
  const { user, admin } = await requireAdmin()

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col">
      {/* Step 2.0: Admin Sidebar - Desktop only */}
      <AdminSidebar admin={admin} />

      {/* Step 3.0: Admin Navbar - Top */}
      <AdminNavbar user={user} admin={admin} />

      {/* Step 3.5: Admin Mobile Nav - Bottom (Mobile only) */}
      <AdminMobileNav admin={admin} />

      {/* Step 4.0: Main Content Area */}
      <main className="ml-0 md:ml-[10px] mt-2 md:mt-0 mb-16 md:mb-0 flex-1">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}


