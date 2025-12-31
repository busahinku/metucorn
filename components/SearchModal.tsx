'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Search, Film, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  type: 'movie' | 'cast'
  id: string
  title: string
  subtitle?: string
  image?: string
  movies?: string[] // For cast members, list of movies they're in
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Ensure we're mounted on client before using portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setSearchQuery('')
      setResults([])
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Debounced search function with parallel queries
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([])
        return
      }

      setIsSearching(true)

      try {
        // Run both queries in parallel for better performance
        const [moviesResult, castResult] = await Promise.all([
          supabase
          .from('movie')
          .select('movie_id, title, poster_image, release_date')
          .eq('status', 'available')
          .ilike('title', `%${searchQuery}%`)
            .limit(5),
          supabase
          .from('cast')
          .select(`
            cast_id,
            cast_name,
            movie_cast!inner (
              movie:movie_id (
                movie_id,
                title,
                status
              )
            )
          `)
          .ilike('cast_name', `%${searchQuery}%`)
          .limit(5)
        ])

        const movies = moviesResult.data || []
        const castMembers = castResult.data || []

        const movieResults: SearchResult[] = movies.map((movie) => ({
          type: 'movie' as const,
          id: movie.movie_id,
          title: movie.title,
          subtitle: movie.release_date
            ? new Date(movie.release_date).getFullYear().toString()
            : undefined,
          image: movie.poster_image,
        }))

        const castResults: SearchResult[] = castMembers.map((cast) => {
          const availableMovies = cast.movie_cast
            .filter((mc: any) => mc.movie?.status === 'available')
            .map((mc: any) => mc.movie?.title)
            .filter(Boolean)

          return {
            type: 'cast' as const,
            id: cast.cast_id,
            title: cast.cast_name,
            subtitle: availableMovies.length
              ? `${availableMovies.length} movie${availableMovies.length > 1 ? 's' : ''}`
              : undefined,
            movies: availableMovies,
          }
        })

        // Combine and sort results (movies first, then cast)
        setResults([...movieResults, ...castResults])
      } catch (error) {
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    // Increased debounce to 400ms to reduce query frequency
    const timer = setTimeout(performSearch, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, supabase])

  const handleResultClick = () => {
    onClose()
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl mx-auto px-4 pt-4 md:pt-20">
        <div className="bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 md:px-6 py-4 md:py-5 border-b border-white/20 bg-white/5">
            <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-300 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, actors..."
              className="flex-1 bg-transparent text-white text-base md:text-lg placeholder:text-gray-400 focus:outline-none"
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] md:max-h-[500px] overflow-y-auto">
            {searchQuery.trim().length < 2 ? (
              <div className="px-4 md:px-6 py-8 md:py-12 text-center">
                <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm md:text-base">
                  Type at least 2 characters to search
                </p>
              </div>
            ) : results.length === 0 && !isSearching ? (
              <div className="px-4 md:px-6 py-8 md:py-12 text-center">
                <Film className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm md:text-base">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-gray-500 text-xs md:text-sm mt-2">
                  Try different keywords
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {results.map((result) => (
                  <div key={`${result.type}-${result.id}`}>
                    {result.type === 'movie' ? (
                      <Link
                        href={`/movies/${result.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 hover:bg-white/10 backdrop-blur-sm transition-all group"
                      >
                        {/* Movie Poster */}
                        <div className="relative w-12 h-16 md:w-14 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
                          {result.image ? (
                            <Image
                              src={result.image}
                              alt={result.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 48px, 56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>

                        {/* Movie Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Film className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <h3 className="text-white font-semibold text-sm md:text-base truncate group-hover:text-red-500 transition-colors">
                              {result.title}
                            </h3>
                          </div>
                          {result.subtitle && (
                            <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="px-4 md:px-6 py-3 md:py-4 hover:bg-white/10 backdrop-blur-sm transition-all">
                        {/* Cast Member */}
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                            <User className="w-6 h-6 md:w-7 md:h-7 text-gray-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <h3 className="text-white font-semibold text-sm md:text-base truncate">
                                {result.title}
                              </h3>
                            </div>
                            {result.subtitle && (
                              <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                                {result.subtitle}
                              </p>
                            )}
                            {result.movies && result.movies.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {result.movies.slice(0, 3).map((movie, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-md text-gray-300 truncate max-w-[150px]"
                                  >
                                    {movie}
                                  </span>
                                ))}
                                {result.movies.length > 3 && (
                                  <span className="text-xs px-2 py-1 text-gray-500">
                                    +{result.movies.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          {results.length > 0 && (
            <div className="px-4 md:px-6 py-2 md:py-3 border-t border-white/20 bg-white/5 backdrop-blur-sm">
              <p className="text-xs text-gray-400 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-white/20 backdrop-blur-sm border border-white/20 rounded text-gray-300">ESC</kbd> to close
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
