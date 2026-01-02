'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, Edit, Plus } from 'lucide-react'
import ReviewModal from './ReviewModal'

interface MovieRatingProps {
  movieId: string
  clientId: string
  movieTitle?: string
}

export default function MovieRating({ movieId, clientId, movieTitle = 'Movie' }: MovieRatingProps) {
  const [existingReview, setExistingReview] = useState<{ rating_id: string; score: number; review_text?: string } | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Fetch existing review
    async function fetchReview() {
      setLoading(true)
      const { data } = await supabase
        .from('rating')
        .select('rating_id, score, review_text')
        .eq('client_id', clientId)
        .eq('movie_id', movieId)
        .maybeSingle()

      if (data) {
        setExistingReview(data)
      }
      setLoading(false)
    }

    fetchReview()
  }, [movieId, clientId, supabase])

  const refreshReview = async () => {
    const { data } = await supabase
      .from('rating')
      .select('rating_id, score, review_text')
      .eq('client_id', clientId)
      .eq('movie_id', movieId)
      .maybeSingle()

    if (data) {
      setExistingReview(data)
    }
  }

  return (
    <>
      <div className="bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Your Review
          </h3>
          <button
            onClick={() => setShowReviewModal(true)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              existingReview
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {existingReview ? (
              <>
                <Edit className="w-4 h-4" />
                Edit Review
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Write Review
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : existingReview ? (
          <div className="space-y-4">
            {/* Star Rating Display */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <Star
                    key={value}
                    className={`w-6 h-6 ${
                      value <= existingReview.score
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'fill-transparent text-gray-600'
                    }`}
                    strokeWidth={2}
                  />
                ))}
              </div>
              <span className="text-white font-semibold text-lg">
                {existingReview.score}/10
              </span>
            </div>

            {/* Review Text */}
            {existingReview.review_text && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {existingReview.review_text}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              You haven't reviewed this movie yet
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Share your thoughts with other viewers
            </p>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false)
          refreshReview()
        }}
        movieId={movieId}
        movieTitle={movieTitle}
        existingReview={existingReview}
      />
    </>
  )
}





















