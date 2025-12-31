'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LogoImage from '@/components/LogoImage'
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters except +
    const cleaned = value.replace(/[^\d+]/g, '')

    // Must start with +
    if (!cleaned.startsWith('+')) {
      return '+' + cleaned
    }

    // Get all digits after +
    const allDigits = cleaned.slice(1)

    if (allDigits.length === 0) return '+'

    // Country code is first 1-2 digits (most common)
    // If first digit is 1-9, take max 2 digits for country code
    let countryCodeLength = 2
    if (allDigits[0] === '1') {
      countryCodeLength = 1 // +1 for US/Canada
    }

    const countryCode = allDigits.slice(0, Math.min(countryCodeLength, allDigits.length))
    const phoneDigits = allDigits.slice(countryCode.length)

    // Format: +XX XXX XXX XX XX (3-3-2-2)
    let formatted = '+' + countryCode

    if (phoneDigits.length > 0) {
      formatted += ' ' + phoneDigits.slice(0, 3)
    }
    if (phoneDigits.length > 3) {
      formatted += ' ' + phoneDigits.slice(3, 6)
    }
    if (phoneDigits.length > 6) {
      formatted += ' ' + phoneDigits.slice(6, 8)
    }
    if (phoneDigits.length > 8) {
      formatted += ' ' + phoneDigits.slice(8, 10)
    }

    return formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Step 1.0: Sign up with Supabase Auth
      // The database trigger will automatically create the client profile
      // Use environment variable for production, fallback to window.location.origin
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/callback`,
          data: {
            name,
            phone,
          }
        }
      })

      if (authError) throw authError

      // Step 2.0: Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        // User already exists
        setError('An account with this email already exists. Please sign in instead.')
        return
      }

      if (data.session) {
        // Auto-logged in (confirmation disabled)
        setSuccess(true)
        setTimeout(() => {
          router.push('/movies')
          router.refresh()
        }, 1500)
      } else {
        // Email confirmation required
        setNeedsConfirmation(true)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      // Use environment variable for production, fallback to window.location.origin
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectUrl}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0C0C0C]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[400px] relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <Link href="/" className="mb-8 hover:scale-105 transition-transform duration-300">
            <LogoImage />
          </Link>
          <h1 className="text-3xl font-bold mb-3 text-[#E5E5E5]">Create Account</h1>
          <p className="text-[#A1A0A0] text-sm">Join the community and start watching</p>
        </div>

        <div className="bg-[#121212] border border-[#1A1A1A] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {needsConfirmation ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#E5E5E5]">Check Your Email</h2>
              <p className="text-[#A1A0A0] text-sm leading-relaxed">
                We sent a confirmation link to <span className="text-[#E5E5E5] font-medium">{email}</span>
                <br />
                Click the link to activate your account.
              </p>
              <div className="pt-4">
                <Link 
                  href="/login"
                  className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-medium"
                >
                  Go to Sign In
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#E5E5E5]">Account Created!</h2>
              <p className="text-[#A1A0A0] text-sm">
                Redirecting you to the movies...
              </p>
              <Loader2 className="w-6 h-6 animate-spin text-red-500 mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A0A0] ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#505050] group-focus-within:text-[#E5E5E5] transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-[#151515] border border-[#202020] rounded-xl text-[#E5E5E5] placeholder-[#404040] focus:outline-none focus:border-red-500/50 focus:bg-[#1A1A1A] focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                  placeholder="Mehmet Ali"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A0A0] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#505050] group-focus-within:text-[#E5E5E5] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-[#151515] border border-[#202020] rounded-xl text-[#E5E5E5] placeholder-[#404040] focus:outline-none focus:border-red-500/50 focus:bg-[#1A1A1A] focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                  placeholder="kino_enjoyer@odtu.com.tr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A0A0] ml-1">Phone (Optional)</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#505050] group-focus-within:text-[#E5E5E5] transition-colors" />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#151515] border border-[#202020] rounded-xl text-[#E5E5E5] placeholder-[#404040] focus:outline-none focus:border-red-500/50 focus:bg-[#1A1A1A] focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                  placeholder="+90 555 555 55 55"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A0A0] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#505050] group-focus-within:text-[#E5E5E5] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#151515] border border-[#202020] rounded-xl text-[#E5E5E5] placeholder-[#404040] focus:outline-none focus:border-red-500/50 focus:bg-[#1A1A1A] focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1A1A1A]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#121212] text-[#505050]">OR CONTINUE WITH</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 border border-gray-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>
          </form>
          )}

          {!needsConfirmation && !success && (
            <div className="mt-8 pt-6 border-t border-[#1A1A1A] text-center">
              <p className="text-sm text-[#505050]">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-[#E5E5E5] font-medium hover:text-red-500 transition-colors inline-flex items-center gap-1 group"
                >
                  Sign in
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
