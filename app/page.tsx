import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Play, Star, Film, Users } from 'lucide-react'

// Revalidate homepage every 60 seconds
export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  // Fetch ALL data in parallel (much faster!)
  const [
    { data: featuredMovie },
    { data: allTickets },
    { data: upcomingParties },
    { data: recentMovies },
    { data: newMovies },
    { data: ratings }
  ] = await Promise.all([
    // Featured movie - specific movie for hero
    supabase
      .from('movie')
      .select(`
        *,
        director:director_id (director_name),
        movie_genre (
          genre:genre_id (name)
        )
      `)
      .eq('movie_id', '39dc9cb1-c1ba-4a90-8753-fac78bbcdd9a')
      .single(),
    
    // All active tickets to calculate trending movies
    supabase
      .from('ticket')
      .select('movie_id')
      .eq('is_active', true),
    
    // Upcoming parties
    supabase
      .from('watch_party')
      .select(`
        *,
        movie:movie_id (
          title,
          poster_image,
          duration_time
        ),
        host:host_id (
          name
        ),
        party_participant (client_id)
      `)
      .gte('scheduled_time', new Date().toISOString())
      .in('status', ['scheduled', 'active'])
      .order('scheduled_time', { ascending: true })
      .limit(4),
    
    // Recently added movies
    supabase
      .from('movie')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(5),
    
    // New movies
    supabase
      .from('movie')
      .select('*')
      .eq('status', 'available')
      .order('release_date', { ascending: false })
      .limit(5),
    
    // Ratings for featured movie (fetch in parallel)
    supabase
      .from('rating')
      .select('score')
      .eq('movie_id', '39dc9cb1-c1ba-4a90-8753-fac78bbcdd9a')
  ])

  // Calculate average rating for featured movie
  const avgRating = ratings && ratings.length > 0
    ? ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length
    : 0

  // Calculate trending movies (most purchased)
  const ticketCounts: Record<string, number> = {}
  allTickets?.forEach((ticket: any) => {
    const movieId = ticket.movie_id
    ticketCounts[movieId] = (ticketCounts[movieId] || 0) + 1
  })

  // Get top 5 movie IDs by ticket count
  const topMovieIds = Object.entries(ticketCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([movieId]) => movieId)

  // Fetch trending movies details
  const { data: trendingMovies } = topMovieIds.length > 0
    ? await supabase
        .from('movie')
        .select('*')
        .eq('status', 'available')
        .in('movie_id', topMovieIds)
    : { data: [] }

  // Sort trending movies by ticket count (maintain order)
  const trendingMoviesSorted = trendingMovies?.sort((a, b) => {
    const countA = ticketCounts[a.movie_id] || 0
    const countB = ticketCounts[b.movie_id] || 0
    return countB - countA
  }) || []

  // If we don't have 5 trending movies, fill with recently added
  let finalTrendingMovies = [...trendingMoviesSorted]
  if (finalTrendingMovies.length < 5 && topMovieIds.length > 0) {
    const existingIds = finalTrendingMovies.map(m => m.movie_id)
    const { data: fallbackMovies } = await supabase
      .from('movie')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(10)
    
    // Filter out movies that are already in trending
    const additionalMovies = fallbackMovies?.filter((m: any) => !existingIds.includes(m.movie_id)).slice(0, 5 - finalTrendingMovies.length) || []
    finalTrendingMovies = [...finalTrendingMovies, ...additionalMovies]
  } else if (finalTrendingMovies.length === 0) {
    // If no tickets exist, show recently added movies
    const { data: fallbackMovies } = await supabase
      .from('movie')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(5)
    finalTrendingMovies = fallbackMovies || []
  }

  return (
    <div className="pb-4 md:pb-8">
        {/* Hero Section */}
        {featuredMovie && (
          <section className="relative px-4 md:px-16 lg:px-16 pt-4 md:pt-8 mb-4 md:mb-6 lg:mb-8">
            <div className="relative h-[500px] md:h-[550px] lg:h-[600px] rounded-[20px] md:rounded-[30px] overflow-hidden">
              {/* Background Image with Gradients */}
              <div className="absolute inset-0">
                <Image
                  src={featuredMovie.header_image || featuredMovie.poster_image || '/placeholder.jpg'}
                  alt={featuredMovie.title}
                  fill
                  className="object-cover object-[72%_47%] md:object-center"
                  priority
                  sizes="100vw"
                />
                {/* Complex Gradient Overlays */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(-86deg, rgba(0, 0, 0, 0.11) 15.44%, rgba(0, 0, 0, 0.40) 88.52%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)'
                }}></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-end md:items-start px-4 md:px-12 py-6 md:py-12">
                <div className="max-w-2xl w-full">
                  {/* Title */}
                  <h1 className="text-3xl md:text-7xl font-bold text-white mb-1 md:mb-2 uppercase tracking-tight font-sora">
                    {featuredMovie.title}
                  </h1>

                  {/* Description - Hidden on mobile */}
                  <p className="hidden md:block text-base md:text-lg text-gray-400 mb-3 line-clamp-3">
                    {featuredMovie.description || featuredMovie.synopsis}
                  </p>

                  {/* Genres */}
                  {featuredMovie.movie_genre && featuredMovie.movie_genre.length > 0 && (
                    <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                      {featuredMovie.movie_genre.slice(0, 3).map((mg: any, idx: number) => (
                        <span key={idx}>
                          <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">
                            {mg.genre?.name}
                          </span>
                          {idx < Math.min(2, featuredMovie.movie_genre.length - 1) && (
                            <span className="text-gray-600 mx-1 md:mx-2">|</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-8">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const ratingOutOf5 = avgRating / 2
                        const isFull = star <= Math.floor(ratingOutOf5)
                        const isPartial = !isFull && star <= Math.ceil(ratingOutOf5)
                        const fillPercentage = isPartial ? ((ratingOutOf5 % 1) * 100) : 0
                        
                        return (
                          <div key={star} className="relative">
                            <Star
                              className={`w-4 h-4 md:w-5 md:h-5 ${
                                isFull
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'fill-transparent text-gray-600'
                              }`}
                              strokeWidth={2}
                            />
                            {isPartial && fillPercentage > 0 && (
                              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                                <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-500 text-yellow-500" strokeWidth={2} />
                              </div>
                            )}
                          </div>
                        )
                      })}
                      <span className="text-white font-semibold ml-1 md:ml-2 text-sm md:text-base">
                        {avgRating > 0 ? (avgRating / 2).toFixed(1) : '0.0'}
                      </span>
                    </div>
                    
                    {/* Language indicator */}
                    <div className="flex items-center gap-1 md:gap-2 text-gray-400">
                      <div className="w-4 h-3 md:w-5 md:h-4 bg-red-600 rounded-sm"></div>
                      <span className="text-xs md:text-sm">Turkish</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
                    <Link
                      href={`/movies/${featuredMovie.movie_id}`}
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-colors"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                      Buy and Watch
                    </Link>
                    
                    {featuredMovie.trailer_link && (
                      <a
                        href={featuredMovie.trailer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-400 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-colors"
                      >
                        <Film className="w-4 h-4 md:w-5 md:h-5" />
                        Trailer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trends Section - Separate container, overlapping hero */}
        <section className="px-4 md:px-16 lg:px-28 mt-0 md:-mt-20 lg:-mt-40 relative z-10">
          <h2 className="text-lg md:text-xl font-medium text-white mb-3 md:mb-5 lg:mb-6">Trends</h2>
          
          {finalTrendingMovies && finalTrendingMovies.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 lg:gap-9">
              {finalTrendingMovies.slice(0, 5).map((movie: any, index: number) => (
                <Link
                  key={movie.movie_id}
                  href={`/movies/${movie.movie_id}`}
                  className={`group relative aspect-[2/3] rounded-xl overflow-hidden ${index >= 4 ? 'hidden md:block' : ''}`}
                >
                  {/* Movie Poster */}
                  <div className="relative w-full h-full">
                    {movie.poster_image ? (
                      <Image
                        src={movie.poster_image}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center rounded-lg">
                        <div className="w-12 h-12 text-[#353535]">📽️</div>
                      </div>
                    )}
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 rounded-lg"></div>
                    
                    {/* Rank Number */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                      <div className="text-9xl md:text-9xl lg:text-9xl font-black text-gray-300/50 font-sora leading-none">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Watch Parties */}
        <section className="px-4 md:px-16 lg:px-28 mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-xl font-medium text-white">Upcoming Parties</h2>
            </div>
            {upcomingParties && upcomingParties.length > 0 && (
              <Link href="/parties" className="text-sm text-gray-400 hover:text-white transition-colors">
                See all
              </Link>
            )}
          </div>
          
          {upcomingParties && upcomingParties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {upcomingParties.map((party: any) => {
                const participantCount = party.party_participant?.length || 0
                const scheduledDate = new Date(party.scheduled_time)
                
                return (
                  <Link
                    key={party.party_id}
                    href="/parties"
                    className="group bg-[#121212] rounded-lg overflow-hidden border border-[#1A1A1A] hover:border-red-600/50 transition-all flex"
                  >
                    {/* Thumbnail - Left Side */}
                    <div className="relative w-16 md:w-20 aspect-[2/3] flex-shrink-0 bg-[#1A1A1A]">
                      {party.movie?.poster_image ? (
                        <Image
                          src={party.movie.poster_image}
                          alt={party.movie.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 64px, 80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                          <Film className="w-6 h-6 md:w-8 md:h-8 text-[#353535]" />
                        </div>
                      )}
                    </div>

                    {/* Content - Right Side */}
                    <div className="flex-1 p-3 md:p-4 flex flex-col justify-between min-w-0">
                      {/* Title */}
                      <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1 mb-1 md:mb-2">
                        {party.movie?.title || 'Movie Night'}
                      </h3>
                      
                      {/* Creator */}
                      <div className="text-gray-400 text-xs md:text-sm mb-2">
                        created: @{party.host?.name || 'Unknown'}
                      </div>

                      {/* Bottom Row: People & Date */}
                      <div className="flex items-center justify-between">
                        {/* People Count */}
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-xs md:text-sm">
                            {participantCount} {participantCount === 1 ? 'person' : 'people'}
                          </span>
                        </div>
                        
                        {/* Date */}
                        <div className="text-gray-400 text-xs md:text-sm">
                              {scheduledDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-between py-8 px-6 bg-[#1A1A1A] rounded-xl">
              <p className="text-gray-400 text-sm md:text-base">
                No upcoming parties yet. Create one and watch with friends!
              </p>
              <Link
                href="/parties/create"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ml-4"
              >
                Create Party
              </Link>
            </div>
          )}
        </section>

        {/* Recently Added Movies */}
        {recentMovies && recentMovies.length > 0 && (
          <section className="px-4 md:px-16 lg:px-28 mt-12 md:mt-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-xl font-medium text-white">Recently Added</h2>
              </div>
              <Link href="/movies" className="text-sm text-gray-400 hover:text-white transition-colors">
                See all
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {recentMovies.map((movie: any) => (
                <Link
                  key={movie.movie_id}
                  href={`/movies/${movie.movie_id}`}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden"
                >
                  {movie.poster_image ? (
                    <Image
                      src={movie.poster_image}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                      <Film className="w-12 h-12 text-[#353535]" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-white text-sm font-semibold line-clamp-1">
                      {movie.title}
                    </h3>
                    {movie.price && (
                      <p className="text-gray-300 text-xs mt-1">
                        ${movie.price}
                      </p>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                    NEW
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New Movies */}
        {newMovies && newMovies.length > 0 && (
          <section className="px-4 md:px-10 lg:px-10 mt-12 md:mt-16 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-xl font-medium text-white">New Movies</h2>
              </div>
              <Link href="/movies" className="text-sm text-gray-400 hover:text-white transition-colors">
                See all
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {newMovies.map((movie: any) => (
                <Link
                  key={movie.movie_id}
                  href={`/movies/${movie.movie_id}`}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden"
                >
                  {movie.poster_image ? (
                    <Image
                      src={movie.poster_image}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                      <Film className="w-12 h-12 text-[#353535]" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-white text-sm font-semibold line-clamp-1">
                      {movie.title}
                    </h3>
                    {movie.price && (
                      <p className="text-gray-300 text-xs mt-1">
                        ${movie.price}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
  )
}
