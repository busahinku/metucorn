'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface MovieFiltersProps {
  genres: any[]
  years: number[]
  currentFilters: {
    genre?: string
    year?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    ageRating?: string
  }
}

export default function MovieFilters({ genres, years, currentFilters }: MovieFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Local state for price inputs with debouncing
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '')

  // Debounce price updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (minPrice === '' || minPrice === '0') {
        params.delete('minPrice')
      } else {
        params.set('minPrice', minPrice)
      }
      
      if (maxPrice === '' || maxPrice === '0') {
        params.delete('maxPrice')
      } else {
        params.set('maxPrice', maxPrice)
      }
      
      router.push(`/movies?${params.toString()}`)
    }, 1000) // Wait 1 second after user stops typing

    return () => clearTimeout(timer)
  }, [minPrice, maxPrice, router, searchParams])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === '' || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`/movies?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    router.push('/movies')
  }

  const hasActiveFilters = currentFilters.genre || currentFilters.year || 
    currentFilters.minPrice || currentFilters.maxPrice || 
    (currentFilters.sortBy && currentFilters.sortBy !== 'newest') ||
    currentFilters.ageRating

  const ageRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17']

  return (
    <div className="relative">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Genre Filter */}
        <select
          value={currentFilters.genre || 'all'}
          onChange={(e) => updateFilter('genre', e.target.value)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all cursor-pointer"
        >
          <option value="all" className="bg-[#1A1A1A]">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.genre_id} value={genre.genre_id} className="bg-[#1A1A1A]">
              {genre.name}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={currentFilters.year || 'all'}
          onChange={(e) => updateFilter('year', e.target.value)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all cursor-pointer"
        >
          <option value="all" className="bg-[#1A1A1A]">All Years</option>
          {years.map((year) => (
            <option key={year} value={year} className="bg-[#1A1A1A]">
              {year}
            </option>
          ))}
        </select>

        {/* Age Rating Filter */}
        <select
          value={currentFilters.ageRating || 'all'}
          onChange={(e) => updateFilter('ageRating', e.target.value)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all cursor-pointer"
        >
          <option value="all" className="bg-[#1A1A1A]">All Ratings</option>
          {ageRatings.map((rating) => (
            <option key={rating} value={rating} className="bg-[#1A1A1A]">
              {rating}
            </option>
          ))}
        </select>

        {/* Price Range with Divider */}
        <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all">
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-16 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
          />
          <div className="w-px h-4 bg-white/20"></div>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-16 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none"
          />
          <span className="text-gray-500 text-xs">$</span>
        </div>

        {/* Spacer */}
        <div className="flex-1 hidden md:block"></div>

        {/* Sort By */}
        <select
          value={currentFilters.sortBy || 'newest'}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all cursor-pointer"
        >
          <option value="newest" className="bg-[#1A1A1A]">Newest</option>
          <option value="oldest" className="bg-[#1A1A1A]">Oldest</option>
          <option value="title_az" className="bg-[#1A1A1A]">A-Z</option>
          <option value="title_za" className="bg-[#1A1A1A]">Z-A</option>
          <option value="price_low" className="bg-[#1A1A1A]">Price ↑</option>
          <option value="price_high" className="bg-[#1A1A1A]">Price ↓</option>
          <option value="year_new" className="bg-[#1A1A1A]">Year ↓</option>
          <option value="year_old" className="bg-[#1A1A1A]">Year ↑</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center justify-center w-9 h-9 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-600 rounded-lg text-gray-400 hover:text-white transition-all group"
            title="Clear all filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Active Filter Indicator */}
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
          <span>Filters active</span>
        </div>
      )}
    </div>
  )
}
