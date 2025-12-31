'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ShoppingCart, CreditCard, Wallet, DollarSign, X, Check } from 'lucide-react'

interface BuyTicketButtonProps {
  movieId: string
  price: string | number
}

export default function BuyTicketButton({ movieId, price }: BuyTicketButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'paypal'>('credit_card')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [showModal])

  const handlePurchase = async () => {
    setLoading(true)
    
    try {
      // Step 1.0: Get current user (already authenticated)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Please log in to purchase tickets')
        setShowModal(false)
        setLoading(false)
        return
      }

      // Step 2.0: Get client profile
      const { data: client } = await supabase
        .from('client')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (!client) throw new Error('Client profile not found')

      // Step 3.0: Generate access code
      const accessCode = `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

      // Step 4.0: Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('ticket')
        .insert({
          client_id: client.client_id,
          movie_id: movieId,
          price: parseFloat(price.toString()),
          access_code: accessCode,
          is_active: true,
        })
        .select()
        .single()

      if (ticketError) throw ticketError

      // Step 5.0: Create mock payment record
      const { error: paymentError } = await supabase
        .from('payment')
        .insert({
          ticket_id: ticket.ticket_id,
          amount: parseFloat(price.toString()),
          method: paymentMethod,
          status: 'completed',
          transaction_id: `TXN-${Date.now()}`,
        })

      if (paymentError) throw paymentError

      // Show success animation
      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        setSuccess(false)
        router.push('/my-tickets')
        router.refresh()
      }, 1500)
    } catch (error: any) {
      alert(error.message || 'Failed to purchase ticket')
      setLoading(false)
    }
  }

  const handleBuyClick = async () => {
    // Check authentication BEFORE showing modal
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
    
    setShowModal(true)
  }

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: CreditCard },
    { id: 'debit_card', name: 'Debit Card', icon: Wallet },
    { id: 'paypal', name: 'PayPal', icon: DollarSign },
  ]

  return (
    <>
      <button
        onClick={handleBuyClick}
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
      >
        <ShoppingCart className="w-5 h-5" />
        Buy Ticket
      </button>

      {/* Payment Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto">
          {/* Blurry Background Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => !loading && !success && setShowModal(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md mx-auto p-4 min-h-screen flex items-center justify-center py-8">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 fade-in duration-200 w-full max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
                <h2 className="text-lg md:text-2xl font-bold text-[#E5E5E5]">Purchase Ticket</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#A1A0A0] hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  disabled={loading || success}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success State */}
              {success ? (
                <div className="p-8 md:p-10 flex flex-col items-center justify-center flex-1">
                  <div className="w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300 border border-green-500/30">
                    <Check className="w-10 h-10 text-green-400" strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Purchase Successful!</h3>
                  <p className="text-[#A1A0A0] text-center text-sm">Redirecting to your tickets...</p>
                </div>
              ) : (
                <>
                  {/* Scrollable Content */}
                  <div className="p-4 md:p-6 space-y-4 md:space-y-5 overflow-y-auto flex-1">
                    {/* Notice */}
                    <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-3 md:p-4">
                      <p className="text-xs md:text-sm text-blue-300">
                        This is a mock payment for educational purposes
                      </p>
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <label className="block text-sm font-medium text-[#E5E5E5] mb-2 md:mb-3">
                        Select Payment Method
                      </label>
                      <div className="grid gap-2 md:gap-3">
                        {paymentMethods.map((method) => {
                          const Icon = method.icon
                          return (
                            <button
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id as any)}
                              className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 transition-all ${
                                paymentMethod === method.id
                                  ? 'border-red-500 bg-red-500/10 backdrop-blur-sm'
                                  : 'border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                paymentMethod === method.id ? 'bg-red-600' : 'bg-white/10'
                              }`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-medium text-[#E5E5E5] text-sm md:text-base">{method.name}</span>
                              {paymentMethod === method.id && (
                                <div className="ml-auto">
                                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  </div>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#A1A0A0] text-xs md:text-sm">Ticket Price</span>
                        <span className="text-[#E5E5E5] font-medium text-sm md:text-base">${parseFloat(price.toString()).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#A1A0A0] text-xs md:text-sm">Service Fee</span>
                        <span className="text-[#E5E5E5] font-medium text-sm md:text-base">$0.00</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 md:pt-3 mt-2 md:mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-lg font-semibold text-[#E5E5E5]">Total</span>
                          <span className="text-lg md:text-2xl font-bold text-red-500">${parseFloat(price.toString()).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer - Fixed at bottom */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3 p-4 md:p-6 border-t border-white/10 bg-white/5 flex-shrink-0">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm py-2.5 md:py-3 rounded-lg transition-all text-[#E5E5E5] font-medium border border-white/10 text-sm md:text-base"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePurchase}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 py-2.5 md:py-3 rounded-lg font-semibold transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 text-white text-sm md:text-base"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        'Confirm Purchase'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
