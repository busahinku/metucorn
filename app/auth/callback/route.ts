import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Ensure this route is dynamic (not statically generated)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
    }

    if (!code) {
      console.error('No code parameter in callback')
      return NextResponse.redirect(`${origin}/login?error=missing_code`)
    }

    const supabase = await createClient()

    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Exchange error:', exchangeError)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    if (!data?.user) {
      console.error('No user data after exchange')
      return NextResponse.redirect(`${origin}/login?error=no_user_data`)
    }

      // Check if client profile exists
    const { data: existingClient } = await supabase
        .from('client')
        .select('client_id')
        .eq('user_id', data.user.id)
      .maybeSingle()

      // If no client profile exists, create one (for OAuth users)
    if (!existingClient) {
        const name = data.user.user_metadata?.full_name || 
                     data.user.user_metadata?.name || 
                     data.user.email?.split('@')[0] || 
                     'User'
        
        const { error: insertError } = await supabase
          .from('client')
          .insert({
            user_id: data.user.id,
            name: name,
            email: data.user.email || '',
            phone: data.user.user_metadata?.phone || ''
          })
          .select()
          .single()

        if (insertError) {
          console.error('Profile creation error:', insertError)
          // Log the error but continue - user is authenticated
          // They might need to create profile manually or retry
        } else {
          console.log('Client profile created successfully for user:', data.user.id)
        }
  }

  // Redirect to movies page after successful authentication
  return NextResponse.redirect(`${origin}/movies`)
  } catch (err: any) {
    console.error('Callback route error:', err)
    const requestUrl = new URL(request.url)
    const origin = requestUrl.origin
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message || 'authentication_failed')}`)
  }
}











