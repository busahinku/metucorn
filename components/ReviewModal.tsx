'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Star, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: string
  movieTitle: string
  existingReview?: {
    rating_id: string
    score: number
    review_text?: string
  } | null
}

export default function ReviewModal({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  existingReview
}: ReviewModalProps) {
  const [score, setScore] = useState(existingReview?.score || 0)
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '')
  const [hoveredScore, setHoveredScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setScore(existingReview?.score || 0)
      setReviewText(existingReview?.review_text || '')
      setSuccess(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, existingReview])

  const handleSubmit = async () => {
    if (score === 0) {
      alert('Please select a rating')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to review')
        setLoading(false)
        return
      }

      // Get client_id
      const { data: client } = await supabase
        .from('client')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (!client) throw new Error('Client profile not found')

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('rating')
          .update({
            score,
            review_text: reviewText.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('rating_id', existingReview.rating_id)

        if (error) throw error
      } else {
        // Create new review
        const { error } = await supabase
          .from('rating')
          .insert({
            client_id: client.client_id,
            movie_id: movieId,
            score,
            review_text: reviewText.trim() || null
          })

        if (error) throw error
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        router.refresh()
      }, 1500)
    } catch (error: any) {
      alert(error.message || 'Failed to submit review')
      setLoading(false)
    }
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1A1A1A] rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{movieTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            disabled={loading || success}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
              <Star className="w-10 h-10 text-green-500 fill-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {existingReview ? 'Review Updated!' : 'Review Posted!'}
            </h3>
            <p className="text-gray-400 text-center">Thank you for your feedback</p>
          </div>
        ) : (
          <>
            {/* Content */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 md:gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setScore(value)}
                        onMouseEnter={() => setHoveredScore(value)}
                        onMouseLeave={() => setHoveredScore(0)}
                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`w-5 h-5 md:w-7 md:h-7 transition-colors ${
                            value <= (hoveredScore || score)
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'fill-transparent text-gray-600'
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Score Display */}
                  <div className="text-white font-semibold text-lg md:text-xl">
                    {score > 0 ? `${score}/10` : '0/10'}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Click stars to rate (1-10)</p>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Your Review (Optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Share your experience with other viewers
                  </p>
                  <p className="text-xs text-gray-500">
                    {reviewText.length}/1000
                  </p>
                </div>
              </div>

              {/* Review Guidelines */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> Write about what you liked or didn't like, but please avoid spoilers!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row gap-3 p-4 md:p-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-lg transition-colors text-white font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || score === 0}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 text-white flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {existingReview ? 'Update Review' : 'Post Review'}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
