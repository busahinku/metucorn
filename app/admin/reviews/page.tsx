import { createClient } from '@/lib/supabase/server'
import { Star, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import DeleteReviewButton from '@/components/admin/DeleteReviewButton'

export default async function AdminReviewsPage() {
  const supabase = await createClient()

  // Step 1.0: Fetch all ratings/reviews
  const { data: reviews, error, count } = await supabase
    .from('rating')
    .select(`
      rating_id,
      score,
      review_text,
      created_at,
      movie:movie_id (title),
      client:client_id (name, email)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl space-y-6">
      {/* Step 2.0: Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reviews & Ratings</h1>
        <p className="text-gray-400">Monitor and moderate user reviews</p>
      </div>

      {/* Step 3.0: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-600/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{reviews?.length || 0}</div>
              <div className="text-sm text-gray-400">Total Reviews</div>
            </div>
          </div>
        </div>
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-green-500 fill-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {reviews && reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviews.length).toFixed(2)
                  : '0.00'
                }
              </div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {error && (
        <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-4">
          <p className="text-red-400 text-sm">
            <strong>Error:</strong> {error.message}
          </p>
        </div>
      )}

      {/* Step 4.0: Reviews List */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review: any) => (
            <div key={review.rating_id} className="bg-[#151515] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Movie & User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {review.client?.name?.[0]?.toUpperCase() || review.client?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {review.client?.name || review.client?.email || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {review.movie?.title || 'Unknown Movie'}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(10)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (review.score || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">{review.score}/10</span>
                  </div>

                  {/* Review Text */}
                  {review.review_text && (
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {review.review_text}
                    </p>
                  )}

                  {/* Date */}
                  <div className="text-xs text-gray-500">
                    {review.created_at ? format(new Date(review.created_at), 'MMM d, yyyy h:mm a') : '-'}
                  </div>
                </div>

                {/* Delete Button */}
                <DeleteReviewButton ratingId={review.rating_id} />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#151515] border border-white/10 rounded-xl p-12 text-center">
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No reviews found</p>
            <p className="text-xs text-gray-600">
              {count !== null ? `Total in database: ${count}` : 'Checking database...'}
            </p>
            {error && (
              <p className="text-xs text-red-400 mt-2">Error: {error.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

