import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Film } from 'lucide-react'
import MovieFilters from '@/components/MovieFilters'

// Revalidate movies page every 5 minutes
export const revalidate = 300

interface SearchParams {
  genre?: string
  year?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  ageRating?: string
}

export default async function MoviesPage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  const supabase = await createClient()
  
  // Get filter parameters
  const genre = searchParams.genre
  const year = searchParams.year
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined
  const sortBy = searchParams.sortBy || 'newest'
  const ageRating = searchParams.ageRating

  // Step 1.0: Build base movies query (we'll run in parallel)
  let moviesQuery = supabase
    .from('movie')
    .select(`
      movie_id,
      title,
      price,
      poster_image,
      release_date,
      duration_time,
      age_rating,
      created_at,
      movie_genre!inner (
        genre:genre_id (name, genre_id)
      )
    `)
    .eq('status', 'available')

  // Apply genre filter
  if (genre && genre !== 'all') {
    moviesQuery = moviesQuery.eq('movie_genre.genre_id', genre)
  }

  // Apply year filter
  if (year && year !== 'all') {
    const yearStart = `${year}-01-01`
    const yearEnd = `${year}-12-31`
    moviesQuery = moviesQuery.gte('release_date', yearStart).lte('release_date', yearEnd)
  }

  // Apply price range filter
  if (minPrice !== undefined) {
    moviesQuery = moviesQuery.gte('price', minPrice)
  }
  if (maxPrice !== undefined) {
    moviesQuery = moviesQuery.lte('price', maxPrice)
  }

  // Apply age rating filter
  if (ageRating && ageRating !== 'all') {
    moviesQuery = moviesQuery.eq('age_rating', ageRating)
  }

  // Apply sorting
  switch (sortBy) {
    case 'newest':
      moviesQuery = moviesQuery.order('created_at', { ascending: false })
      break
    case 'oldest':
      moviesQuery = moviesQuery.order('created_at', { ascending: true })
      break
    case 'price_low':
      moviesQuery = moviesQuery.order('price', { ascending: true })
      break
    case 'price_high':
      moviesQuery = moviesQuery.order('price', { ascending: false })
      break
    case 'title_az':
      moviesQuery = moviesQuery.order('title', { ascending: true })
      break
    case 'title_za':
      moviesQuery = moviesQuery.order('title', { ascending: false })
      break
    case 'year_new':
      moviesQuery = moviesQuery.order('release_date', { ascending: false })
      break
    case 'year_old':
      moviesQuery = moviesQuery.order('release_date', { ascending: true })
      break
    default:
      moviesQuery = moviesQuery.order('created_at', { ascending: false })
  }

  // Run queries in parallel for speed
  const [{ data: movies }, { data: genres }, { data: allMovies }] = await Promise.all([
    moviesQuery,
    supabase.from('genre').select('genre_id, name').order('name'),
    supabase
      .from('movie')
      .select('release_date')
      .eq('status', 'available')
      .not('release_date', 'is', null),
  ])

  const years = allMovies
    ? Array.from(new Set(allMovies.map((m) => new Date(m.release_date).getFullYear()))).sort(
        (a, b) => b - a
      )
    : []

  return (
    <div className="px-4 md:px-16 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">All Catalog</h1>
          <div className="text-sm text-gray-400">
            {movies?.length || 0} {movies?.length === 1 ? 'movie' : 'movies'} found
          </div>
        </div>

        {/* Filters */}
        <MovieFilters 
          genres={genres || []} 
          years={years}
          currentFilters={{
            genre,
            year,
            minPrice: minPrice?.toString(),
            maxPrice: maxPrice?.toString(),
            sortBy,
            ageRating
          }}
        />
        
        {/* Movies Grid */}
        {movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mt-6">
            {movies.map((movie: any) => (
              <Link
                key={movie.movie_id}
                href={`/movies/${movie.movie_id}`}
                className="group relative aspect-[2/3] rounded-lg overflow-hidden"
              >
                {/* Movie Poster */}
                {movie.poster_image ? (
                  <Image
                    src={movie.poster_image}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                    <Film className="w-12 h-12 text-[#353535]" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                </div>
                
                {/* Info Overlay - Always Visible */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-white text-sm font-semibold line-clamp-1 mb-1">
                    {movie.title}
                  </h3>
                  {movie.price && (
                    <p className="text-gray-300 text-xs">
                      ${parseFloat(movie.price).toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 mt-6">
            <Film className="w-16 h-16 text-[#353535] mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-white">No movies found</h2>
            <p className="text-gray-400 mb-4">Try adjusting your filters</p>
            <Link 
              href="/movies"
              className="text-red-500 hover:text-red-400 transition-colors"
            >
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  )
}
