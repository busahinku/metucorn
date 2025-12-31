import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Film, Clock, Calendar, Star, ArrowLeft, Play, Eye } from 'lucide-react'
import BuyTicketButton from '@/components/BuyTicketButton'
import MovieRating from '@/components/MovieRating'

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = params
  
  // Step 1.0: Get user first (needed for ticket check)
  const { data: { user } } = await supabase.auth.getUser()
  
  // Step 2.0: Fetch all data in parallel
  const [
    { data: movie },
    { data: ratings },
    { data: client }
  ] = await Promise.all([
    // Movie details
    supabase
    .from('movie')
    .select(`
      *,
      director:director_id (director_name, bio),
      movie_genre (
        genre:genre_id (name)
      ),
      movie_cast (
        cast_member:cast_id (cast_name),
        role_name
      )
    `)
    .eq('movie_id', id)
      .single(),

    // Ratings
    supabase
    .from('rating')
    .select(`
      rating_id,
      score,
      review_text,
      created_at,
      client:client_id (
        name
      )
    `)
    .eq('movie_id', id)
      .order('created_at', { ascending: false }),
    
    // Client data (if user exists)
    user
      ? supabase
          .from('client')
          .select('client_id')
          .eq('user_id', user.id)
          .single()
      : Promise.resolve({ data: null, error: null })
  ])

  if (!movie) {
    notFound()
  }

  const avgRating = ratings && ratings.length > 0
    ? ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length
    : 0

  // Step 3.0: Check if user has a ticket (only if client exists)
  let hasTicket = false
  let clientId: string | null = null

    if (client) {
      clientId = client.client_id
      
      const { data: ticket } = await supabase
        .from('ticket')
        .select('ticket_id')
        .eq('client_id', client.client_id)
        .eq('movie_id', id)
        .eq('is_active', true)
        .maybeSingle()

      hasTicket = !!ticket
  }

  return (
    <div className="min-h-screen">
        {/* Full-width Header with Backdrop */}
        <div className="relative w-full h-[500px] md:h-[650px] lg:h-[700px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            {movie.header_image || movie.poster_image ? (
              <Image
                src={movie.header_image || movie.poster_image}
                alt={movie.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-[#1A1A1A]"></div>
            )}
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0C] via-transparent to-transparent"></div>
          </div>

          {/* Back Button */}
          <div className="absolute top-6 left-4 md:left-8 z-10">
            <Link 
              href="/movies"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors backdrop-blur-md bg-black/30 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Back to Movies</span>
            </Link>
          </div>

          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 md:px-16 lg:px-16 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              {/* Poster - Glassy Effect */}
              <div className="relative w-40 md:w-56 flex-shrink-0">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 backdrop-blur-sm">
                  {movie.poster_image ? (
                    <Image
                      src={movie.poster_image}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 200px, 300px"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                      <Film className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Title and Meta */}
              <div className="flex-1 mb-4 md:mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-sora">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-gray-300">
                  {movie.age_rating && (
                    <span className="px-2 py-1 border border-gray-500 rounded text-xs md:text-sm">
                      {movie.age_rating}
                    </span>
                  )}
                  {movie.duration_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {movie.duration_time} min
                    </div>
                  )}
                  {movie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(movie.release_date).getFullYear()}
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.movie_genre && movie.movie_genre.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {movie.movie_genre.map((mg: any, idx: number) => (
                      <span 
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20"
                      >
                        {mg.genre?.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 md:px-16 lg:px-16 py-8 md:py-12">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-8 max-w-7xl">
            {/* Price & Actions - Shows first on mobile */}
            <div className="md:hidden space-y-6">
              {/* Rating Card */}
              {avgRating > 0 && (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] backdrop-blur-sm rounded-xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {(avgRating / 2).toFixed(1)}<span className="text-xl text-gray-400">/5</span>
                  </div>
                  <p className="text-xs text-gray-500">{ratings?.length || 0} reviews</p>
                </div>
              )}

              {/* Price & Actions or Watch Now */}
              {hasTicket ? (
                <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 backdrop-blur-sm rounded-xl p-6 border border-green-600/20">
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-green-500 mb-2">
                      ✓ You own this movie
                    </div>
                    <p className="text-sm text-gray-400">Ready to watch</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      href={`/watch/${movie.movie_id}`}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
                    >
                      <Eye className="w-5 h-5" />
                      Watch Now
                    </Link>
                    
                    {movie.trailer_link && (
                      <a
                        href={movie.trailer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full border border-gray-600 hover:border-gray-400 px-4 py-3 rounded-lg transition-colors text-white"
                      >
                        <Play className="w-5 h-5" />
                        Watch Trailer
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 backdrop-blur-sm rounded-xl p-6 border border-red-600/20">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-red-500 mb-1">
                      ${parseFloat(movie.price || 0).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-400">Rental Price</p>
                  </div>
                  
                  <div className="space-y-3">
                    <BuyTicketButton movieId={movie.movie_id} price={movie.price} />
                    
                    {movie.trailer_link && (
                      <a
                        href={movie.trailer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full border border-gray-600 hover:border-gray-400 px-4 py-3 rounded-lg transition-colors text-white"
                      >
                        <Play className="w-5 h-5" />
                        Watch Trailer
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Rating Section - Mobile - Only for users who own the movie */}
              {hasTicket && clientId && (
                <MovieRating movieId={movie.movie_id} clientId={clientId} movieTitle={movie.title} />
              )}
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Synopsis */}
              {movie.synopsis && (
                <div className="bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
                  <h2 className="text-xl font-semibold mb-3 text-white">Synopsis</h2>
                  <p className="text-gray-400 leading-relaxed">{movie.synopsis}</p>
                </div>
              )}

              {/* Director */}
              {movie.director && (
                <div className="bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold mb-2 text-white">Director</h3>
                  <p className="text-gray-300">{movie.director.director_name}</p>
                </div>
              )}

              {/* Cast */}
              {movie.movie_cast && movie.movie_cast.length > 0 && (
                <div className="bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold mb-4 text-white">Cast</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {movie.movie_cast.map((mc: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-white">{mc.cast_member?.cast_name}</p>
                          {mc.role_name && (
                            <p className="text-sm text-gray-400">as {mc.role_name}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Section - Only for users who own the movie */}
              {hasTicket && clientId && (
                <MovieRating movieId={movie.movie_id} clientId={clientId} />
              )}

              {/* Reviews Section */}
              {ratings && ratings.length > 0 && (
                <div className="bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    User Reviews ({ratings.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {ratings.map((rating: any) => (
                      <div key={rating.rating_id} className="bg-[#121212] rounded-lg p-4 border border-[#252525]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                              {rating.client?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#E5E5E5]">
                                {rating.client?.name || 'Anonymous'}
                              </p>
                              <p className="text-xs text-[#707070]">
                                {new Date(rating.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-[#1A1A1A] px-2 py-1 rounded-lg border border-[#252525]">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-bold text-[#E5E5E5]">{rating.score}/10</span>
                          </div>
                        </div>
                        
                        {rating.review_text && (
                          <p className="text-sm text-[#A1A0A0] leading-relaxed">
                            {rating.review_text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block md:col-span-1 space-y-6">
              {/* Rating Card */}
              {avgRating > 0 && (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] backdrop-blur-sm rounded-xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {(avgRating / 2).toFixed(1)}<span className="text-xl text-gray-400">/5</span>
                  </div>
                  <p className="text-xs text-gray-500">{ratings?.length || 0} reviews</p>
                </div>
              )}

              {/* Price & Actions or Watch Now */}
              {hasTicket ? (
                <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 backdrop-blur-sm rounded-xl p-6 border border-green-600/20">
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-green-500 mb-2">
                      ✓ You own this movie
                    </div>
                    <p className="text-sm text-gray-400">Ready to watch</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      href={`/watch/${movie.movie_id}`}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
                    >
                      <Eye className="w-5 h-5" />
                      Watch Now
                    </Link>
                    
                    {movie.trailer_link && (
                      <a
                        href={movie.trailer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full border border-gray-600 hover:border-gray-400 px-4 py-3 rounded-lg transition-colors text-white"
                      >
                        <Play className="w-5 h-5" />
                        Watch Trailer
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 backdrop-blur-sm rounded-xl p-6 border border-red-600/20">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-red-500 mb-1">
                      ${parseFloat(movie.price || 0).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-400">Rental Price</p>
                  </div>
                  
                  <div className="space-y-3">
                    <BuyTicketButton movieId={movie.movie_id} price={movie.price} />
                    
                    {movie.trailer_link && (
                      <a
                        href={movie.trailer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full border border-gray-600 hover:border-gray-400 px-4 py-3 rounded-lg transition-colors text-white"
                      >
                        <Play className="w-5 h-5" />
                        Watch Trailer
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info - Desktop only */}
              <div className="hidden md:block bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 space-y-3">
                <h3 className="text-sm font-semibold text-white mb-3">Movie Details</h3>
                
                {movie.duration_time && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{movie.duration_time} min</span>
                  </div>
                )}
                
                {movie.release_date && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Release Date</span>
                    <span className="text-white">
                      {new Date(movie.release_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                
                {movie.age_rating && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Age Rating</span>
                    <span className="text-white">{movie.age_rating}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-500 capitalize">{movie.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
