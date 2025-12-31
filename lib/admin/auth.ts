import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Step 1.0: Check if user is an admin
 * Security: Validates against admin table in database
 */
export async function requireAdmin() {
  const supabase = await createClient()
  
  // Step 1.1: Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login?redirectTo=/admin')
  }
  
  // Step 1.2: Check if user exists in admin table
  const { data: adminData, error: adminError } = await supabase
    .from('admin')
    .select('admin_id, role, username, email')
    .eq('user_id', user.id)
    .single()
  
  if (adminError || !adminData) {
    // User is not an admin - redirect to homepage
    redirect('/?error=unauthorized')
  }
  
  // Step 1.3: Update last login timestamp
  await supabase
    .from('admin')
    .update({ last_login: new Date().toISOString() })
    .eq('admin_id', adminData.admin_id)
  
  return {
    user,
    admin: adminData
  }
}

/**
 * Step 2.0: Check admin status without redirect (for client components)
 */
export async function checkAdminStatus() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { isAdmin: false }
    
    const { data: adminData } = await supabase
      .from('admin')
      .select('admin_id, role')
      .eq('user_id', user.id)
      .single()
    
    return { 
      isAdmin: !!adminData,
      role: adminData?.role 
    }
  } catch {
    return { isAdmin: false }
  }
}















